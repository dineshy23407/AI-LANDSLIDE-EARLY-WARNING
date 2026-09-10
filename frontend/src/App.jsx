import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import SiteSelector from './components/SiteSelector';
import SensorCards from './components/SensorCards';
import RiskDisplay from './components/RiskDisplay';
import AdvisoryBanner from './components/AdvisoryBanner';
import TelemetryCharts from './components/TelemetryCharts';
import SimulationControl from './components/SimulationControl';
import ForecastCard from './components/ForecastCard';
import EmailAlertsPanel from './components/EmailAlertsPanel';
import AlertLogTable from './components/AlertLogTable';
import ModelMetricsModal from './components/ModelMetricsModal';
import HistoricalLandslidesModal from './components/HistoricalLandslidesModal';
import SIHPresentationModal from './components/SIHPresentationModal';

import {
  checkHealth,
  fetchSites,
  fetchLiveTelemetry,
  fetchHistory,
  fetchAlerts,
  fetchModelMetrics,
  setScenario,
  setManualOverride,
  resetSimulation,
  createCustomSite,
  fetchForecast,
  fetchHistoricalEvents,
  fetchSubscribers,
  addSubscriber,
  deleteSubscriber,
  sendEmailAlert,
  fetchEmailLogs
} from './api';

export default function App() {
  const [selectedSiteId, setSelectedSiteId] = useState('A-02');
  const [sites, setSites] = useState([]);
  const [liveData, setLiveData] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [historicalEvents, setHistoricalEvents] = useState([]);

  const [isConnected, setIsConnected] = useState(false);
  const [isPolling, setIsPolling] = useState(true);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Polling ref
  const pollingTimerRef = useRef(null);

  // Load initial sites, health, metrics, subscribers, and historical events
  useEffect(() => {
    async function initSystem() {
      try {
        const [healthRes, sitesRes, metricsRes, eventsRes, subsRes, emailLogsRes] = await Promise.allSettled([
          checkHealth(),
          fetchSites(),
          fetchModelMetrics(),
          fetchHistoricalEvents(),
          fetchSubscribers(),
          fetchEmailLogs(20)
        ]);

        if (healthRes.status === 'fulfilled') {
          setIsConnected(true);
          setErrorMessage(null);
        } else {
          setIsConnected(false);
          setErrorMessage('Unable to connect to Flask API backend on port 5000. Please ensure the backend is running.');
        }

        if (sitesRes.status === 'fulfilled' && sitesRes.value.sites) {
          setSites(sitesRes.value.sites);
        }

        if (metricsRes.status === 'fulfilled' && metricsRes.value.metrics) {
          setModelMetrics(metricsRes.value.metrics);
        }

        if (eventsRes.status === 'fulfilled' && eventsRes.value.events) {
          setHistoricalEvents(eventsRes.value.events);
        }

        if (subsRes.status === 'fulfilled' && subsRes.value.subscribers) {
          setSubscribers(subsRes.value.subscribers);
        }

        if (emailLogsRes.status === 'fulfilled' && emailLogsRes.value.logs) {
          setEmailLogs(emailLogsRes.value.logs);
        }
      } catch (err) {
        console.error('System initialization error:', err);
        setIsConnected(false);
        setErrorMessage('Failed to connect to backend.');
      }
    }

    initSystem();
  }, []);

  // Fetch telemetry, history, alerts, and email logs for current site
  const loadSiteData = useCallback(async (siteId) => {
    try {
      const [liveRes, histRes, alertsRes, emailLogsRes, subsRes] = await Promise.all([
        fetchLiveTelemetry(siteId),
        fetchHistory(siteId, 30),
        fetchAlerts(siteId, 20),
        fetchEmailLogs(20),
        fetchSubscribers(siteId)
      ]);

      if (liveRes.success) {
        setLiveData(liveRes);
        setIsConnected(true);
        setErrorMessage(null);
      }

      if (histRes.success) {
        setHistory(histRes.history || []);
      }

      if (alertsRes.success) {
        setAlerts(alertsRes.alerts || []);
      }

      if (emailLogsRes.success) {
        setEmailLogs(emailLogsRes.logs || []);
      }

      if (subsRes.success) {
        setSubscribers(subsRes.subscribers || []);
      }

      setLoading(false);
    } catch (err) {
      console.error(`Error loading data for site ${siteId}:`, err);
      setIsConnected(false);
      setErrorMessage('Backend communication failure. Please verify the Flask server is running at http://127.0.0.1:5000.');
      setLoading(false);
    }
  }, []);

  // Initial and site-change data load
  useEffect(() => {
    loadSiteData(selectedSiteId);
  }, [selectedSiteId, loadSiteData]);

  // Telemetry auto-polling loop (every 4 seconds)
  useEffect(() => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
    }

    if (isPolling) {
      pollingTimerRef.current = setInterval(() => {
        loadSiteData(selectedSiteId);
      }, 4000);
    }

    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
    };
  }, [isPolling, selectedSiteId, loadSiteData]);

  // User Actions
  const handleSelectSite = (siteId) => {
    setSelectedSiteId(siteId);
    loadSiteData(siteId);
  };

  const handleTriggerScenario = async (siteId, scenarioKey) => {
    try {
      await setScenario(siteId, scenarioKey);
      await loadSiteData(siteId);
    } catch (err) {
      console.error('Scenario trigger error:', err);
    }
  };

  const handleManualOverride = async (siteId, values) => {
    try {
      await setManualOverride(siteId, values);
      await loadSiteData(siteId);
    } catch (err) {
      console.error('Manual override error:', err);
    }
  };

  const handleResetAuto = async (siteId) => {
    try {
      await resetSimulation(siteId);
      await loadSiteData(siteId);
    } catch (err) {
      console.error('Reset simulation error:', err);
    }
  };

  const handleManualFetch = () => {
    loadSiteData(selectedSiteId);
  };

  const handleAddCustomSite = async (sitePayload) => {
    try {
      const res = await createCustomSite(sitePayload);
      if (res.success && res.site) {
        const sitesRes = await fetchSites();
        if (sitesRes.success && sitesRes.sites) {
          setSites(sitesRes.sites);
        }
        setSelectedSiteId(res.site.site_id);
        await loadSiteData(res.site.site_id);
      }
    } catch (err) {
      console.error('Failed to create custom site:', err);
      throw err;
    }
  };

  // Subscriber and Email Handlers
  const handleAddSubscriber = async (subPayload) => {
    const res = await addSubscriber(subPayload);
    if (res.success) {
      const subsRes = await fetchSubscribers(selectedSiteId);
      if (subsRes.success) setSubscribers(subsRes.subscribers);
    }
    return res;
  };

  const handleDeleteSubscriber = async (subId) => {
    const res = await deleteSubscriber(subId);
    if (res.success) {
      const subsRes = await fetchSubscribers(selectedSiteId);
      if (subsRes.success) setSubscribers(subsRes.subscribers);
    }
    return res;
  };

  const handleSendEmailAlert = async (payload) => {
    const res = await sendEmailAlert(payload);
    if (res.success) {
      const logsRes = await fetchEmailLogs(20);
      if (logsRes.success) setEmailLogs(logsRes.logs);
    }
    return res;
  };

  const currentSiteRec = sites.find(s => s.site_id === selectedSiteId) || {
    name: selectedSiteId,
    state: 'North Eastern Region'
  };

  return (
    <div className="app-container">
      {/* Header with disclaimers and live status */}
      <Header
        isConnected={isConnected}
        onOpenMetrics={() => setIsMetricsOpen(true)}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* Backend Disconnection Alert Banner */}
      {errorMessage && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.18)',
          border: '1px solid #EF4444',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#FCA5A5',
          fontSize: '0.85rem'
        }}>
          <div>
            <strong>Backend Connection Offline: </strong> {errorMessage}
          </div>
          <button
            onClick={() => loadSiteData(selectedSiteId)}
            className="btn btn-primary"
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Monitoring Site Switcher */}
      <SiteSelector
        sites={sites}
        selectedSiteId={selectedSiteId}
        onSelectSite={handleSelectSite}
        onAddCustomSite={handleAddCustomSite}
        activeScenario={liveData?.scenario_name}
      />

      {/* Core Real-Time Sensor Telemetry Gauges */}
      <SensorCards telemetry={liveData?.telemetry} />

      {/* Impending Landslide Forecast & Predictive Lead-Time Card */}
      <ForecastCard
        forecast={liveData?.forecast}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
      />

      {/* Main Analysis Grid: Risk Classification & Charts */}
      <div className="dashboard-main-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* AI Model Risk Classification & Probabilities */}
          <RiskDisplay prediction={liveData?.prediction} />

          {/* SOP Emergency Advisory Directive */}
          <AdvisoryBanner
            advisory={liveData?.advisory}
            riskLevel={liveData?.prediction?.risk_level}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Historical Trends Time Series */}
          <TelemetryCharts history={history} />

          {/* Scenario Trigger & Stress Test Controls */}
          <SimulationControl
            siteId={selectedSiteId}
            onTriggerScenario={handleTriggerScenario}
            onManualOverride={handleManualOverride}
            onResetAuto={handleResetAuto}
            onManualFetch={handleManualFetch}
            isPolling={isPolling}
            setIsPolling={setIsPolling}
            activeScenario={liveData?.scenario}
          />
        </div>
      </div>

      {/* Citizen & Authority Email Alert Notification Panel */}
      <EmailAlertsPanel
        siteId={selectedSiteId}
        siteName={currentSiteRec.name}
        state={currentSiteRec.state}
        currentRiskLevel={liveData?.prediction?.risk_level}
        subscribers={subscribers}
        emailLogs={emailLogs}
        onAddSubscriber={handleAddSubscriber}
        onDeleteSubscriber={handleDeleteSubscriber}
        onSendEmailAlert={handleSendEmailAlert}
        onRefreshData={() => loadSiteData(selectedSiteId)}
      />

      {/* SQLite Alert History Log */}
      <AlertLogTable
        alerts={alerts}
        onRefreshAlerts={() => loadSiteData(selectedSiteId)}
      />

      {/* Model Diagnostics Modal */}
      <ModelMetricsModal
        isOpen={isMetricsOpen}
        onClose={() => setIsMetricsOpen(false)}
        metrics={modelMetrics}
      />

      {/* Historical Landslides Disasters Catalog Modal */}
      <HistoricalLandslidesModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        events={historicalEvents}
      />

      {/* SIH 2026 6-Slide Presentation Deck Modal */}
      <SIHPresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />
    </div>
  );
}
