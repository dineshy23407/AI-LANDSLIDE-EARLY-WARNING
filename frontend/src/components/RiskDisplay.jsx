import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame, HelpCircle } from 'lucide-react';
import { RISK_LEVELS } from '../utils/constants';

export default function RiskDisplay({ prediction }) {
  if (!prediction) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
        Evaluating geotechnical risk model...
      </div>
    );
  }

  const riskLevel = prediction.risk_level || 'LOW';
  const riskMeta = RISK_LEVELS[riskLevel] || RISK_LEVELS['LOW'];
  const confidence = prediction.confidence || 0;
  const probabilities = prediction.probabilities || { LOW: 0, MEDIUM: 0, HIGH: 0, 'VERY HIGH': 0 };
  const riskIndex = prediction.risk_index !== undefined ? prediction.risk_index : 20.0;
  const isCritical = riskLevel === 'VERY HIGH';

  const renderIcon = () => {
    switch (riskLevel) {
      case 'LOW':
        return <ShieldCheck size={36} color={riskMeta.color} />;
      case 'MEDIUM':
        return <AlertTriangle size={36} color={riskMeta.color} />;
      case 'HIGH':
        return <AlertOctagon size={36} color={riskMeta.color} />;
      case 'VERY HIGH':
        return <Flame size={36} color={riskMeta.color} />;
      default:
        return <AlertCircle size={36} color={riskMeta.color} />;
    }
  };

  return (
    <div
      className={`glass-card ${isCritical ? 'critical-pulse' : ''}`}
      style={{
        border: `2px solid ${riskMeta.borderColor}`,
        backgroundColor: riskMeta.bgColor,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}
    >
      {/* Top Banner: Classification Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '0.6rem',
            borderRadius: '10px',
            border: `1px solid ${riskMeta.borderColor}`,
            display: 'flex'
          }}>
            {renderIcon()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Current Risk Classification
              </span>
              <span className="badge" style={{ background: riskMeta.color, color: '#000', fontWeight: 800 }}>
                {riskMeta.badgeText}
              </span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: riskMeta.color, letterSpacing: '-0.02em' }}>
              {riskLevel} RISK
            </h2>
          </div>
        </div>

        {/* Risk Index Gauge Box */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
          padding: '0.65rem 1rem',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Composite Risk Index</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 800, color: riskMeta.color }}>
            {riskIndex.toFixed(1)} <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
            Model Confidence: <strong style={{ color: '#F3F4F6' }}>{confidence.toFixed(1)}%</strong>
          </div>
        </div>
      </div>

      {/* Probability Distribution Spectrum */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.4rem' }}>
          <span>ML Model Probability Distribution across Risk Tiers:</span>
          <span>Argmax Class: <strong style={{ color: riskMeta.color }}>{riskLevel}</strong></span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {['LOW', 'MEDIUM', 'HIGH', 'VERY HIGH'].map(tier => {
            const probVal = probabilities[tier] || 0;
            const meta = RISK_LEVELS[tier];
            const isSelected = tier === riskLevel;
            return (
              <div
                key={tier}
                style={{
                  background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.25)',
                  border: `1px solid ${isSelected ? meta.color : 'rgba(255, 255, 255, 0.05)'}`,
                  borderRadius: '6px',
                  padding: '0.5rem 0.65rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, color: meta.color }}>{tier}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#F3F4F6' }}>{probVal.toFixed(1)}%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.max(2, probVal)}%`,
                      height: '100%',
                      background: meta.color,
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandatory Probability Labeling & Scientific Disclaimer */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '6px',
        border: '1px dashed rgba(255, 255, 255, 0.12)',
        padding: '0.55rem 0.75rem',
        fontSize: '0.74rem',
        color: '#9CA3AF',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.5rem'
      }}>
        <HelpCircle size={15} color="#9CA3AF" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: '#D1D5DB' }}>Scientific Model Output Disclaimer: </strong>
          Risk classification and confidence percentages represent statistical inference computed by the Scikit-Learn Random Forest model based on input sensor parameters. This output represents hazard probability estimation, not physical certainty or guarantee that a landslide will or will not occur.
        </div>
      </div>
    </div>
  );
}
