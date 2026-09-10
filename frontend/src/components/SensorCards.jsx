import React from 'react';
import { CloudRain, Droplets, Compass, Activity } from 'lucide-react';
import { SENSOR_THRESHOLDS } from '../utils/constants';

export default function SensorCards({ telemetry }) {
  if (!telemetry) {
    return (
      <div className="grid-4col">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-card" style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#6B7280', fontSize: '0.85rem' }}>Acquiring telemetry...</span>
          </div>
        ))}
      </div>
    );
  }

  const { rainfall, soil_moisture, tilt, vibration } = telemetry;

  // Helper to determine status color and text based on threshold
  const getParamStatus = (val, th) => {
    if (val < th.low) return { color: '#10B981', text: 'Nominal / Baseline' };
    if (val < th.medium) return { color: '#F59E0B', text: 'Elevated' };
    if (val < th.high) return { color: '#F97316', text: 'Warning Level' };
    return { color: '#EF4444', text: 'Critical Threshold' };
  };

  const rainStatus = getParamStatus(rainfall, SENSOR_THRESHOLDS.rainfall);
  const moistureStatus = getParamStatus(soil_moisture, SENSOR_THRESHOLDS.soil_moisture);
  const tiltStatus = getParamStatus(tilt, SENSOR_THRESHOLDS.tilt);
  const vibStatus = getParamStatus(vibration, SENSOR_THRESHOLDS.vibration);

  const cards = [
    {
      title: 'Cumulative Rainfall',
      value: rainfall,
      unit: 'mm/24h',
      status: rainStatus,
      pct: Math.min(100, (rainfall / SENSOR_THRESHOLDS.rainfall.max) * 100),
      icon: CloudRain,
      sublabel: rainfall > 100 ? 'Torrential Cloudburst' : rainfall > 50 ? 'Heavy Monsoon Rain' : 'Light / Dry'
    },
    {
      title: 'Soil Moisture Saturation',
      value: soil_moisture,
      unit: '%',
      status: moistureStatus,
      pct: Math.min(100, soil_moisture),
      icon: Droplets,
      sublabel: soil_moisture > 85 ? 'High Pore Saturation' : soil_moisture > 60 ? 'Wetted Regolith' : 'Dry / Ambient'
    },
    {
      title: 'Inclinometer Slope Tilt',
      value: tilt,
      unit: 'degrees (°)',
      status: tiltStatus,
      pct: Math.min(100, (tilt / SENSOR_THRESHOLDS.tilt.max) * 100),
      icon: Compass,
      sublabel: tilt > 10 ? 'Kinematic Shear Failure' : tilt > 4 ? 'Creep Displacement' : 'Stable Equilibrium'
    },
    {
      title: 'Ground Vibration / Tremor',
      value: vibration,
      unit: 'm/s²',
      status: vibStatus,
      pct: Math.min(100, (vibration / SENSOR_THRESHOLDS.vibration.max) * 100),
      icon: Activity,
      sublabel: vibration > 2.5 ? 'Seismic / Rupture Shock' : vibration > 1.0 ? 'Elevated Microtremor' : 'Ambient Microseismic'
    }
  ];

  return (
    <div className="grid-4col">
      {cards.map((c, idx) => {
        const IconComponent = c.icon;
        return (
          <div key={idx} className="glass-card sensor-card">
            <div className="sensor-header">
              <span>{c.title}</span>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.3rem',
                borderRadius: '6px',
                display: 'flex'
              }}>
                <IconComponent size={18} color={c.status.color} />
              </div>
            </div>

            <div className="sensor-value-box">
              <span className="sensor-value" style={{ color: c.status.color }}>
                {typeof c.value === 'number' ? c.value.toFixed(idx >= 2 ? (idx === 3 ? 3 : 2) : 1) : c.value}
              </span>
              <span className="sensor-unit">{c.unit}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', marginTop: '0.2rem' }}>
              <span style={{ color: c.status.color, fontWeight: 600 }}>{c.status.text}</span>
              <span style={{ color: '#9CA3AF' }}>{c.sublabel}</span>
            </div>

            <div className="sensor-gauge-bar">
              <div
                className="sensor-gauge-fill"
                style={{
                  width: `${Math.max(5, c.pct)}%`,
                  backgroundColor: c.status.color
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
