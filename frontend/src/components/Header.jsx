import React, { useState, useEffect } from 'react';
import { AlertCircle, Activity, Brain, Wifi, WifiOff, Clock, FileText } from 'lucide-react';

export default function Header({ isConnected, onOpenMetrics, onOpenPresentation, lastUpdated }) {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Top Warning Watermark Banner */}
      <div className="prototype-disclaimer-banner">
        <div className="prototype-disclaimer-left">
          <span className="prototype-tag">PROTOTYPE SIMULATION</span>
          <AlertCircle size={16} />
          <span>
            <strong>RESEARCH & DEMONSTRATION NOTICE:</strong> Telemetry data is simulated for prototype demonstration. ML risk classifications are statistical model estimates, not a guarantee of physical slope failure.
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', opacity: 0.9 }}>
          <Clock size={14} />
          <span>IST: {currentTime}</span>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #EF4444, #F97316)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)'
          }}>
            <Activity size={26} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em', color: '#F9FAFB' }}>
                AI Landslide Early Warning System
              </h1>
              <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
                SIH 2026
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#9CA3AF', marginTop: '0.15rem' }}>
              Geotechnical Slope Stability & Real-Time Risk Monitoring | North Eastern Region of India
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Connection Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '6px',
            background: isConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            fontSize: '0.78rem',
            color: isConnected ? '#34D399' : '#F87171'
          }}>
            {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span>{isConnected ? 'Flask Backend Connected' : 'Connecting to API...'}</span>
          </div>

          {/* Model Diagnostics Button */}
          <button onClick={onOpenMetrics} className="btn btn-secondary" title="View Random Forest evaluation metrics">
            <Brain size={16} color="#06B6D4" />
            <span>ML Model Specs</span>
          </button>

          {/* SIH 2026 Presentation Button */}
          <button onClick={onOpenPresentation} className="btn" style={{ background: 'linear-gradient(135deg, #2563EB, #0284C7)', color: 'white' }} title="View 6-Slide SIH 2026 Official Presentation">
            <FileText size={16} />
            <span>SIH 2026 PPT</span>
          </button>
        </div>
      </div>
    </header>
  );
}
