import axios from 'axios';

// Use explicit backend address with fallback to relative proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export const fetchSites = async () => {
  const response = await apiClient.get('/sites');
  return response.data;
};

export const createCustomSite = async (siteData) => {
  const response = await apiClient.post('/sites', siteData);
  return response.data;
};

export const fetchLiveTelemetry = async (siteId) => {
  const response = await apiClient.get('/sensors/live', {
    params: { site_id: siteId }
  });
  return response.data;
};

export const predictManual = async (payload) => {
  const response = await apiClient.post('/predict', payload);
  return response.data;
};

export const fetchHistory = async (siteId, limit = 30) => {
  const response = await apiClient.get('/history', {
    params: { site_id: siteId, limit }
  });
  return response.data;
};

export const fetchAlerts = async (siteId, limit = 20) => {
  const response = await apiClient.get('/alerts', {
    params: { site_id: siteId, limit }
  });
  return response.data;
};

export const fetchModelMetrics = async () => {
  const response = await apiClient.get('/model/metrics');
  return response.data;
};

export const setScenario = async (siteId, scenarioKey) => {
  const response = await apiClient.post('/simulate/scenario', {
    site_id: siteId,
    scenario: scenarioKey
  });
  return response.data;
};

export const setManualOverride = async (siteId, values) => {
  const response = await apiClient.post('/simulate/override', {
    site_id: siteId,
    ...values
  });
  return response.data;
};

export const resetSimulation = async (siteId) => {
  const response = await apiClient.post('/simulate/reset', {
    site_id: siteId
  });
  return response.data;
};

// --- Predictive Forecaster & Historical Events ---

export const fetchForecast = async (siteId) => {
  const response = await apiClient.get('/forecast', {
    params: { site_id: siteId }
  });
  return response.data;
};

export const fetchHistoricalEvents = async (siteId) => {
  const response = await apiClient.get('/landslide-events', {
    params: { site_id: siteId }
  });
  return response.data;
};

// --- Citizen & Authority Email Subscribers ---

export const fetchSubscribers = async (siteId) => {
  const response = await apiClient.get('/subscribers', {
    params: { site_id: siteId }
  });
  return response.data;
};

export const addSubscriber = async (subscriberData) => {
  const response = await apiClient.post('/subscribers', subscriberData);
  return response.data;
};

export const deleteSubscriber = async (subId) => {
  const response = await apiClient.delete(`/subscribers/${subId}`);
  return response.data;
};

// --- Emergency Email Alert Dispatch ---

export const sendEmailAlert = async (payload) => {
  const response = await apiClient.post('/alerts/email/send', payload);
  return response.data;
};

export const fetchEmailLogs = async (limit = 30) => {
  const response = await apiClient.get('/alerts/email/logs', {
    params: { limit }
  });
  return response.data;
};

export default apiClient;
