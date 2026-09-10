"""
AI-Based Early Warning & Landslide Risk Monitoring System
North Eastern Region of India - Smart India Hackathon 2026

Model Training & Evaluation Pipeline:
Trains a Random Forest Classifier to categorize slope stability telemetry
into LOW, MEDIUM, HIGH, and VERY HIGH landslide risk tiers.
Exports serialized model and comprehensive evaluation metrics.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score
from sklearn.model_selection import StratifiedKFold, cross_val_score

from dataset_generator import save_datasets

FEATURES = ['rainfall', 'soil_moisture', 'tilt', 'vibration']
CLASSES = ['LOW', 'MEDIUM', 'HIGH', 'VERY HIGH']

def train_and_evaluate(data_dir, output_dir):
    train_path = os.path.join(data_dir, 'synthetic_landslide_train.csv')
    test_path = os.path.join(data_dir, 'synthetic_landslide_test.csv')

    # If dataset doesn't exist, generate it automatically
    if not os.path.exists(train_path) or not os.path.exists(test_path):
        print("[Pipeline] Datasets not found. Generating synthetic sensor data...")
        save_datasets(data_dir)

    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)

    X_train = train_df[FEATURES]
    y_train = train_df['risk_level']
    X_test = test_df[FEATURES]
    y_test = test_df['risk_level']

    print(f"\n[Training] Dataset loaded: {len(X_train)} training samples, {len(X_test)} test samples.")
    print("Features:", FEATURES)
    print("Target Classes:", CLASSES)

    # Initialize Random Forest Classifier
    rf_model = RandomForestClassifier(
        n_estimators=150,
        max_depth=12,
        min_samples_split=4,
        min_samples_leaf=2,
        class_weight='balanced',
        random_state=42,
        n_jobs=1
    )

    # 5-fold Stratified Cross-Validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(rf_model, X_train, y_train, cv=cv, scoring='accuracy')
    print(f"[Cross-Validation] 5-Fold Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

    # Train model on full training set
    rf_model.fit(X_train, y_train)

    # Predictions on holdout test set
    y_pred = rf_model.predict(X_test)
    y_prob = rf_model.predict_proba(X_test)

    # Metrics computation
    accuracy = accuracy_score(y_test, y_pred)
    f1_macro = f1_score(y_test, y_pred, average='macro')
    f1_weighted = f1_score(y_test, y_pred, average='weighted')
    report_dict = classification_report(y_test, y_pred, labels=CLASSES, output_dict=True)
    conf_matrix = confusion_matrix(y_test, y_pred, labels=CLASSES).tolist()

    # Feature Importance analysis
    feature_importance_dict = {
        feat: round(float(imp), 4)
        for feat, imp in zip(FEATURES, rf_model.feature_importances_)
    }
    sorted_features = dict(sorted(feature_importance_dict.items(), key=lambda item: item[1], reverse=True))

    print("\n" + "="*55)
    print(f" MODEL EVALUATION REPORT (Test Set N={len(X_test)})")
    print("="*55)
    print(f"Overall Accuracy: {accuracy * 100:.2f}%")
    print(f"Macro F1-Score:   {f1_macro:.4f}")
    print(f"Weighted F1-Score:{f1_weighted:.4f}")
    print("\nDetailed Classification Report:")
    print(classification_report(y_test, y_pred, labels=CLASSES, digits=4))
    print("\nConfusion Matrix (Rows: Actual, Cols: Predicted [LOW, MEDIUM, HIGH, VERY HIGH]):")
    print(np.array(conf_matrix))
    print("\nFeature Importances:")
    for feat, imp in sorted_features.items():
        print(f"  {feat:<15}: {imp * 100:.2f}%")
    print("="*55)

    # Save artifacts
    os.makedirs(output_dir, exist_ok=True)
    model_path = os.path.join(output_dir, 'landslide_rf_model.joblib')
    metrics_path = os.path.join(output_dir, 'model_metrics.json')

    # Save model artifact
    joblib.dump({
        'model': rf_model,
        'features': FEATURES,
        'classes': CLASSES,
        'classes_in_model': list(rf_model.classes_)
    }, model_path)
    print(f"\n[Artifact] Serialized model saved to: {model_path}")

    # Save metrics JSON for API endpoint and frontend diagnostics
    metrics_data = {
        'model_name': 'Random Forest Classifier for Landslide Risk Early Warning',
        'algorithm': 'RandomForestClassifier (150 trees, max_depth=12)',
        'region': 'North Eastern Region of India (NER)',
        'features': FEATURES,
        'classes': CLASSES,
        'accuracy': round(float(accuracy), 4),
        'f1_macro': round(float(f1_macro), 4),
        'f1_weighted': round(float(f1_weighted), 4),
        'cv_mean_accuracy': round(float(cv_scores.mean()), 4),
        'cv_std_accuracy': round(float(cv_scores.std()), 4),
        'classification_report': report_dict,
        'confusion_matrix': conf_matrix,
        'feature_importances': sorted_features,
        'test_samples_count': len(X_test),
        'train_samples_count': len(X_train)
    }

    with open(metrics_path, 'w') as f:
        json.dump(metrics_data, f, indent=2)
    print(f"[Artifact] Metrics JSON saved to: {metrics_path}")

    # Verify model loading and single sample prediction
    loaded = joblib.load(model_path)
    sample_input = pd.DataFrame([{
        'rainfall': 85.0,
        'soil_moisture': 78.5,
        'tilt': 7.2,
        'vibration': 1.85
    }])
    pred = loaded['model'].predict(sample_input)[0]
    probs = loaded['model'].predict_proba(sample_input)[0]
    prob_dict = {cls: round(float(p), 4) for cls, p in zip(loaded['model'].classes_, probs)}
    print(f"\n[Sanity Test] Sample input ({sample_input.to_dict('records')[0]}):")
    print(f" -> Predicted Class: {pred}")
    print(f" -> Probabilities:   {prob_dict}")

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(script_dir, 'data')
    train_and_evaluate(data_dir, script_dir)
