import React from 'react';
import { X, History, AlertTriangle, Mountain } from 'lucide-react';

export default function HistoricalLandslidesModal({ isOpen, onClose, events }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #1F293D', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={22} color="#06B6D4" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F9FAFB' }}>
                Historical Landslide Disasters Catalog (North Eastern Region)
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                Recorded geotechnical failures used to benchmark antecedent rainfall and kinematic tilt thresholds
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.35rem 0.65rem' }}>
            <X size={16} />
          </button>
        </div>

        {/* Table of Events */}
        <div style={{ overflowX: 'auto', maxHeight: '55vh' }}>
          <table className="custom-table" style={{ fontSize: '0.78rem' }}>
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Event & Date</th>
                <th style={{ width: '90px' }}>State</th>
                <th style={{ width: '120px' }}>Rainfall & Tilt</th>
                <th>Trigger Mechanism</th>
                <th>Impact & Disruption Summary</th>
                <th style={{ width: '80px' }}>Severity</th>
              </tr>
            </thead>
            <tbody>
              {events && events.map((ev, idx) => (
                <tr key={idx}>
                  <td>
                    <strong style={{ color: '#F3F4F6' }}>{ev.event_name}</strong>
                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{ev.date}</div>
                  </td>
                  <td>
                    <span style={{ color: '#93C5FD' }}>{ev.state}</span>
                  </td>
                  <td>
                    <div style={{ fontFamily: 'var(--font-mono)', color: '#06B6D4' }}>{ev.rainfall_mm} mm</div>
                    <div style={{ fontFamily: 'var(--font-mono)', color: '#F59E0B' }}>{ev.tilt_deg}° tilt</div>
                  </td>
                  <td style={{ color: '#E5E7EB' }}>
                    {ev.trigger_type}
                  </td>
                  <td style={{ color: '#9CA3AF' }}>
                    {ev.impact_summary}
                  </td>
                  <td>
                    <span className="badge" style={{
                      background: ev.severity === 'VERY HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                      color: ev.severity === 'VERY HIGH' ? '#EF4444' : '#F97316',
                      border: `1px solid ${ev.severity === 'VERY HIGH' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(249, 115, 22, 0.5)'}`
                    }}>
                      {ev.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Close Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
