"""
AI-Based Early Warning & Landslide Risk Monitoring System
North Eastern Region of India - Smart India Hackathon 2026

Telemetry Simulator Engine:
Maintains physical state drift and simulated telemetry for North East India monitoring sites:
- Site A-02: Gangtok-Nathula Slope Corridor (East Sikkim)
- Site B-04: Champhai Ridge Slopes (Mizoram)
- Site C-01: Dima Hasao Hill Rail Section (Assam)
"""

import random
import time

# Predefined geological demo scenarios
SCENARIOS = {
    'NORMAL_DRY': {
        'name': 'Normal Dry Conditions',
        'description': 'Post-monsoon dry slope, stable geotechnical equilibrium.',
        'target': {'rainfall': 5.0, 'soil_moisture': 28.0, 'tilt': 1.1, 'vibration': 0.15},
        'noise': {'rainfall': 2.0, 'soil_moisture': 3.0, 'tilt': 0.2, 'vibration': 0.05}
    },
    'PRE_MONSOON': {
        'name': 'Pre-Monsoon Showers',
        'description': 'Moderate rainfall causing progressive wetting of topsoil and minor creep.',
        'target': {'rainfall': 35.0, 'soil_moisture': 55.0, 'tilt': 3.5, 'vibration': 0.70},
        'noise': {'rainfall': 6.0, 'soil_moisture': 4.0, 'tilt': 0.4, 'vibration': 0.15}
    },
    'MONSOON_DELUGE': {
        'name': 'Heavy Monsoon Deluge',
        'description': 'Sustained precipitation along steep highway cuts, elevated pore pressure.',
        'target': {'rainfall': 88.0, 'soil_moisture': 81.0, 'tilt': 7.6, 'vibration': 1.85},
        'noise': {'rainfall': 10.0, 'soil_moisture': 3.5, 'tilt': 0.6, 'vibration': 0.25}
    },
    'CRITICAL_FAILURE': {
        'name': 'Critical Slope Failure / Cloudburst Trigger',
        'description': 'Torrential cloudburst, fully saturated regolith, shear displacement and ground tremors.',
        'target': {'rainfall': 145.0, 'soil_moisture': 94.0, 'tilt': 15.2, 'vibration': 3.40},
        'noise': {'rainfall': 15.0, 'soil_moisture': 3.0, 'tilt': 1.2, 'vibration': 0.40}
    }
}

class SiteTelemetrySimulator:
    def __init__(self):
        # Baseline internal states for each site
        self.site_states = {}
        # Pre-seed standard sites
        for s_id in ['A-02', 'B-04', 'C-01', 'SK-01', 'AS-01', 'ML-01', 'AR-01', 'MZ-01', 'NL-01', 'MN-01', 'TR-01']:
            self._ensure_site(s_id)

    def _ensure_site(self, site_id):
        if site_id not in self.site_states:
            self.site_states[site_id] = {
                'rainfall': round(12.0 + random.random() * 15.0, 1),
                'soil_moisture': round(32.0 + random.random() * 20.0, 1),
                'tilt': round(1.0 + random.random() * 1.5, 2),
                'vibration': round(0.12 + random.random() * 0.25, 3),
                'active_scenario': 'NORMAL_DRY',
                'manual_override': None,
                'last_update': time.time()
            }

    def set_scenario(self, site_id, scenario_key):
        self._ensure_site(site_id)
        if scenario_key not in SCENARIOS:
            return False, f"Unknown scenario {scenario_key}"
        
        self.site_states[site_id]['active_scenario'] = scenario_key
        self.site_states[site_id]['manual_override'] = None
        return True, SCENARIOS[scenario_key]['name']

    def set_manual_override(self, site_id, rainfall, soil_moisture, tilt, vibration):
        self._ensure_site(site_id)
        self.site_states[site_id]['manual_override'] = {
            'rainfall': float(rainfall),
            'soil_moisture': float(soil_moisture),
            'tilt': float(tilt),
            'vibration': float(vibration)
        }
        self.site_states[site_id]['active_scenario'] = 'CUSTOM_MANUAL'
        return True, "Manual override applied"

    def reset_to_auto(self, site_id):
        self._ensure_site(site_id)
        self.site_states[site_id]['manual_override'] = None
        self.site_states[site_id]['active_scenario'] = 'NORMAL_DRY'
        return True

    def get_current_reading(self, site_id):
        if not site_id:
            site_id = 'A-02'
        self._ensure_site(site_id)
        
        state = self.site_states[site_id]
        
        # If manual override active, return with slight sensor noise
        if state['manual_override']:
            over = state['manual_override']
            rf = max(0.0, round(over['rainfall'] + (random.random() - 0.5) * 1.5, 1))
            sm = min(100.0, max(10.0, round(over['soil_moisture'] + (random.random() - 0.5) * 0.8, 1)))
            tilt = max(0.0, round(over['tilt'] + (random.random() - 0.5) * 0.1, 2))
            vib = max(0.01, round(over['vibration'] + (random.random() - 0.5) * 0.05, 3))
            return {
                'site_id': site_id,
                'rainfall': rf,
                'soil_moisture': sm,
                'tilt': tilt,
                'vibration': vib,
                'scenario': 'CUSTOM_MANUAL',
                'scenario_name': 'Manual Custom Telemetry'
            }

        # Otherwise drift towards target of active scenario
        sc_data = SCENARIOS.get(state['active_scenario'], SCENARIOS['NORMAL_DRY'])
        tgt = sc_data['target']
        noise = sc_data['noise']

        # Smooth relaxation towards scenario target
        alpha = 0.35  # convergence rate per tick
        state['rainfall'] += alpha * (tgt['rainfall'] - state['rainfall']) + (random.random() - 0.5) * noise['rainfall']
        state['soil_moisture'] += alpha * (tgt['soil_moisture'] - state['soil_moisture']) + (random.random() - 0.5) * noise['soil_moisture']
        state['tilt'] += alpha * (tgt['tilt'] - state['tilt']) + (random.random() - 0.5) * noise['tilt']
        state['vibration'] += alpha * (tgt['vibration'] - state['vibration']) + (random.random() - 0.5) * noise['vibration']

        # Clamping to physically sensible ranges
        rf = max(0.0, round(state['rainfall'], 1))
        sm = min(100.0, max(10.0, round(state['soil_moisture'], 1)))
        tilt = max(0.0, min(30.0, round(state['tilt'], 2)))
        vib = max(0.01, min(10.0, round(state['vibration'], 3)))

        return {
            'site_id': site_id,
            'rainfall': rf,
            'soil_moisture': sm,
            'tilt': tilt,
            'vibration': vib,
            'scenario': state['active_scenario'],
            'scenario_name': sc_data['name']
        }

# Global singleton instance for backend runtime
simulator_engine = SiteTelemetrySimulator()
