import React from 'react';
import { Clock, AlertOctagon, TrendingUp, Compass, Droplets, History, ShieldAlert } from 'lucide-react';

export default function ForecastCard({ forecast, onOpenHistoryModal }) {
  if (!forecast) {
    return (
      <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', color: '#6B7280' }}>
        Calculating predictive slope failure trajectory...
      </div>
    );
  }

  const {
    lead_time_window,
    failure_probability_6h,
    failure_probability_24h,
    creep_phase,
    velocity_deg_hr,
    acceleration_deg_hr2,
    primary_trigger,
    attribution,
    historical_match,
    forecast_status
  } = forecast;

  const isImminent = forecast_status === 'IMMINENT_SLOPE_FAILURE';
  const isWarning = forecast_status === 'ACCELERATING_CREEP_DETECTED';
  
  const statusColor = isImminent ? '#EF4444' : (isWarning ? '#F97316' : (forecast_status === 'ELEVATED_WATCH' ? '#F59E0B' : '#10B981'));
  const statusBg = isImminent ? 'rgba(239, 68, 68, 0.15)' : (isWarning ? 'rgba(249, 115, 22, 0.12)' : (forecast_status === 'ELEVATED_WATCH' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)'));

  return (
    <div
      className={`glass-card ${isImminent ? 'critical-pulse' : ''}`}
      style={{
        border: `1.5px solid ${statusColor}`,
        background: statusBg,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} color={statusColor} />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F9FAFB' }}>
              Impending Landslide Forecast & Early Lead-Time Prediction
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              Continuous Kinematic Analysis ($d(\theta)/dt$) & Antecedent Infiltration Modeling
            </span>
          </div>
        </div>

        <span className="badge" style={{ background: statusColor, color: '#000', fontWeight: 800 }}>
          {forecast_status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Main Lead Time & Probability Highlight Box */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.75rem',
        background: 'rgba(0, 0, 0, 0.35)',
        padding: '0.85rem 1rem',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Estimated Time to Failure Window */}
        <div>
          <div style={{ fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Forecasted Failure Lead Time
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: statusColor, fontFamily: 'var(--font-mono)' }}>
            {lead_time_window}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '0.2rem' }}>
            Phase: <strong style={{ color: '#F3F4F6' }}>{creep_phase}</strong>
          </div>
        </div>

        {/* 6-Hour Failure Probability */}
        <div>
          <div style={{ fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            6-Hour Slide Probability
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: statusColor, fontFamily: 'var(--font-mono)' }}>
            {failure_probability_6h}%
          </div>
          <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden', marginTop: '0.4rem' }}>
            <div style={{ width: `${failure_probability_6h}%`, height: '100%', background: statusColor, transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* 24-Hour Failure Probability */}
        <div>
          <div style={{ fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            24-Hour Slide Probability
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: statusColor, fontFamily: 'var(--font-mono)' }}>
            {failure_probability_24h}%
          </div>
          <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden', marginTop: '0.4rem' }}>
            <div style={{ width: `${failure_probability_24h}%`, height: '100%', background: statusColor, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      </div>

      {/* Kinematics and Trigger Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
        {/* Slope Velocity & Acceleration */}
        <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.65rem 0.85rem', borderRadius: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.35rem' }}>
            <Compass size={14} color="#06B6D4" />
            <span>Kinematic Velocity & Acceleration</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#E5E7EB' }}>
            Tilt Velocity: <strong style={{ fontFamily: 'var(--font-mono)', color: '#06B6D4' }}>{velocity_deg_hr}°/hr</strong>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#E5E7EB', marginTop: '0.15rem' }}>
            Shear Accel: <strong style={{ fontFamily: 'var(--font-mono)', color: acceleration_deg_hr2 > 0 ? '#EF4444' : '#10B981' }}>{acceleration_deg_hr2}°/hr²</strong>
          </div>
        </div>

        {/* Trigger Attribution */}
        {attribution && (
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.65rem 0.85rem', borderRadius: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.35rem' }}>
              <TrendingUp size={14} color="#F59E0B" />
              <span>Attribution of Impending Instability</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.74rem', flexWrap: 'wrap' }}>
              <span style={{ color: '#06B6D4' }}>Rain Infiltration: <strong>{attribution.rainfall_pct}%</strong></span>
              <span style={{ color: '#3B82F6' }}>Soil Saturation: <strong>{attribution.moisture_pct}%</strong></span>
              <span style={{ color: '#F59E0B' }}>Tilt Shear: <strong>{attribution.tilt_pct}%</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Historical Disaster Analog Benchmark */}
      {historical_match && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderLeft: '4px solid #F59E0B',
          borderRadius: '6px',
          padding: '0.65rem 0.85rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <History size={15} color="#F59E0B" />
              <strong style={{ fontSize: '0.78rem', color: '#FCD34D' }}>
                Historical Landslide Analog Match ({historical_match.similarity_score}% Similarity):
              </strong>
            </div>
            <p style={{ fontSize: '0.76rem', color: '#D1D5DB', margin: '0.25rem 0 0', lineHeight: 1.4 }}>
              {historical_match.narrative}
            </p>
          </div>

          <button
            onClick={onOpenHistoryModal}
            className="btn btn-outline"
            style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', alignSelf: 'center' }}
          >
            Past Events Catalog
          </button>
        </div>
      )}
    </div>
  );
}
