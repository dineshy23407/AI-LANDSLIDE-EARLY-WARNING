import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, ShieldCheck, Eye, X, Bell, Users, AlertTriangle } from 'lucide-react';

export default function EmailAlertsPanel({
  siteId,
  siteName,
  state,
  currentRiskLevel,
  subscribers,
  emailLogs,
  onSendEmailAlert,
  onRefreshData
}) {
  const [broadcastStatus, setBroadcastStatus] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [previewEmailHtml, setPreviewEmailHtml] = useState(null);

  // Relevant inbuilt subscribers for this site or ALL
  const relevantSubscribers = (subscribers || []).filter(
    s => s.site_id === siteId || s.site_id === 'ALL'
  );

  const handleTriggerBroadcast = async () => {
    setIsBroadcasting(true);
    setBroadcastStatus('');

    try {
      const payload = {
        site_id: siteId,
        risk_level: currentRiskLevel || 'VERY HIGH'
      };

      const res = await onSendEmailAlert(payload);
      if (res.success) {
        setBroadcastStatus(`Dispatched alert to ${res.recipients_count} regional emergency inboxes from inbuilt directory!`);
      }
    } catch (err) {
      setBroadcastStatus(`Dispatch error: ${err.message}`);
    } finally {
      setIsBroadcasting(false);
      setTimeout(() => setBroadcastStatus(''), 6000);
    }
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            padding: '0.45rem',
            borderRadius: '8px',
            display: 'flex'
          }}>
            <Mail size={20} color="#06B6D4" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#F9FAFB' }}>
                Automated Inbuilt Email Alert Dispatch System
              </h3>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                AUTO-DISPATCH ACTIVE
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#9CA3AF' }}>
              Pre-loaded with 32+ verified North Eastern disaster management cells, BRO task forces, and local ward inboxes
            </p>
          </div>
        </div>

        {/* 1-Click Broadcast Trigger */}
        <button
          onClick={handleTriggerBroadcast}
          disabled={isBroadcasting}
          className="btn btn-primary"
          style={{
            background: 'linear-gradient(135deg, #EF4444, #F97316)',
            padding: '0.45rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            boxShadow: '0 2px 10px rgba(239, 68, 68, 0.3)'
          }}
        >
          <Send size={14} />
          <span>{isBroadcasting ? 'Dispatching to Inbuilt Directory...' : `Broadcast Alert to Inbuilt Directory (${currentRiskLevel || 'HIGH'})`}</span>
        </button>
      </div>

      {broadcastStatus && (
        <div style={{
          background: broadcastStatus.includes('Dispatched') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${broadcastStatus.includes('Dispatched') ? '#10B981' : '#EF4444'}`,
          color: broadcastStatus.includes('Dispatched') ? '#34D399' : '#F87171',
          padding: '0.5rem 0.85rem',
          borderRadius: '6px',
          fontSize: '0.78rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} />
          <span>{broadcastStatus}</span>
        </div>
      )}

      {/* Connected Regional Inboxes Strip */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid #1F293D',
        borderRadius: '8px',
        padding: '0.75rem 1rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 600, color: '#D1D5DB' }}>
            <Users size={14} color="#06B6D4" />
            <span>Target Stakeholder Inboxes for {siteName} ({relevantSubscribers.length} connected):</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
            Auto-triggers when slope reaches HIGH/VERY HIGH
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {relevantSubscribers.slice(0, 6).map((sub, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '0.25rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <ShieldCheck size={12} color="#10B981" />
              <span style={{ color: '#F3F4F6' }}>{sub.name}</span>
              <span style={{ color: '#6B7280', fontSize: '0.68rem' }}>({sub.email})</span>
            </div>
          ))}
          {relevantSubscribers.length > 6 && (
            <div style={{ fontSize: '0.72rem', color: '#9CA3AF', padding: '0.25rem 0.4rem', alignSelf: 'center' }}>
              +{relevantSubscribers.length - 6} more emergency cells
            </div>
          )}
        </div>
      </div>

      {/* Dispatched Email Audit Log Table */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#D1D5DB', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Bell size={14} color="#F59E0B" />
          <span>Dispatched Alert Email Logs (Delivered from Inbuilt Dataset):</span>
        </div>

        <div style={{ overflowX: 'auto', maxHeight: '180px' }}>
          <table className="custom-table" style={{ fontSize: '0.74rem' }}>
            <thead>
              <tr>
                <th style={{ width: '110px' }}>Timestamp</th>
                <th>Recipient Inbuilt Contact</th>
                <th>Site Corridor</th>
                <th>Warning Level</th>
                <th>Predicted Lead Time</th>
                <th>Delivery Status</th>
                <th style={{ textAlign: 'center', width: '90px' }}>Preview</th>
              </tr>
            </thead>
            <tbody>
              {!emailLogs || emailLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '1rem', color: '#6B7280' }}>
                    No emails dispatched yet. Click "Broadcast Alert to Inbuilt Directory" to trigger an alert.
                  </td>
                </tr>
              ) : (
                emailLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      {log.timestamp ? log.timestamp.split(' ')[1] || log.timestamp : 'Recent'}
                    </td>
                    <td>
                      <strong style={{ color: '#F3F4F6' }}>{log.recipient_name || 'Emergency Officer'}</strong>
                      <div style={{ color: '#9CA3AF', fontSize: '0.68rem' }}>{log.recipient_email}</div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', color: '#93C5FD' }}>{log.site_id}</span>
                    </td>
                    <td>
                      <span className="badge" style={{
                        background: log.risk_level === 'VERY HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                        color: log.risk_level === 'VERY HIGH' ? '#EF4444' : '#F97316',
                        border: `1px solid ${log.risk_level === 'VERY HIGH' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(249, 115, 22, 0.5)'}`
                      }}>
                        {log.risk_level}
                      </span>
                    </td>
                    <td style={{ color: '#FCD34D' }}>{log.predicted_lead_time}</td>
                    <td>
                      <span style={{ color: log.delivery_status === 'DELIVERED_VIA_SMTP' ? '#34D399' : '#06B6D4' }}>
                        {log.delivery_status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => setPreviewEmailHtml(log.email_body_html)}
                        className="btn btn-outline"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                        title="View formatted HTML alert email"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full-Screen HTML Email Preview Modal */}
      {previewEmailHtml && (
        <div className="modal-overlay" onClick={() => setPreviewEmailHtml(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} color="#06B6D4" />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#F3F4F6' }}>
                  Delivered Emergency Alert Email Preview (Exact HTML Rendering)
                </h4>
              </div>
              <button onClick={() => setPreviewEmailHtml(null)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}>
                <X size={15} />
              </button>
            </div>

            <div style={{
              background: '#0F172A',
              border: '1px solid #334155',
              borderRadius: '6px',
              overflow: 'hidden',
              maxHeight: '65vh',
              overflowY: 'auto'
            }}>
              <iframe
                title="Email Preview"
                srcDoc={previewEmailHtml}
                style={{ width: '100%', height: '520px', border: 'none', background: '#FFF' }}
              />
            </div>

            <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
              <button onClick={() => setPreviewEmailHtml(null)} className="btn btn-secondary" style={{ fontSize: '0.78rem' }}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
