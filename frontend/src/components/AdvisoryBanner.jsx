import React from 'react';
import { AlertTriangle, Radio, ShieldAlert, Truck } from 'lucide-react';
import { RISK_LEVELS } from '../utils/constants';

export default function AdvisoryBanner({ advisory, riskLevel }) {
  if (!advisory) return null;

  const currentLevel = riskLevel || 'LOW';
  const meta = RISK_LEVELS[currentLevel] || RISK_LEVELS['LOW'];

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Radio size={18} color={meta.color} />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F3F4F6' }}>
            Early Warning Advisory & SOP Protocol
          </span>
        </div>
        <span className="badge" style={{ background: meta.bgColor, color: meta.color, border: `1px solid ${meta.borderColor}` }}>
          STATUS: {advisory.status_code || currentLevel}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '1rem',
        background: 'rgba(0, 0, 0, 0.25)',
        padding: '0.9rem 1rem',
        borderRadius: '8px',
        borderLeft: `4px solid ${meta.color}`
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9CA3AF', fontWeight: 600, marginBottom: '0.2rem' }}>
            Civilian & Transport Action Directive
          </div>
          <p style={{ fontSize: '0.85rem', color: '#E5E7EB', lineHeight: 1.45 }}>
            {advisory.action_protocol || 'Normal transit permitted along hill corridor.'}
          </p>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9CA3AF', fontWeight: 600, marginBottom: '0.2rem' }}>
            Disaster Authority & BRO Mandate
          </div>
          <p style={{ fontSize: '0.82rem', color: '#D1D5DB', lineHeight: 1.45 }}>
            {advisory.authority_action || 'Routine automated sensor polling in progress.'}
          </p>
        </div>
      </div>
    </div>
  );
}
