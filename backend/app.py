"""
AI-Based Early Warning & Landslide Risk Monitoring System
North Eastern Region of India - Smart India Hackathon 2026

Flask REST API Server:
Exposes endpoints for live telemetry, ML inference, historical trends,
model diagnostics, and scenario injection.
"""

import os
import time
import json
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

import database
import forecaster
import mailer
from simulator import simulator_engine, SCENARIOS

LAST_EMAIL_DISPATCH = {}

app = Flask(__name__)
# Enable CORS for local development (React dev server on port 5173)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Global paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'landslide_rf_model.joblib')
METRICS_PATH = os.path.join(BASE_DIR, 'model', 'model_metrics.json')

# Global ML model container
ml_artifact = None

def load_ml_model():
    global ml_artifact
    if os.path.exists(MODEL_PATH):
        try:
            ml_artifact = joblib.load(MODEL_PATH)
            print(f"[Model] Successfully loaded Random Forest model from {MODEL_PATH}")
        except Exception as e:
            print(f"[Model Error] Failed to load model: {e}")
            ml_artifact = None
    else:
        print(f"[Model Error] Model file not found at {MODEL_PATH}")
        ml_artifact = None

# Initialize database and model on startup
database.init_db()
load_ml_model()

ADVISORY_PROTOCOLS = {
    'LOW': {
        'status_code': 'STABLE',
        'badge_color': '#10B981',  # emerald green
        'advisory_level': 'Normal Geotechnical Baseline',
        'action_protocol': 'Routine telemetry monitoring active. Normal vehicular transit permitted along corridor. Slope conditions remain structurally stable.',
        'authority_action': 'Standard automated data acquisition (10-min interval).'
    },
    'MEDIUM': {
        'status_code': 'WATCH',
        'badge_color': '#F59E0B',  # amber/yellow
        'advisory_level': 'Watch Advisory - Pore Pressure Creep',
        'action_protocol': 'Elevated soil moisture saturation detected. Drivers advised to reduce speed. Municipal disaster cells should monitor hillside drainage and culvert discharge.',
        'authority_action': 'Increase sensor polling to 2-min interval. Deploy spotters to inspect surface tension cracks.'
    },
    'HIGH': {
        'status_code': 'WARNING',
        'badge_color': '#F97316',  # orange
        'advisory_level': 'Severe Warning - High Landslide Risk',
        'action_protocol': 'Accelerated shear tilt displacement and high pore water pressure. Restrict heavy commercial vehicles. Pre-position Border Roads Organisation (BRO) earthmovers at staging bays.',
        'authority_action': 'SDRF teams on 30-minute standby. Issue public advisory via regional emergency broadcast.'
    },
    'VERY HIGH': {
        'status_code': 'CRITICAL ALERT',
        'badge_color': '#EF4444',  # red
        'advisory_level': 'Critical Emergency - Imminent Slope Failure',
        'action_protocol': 'CRITICAL SHEAR DISPLACEMENT & SHOCK DETECTED. Immediate evacuation of downslope human habitations. Full closure of arterial highway to all traffic.',
        'authority_action': 'Activate State Emergency Operation Centre (SEOC). Mobilize NDRF search and rescue units immediately.'
    }
}

def run_ml_inference(rainfall, soil_moisture, tilt, vibration):
    """
    Executes ML prediction and returns risk class, confidence, probability distribution,
    and a continuous 0-100 Risk Index.
    """
    if ml_artifact is None:
        # Fallback heuristic if model is missing
        return 'MEDIUM', 0.50, {'LOW': 0.25, 'MEDIUM': 0.50, 'HIGH': 0.15, 'VERY HIGH': 0.10}, 50.0

    model = ml_artifact['model']
    features = ml_artifact['features']
    classes = ml_artifact['classes']

    input_df = pd.DataFrame([{
        'rainfall': float(rainfall),
        'soil_moisture': float(soil_moisture),
        'tilt': float(tilt),
        'vibration': float(vibration)
    }])[features]

    pred_class = model.predict(input_df)[0]
    raw_probs = model.predict_proba(input_df)[0]
    
    # Map probability to class names
    model_classes = list(model.classes_)
    prob_dict = {}
    for cls in classes:
        if cls in model_classes:
            prob_dict[cls] = round(float(raw_probs[model_classes.index(cls)]), 4)
        else:
            prob_dict[cls] = 0.0

    confidence = prob_dict.get(pred_class, 0.0)

    # Compute a continuous 0-100 Risk Index based on expected class severity
    weights = {'LOW': 15.0, 'MEDIUM': 45.0, 'HIGH': 75.0, 'VERY HIGH': 95.0}
    risk_index = sum(prob_dict[c] * weights[c] for c in classes)
    risk_index = round(min(100.0, max(0.0, risk_index)), 1)

    return pred_class, confidence, prob_dict, risk_index

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OPERATIONAL',
        'service': 'AI-Based Early Warning & Landslide Risk Monitoring System',
        'region': 'North Eastern Region of India (NER)',
        'hackathon': 'Smart India Hackathon 2026',
        'database': 'SQLite Connected',
        'model_loaded': ml_artifact is not None,
        'model_algorithm': 'Random Forest Classifier (Scikit-Learn)',
        'data_disclaimer': 'SIMULATED PROTOTYPE TELEMETRY - FOR RESEARCH & DEMONSTRATION PURPOSES ONLY'
    })

@app.route('/api/sites', methods=['GET'])
def get_sites():
    try:
        sites = database.get_all_sites()
        return jsonify({
            'success': True,
            'count': len(sites),
            'sites': sites
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/sites', methods=['POST'])
def create_custom_site():
    """
    Allows user to manually add a new monitoring location from the North Eastern Region.
    """
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({'success': False, 'error': 'JSON payload required'}), 400
        
        name = data.get('name', '').strip()
        state = data.get('state', '').strip()
        if not name or not state:
            return jsonify({'success': False, 'error': 'Location name and State are required.'}), 400

        site_id = data.get('site_id', '').strip()
        elevation_m = int(data.get('elevation_m', 1000))
        terrain_type = data.get('terrain_type', 'Steep Sloped Hill Corridor').strip()
        description = data.get('description', f'Custom monitoring node deployed in {name}, {state}.').strip()
        latitude = float(data.get('latitude', 26.0)) if data.get('latitude') else None
        longitude = float(data.get('longitude', 92.0)) if data.get('longitude') else None

        new_site = database.add_custom_site(
            site_id=site_id,
            name=name,
            state=state,
            latitude=latitude,
            longitude=longitude,
            elevation_m=elevation_m,
            terrain_type=terrain_type,
            description=description
        )

        # Ensure telemetry simulator state is ready
        simulator_engine._ensure_site(new_site['site_id'])

        return jsonify({
            'success': True,
            'site': new_site,
            'message': f"Monitoring site {new_site['site_id']} ({new_site['name']}) created successfully."
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/sensors/live', methods=['GET'])
def get_live_telemetry():
    site_id = request.args.get('site_id', 'A-02')
    
    try:
        # Generate next simulated step
        raw_telemetry = simulator_engine.get_current_reading(site_id)
        
        # Run ML model inference
        pred_class, confidence, prob_dict, risk_index = run_ml_inference(
            raw_telemetry['rainfall'],
            raw_telemetry['soil_moisture'],
            raw_telemetry['tilt'],
            raw_telemetry['vibration']
        )

        # Log reading to SQLite
        database.log_telemetry(
            site_id=site_id,
            rainfall=raw_telemetry['rainfall'],
            soil_moisture=raw_telemetry['soil_moisture'],
            tilt=raw_telemetry['tilt'],
            vibration=raw_telemetry['vibration'],
            risk_level=pred_class,
            confidence=confidence,
            risk_index=risk_index,
            is_simulated=1
        )

        # Compute forward-looking predictive landslide forecast
        forecast_data = forecaster.compute_landslide_forecast(
            site_id=site_id,
            current_telemetry=raw_telemetry
        )

        # If HIGH or VERY HIGH risk, log an alert event and trigger email dispatch
        if pred_class in ['HIGH', 'VERY HIGH']:
            advisory = ADVISORY_PROTOCOLS[pred_class]
            database.log_alert(
                site_id=site_id,
                risk_level=pred_class,
                message=f"{advisory['advisory_level']}: Rain={raw_telemetry['rainfall']}mm, Tilt={raw_telemetry['tilt']}°, Vib={raw_telemetry['vibration']}m/s²",
                advisory_action=advisory['action_protocol'],
                status='ACTIVE'
            )

            # Automated email alert dispatch with 60-second debounce
            now_ts = time.time()
            if now_ts - LAST_EMAIL_DISPATCH.get(site_id, 0) > 60:
                LAST_EMAIL_DISPATCH[site_id] = now_ts
                site_rec = next((s for s in database.get_all_sites() if s['site_id'] == site_id), None)
                s_name = site_rec['name'] if site_rec else site_id
                s_state = site_rec['state'] if site_rec else 'North Eastern Region'
                try:
                    mailer.dispatch_email_alerts(
                        site_id=site_id,
                        site_name=s_name,
                        state=s_state,
                        risk_level=pred_class,
                        forecast=forecast_data,
                        telemetry=raw_telemetry
                    )
                except Exception as ex:
                    print(f"[Email Auto-Dispatch Error] {ex}")

        advisory_info = ADVISORY_PROTOCOLS.get(pred_class, ADVISORY_PROTOCOLS['LOW'])

        return jsonify({
            'success': True,
            'site_id': site_id,
            'scenario': raw_telemetry['scenario'],
            'scenario_name': raw_telemetry['scenario_name'],
            'telemetry': {
                'rainfall': raw_telemetry['rainfall'],
                'rainfall_unit': 'mm/24h',
                'soil_moisture': raw_telemetry['soil_moisture'],
                'soil_moisture_unit': '%',
                'tilt': raw_telemetry['tilt'],
                'tilt_unit': 'degrees (°)',
                'vibration': raw_telemetry['vibration'],
                'vibration_unit': 'm/s²'
            },
            'prediction': {
                'risk_level': pred_class,
                'confidence': round(confidence * 100, 1),
                'risk_index': risk_index,
                'probabilities': {k: round(v * 100, 1) for k, v in prob_dict.items()},
                'disclaimer': 'Model statistical prediction based on simulated geomechanical parameters. Not an absolute physical certainty guarantee.'
            },
            'forecast': forecast_data,
            'advisory': advisory_info,
            'is_simulated': True,
            'prototype_notice': 'PROTOTYPE DATA: Telemetry readings are synthesized for prototype demonstration without physical IoT hardware.'
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict_custom():
    """
    Direct prediction endpoint for external or custom sensor readings.
    """
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({'success': False, 'error': 'JSON payload required'}), 400

        required = ['rainfall', 'soil_moisture', 'tilt', 'vibration']
        for field in required:
            if field not in data:
                return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400

        site_id = data.get('site_id', 'CUSTOM')
        rainfall = float(data['rainfall'])
        soil_moisture = float(data['soil_moisture'])
        tilt = float(data['tilt'])
        vibration = float(data['vibration'])

        pred_class, confidence, prob_dict, risk_index = run_ml_inference(
            rainfall, soil_moisture, tilt, vibration
        )

        # Log to DB
        database.log_telemetry(
            site_id=site_id,
            rainfall=rainfall,
            soil_moisture=soil_moisture,
            tilt=tilt,
            vibration=vibration,
            risk_level=pred_class,
            confidence=confidence,
            risk_index=risk_index,
            is_simulated=1
        )

        advisory_info = ADVISORY_PROTOCOLS.get(pred_class, ADVISORY_PROTOCOLS['LOW'])

        return jsonify({
            'success': True,
            'site_id': site_id,
            'inputs': {
                'rainfall': rainfall,
                'soil_moisture': soil_moisture,
                'tilt': tilt,
                'vibration': vibration
            },
            'prediction': {
                'risk_level': pred_class,
                'confidence': round(confidence * 100, 1),
                'risk_index': risk_index,
                'probabilities': {k: round(v * 100, 1) for k, v in prob_dict.items()},
                'disclaimer': 'Model statistical prediction based on sensor parameters. Does not guarantee occurrence or non-occurrence of physical slope failure.'
            },
            'advisory': advisory_info
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_telemetry_history():
    site_id = request.args.get('site_id')
    limit = int(request.args.get('limit', 30))
    limit = min(100, max(5, limit))

    try:
        history = database.get_recent_telemetry(site_id=site_id, limit=limit)
        return jsonify({
            'success': True,
            'site_id': site_id,
            'count': len(history),
            'history': history
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    site_id = request.args.get('site_id')
    limit = int(request.args.get('limit', 20))

    try:
        alerts = database.get_recent_alerts(site_id=site_id, limit=limit)
        return jsonify({
            'success': True,
            'count': len(alerts),
            'alerts': alerts
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/forecast', methods=['GET'])
def get_landslide_forecast():
    site_id = request.args.get('site_id', 'A-02')
    try:
        raw_telemetry = simulator_engine.get_current_reading(site_id)
        forecast_data = forecaster.compute_landslide_forecast(site_id=site_id, current_telemetry=raw_telemetry)
        return jsonify({
            'success': True,
            'site_id': site_id,
            'forecast': forecast_data
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/landslide-events', methods=['GET'])
def get_historical_events():
    site_id = request.args.get('site_id')
    try:
        events = database.get_historical_landslide_events(site_id)
        return jsonify({
            'success': True,
            'count': len(events),
            'events': events
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/subscribers', methods=['GET'])
def get_subscribers_route():
    site_id = request.args.get('site_id')
    try:
        subs = database.get_subscribers(site_id)
        return jsonify({
            'success': True,
            'count': len(subs),
            'subscribers': subs
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/subscribers', methods=['POST'])
def add_subscriber_route():
    try:
        data = request.get_json(force=True)
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        role = data.get('role', 'Local Resident').strip()
        site_id = data.get('site_id', 'ALL').strip().upper()
        threshold = data.get('alert_level_threshold', 'HIGH').strip().upper()

        if not name or not email:
            return jsonify({'success': False, 'error': 'Name and Email are required.'}), 400

        sub = database.add_subscriber(name, email, role, site_id, threshold)
        return jsonify({
            'success': True,
            'subscriber': sub,
            'message': f"Successfully subscribed {email} to landslide early warnings."
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/subscribers/<int:sub_id>', methods=['DELETE'])
def delete_subscriber_route(sub_id):
    try:
        success = database.delete_subscriber(sub_id)
        if success:
            return jsonify({'success': True, 'message': 'Subscriber removed successfully.'})
        return jsonify({'success': False, 'error': 'Subscriber not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/alerts/email/send', methods=['POST'])
def manual_email_alert_broadcast():
    try:
        data = request.get_json(force=True) or {}
        site_id = data.get('site_id', 'A-02')
        risk_level = data.get('risk_level', 'VERY HIGH')

        raw_telemetry = simulator_engine.get_current_reading(site_id)
        forecast_data = forecaster.compute_landslide_forecast(site_id=site_id, current_telemetry=raw_telemetry)

        site_rec = next((s for s in database.get_all_sites() if s['site_id'] == site_id), None)
        site_name = site_rec['name'] if site_rec else site_id
        state = site_rec['state'] if site_rec else 'North Eastern Region'

        custom_recipient = None
        if data.get('custom_email'):
            custom_recipient = {
                'name': data.get('custom_name', 'Test Recipient'),
                'email': data.get('custom_email')
            }

        dispatched = mailer.dispatch_email_alerts(
            site_id=site_id,
            site_name=site_name,
            state=state,
            risk_level=risk_level,
            forecast=forecast_data,
            telemetry=raw_telemetry,
            custom_recipient=custom_recipient
        )

        return jsonify({
            'success': True,
            'site_id': site_id,
            'recipients_count': len(dispatched),
            'dispatched': dispatched,
            'message': f"Emergency warning broadcast sent to {len(dispatched)} subscriber(s)."
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/alerts/email/logs', methods=['GET'])
def get_email_logs_route():
    limit = int(request.args.get('limit', 30))
    try:
        logs = database.get_email_logs(limit=limit)
        return jsonify({
            'success': True,
            'count': len(logs),
            'logs': logs
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/model/metrics', methods=['GET'])
def get_model_metrics():
    if not os.path.exists(METRICS_PATH):
        return jsonify({'success': False, 'error': 'Metrics file not found'}), 404
    
    try:
        with open(METRICS_PATH, 'r') as f:
            data = json.load(f)
        return jsonify({
            'success': True,
            'metrics': data
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/simulate/scenario', methods=['POST'])
def trigger_scenario():
    try:
        data = request.get_json(force=True)
        site_id = data.get('site_id', 'A-02')
        scenario_key = data.get('scenario')

        success, msg = simulator_engine.set_scenario(site_id, scenario_key)
        if not success:
            return jsonify({'success': False, 'error': msg}), 400
        
        return jsonify({
            'success': True,
            'site_id': site_id,
            'scenario': scenario_key,
            'message': f"Active simulation scenario for {site_id} updated to: {msg}"
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/simulate/override', methods=['POST'])
def manual_override():
    try:
        data = request.get_json(force=True)
        site_id = data.get('site_id', 'A-02')
        rainfall = data.get('rainfall', 20.0)
        soil_moisture = data.get('soil_moisture', 45.0)
        tilt = data.get('tilt', 2.0)
        vibration = data.get('vibration', 0.5)

        success, msg = simulator_engine.set_manual_override(site_id, rainfall, soil_moisture, tilt, vibration)
        if not success:
            return jsonify({'success': False, 'error': msg}), 400

        return jsonify({
            'success': True,
            'site_id': site_id,
            'message': msg
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/simulate/reset', methods=['POST'])
def reset_simulation():
    try:
        data = request.get_json(force=True) or {}
        site_id = data.get('site_id', 'A-02')
        simulator_engine.reset_to_auto(site_id)
        return jsonify({'success': True, 'message': f'Simulation for site {site_id} reset to auto baseline.'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"[Server] Starting Landslide Early Warning Flask API on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
