"""
AI-Based Early Warning & Landslide Risk Monitoring System
North Eastern Region of India - Smart India Hackathon 2026

Dataset Generator:
Generates a realistic, physics-correlated synthetic sensor dataset simulating
geotechnical slope stability conditions across the North Eastern Region of India.

Features:
- rainfall (mm/24h): 0 to 200 mm
- soil_moisture (%): 10% to 100% (volumetric water content / saturation)
- tilt (degrees): 0.0° to 25.0° (inclinometer slope displacement angle)
- vibration (m/s²): 0.0 to 5.0 m/s² (geophone / accelerometer ground motion)

Classes:
- LOW
- MEDIUM
- HIGH
- VERY HIGH
"""

import os
import numpy as np
import pandas as pd

def calculate_geotechnical_risk(rainfall, soil_moisture, tilt, vibration, noise_std=0.025, rng=None):
    """
    Computes a continuous slope instability index (0.0 to 1.0) based on
    hydrological pore-water pressure, shear displacement, and dynamic tremor forces.
    """
    if rng is None:
        rng = np.random.default_rng()

    # Normalized physical components (0.0 to 1.0 scale)
    r_norm = np.clip(rainfall / 120.0, 0.0, 1.4)
    m_norm = np.clip((soil_moisture - 15.0) / 75.0, 0.0, 1.2)
    t_norm = np.clip(tilt / 14.0, 0.0, 1.4)
    v_norm = np.clip(vibration / 3.0, 0.0, 1.4)

    # Nonlinear hydrological pore-water pressure component (45% weight)
    hydro_factor = 0.20 * r_norm + 0.18 * (r_norm * m_norm) + 0.12 * m_norm
    
    # Kinematic tilt shear displacement (30% weight)
    tilt_factor = 0.30 * t_norm
    
    # Dynamic tremor vibration shock (20% weight)
    vib_factor = 0.20 * v_norm

    raw_score = hydro_factor + tilt_factor + vib_factor

    # Compound triggers: severe tilt + tremor or saturated soil + cloudburst
    compound_seismic_slip = (tilt >= 9.5) & (vibration >= 2.2)
    compound_debris_flow = (soil_moisture >= 84.0) & (rainfall >= 90.0)

    raw_score = np.where(compound_seismic_slip, np.maximum(raw_score, 0.82), raw_score)
    raw_score = np.where(compound_debris_flow, np.maximum(raw_score, 0.80), raw_score)
    
    # Add natural geotechnical heterogeneity noise
    noise = rng.normal(0, noise_std, size=rainfall.shape)
    instability_index = np.clip(raw_score + noise, 0.0, 1.0)

    # Categorize into 4 distinct risk tiers
    conditions = [
        instability_index < 0.28,
        (instability_index >= 0.28) & (instability_index < 0.55),
        (instability_index >= 0.55) & (instability_index < 0.78),
        instability_index >= 0.78
    ]
    choices = ['LOW', 'MEDIUM', 'HIGH', 'VERY HIGH']
    risk_class = np.select(conditions, choices, default='MEDIUM')
    
    return instability_index, risk_class

def generate_synthetic_dataset(n_samples=4000, random_state=42):
    """
    Generates realistic samples distributed across geological scenarios:
    1. Dry / baseline stable conditions (LOW)
    2. Moderate pre-monsoon precipitation & mild soil wetness (MEDIUM)
    3. Heavy monsoon rainfall & elevated moisture on creeping slopes (HIGH)
    4. Saturated soil + torrential rainfall + active shear tilt / tremor (VERY HIGH)
    5. Seismic triggering during wet periods (Compound VERY HIGH/HIGH)
    6. Boundary edge cases to make the ML model robust
    """
    rng = np.random.default_rng(random_state)

    # Sub-distributions for realistic geological scenarios
    # Scenario 1: Stable Dry Season (Gangtok winter / Shillong plateau dry days)
    n1 = int(n_samples * 0.28)
    r1 = rng.uniform(0.0, 18.0, n1)
    m1 = rng.uniform(15.0, 45.0, n1)
    t1 = rng.uniform(0.0, 2.5, n1)
    v1 = rng.uniform(0.02, 0.50, n1)

    # Scenario 2: Moderate Pre-Monsoon / Intermittent Showers
    n2 = int(n_samples * 0.27)
    r2 = rng.uniform(18.0, 55.0, n2)
    m2 = rng.uniform(40.0, 72.0, n2)
    t2 = rng.uniform(1.8, 5.8, n2)
    v2 = rng.uniform(0.30, 1.40, n2)

    # Scenario 3: Active Monsoon Season (High rain & wet soil along NH-10 / Champhai)
    n3 = int(n_samples * 0.25)
    r3 = rng.uniform(55.0, 115.0, n3)
    m3 = rng.uniform(68.0, 92.0, n3)
    t3 = rng.uniform(4.5, 12.0, n3)
    v3 = rng.uniform(1.00, 2.80, n3)

    # Scenario 4: Critical Cloudburst / Saturated Slip / Seismic Trigger (VERY HIGH)
    n4 = int(n_samples * 0.20)
    r4 = rng.uniform(90.0, 195.0, n4)
    m4 = rng.uniform(82.0, 100.0, n4)
    t4 = rng.uniform(9.0, 24.5, n4)
    v4 = rng.uniform(2.20, 5.00, n4)

    # Combine distributions
    rainfall = np.concatenate([r1, r2, r3, r4])
    soil_moisture = np.concatenate([m1, m2, m3, m4])
    tilt = np.concatenate([t1, t2, t3, t4])
    vibration = np.concatenate([v1, v2, v3, v4])

    # Round to realistic precision matching actual field telemetry
    rainfall = np.round(rainfall, 1)
    soil_moisture = np.round(soil_moisture, 1)
    tilt = np.round(tilt, 2)
    vibration = np.round(vibration, 3)

    # Compute risk classes based on physics
    instability_index, risk_class = calculate_geotechnical_risk(
        rainfall, soil_moisture, tilt, vibration, noise_std=0.035, rng=rng
    )

    df = pd.DataFrame({
        'rainfall': rainfall,
        'soil_moisture': soil_moisture,
        'tilt': tilt,
        'vibration': vibration,
        'instability_index': np.round(instability_index, 4),
        'risk_level': risk_class
    })

    # Shuffle dataset
    df = df.sample(frac=1.0, random_state=random_state).reset_index(drop=True)
    return df

def save_datasets(output_dir):
    os.makedirs(output_dir, exist_ok=True)
    full_df = generate_synthetic_dataset(n_samples=4200, random_state=42)

    # Split 80% train, 20% test
    split_idx = int(len(full_df) * 0.8)
    train_df = full_df.iloc[:split_idx].copy()
    test_df = full_df.iloc[split_idx:].copy()

    train_path = os.path.join(output_dir, 'synthetic_landslide_train.csv')
    test_path = os.path.join(output_dir, 'synthetic_landslide_test.csv')

    train_df.to_csv(train_path, index=False)
    test_df.to_csv(test_path, index=False)

    print(f"[Dataset Generator] Successfully generated datasets:")
    print(f" - Train set: {train_path} ({len(train_df)} records)")
    print(f" - Test set:  {test_path} ({len(test_df)} records)")
    print("\nClass distribution in training set:")
    print(train_df['risk_level'].value_counts())
    print("\nFeature statistics:")
    print(train_df[['rainfall', 'soil_moisture', 'tilt', 'vibration']].describe().round(2))

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(script_dir, 'data')
    save_datasets(data_dir)
