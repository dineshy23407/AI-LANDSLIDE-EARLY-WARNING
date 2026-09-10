"""
Automated Test Suite for Landslide Early Warning Backend
Tests database integrity, ML inference, and all REST API endpoints.
"""

import unittest
import json
import os
import sys

# Add backend directory to sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from app import app, run_ml_inference
import database

class LandslideBackendTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.client = self.app.test_client()
        database.init_db()

    def test_database_initialization(self):
        sites = database.get_all_sites()
        self.assertGreaterEqual(len(sites), 3)
        site_ids = [s['site_id'] for s in sites]
        self.assertIn('A-02', site_ids)
        self.assertIn('B-04', site_ids)
        self.assertIn('C-01', site_ids)

    def test_ml_inference_low_risk(self):
        pred_class, conf, prob_dict, risk_idx = run_ml_inference(
            rainfall=5.0,
            soil_moisture=25.0,
            tilt=0.8,
            vibration=0.1
        )
        self.assertEqual(pred_class, 'LOW')
        self.assertGreater(conf, 0.5)
        self.assertLess(risk_idx, 35.0)

    def test_ml_inference_very_high_risk(self):
        pred_class, conf, prob_dict, risk_idx = run_ml_inference(
            rainfall=150.0,
            soil_moisture=95.0,
            tilt=16.5,
            vibration=3.8
        )
        self.assertEqual(pred_class, 'VERY HIGH')
        self.assertGreater(conf, 0.5)
        self.assertGreater(risk_idx, 75.0)

    def test_api_health(self):
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'OPERATIONAL')
        self.assertTrue(data['model_loaded'])

    def test_api_sites(self):
        response = self.client.get('/api/sites')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertGreaterEqual(len(data['sites']), 3)

    def test_api_live_sensors(self):
        response = self.client.get('/api/sensors/live?site_id=A-02')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['site_id'], 'A-02')
        self.assertIn('telemetry', data)
        self.assertIn('rainfall', data['telemetry'])
        self.assertIn('prediction', data)
        self.assertIn('risk_level', data['prediction'])
        self.assertIn('advisory', data)
        self.assertTrue(data['is_simulated'])

    def test_api_predict_custom(self):
        payload = {
            'site_id': 'TEST-01',
            'rainfall': 80.0,
            'soil_moisture': 75.0,
            'tilt': 6.5,
            'vibration': 1.6
        }
        response = self.client.post('/api/predict', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertIn(data['prediction']['risk_level'], ['MEDIUM', 'HIGH', 'VERY HIGH'])
        self.assertIn('probabilities', data['prediction'])

    def test_api_history(self):
        response = self.client.get('/api/history?site_id=A-02&limit=10')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertGreater(len(data['history']), 0)

    def test_api_model_metrics(self):
        response = self.client.get('/api/model/metrics')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertIn('metrics', data)
        self.assertGreaterEqual(data['metrics']['accuracy'], 0.85)
        self.assertIn('feature_importances', data['metrics'])

    def test_api_scenario_injection(self):
        payload = {'site_id': 'A-02', 'scenario': 'CRITICAL_FAILURE'}
        response = self.client.post('/api/simulate/scenario', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])

    def test_api_create_custom_site(self):
        payload = {
            'site_id': 'NL-TEST',
            'name': 'Pfutsero High Altitude Slope',
            'state': 'Nagaland',
            'elevation_m': 2133,
            'terrain_type': 'Soft Sedimentary Shale and Disang Formations',
            'description': 'Highest altitude town in Nagaland with active monsoon slope failures.'
        }
        response = self.client.post('/api/sites', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['site']['site_id'], 'NL-TEST')
        self.assertEqual(data['site']['state'], 'Nagaland')

        # Test querying live telemetry for the newly created site
        live_res = self.client.get('/api/sensors/live?site_id=NL-TEST')
        self.assertEqual(live_res.status_code, 200)
        live_data = json.loads(live_res.data)
        self.assertEqual(live_data['site_id'], 'NL-TEST')

    def test_api_forecast(self):
        response = self.client.get('/api/forecast?site_id=A-02')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertIn('forecast', data)
        self.assertIn('lead_time_window', data['forecast'])
        self.assertIn('failure_probability_6h', data['forecast'])

    def test_api_landslide_events(self):
        response = self.client.get('/api/landslide-events')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertGreaterEqual(len(data['events']), 5)

    def test_api_subscribers_flow(self):
        # 1. Add subscriber
        payload = {
            'name': 'Test Officer',
            'email': 'officer.test@sih2026.org',
            'role': 'Disaster Officer',
            'site_id': 'A-02',
            'alert_level_threshold': 'HIGH'
        }
        res_post = self.client.post('/api/subscribers', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(res_post.status_code, 201)
        sub_id = json.loads(res_post.data)['subscriber']['id']

        # 2. Get subscribers
        res_get = self.client.get('/api/subscribers?site_id=A-02')
        self.assertEqual(res_get.status_code, 200)
        emails = [s['email'] for s in json.loads(res_get.data)['subscribers']]
        self.assertIn('officer.test@sih2026.org', emails)

        # 3. Delete subscriber
        res_del = self.client.delete(f'/api/subscribers/{sub_id}')
        self.assertEqual(res_del.status_code, 200)

    def test_api_email_dispatch(self):
        payload = {
            'site_id': 'A-02',
            'risk_level': 'VERY HIGH',
            'custom_email': 'judge@sih2026.org',
            'custom_name': 'SIH Evaluator'
        }
        response = self.client.post('/api/alerts/email/send', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertGreaterEqual(data['recipients_count'], 1)

        # Check email logs
        logs_res = self.client.get('/api/alerts/email/logs')
        self.assertEqual(logs_res.status_code, 200)
        logs_data = json.loads(logs_res.data)
        self.assertTrue(logs_data['success'])
        self.assertGreater(len(logs_data['logs']), 0)

if __name__ == '__main__':
    unittest.main()

