import React, { useState } from 'react';
import { Play, Pause, RefreshCw, Sliders, Zap, RotateCcw } from 'lucide-react';

export default function SimulationControl({
  siteId,
  onTriggerScenario,
  onManualOverride,
  onResetAuto,
  onManualFetch,
  isPolling,
  setIsPolling,
  activeScenario
}) {
  const [showSliders, setShowSliders] = useState(false);
  const [sliderRainfall, setSliderRainfall] = useState(65.0);
  const [sliderMoisture, setSliderMoisture] = useState(70.0);
  const [sliderTilt, setSliderTilt] = useState(5.5);
  const [sliderVibration, setSliderVibration] = useState(1.4);

  const handleApplySliders = () => {
    onManualOverride(siteId, {
      rainfall: sliderRainfall,
      soil_moisture: sliderMoisture,
      tilt: sliderTilt,
      vibration: sliderVibration
    });
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Control Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} color="#F59E0B" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F3F4F6' }}>
            Prototype Scenario Injector & Telemetry Controls
          </span>
        </div>

        {/* Polling & Refresh Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setIsPolling(!isPolling)}
            className={`btn ${isPolling ? 'btn-secondary' : 'btn-primary'}`}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
            title={isPolling ? 'Pause real-time telemetry polling' : 'Resume real-time telemetry polling'}
          >
            {isPolling ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPolling ? 'Auto-Poll: ON (4s)' : 'Auto-Poll: PAUSED'}</span>
          </button>

          <button
            onClick={onManualFetch}
            className="btn btn-outline"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
            title="Fetch single telemetry reading"
          >
            <RefreshCw size={14} />
            <span>Tick</span>
          </button>
        </div>
      </div>

      {/* Preset Geological Scenarios */}
      <div>
        <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.4rem' }}>
          Instant Scenario Triggers (Updates live slope conditions for Site {siteId}):
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.5rem' }}>
          <button
            onClick={() => onTriggerScenario(siteId, 'NORMAL_DRY')}
            className={`btn ${activeScenario === 'NORMAL_DRY' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderLeft: '3px solid #10B981', fontSize: '0.78rem', justifyContent: 'flex-start' }}
          >
            ☀️ Normal Dry (LOW)
          </button>

          <button
            onClick={() => onTriggerScenario(siteId, 'PRE_MONSOON')}
            className={`btn ${activeScenario === 'PRE_MONSOON' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderLeft: '3px solid #F59E0B', fontSize: '0.78rem', justifyContent: 'flex-start' }}
          >
            🌧️ Pre-Monsoon (MEDIUM)
          </button>

          <button
            onClick={() => onTriggerScenario(siteId, 'MONSOON_DELUGE')}
            className={`btn ${activeScenario === 'MONSOON_DELUGE' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderLeft: '3px solid #F97316', fontSize: '0.78rem', justifyContent: 'flex-start' }}
          >
            ⛈️ Heavy Monsoon (HIGH)
          </button>

          <button
            onClick={() => onTriggerScenario(siteId, 'CRITICAL_FAILURE')}
            className={`btn ${activeScenario === 'CRITICAL_FAILURE' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderLeft: '3px solid #EF4444', fontSize: '0.78rem', justifyContent: 'flex-start' }}
          >
            ⚠️ Cloudburst Slip (CRITICAL)
          </button>
        </div>
      </div>

      {/* Toggle Manual Sliders Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setShowSliders(!showSliders)}
          className="btn btn-outline"
          style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
        >
          <Sliders size={14} />
          <span>{showSliders ? 'Hide Custom Sensor Sliders' : 'Open Custom Sensor Sliders'}</span>
        </button>

        <button
          onClick={() => onResetAuto(siteId)}
          className="btn btn-outline"
          style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', color: '#9CA3AF' }}
          title="Reset simulation to default automatic drift"
        >
          <RotateCcw size={14} />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Expandable Manual Sensor Controls */}
      {showSliders && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #1F293D',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#9CA3AF', fontWeight: 600 }}>
            Manual Telemetry Synthesizer (Stress-test custom edge cases):
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {/* Rainfall Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#D1D5DB' }}>
                <span>Rainfall:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#06B6D4' }}>{sliderRainfall.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="1"
                value={sliderRainfall}
                onChange={(e) => setSliderRainfall(parseFloat(e.target.value))}
              />
            </div>

            {/* Moisture Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#D1D5DB' }}>
                <span>Soil Moisture:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#3B82F6' }}>{sliderMoisture.toFixed(1)} %</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={sliderMoisture}
                onChange={(e) => setSliderMoisture(parseFloat(e.target.value))}
              />
            </div>

            {/* Tilt Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#D1D5DB' }}>
                <span>Slope Tilt:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#F59E0B' }}>{sliderTilt.toFixed(1)} °</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.1"
                value={sliderTilt}
                onChange={(e) => setSliderTilt(parseFloat(e.target.value))}
              />
            </div>

            {/* Vibration Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#D1D5DB' }}>
                <span>Ground Vibration:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#EC4899' }}>{sliderVibration.toFixed(2)} m/s²</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="5.0"
                step="0.05"
                value={sliderVibration}
                onChange={(e) => setSliderVibration(parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.35rem' }}>
            <button
              onClick={handleApplySliders}
              className="btn btn-primary"
              style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
            >
              Inject Telemetry & Classify Risk
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
