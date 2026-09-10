import React from 'react';
import { AlertCircle, History } from 'lucide-react';
import { RISK_LEVELS } from '../utils/constants';

export default function AlertLogTable({ alerts, onRefreshAlerts }) {
  const alertList = alerts || [];

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={18} color="#06B6D4" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#E5E7EB' }}>
            Risk Warning Event History & Audit Log (SQLite)
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
          Total Logged: <strong>{alertList.length}</strong>
        </span>
      </div>

      <div style={{ overflowX: 'auto', maxHeight: '220px' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '130px' }}>Timestamp</th>
              <th style={{ width: '80px' }}>Site</th>
              <th style={{ width: '110px' }}>Risk Tier</th>
              <th>Trigger Telemetry & Context</th>
              <th>Advisory Action Protocol</th>
            </tr>
          </thead>
          <tbody>
            {alertList.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: '#6B7280' }}>
                  No active hazard alerts recorded for this site.
                </td>
              </tr>
            ) : (
              alertList.map((al, idx) => {
                const meta = RISK_LEVELS[al.risk_level] || RISK_LEVELS['LOW'];
                return (
                  <tr key={idx}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      {al.timestamp ? al.timestamp.split(' ')[1] || al.timestamp : 'Recent'}
                    </td>
                    <td>
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        background: '#1F2937',
                        color: '#93C5FD',
                        padding: '0.15rem 0.35rem',
                        borderRadius: '3px'
                      }}>
                        {al.site_id}
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={{ background: meta.bgColor, color: meta.color, border: `1px solid ${meta.borderColor}` }}>
                        {al.risk_level}
                      </span>
                    </td>
                    <td style={{ color: '#E5E7EB', fontSize: '0.8rem' }}>
                      {al.message}
                    </td>
                    <td style={{ color: '#9CA3AF', fontSize: '0.76rem' }}>
                      {al.advisory_action}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
