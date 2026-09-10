"""
AI-Based Early Warning & Landslide Risk Monitoring System
North Eastern Region of India - Smart India Hackathon 2026

Predictive Landslide Forecaster Engine:
Analyzes previous telemetry history, slope tilt kinematics (velocity and acceleration),
and antecedent rainfall accumulation to predict the NEXT landslide before it occurs.
Benchmarks current slope trajectories against historical disaster records.
"""

import numpy as np
import datetime
import database

def compute_landslide_forecast(site_id, history_records=None, current_telemetry=None):
    """
    Computes a forward-looking predictive forecast of impending slope failure:
    - Estimated Time-to-Failure (TTF) window (Lead Time)
    - 6-Hour and 24-Hour Failure Initiation Probabilities
    - Kinematic Creep Phase (Primary, Secondary, Tertiary Accelerating)
    - Dominant Trigger Factor Attribution
    - Historical Landslide Benchmark Matching
    """
    if history_records is None:
        history_records = database.get_recent_telemetry(site_id=site_id, limit=25)

    if not history_records or len(history_records) < 2:
        return {
            'site_id': site_id,
            'forecast_status': 'INSUFFICIENT_DATA',
            'lead_time_window': 'Awaiting telemetry baseline...',
            'failure_probability_6h': 10.0,
            'failure_probability_24h': 15.0,
            'creep_phase': 'Primary Creep (Stable Baseline)',
            'velocity_deg_hr': 0.05,
            'acceleration_deg_hr2': 0.0,
            'antecedent_rainfall_accum': 0.0,
            'primary_trigger': 'Normal Baseline Conditions',
            'historical_match': None,
            'recommendation': 'Continue routine automated sensor acquisition.'
        }

    # Extract time series parameters
    tilts = np.array([float(r['tilt']) for r in history_records])
    rains = np.array([float(r['rainfall']) for r in history_records])
    moistures = np.array([float(r['soil_moisture']) for r in history_records])
    vibrations = np.array([float(r['vibration']) for r in history_records])

    latest_tilt = tilts[-1]
    latest_rain = rains[-1]
    latest_moisture = moistures[-1]
    latest_vib = vibrations[-1]

    # Calculate velocity (rate of change over recent steps)
    n_points = min(5, len(tilts))
    recent_tilts = tilts[-n_points:]
    delta_tilts = np.diff(recent_tilts)
    avg_delta_tilt = float(np.mean(delta_tilts))
    # Scale to estimated degrees per hour (assuming 5-min intervals)
    velocity_deg_hr = round(max(0.0, avg_delta_tilt * 12.0), 2)

    # Calculate acceleration (rate of change of velocity)
    if len(delta_tilts) >= 2:
        accel = float(np.diff(delta_tilts)[-1]) * 144.0  # scaled to deg/hr^2
        acceleration_deg_hr2 = round(accel, 2)
    else:
        acceleration_deg_hr2 = 0.0

    # Cumulative antecedent precipitation indicator
    antecedent_rain = round(float(np.mean(rains[-10:])) if len(rains) >= 10 else latest_rain, 1)

    # Geotechnical Kinematic Creep Phase Analysis
    # Tertiary creep occurs when velocity accelerates and slope approaches shear failure
    if latest_tilt >= 10.0 or (velocity_deg_hr >= 1.5 and acceleration_deg_hr2 > 0.1):
        creep_phase = 'Tertiary Creep (Accelerating / Imminent Failure)'
        lead_time = 'Imminent: 1 to 4 Hours'
        prob_6h = min(98.5, 75.0 + 1.5 * latest_tilt + 0.1 * latest_rain)
        prob_24h = min(99.9, prob_6h + 5.0)
        status = 'IMMINENT_SLOPE_FAILURE'
        action = 'CRITICAL ADVISORY: Evacuate slope foot zones. Issue immediate highway roadblock and sound community alarm.'
    elif latest_tilt >= 5.0 or (velocity_deg_hr >= 0.6 and latest_moisture > 75.0) or (latest_rain > 70.0 and latest_moisture > 80.0):
        creep_phase = 'Secondary Creep (Accelerated Displacement)'
        lead_time = 'Warning Window: 4 to 9 Hours'
        prob_6h = min(88.0, 45.0 + 2.0 * latest_tilt + 0.15 * latest_rain)
        prob_24h = min(95.0, prob_6h + 10.0)
        status = 'ACCELERATING_CREEP_DETECTED'
        action = 'HIGH WARNING: Saturated slope creeping towards slip. Mobilize SDRF and issue SMS/Email evacuation alerts.'
    elif latest_tilt >= 2.5 or latest_rain > 35.0 or latest_moisture > 60.0:
        creep_phase = 'Secondary Creep (Steady Dilatancy)'
        lead_time = 'Advisory Window: 12 to 24 Hours'
        prob_6h = min(55.0, 20.0 + 1.2 * latest_tilt + 0.1 * latest_rain)
        prob_24h = min(70.0, prob_6h + 15.0)
        status = 'ELEVATED_WATCH'
        action = 'WATCH PROTOCOL: Inspect hillside weep holes, culvert outflow, and tension cracks.'
    else:
        creep_phase = 'Primary Creep (Stable Geotechnical Equilibrium)'
        lead_time = 'No Impending Failure (>48 Hours / Stable)'
        prob_6h = round(max(3.0, 5.0 + 0.5 * latest_tilt), 1)
        prob_24h = round(max(5.0, prob_6h + 4.0), 1)
        status = 'STABLE_EQUILIBRIUM'
        action = 'Routine automated telemetry monitoring active.'

    prob_6h = round(float(prob_6h), 1)
    prob_24h = round(float(prob_24h), 1)

    # Attribution breakdown of triggers
    total_stress = (latest_rain / 120.0) + (latest_moisture / 80.0) + (latest_tilt / 12.0) + (latest_vib / 2.5) + 0.001
    rain_attr = round(((latest_rain / 120.0) / total_stress) * 100)
    moist_attr = round(((latest_moisture / 80.0) / total_stress) * 100)
    tilt_attr = round(((latest_tilt / 12.0) / total_stress) * 100)
    vib_attr = max(0, 100 - (rain_attr + moist_attr + tilt_attr))

    primary_trigger = f"Rainfall Infiltration ({rain_attr}%) + Soil Saturation ({moist_attr}%) + Tilt Shear ({tilt_attr}%)"

    # Find closest historical catastrophic landslide match from the database
    historical_events = database.get_historical_landslide_events()
    best_match = None
    min_dist = float('inf')

    for ev in historical_events:
        # Distance metric comparing rainfall and tilt
        dist = ((latest_rain - ev['rainfall_mm']) / 100.0) ** 2 + ((latest_tilt - ev['tilt_deg']) / 10.0) ** 2
        if dist < min_dist:
            min_dist = dist
            best_match = ev

    historical_comparison = None
    if best_match:
        similarity_pct = max(10, min(99, int(100 - min_dist * 35)))
        historical_comparison = {
            'event_name': best_match['event_name'],
            'date': best_match['date'],
            'location': best_match['location'],
            'state': best_match['state'],
            'rainfall_mm': best_match['rainfall_mm'],
            'tilt_deg': best_match['tilt_deg'],
            'trigger_type': best_match['trigger_type'],
            'impact_summary': best_match['impact_summary'],
            'similarity_score': similarity_pct,
            'narrative': f"Current conditions ({latest_rain}mm rain, {latest_tilt}° tilt) exhibit {similarity_pct}% kinematic resemblance to the {best_match['event_name']} ({best_match['date']}) in {best_match['state']} which resulted in: {best_match['impact_summary']}"
        }

    return {
        'site_id': site_id,
        'forecast_status': status,
        'lead_time_window': lead_time,
        'failure_probability_6h': prob_6h,
        'failure_probability_24h': prob_24h,
        'creep_phase': creep_phase,
        'velocity_deg_hr': velocity_deg_hr,
        'acceleration_deg_hr2': acceleration_deg_hr2,
        'antecedent_rainfall_accum': antecedent_rain,
        'primary_trigger': primary_trigger,
        'attribution': {
            'rainfall_pct': rain_attr,
            'moisture_pct': moist_attr,
            'tilt_pct': tilt_attr,
            'vibration_pct': vib_attr
        },
        'historical_match': historical_comparison,
        'recommendation': action,
        'disclaimer': 'Lead-time prediction is a geotechnical statistical estimate modeled on kinematic inverse-velocity and antecedent rain. It does not provide absolute certainty of slope failure timing.'
    }
