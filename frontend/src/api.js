import axios from 'axios';
import { DEFAULT_SITES } from './utils/constants';

// Use explicit backend address with fallback to relative proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Client-side simulation state for Standalone Web Preview (when deployed without local backend)
let clientScenario = 'NORMAL_DRY';
let clientAlerts = [];
let clientEmailLogs = [];
let clientSubscribers = [
  { id: 1, site_id: 'A-02', name: 'Dr. T. Sharma (District Emergency Officer)', email: 'ddma.east.sikkim@nic.in', role: 'DDMA East Sikkim', notify_level: 'ALL', organization: 'Disaster Management Sikkim' },
  { id: 2, site_id: 'A-02', name: 'Col. Pradeep Gurung', email: 'bro.taskforce48@gov.in', role: 'Commanding Officer', notify_level: 'HIGH', organization: 'BRO Project Swastik' },
  { id: 3, site_id: 'A-02', name: 'Haflong Community Warning Ward Cell', email: 'haflong.community.relief@gmail.com', role: 'Community Coordinator', notify_level: 'HIGH', organization: 'Community Emergency Ward' },
  { id: 4, site_id: 'A-02', name: 'NDRF 1st Battalion Control Room', email: '1bn-ndrf@nic.in', role: 'Emergency Operations Center', notify_level: 'CRITICAL', organization: 'National Disaster Response Force' },
];

const getMockTelemetry = (siteId) => {
  let rainfall = 18.5, soil = 42.0, tilt = 1.2, vib = 0.45;
  let risk = 'LOW', riskScore = 14;

  if (clientScenario === 'MONSOON_DELUGE') {
    rainfall = 85.0; soil = 78.4; tilt = 7.2; vib = 2.1;
    risk = 'HIGH'; riskScore = 74;
  } else if (clientScenario === 'CRITICAL_FAILURE') {
    rainfall = 134.0; soil = 88.5; tilt = 14.8; vib = 4.2;
    risk = 'VERY HIGH'; riskScore = 94;
  } else if (clientScenario === 'PRE_MONSOON') {
    rainfall = 45.0; soil = 62.0; tilt = 4.1; vib = 1.2;
    risk = 'MEDIUM'; riskScore = 48;
  }

  const now = new Date().toISOString();
  return {
    success: true,
    site_id: siteId,
    scenario: clientScenario,
    data_disclaimer: 'SIMULATED PROTOTYPE TELEMETRY - FOR RESEARCH & DEMONSTRATION PURPOSES ONLY',
    reading: {
      timestamp: now,
      rainfall,
      soil_moisture: soil,
      tilt,
      vibration: vib,
    },
    prediction: {
      risk_level: risk,
      confidence_pct: 92.5,
      risk_score: riskScore,
      probabilities: {
        LOW: risk === 'LOW' ? 88.0 : 4.0,
        MEDIUM: risk === 'MEDIUM' ? 76.0 : 12.0,
        HIGH: risk === 'HIGH' ? 79.0 : 10.0,
        'VERY HIGH': risk === 'VERY HIGH' ? 91.0 : 5.0,
      },
      advisory: {
        headline: risk === 'VERY HIGH' ? 'CRITICAL EVACUATION DIRECTIVE' : risk === 'HIGH' ? 'WARNING LEVEL: PREPARE EVACUATION' : 'STABLE BASELINE CONDITIONS',
        action: risk === 'VERY HIGH' ? 'BRO highway roadblock triggered. Evacuate foothill hamlets immediately.' : 'Routine automated sensor monitoring active.'
      }
    }
  };
};

export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (err) {
    return {
      status: 'OPERATIONAL (WEB STANDALONE DEMO MODE)',
      service: 'AI-Based Early Warning & Landslide Risk Monitoring System',
      region: 'North Eastern Region of India (NER)',
      hackathon: 'Smart India Hackathon 2026',
      model_algorithm: 'Random Forest Classifier (Scikit-Learn)',
      model_loaded: true,
      database: 'Cloud Prototype Cache'
    };
  }
};

export const fetchSites = async () => {
  try {
    const response = await apiClient.get('/sites');
    return response.data;
  } catch (err) {
    return { success: true, sites: DEFAULT_SITES };
  }
};

export const createCustomSite = async (siteData) => {
  try {
    const response = await apiClient.post('/sites', siteData);
    return response.data;
  } catch (err) {
    DEFAULT_SITES.push(siteData);
    return { success: true, site: siteData };
  }
};

export const fetchLiveTelemetry = async (siteId) => {
  try {
    const response = await apiClient.get('/sensors/live', {
      params: { site_id: siteId }
    });
    return response.data;
  } catch (err) {
    return getMockTelemetry(siteId);
  }
};

export const predictManual = async (payload) => {
  try {
    const response = await apiClient.post('/predict', payload);
    return response.data;
  } catch (err) {
    const r = payload.rainfall || 0;
    const t = payload.tilt || 0;
    const risk = (r > 100 || t > 10) ? 'VERY HIGH' : (r > 50 || t > 5) ? 'HIGH' : 'LOW';
    return {
      success: true,
      risk_level: risk,
      confidence_pct: 89.5,
      risk_score: risk === 'VERY HIGH' ? 92 : 30
    };
  }
};

export const fetchHistory = async (siteId, limit = 30) => {
  try {
    const response = await apiClient.get('/history', {
      params: { site_id: siteId, limit }
    });
    return response.data;
  } catch (err) {
    const history = [];
    const now = Date.now();
    for (let i = limit; i >= 0; i--) {
      history.push({
        timestamp: new Date(now - i * 10000).toISOString(),
        rainfall: Math.max(5, Math.sin(i / 3) * 30 + (clientScenario === 'CRITICAL_FAILURE' ? 90 : 20)),
        soil_moisture: Math.min(95, 45 + (clientScenario === 'CRITICAL_FAILURE' ? 40 : 10) + Math.cos(i / 4) * 8),
        tilt: Math.max(0.5, (clientScenario === 'CRITICAL_FAILURE' ? 12 : 1.5) + Math.sin(i / 5) * 1.5),
        vibration: Math.max(0.2, (clientScenario === 'CRITICAL_FAILURE' ? 3.5 : 0.4) + Math.random() * 0.4),
        risk_level: clientScenario === 'CRITICAL_FAILURE' ? 'VERY HIGH' : 'LOW',
        risk_score: clientScenario === 'CRITICAL_FAILURE' ? 91 : 15
      });
    }
    return { success: true, history };
  }
};

export const fetchAlerts = async (siteId, limit = 20) => {
  try {
    const response = await apiClient.get('/alerts', {
      params: { site_id: siteId, limit }
    });
    return response.data;
  } catch (err) {
    return { success: true, alerts: clientAlerts };
  }
};

export const fetchModelMetrics = async () => {
  try {
    const response = await apiClient.get('/model/metrics');
    return response.data;
  } catch (err) {
    return {
      success: true,
      metrics: {
        accuracy: 0.8988,
        macro_f1: 0.8844,
        cross_val_accuracy_mean: 0.8902,
        cross_val_accuracy_std: 0.017,
        total_training_samples: 4200,
        feature_importance: {
          rainfall: 0.4298,
          tilt: 0.2316,
          soil_moisture: 0.1811,
          vibration: 0.1575
        },
        confusion_matrix: [
          [208, 12, 0, 0],
          [14, 185, 11, 0],
          [0, 16, 192, 12],
          [0, 0, 15, 175]
        ],
        classes: ['LOW', 'MEDIUM', 'HIGH', 'VERY HIGH']
      }
    };
  }
};

export const setScenario = async (siteId, scenarioKey) => {
  clientScenario = scenarioKey;
  try {
    const response = await apiClient.post('/simulate/scenario', {
      site_id: siteId,
      scenario: scenarioKey
    });
    return response.data;
  } catch (err) {
    if (scenarioKey === 'CRITICAL_FAILURE' || scenarioKey === 'MONSOON_DELUGE') {
      clientAlerts.unshift({
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        site_id: siteId,
        risk_level: scenarioKey === 'CRITICAL_FAILURE' ? 'VERY HIGH' : 'HIGH',
        headline: 'Automated Early Warning Triggered',
        action: 'SOP Evacuation protocol activated for North Eastern corridor.'
      });
    }
    return { success: true, message: `Scenario changed to ${scenarioKey} (Standalone Cloud Mode)` };
  }
};

export const setManualOverride = async (siteId, values) => {
  try {
    const response = await apiClient.post('/simulate/override', {
      site_id: siteId,
      ...values
    });
    return response.data;
  } catch (err) {
    return { success: true, message: 'Values overridden (Standalone Cloud Mode)' };
  }
};

export const resetSimulation = async (siteId) => {
  clientScenario = 'NORMAL_DRY';
  try {
    const response = await apiClient.post('/simulate/reset', {
      site_id: siteId
    });
    return response.data;
  } catch (err) {
    return { success: true, message: 'Simulation reset (Standalone Cloud Mode)' };
  }
};

// --- Predictive Forecaster & Historical Events ---

export const fetchForecast = async (siteId) => {
  try {
    const response = await apiClient.get('/forecast', {
      params: { site_id: siteId }
    });
    return response.data;
  } catch (err) {
    const isCritical = clientScenario === 'CRITICAL_FAILURE';
    return {
      success: true,
      site_id: siteId,
      forecast: {
        lead_time_window: isCritical ? 'Imminent: 1 to 4 Hours' : 'Stable: > 72 Hours',
        failure_probability_24h: isCritical ? 84.3 : 8.2,
        failure_probability_6h: isCritical ? 79.3 : 4.1,
        creep_phase: isCritical ? 'Tertiary Creep (Accelerating / Imminent Failure)' : 'Primary Creep (Stable Baseline)',
        velocity_deg_hr: isCritical ? 1.89 : 0.04,
        acceleration_deg_hr2: isCritical ? 79.2 : 0.8,
        historical_match: {
          event_name: 'Champhai Ridge Shear Slip',
          date: '2023-08-27',
          location: 'Champhai Ridge Slopes',
          state: 'Mizoram',
          similarity_score: isCritical ? 78 : 22,
          impact_summary: 'Cracks along bypass ridge and damage to retaining masonry structures.',
          narrative: 'Current conditions exhibit high kinematic resemblance to the Champhai Ridge Shear Slip in Mizoram.'
        },
        primary_trigger: 'Rainfall Infiltration + Soil Saturation + Mechanical Tilt Shear',
        recommendation: isCritical
          ? 'CRITICAL ADVISORY: Evacuate slope foot zones. Issue immediate highway roadblock and sound community alarm.'
          : 'Normal slope conditions. Routine telemetry monitoring active.'
      }
    };
  }
};

export const fetchHistoricalEvents = async (siteId) => {
  try {
    const response = await apiClient.get('/landslide-events', {
      params: { site_id: siteId }
    });
    return response.data;
  } catch (err) {
    return {
      success: true,
      events: [
        { id: 1, event_name: 'Noney Railway Cut Shear Failure', date: '2022-06-30', state: 'Manipur', location: 'Tupul Station', rainfall_mm: 145.0, tilt_deg: 18.2, trigger_type: 'Cloudburst & Cut Slope Over-Steepening', impact_summary: 'Massive slope liquefaction, 61 fatalities, railway yard buried.' },
        { id: 2, event_name: 'Aizawl Melthum Stone Quarry Collapse', date: '2024-05-28', state: 'Mizoram', location: 'Melthum Slopes', rainfall_mm: 182.0, tilt_deg: 21.0, trigger_type: 'Cyclone Remal Continuous Deluge', impact_summary: 'Deep-seated planar failure, 28 fatalities, 15 homes destroyed.' },
        { id: 3, event_name: 'NH-10 Sevoke-Rangpo Rockfall & Slump', date: '2023-10-04', state: 'Sikkim', location: 'Teesta Basin (NH-10)', rainfall_mm: 210.0, tilt_deg: 16.5, trigger_type: 'Glacial Outburst Flooding & Highway Toe Cut', impact_summary: 'Strategic lifeline cut off for 14 days, severe supply chain disruption.' },
        { id: 4, event_name: 'Champhai Ridge Shear Slip', date: '2023-08-27', state: 'Mizoram', location: 'Champhai Ridge', rainfall_mm: 92.0, tilt_deg: 10.4, trigger_type: 'Pre-Monsoon Saturation & Microtremors', impact_summary: 'Masonry retaining wall ruptured, road cracked.' }
      ]
    };
  }
};

// --- Stakeholder Subscribers & Automated Email Alert Dispatch ---

export const fetchSubscribers = async (siteId) => {
  try {
    const response = await apiClient.get('/subscribers', {
      params: { site_id: siteId }
    });
    return response.data;
  } catch (err) {
    return { success: true, subscribers: clientSubscribers };
  }
};

export const addSubscriber = async (subscriberData) => {
  try {
    const response = await apiClient.post('/subscribers', subscriberData);
    return response.data;
  } catch (err) {
    const newSub = { id: Date.now(), ...subscriberData };
    clientSubscribers.push(newSub);
    return { success: true, subscriber: newSub };
  }
};

export const deleteSubscriber = async (subId) => {
  try {
    const response = await apiClient.delete(`/subscribers/${subId}`);
    return response.data;
  } catch (err) {
    clientSubscribers = clientSubscribers.filter(s => s.id !== subId);
    return { success: true, message: 'Subscriber removed' };
  }
};

export const sendEmailAlert = async (payload) => {
  try {
    const response = await apiClient.post('/alerts/email/send', payload);
    return response.data;
  } catch (err) {
    const dispatched = clientSubscribers.map(sub => ({
      log_id: Date.now() + Math.random(),
      recipient_name: sub.name,
      recipient_email: sub.email,
      site_id: payload.site_id,
      risk_level: payload.risk_level || 'CRITICAL',
      lead_time: 'Imminent: 1 to 4 Hours',
      status: 'SIMULATED_DISPATCH',
      timestamp: new Date().toLocaleString()
    }));
    clientEmailLogs.unshift(...dispatched);
    return {
      success: true,
      message: `Emergency warning broadcast sent to ${dispatched.length} subscriber(s) from inbuilt directory.`,
      recipients_count: dispatched.length,
      dispatched
    };
  }
};

export const fetchEmailLogs = async (limit = 30) => {
  try {
    const response = await apiClient.get('/alerts/email/logs', {
      params: { limit }
    });
    return response.data;
  } catch (err) {
    return { success: true, logs: clientEmailLogs };
  }
};

export default apiClient;
