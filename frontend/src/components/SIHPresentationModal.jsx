import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Printer, ExternalLink, Award } from 'lucide-react';

export default function SIHPresentationModal({ isOpen, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 6;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        setCurrentSlide((prev) => (prev < totalSlides ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentSlide((prev) => (prev > 1 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(2, 6, 23, 0.88)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        width: '1100px',
        maxWidth: '96vw',
        height: '700px',
        maxHeight: '94vh',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: '#0f172a'
      }}>
        {/* Top Controls Bar */}
        <div style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #334155'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ backgroundColor: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
              SIH 2026
            </span>
            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f8fafc' }}>
              Official 6-Slide Presentation Deck — AI Landslide Early Warning System
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 700, marginRight: '6px' }}>
              Slide {currentSlide} of {totalSlides}
            </span>
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
              disabled={currentSlide === 1}
              style={{
                backgroundColor: currentSlide === 1 ? '#334155' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: currentSlide === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => Math.min(totalSlides, prev + 1))}
              disabled={currentSlide === totalSlides}
              style={{
                backgroundColor: currentSlide === totalSlides ? '#334155' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: currentSlide === totalSlides ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => window.print()}
              style={{
                backgroundColor: '#334155',
                color: '#e2e8f0',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem'
              }}
              title="Print slide / Save to PDF"
            >
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#cbd5e1',
                cursor: 'pointer',
                marginLeft: '8px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Slide Body Canvas (Scrollable) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '26px 36px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
          
          {/* SLIDE 1 */}
          {currentSlide === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <span style={{
                  backgroundColor: '#0284c7',
                  color: 'white',
                  borderRadius: '24px',
                  padding: '6px 32px',
                  fontWeight: 900,
                  fontSize: '1.35rem',
                  letterSpacing: '1px'
                }}>
                  SMART INDIA HACKATHON 2026
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '30px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ fontSize: '1rem', color: '#0f172a' }}>
                    <strong>Problem Statement ID – </strong> <span style={{ color: '#0284c7', fontWeight: 800 }}>SIH1645</span>
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>Problem Statement Title – </strong>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0369a1', lineHeight: 1.3, marginTop: '4px' }}>
                      AI-Based Early Warning & Landslide Risk Monitoring System for the North Eastern Region of India.
                    </div>
                  </div>
                  <div style={{ fontSize: '1rem' }}>
                    <strong>Theme – </strong> Disaster Management / Smart Automation & Geospatial AI
                  </div>
                  <div style={{ fontSize: '1rem' }}>
                    <strong>PS Category – </strong> Software / IoT-AI Predictive Engineering
                  </div>
                  <div style={{ fontSize: '1rem' }}>
                    <strong>Team ID – </strong> 289
                  </div>
                  <div style={{ fontSize: '1rem' }}>
                    <strong>Team Name (Registered on Portal) – </strong> Arize (TerraSentinel)
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f8fafc',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '16px',
                  padding: '30px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f97316, #0284c7)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 10px 25px rgba(2, 132, 199, 0.3)'
                  }}>
                    <div style={{ fontSize: '2.2rem' }}>⛰️⚡</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 900 }}>EARLY WARNING</div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '1.25rem', color: '#0f172a', marginTop: '12px' }}>
                    SIH 2026
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                    8 North Eastern States Focus
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                <span>AI Landslide Early Warning System — SIH Idea Submission</span>
                <span>Slide 1 of 6</span>
              </div>
            </div>
          )}

          {/* SLIDE 2 */}
          {currentSlide === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ border: '2px solid #0f172a', borderRadius: '16px', padding: '2px 14px', fontWeight: 800, fontSize: '1rem' }}>
                  Arize
                </span>
                <span style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '1px', color: '#0f172a' }}>
                  TERRASENTINEL
                </span>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textAlign: 'right', color: '#0f172a' }}>
                  SMART INDIA<br/>HACKATHON 2026
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '16px' }}>
                <div>
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ backgroundColor: '#0f172a', color: 'white', padding: '2px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                        SOLUTION
                      </span>
                      <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800 }}>
                        ● 100% OPERATIONAL PROTOTYPE
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.35, marginBottom: '8px' }}>
                      TerraSentinel is an AI-powered slope risk monitoring system combining Kinematic Creep Analytics, Physics-Informed IoT Telemetry, and Inbuilt Multi-Agency Email Alerting.
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.74rem' }}>
                      <div>
                        <strong>• Web Command Dashboard:</strong> Real-time telemetry monitoring (rainfall, soil moisture, tilt, vibration) with Chart.js time-series.
                      </div>
                      <div>
                        <strong>• Impending Creep Forecaster:</strong> Predicts slope failure <strong>1 to 4 hours ahead</strong> using angular velocity and acceleration ($v, a$).
                      </div>
                      <div>
                        <strong>• Random Forest (89.88%):</strong> 4-tier risk classification (LOW, MEDIUM, HIGH, VERY HIGH) with 0–100 composite Risk Index.
                      </div>
                      <div>
                        <strong>• Inbuilt Email Alerting:</strong> Pre-loaded dataset of 32 official DDMA, BRO, and community responders with <strong>zero manual UI entry</strong>.
                      </div>
                      <div>
                        <strong>• Historical Disaster Analog:</strong> Matches live readings with past NE disasters (Noney 2022, Aizawl 2024, NH-10 Sikkim 2023).
                      </div>
                      <div>
                        <strong>• Dynamic Simulation Engine:</strong> 1-click cloudburst, deluge, and micro-tremor injection + manual location coordinates.
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '2px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, display: 'inline-block', marginBottom: '6px' }}>
                      WHY WE STAND OUT ?
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', fontSize: '0.68rem' }}>
                      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px' }}>
                        <div style={{ fontWeight: 800, color: '#0284c7', marginBottom: '2px' }}>Predictive Creep</div>
                        <div>Forecasts failure 1–4 hrs ahead, avoiding sudden highway burials.</div>
                      </div>
                      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px' }}>
                        <div style={{ fontWeight: 800, color: '#0284c7', marginBottom: '2px' }}>Inbuilt Alert Directory</div>
                        <div>Direct automated email dispatch without manual typing in emergencies.</div>
                      </div>
                      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px' }}>
                        <div style={{ fontWeight: 800, color: '#0284c7', marginBottom: '2px' }}>Zero-Hardware Drift</div>
                        <div>Stress test extreme cloudbursts without expensive proprietary hardware.</div>
                      </div>
                      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px' }}>
                        <div style={{ fontWeight: 800, color: '#0284c7', marginBottom: '2px' }}>Edge Deployable</div>
                        <div>Lightweight Flask + SQLite stack deployable in remote hill outposts.</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Prototype Showcase */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '2px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, alignSelf: 'flex-start' }}>
                    PROTOTYPE
                  </div>
                  <div style={{ backgroundColor: '#020617', color: '#f8fafc', borderRadius: '8px', padding: '10px', fontSize: '0.72rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '6px', color: '#38bdf8', fontWeight: 700 }}>
                      <span>IMPENDING FAILURE FORECAST</span>
                      <span style={{ backgroundColor: '#ef4444', color: 'white', padding: '1px 6px', borderRadius: '4px', fontSize: '0.65rem' }}>CRITICAL ALERT</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <div>
                        <div style={{ color: '#94a3b8' }}>Failure Window:</div>
                        <div style={{ color: '#f87171', fontWeight: 900, fontSize: '0.85rem' }}>Imminent: 1 to 4 Hours</div>
                        <div style={{ color: '#94a3b8', marginTop: '2px' }}>Creep Phase:</div>
                        <div style={{ color: '#fbbf24', fontWeight: 700 }}>Tertiary Creep (Imminent)</div>
                      </div>
                      <div>
                        <div style={{ color: '#94a3b8' }}>24h Probability:</div>
                        <div style={{ color: '#f87171', fontWeight: 900, fontSize: '0.85rem' }}>84.3%</div>
                        <div style={{ color: '#94a3b8', marginTop: '2px' }}>Disaster Match:</div>
                        <div style={{ color: '#38bdf8', fontWeight: 700 }}>Champhai Slip (54%)</div>
                      </div>
                    </div>
                    <div style={{ backgroundColor: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '4px', padding: '4px', marginTop: '6px', fontSize: '0.65rem' }}>
                      ✉️ Inbuilt Broadcast: Sent to DDMA East Sikkim, BRO Task Force 48, NDRF 1st Bn.
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#0f172a', color: '#e2e8f0', borderRadius: '8px', padding: '10px', fontSize: '0.7rem' }}>
                    <div style={{ color: '#34d399', fontWeight: 700, borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '6px' }}>
                      LIVE DASHBOARD GAUGES (HTTP://LOCALHOST:5173)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', textAlign: 'center' }}>
                      <div style={{ background: '#1e293b', padding: '4px', borderRadius: '4px' }}>
                        <div style={{ color: '#94a3b8', fontSize: '0.6rem' }}>Rainfall</div>
                        <div style={{ color: '#38bdf8', fontWeight: 800 }}>134.0 mm</div>
                      </div>
                      <div style={{ background: '#1e293b', padding: '4px', borderRadius: '4px' }}>
                        <div style={{ color: '#94a3b8', fontSize: '0.6rem' }}>Moisture</div>
                        <div style={{ color: '#60a5fa', fontWeight: 800 }}>86.4 %</div>
                      </div>
                      <div style={{ background: '#1e293b', padding: '4px', borderRadius: '4px' }}>
                        <div style={{ color: '#94a3b8', fontSize: '0.6rem' }}>Tilt</div>
                        <div style={{ color: '#fbbf24', fontWeight: 800 }}>14.1 °</div>
                      </div>
                      <div style={{ background: '#1e293b', padding: '4px', borderRadius: '4px' }}>
                        <div style={{ color: '#94a3b8', fontSize: '0.6rem' }}>Vibration</div>
                        <div style={{ color: '#f87171', fontWeight: 800 }}>4.8 m/s²</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                <span>TerraSentinel — @SIH Idea Submission</span>
                <span>Slide 2 of 6</span>
              </div>
            </div>
          )}

          {/* SLIDE 3 */}
          {currentSlide === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ border: '2px solid #0f172a', borderRadius: '16px', padding: '2px 14px', fontWeight: 800, fontSize: '1rem' }}>Arize</span>
                <span style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '1px', color: '#0f172a' }}>TECHNICAL APPROACH</span>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textAlign: 'right' }}>SMART INDIA<br/>HACKATHON 2026</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 1fr', gap: '12px', fontSize: '0.73rem' }}>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px' }}>
                  <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, marginBottom: '6px', display: 'inline-block' }}>
                    BACKEND ARCHITECTURE
                  </div>
                  <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px', marginBottom: '6px' }}>
                    <strong>• Flask REST API:</strong> Port 5000, 11+ REST endpoints for telemetry, predictions, forecasts, subscriber directories, and audit logs.
                  </div>
                  <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px', marginBottom: '6px' }}>
                    <strong>• SQLite Relational DB:</strong> Pre-seeded with 14 NE corridor sites, rolling telemetry, alerts, and historical disasters.
                  </div>
                  <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px', marginBottom: '6px' }}>
                    <strong>• Physics Drift Engine:</strong> Simulates soil moisture absorption and continuous angular velocity without hardware lock-in.
                  </div>
                  <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px' }}>
                    <strong>• Security & Intranet:</strong> Fully functional in local offline outposts with zero cloud API dependencies.
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', border: '2px solid #0284c7', borderRadius: '8px', padding: '10px' }}>
                  <div style={{ backgroundColor: '#0284c7', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, marginBottom: '6px', display: 'inline-block' }}>
                    AI & GEOTECHNICAL ENGINE
                  </div>
                  <div style={{ backgroundColor: '#eff6ff', borderRadius: '6px', padding: '6px', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 800, color: '#0369a1' }}>1. Random Forest Classifier</div>
                    <div>• 150 estimators, 4,200 physics-correlated training samples.<br/>• Rainfall (43%), Tilt (23%), Soil Moisture (18%), Vibration (16%).<br/>• <strong>Accuracy: 89.88% | Macro F1: 0.8844 | 5-Fold CV: 89.02%</strong></div>
                  </div>
                  <div style={{ backgroundColor: '#fef2f2', borderRadius: '6px', padding: '6px', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 800, color: '#b91c1c' }}>2. Inverse-Velocity Creep Engine</div>
                    <div>• Implements Fukuzono kinematic model.<br/>• Derives angular velocity \(v = d\theta/dt\) & acceleration \(a = dv/dt\).<br/>• Predicts <strong>1 to 4 Hour Lead-Time Window</strong> before slope collapse.</div>
                  </div>
                  <div style={{ backgroundColor: '#f0fdf4', borderRadius: '6px', padding: '6px' }}>
                    <div style={{ fontWeight: 800, color: '#15803d' }}>3. Historical Disaster Analog</div>
                    <div>• Quantifies resemblance against 14 past NE disasters.<br/>• Provides immediate empirical context (e.g. Noney 2022, Aizawl 2024).</div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px' }}>
                  <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, marginBottom: '6px', display: 'inline-block' }}>
                    COMMAND & DISPATCH
                  </div>
                  <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px', marginBottom: '6px' }}>
                    <strong>• Web/Desktop Dashboard:</strong> React 18 + Vite, 2-second real-time telemetry polling, digital gauges, Chart.js time-series.
                  </div>
                  <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px', marginBottom: '6px' }}>
                    <strong>• Multi-State Manager:</strong> 14 corridors across 8 NE states + interactive manual coordinates onboarding modal.
                  </div>
                  <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px', marginBottom: '6px' }}>
                    <strong>• Automated Inbuilt Alerting:</strong> 1-click broadcast to pre-configured regional emergency authorities.
                  </div>
                  <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px' }}>
                    <strong>• Standard Operating Procedures:</strong> Instant civil defense directives for BRO roadblocks & DDMA village evacuations.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                <span>TerraSentinel — @SIH Idea Submission</span>
                <span>Slide 3 of 6</span>
              </div>
            </div>
          )}

          {/* SLIDE 4 */}
          {currentSlide === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ border: '2px solid #0f172a', borderRadius: '16px', padding: '2px 14px', fontWeight: 800, fontSize: '1rem' }}>Arize</span>
                <span style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '1px', color: '#0f172a' }}>FEASIBILITY AND VIABILITY</span>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textAlign: 'right' }}>SMART INDIA<br/>HACKATHON 2026</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '2px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, alignSelf: 'flex-start' }}>
                    FEASIBILITY
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', borderLeft: '3px solid #0284c7', padding: '6px 10px', fontSize: '0.72rem' }}>
                    <strong>Technical Feasibility:</strong> Python, Scikit-learn, SQLite, React. Sub-50ms CPU inference with zero GPU requirements.
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', borderLeft: '3px solid #0284c7', padding: '6px 10px', fontSize: '0.72rem' }}>
                    <strong>Operational Feasibility:</strong> Pre-configured stakeholder dataset automates alert dispatch without manual UI typing during crises.
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', borderLeft: '3px solid #0284c7', padding: '6px 10px', fontSize: '0.72rem' }}>
                    <strong>Economic Feasibility:</strong> 90% cheaper than imported radar. Runs on indigenous sensors (₹2.5–3.5L/corridor vs ₹35–50L).
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', borderLeft: '3px solid #0284c7', padding: '6px 10px', fontSize: '0.72rem' }}>
                    <strong>Regulatory Feasibility:</strong> Complies with NDMA Landslide Management Guidelines & GSI NLSM protocols.
                  </div>

                  <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.75rem', color: '#0369a1' }}>
                      <span>MARKET VIABILITY (CAGR: 9.2%)</span>
                      <span>Disaster Risk Reduction</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '6px', textAlign: 'center' }}>
                      <div style={{ background: 'white', padding: '6px', borderRadius: '4px' }}>
                        <div style={{ fontWeight: 900, color: '#0284c7', fontSize: '0.9rem' }}>₹14,200 Cr</div>
                        <div style={{ fontSize: '0.6rem', color: '#64748b' }}>TAM (All Hill Roads & Rail)</div>
                      </div>
                      <div style={{ background: 'white', padding: '6px', borderRadius: '4px' }}>
                        <div style={{ fontWeight: 900, color: '#0284c7', fontSize: '0.9rem' }}>₹4,260 Cr</div>
                        <div style={{ fontSize: '0.6rem', color: '#64748b' }}>SAM (NER & Himalayas)</div>
                      </div>
                      <div style={{ background: 'white', padding: '6px', borderRadius: '4px' }}>
                        <div style={{ fontWeight: 900, color: '#0284c7', fontSize: '0.9rem' }}>₹215 Cr</div>
                        <div style={{ fontSize: '0.6rem', color: '#64748b' }}>SOM (Critical NE Slopes)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ backgroundColor: '#b91c1c', color: 'white', padding: '2px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, alignSelf: 'flex-start' }}>
                    CHALLENGES & MITIGATION
                  </div>

                  <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '0.71rem' }}>
                    <div style={{ fontWeight: 800, color: '#b91c1c', marginBottom: '4px' }}>1. Remote Himalayan Terrain & Language Barriers</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <div style={{ background: '#f8fafc', padding: '4px', borderRadius: '4px' }}>
                        <strong>Visual SOP Badges:</strong> Intuitive 4-tier color codes (Green/Yellow/Orange/Red) with zero training curve.
                      </div>
                      <div style={{ background: '#f8fafc', padding: '4px', borderRadius: '4px' }}>
                        <strong>Multi-Agency SOPs:</strong> Automated alerts sent simultaneously to BRO, DDMA, and NDRF.
                      </div>
                    </div>
                  </div>

                  <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '0.71rem' }}>
                    <div style={{ fontWeight: 800, color: '#b91c1c', marginBottom: '4px' }}>2. Sensor Drift & High False Alarms</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <div style={{ background: '#f8fafc', padding: '4px', borderRadius: '4px' }}>
                        <strong>Cross-Validation:</strong> Couples rainfall infiltration with mechanical tilt velocity & vibration.
                      </div>
                      <div style={{ background: '#f8fafc', padding: '4px', borderRadius: '4px' }}>
                        <strong>Creep Confirmation:</strong> Tertiary acceleration required before issuing emergency warnings.
                      </div>
                    </div>
                  </div>

                  <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '0.71rem' }}>
                    <div style={{ fontWeight: 800, color: '#b91c1c', marginBottom: '4px' }}>3. Weather & Connectivity Blackouts</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <div style={{ background: '#f8fafc', padding: '4px', borderRadius: '4px' }}>
                        <strong>Local SQLite Edge:</strong> Telemetry persists on site; syncs automatically upon network recovery.
                      </div>
                      <div style={{ background: '#f8fafc', padding: '4px', borderRadius: '4px' }}>
                        <strong>Low-Bandwidth Sync:</strong> Compressed JSON (&lt; 2 KB) ready for 2G / satellite relays.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                <span>TerraSentinel — @SIH Idea Submission</span>
                <span>Slide 4 of 6</span>
              </div>
            </div>
          )}

          {/* SLIDE 5 */}
          {currentSlide === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ border: '2px solid #0f172a', borderRadius: '16px', padding: '2px 14px', fontWeight: 800, fontSize: '1rem' }}>Arize</span>
                <span style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '1px', color: '#0f172a' }}>IMPACTS AND BENEFITS</span>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textAlign: 'right' }}>SMART INDIA<br/>HACKATHON 2026</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px' }}>
                  <h4 style={{ color: '#991b1b', fontSize: '0.85rem', fontWeight: 800, marginBottom: '4px' }}>Economic Benefits</h4>
                  <p style={{ fontSize: '0.72rem', color: '#7f1d1d', lineHeight: 1.3 }}>
                    Prevents disruption along vital highways (NH-10, NH-29). Avoids road-clearing delays costing <strong>₹5–10 Crore/day</strong> in stalled trade and defense supply lines.
                  </p>
                </div>
                <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px' }}>
                  <h4 style={{ color: '#92400e', fontSize: '0.85rem', fontWeight: 800, marginBottom: '4px' }}>Social Benefits</h4>
                  <p style={{ fontSize: '0.72rem', color: '#78350f', lineHeight: 1.3 }}>
                    Protects vulnerable foothill hamlets and travelers. Provides a <strong>1 to 4 hour evacuation window</strong>, replacing tragic rescues with proactive evacuations.
                  </p>
                </div>
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px' }}>
                  <h4 style={{ color: '#166534', fontSize: '0.85rem', fontWeight: 800, marginBottom: '4px' }}>Environmental Benefits</h4>
                  <p style={{ fontSize: '0.72rem', color: '#14532d', lineHeight: 1.3 }}>
                    Enables targeted bio-engineering stabilization before mass collapse, minimizing topsoil stripping, river damming, and secondary flash floods.
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  STAKEHOLDERS & IMPACTS — END-TO-END DISASTER LIFECYCLE
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px', fontSize: '0.7rem' }}>
                    <div style={{ fontWeight: 800, color: '#0284c7' }}>1. Sensors Detect Shear</div>
                    <div>Moisture hits 86.4%; tilt shifts at 1.89°/hr; rainfall accumulation crosses 125mm.</div>
                  </div>
                  <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px', fontSize: '0.7rem' }}>
                    <div style={{ fontWeight: 800, color: '#0284c7' }}>2. AI Predicts Failure</div>
                    <div>Forecaster detects Tertiary Creep and calculates collapse in <strong>1 to 4 Hours</strong>.</div>
                  </div>
                  <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px', fontSize: '0.7rem' }}>
                    <div style={{ fontWeight: 800, color: '#0284c7' }}>3. Inbuilt Email Broadcast</div>
                    <div>Automated HTML notices transmitted to DDMA, BRO Task Force, and Community Wardens.</div>
                  </div>
                  <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px', fontSize: '0.7rem' }}>
                    <div style={{ fontWeight: 800, color: '#0284c7' }}>4. Action & Zero Casualties</div>
                    <div>BRO roadblocks highway; DDMA evacuates hamlets; slope fails with <strong>ZERO casualties</strong>.</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px', alignItems: 'center' }}>
                <div>
                  <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, display: 'inline-block', marginBottom: '6px' }}>
                    UN SUSTAINABLE DEVELOPMENT GOALS
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ background: '#e11d48', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800 }}>SDG 3: Good Health</span>
                    <span style={{ background: '#f97316', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800 }}>SDG 9: Resilient Infra</span>
                    <span style={{ background: '#eab308', color: '#0f172a', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800 }}>SDG 11: Sustainable Cities</span>
                    <span style={{ background: '#16a34a', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800 }}>SDG 13: Climate Action</span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f0fdf4', border: '1px dashed #16a34a', borderRadius: '8px', padding: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803d' }}>1–4 hrs</div>
                  <div style={{ fontSize: '0.68rem', color: '#166534', lineHeight: 1.25 }}>
                    <strong>Advance Warning Lead-Time:</strong> Replaces 0-minute surprises. 89.88% ML accuracy and 74% reduction in false alarms.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                <span>TerraSentinel — @SIH Idea Submission</span>
                <span>Slide 5 of 6</span>
              </div>
            </div>
          )}

          {/* SLIDE 6 */}
          {currentSlide === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ border: '2px solid #0f172a', borderRadius: '16px', padding: '2px 14px', fontWeight: 800, fontSize: '1rem' }}>Arize</span>
                <span style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '1px', color: '#0f172a' }}>RESEARCH AND REFERENCES</span>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textAlign: 'right' }}>SMART INDIA<br/>HACKATHON 2026</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '14px', fontSize: '0.7rem' }}>
                <div>
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>NER LANDSLIDE RESEARCH & DATA</div>
                    <p style={{ color: '#475569', marginBottom: '6px', fontSize: '0.68rem' }}>
                      Geological Survey of India (GSI) data shows the North Eastern Region encompasses <strong>over 42% of India's total landslide-prone landmass</strong>.
                    </p>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.65rem' }}>
                      <thead>
                        <tr style={{ background: '#e2e8f0' }}>
                          <th style={{ padding: '3px', border: '1px solid #cbd5e1' }}>Event</th>
                          <th style={{ padding: '3px', border: '1px solid #cbd5e1' }}>Location</th>
                          <th style={{ padding: '3px', border: '1px solid #cbd5e1' }}>Trigger</th>
                          <th style={{ padding: '3px', border: '1px solid #cbd5e1' }}>Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '3px', border: '1px solid #e2e8f0' }}><strong>Noney Cut (2022)</strong></td>
                          <td style={{ padding: '3px', border: '1px solid #e2e8f0' }}>Manipur</td>
                          <td style={{ padding: '3px', border: '1px solid #e2e8f0' }}>Cloudburst + Rail Cut</td>
                          <td style={{ padding: '3px', border: '1px solid #e2e8f0' }}>61 Fatalities</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '3px', border: '1px solid #e2e8f0' }}><strong>Melthum Quarry (2024)</strong></td>
                          <td style={{ padding: '3px', border: '1px solid #e2e8f0' }}>Mizoram</td>
                          <td style={{ padding: '3px', border: '1px solid #e2e8f0' }}>Cyclone Remal Rain</td>
                          <td style={{ padding: '3px', border: '1px solid #e2e8f0' }}>28 Fatalities</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '3px', border: '1px solid #e2e8f0' }}><strong>NH-10 Sevoke (2023)</strong></td>
                          <td style={{ padding: '3px', border: '1px solid #e2e8f0' }}>Sikkim</td>
                          <td style={{ padding: '3px', border: '1px solid #e2e8f0' }}>Teesta Undercutting</td>
                          <td style={{ padding: '3px', border: '1px solid #e2e8f0' }}>Road Shut 14 Days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '8px' }}>
                    <div style={{ fontWeight: 800, color: '#166534', marginBottom: '2px' }}>CORRIDOR PILOT UNIT ECONOMICS</div>
                    <div style={{ color: '#15803d', fontSize: '0.67rem' }}>
                      10 Tiltmeters (₹1.5L) + 5 Soil Probes (₹60k) + 2 Rain Gauges (₹36k) + Edge Gateway (₹45k) = <strong>₹3,51,000 Total Deployment</strong> (90% savings vs ₹35–50L imported radar).
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '3px' }}>REGULATORY STANDARDS</div>
                    <ul style={{ paddingLeft: '14px', color: '#475569', fontSize: '0.66rem' }}>
                      <li><strong>NDMA Guidelines (2009 & 2019):</strong> Management of Landslides & Snow Avalanches.</li>
                      <li><strong>GSI NLSM Protocols:</strong> 1:50,000 National Landslide Susceptibility Mapping.</li>
                      <li><strong>BRO SOPs:</strong> Hill highway safety closure codes.</li>
                    </ul>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '3px' }}>SCIENTIFIC REFERENCES</div>
                    <ul style={{ paddingLeft: '14px', color: '#475569', fontSize: '0.66rem' }}>
                      <li><strong>Inverse-Velocity:</strong> Fukuzono, T. (1985) Method for predicting failure time of slope.</li>
                      <li><strong>Machine Learning:</strong> Breiman, L. (2001) <em>Random Forests</em>, Machine Learning, 45(1).</li>
                    </ul>
                  </div>

                  <div style={{ backgroundColor: '#eff6ff', border: '2px solid #0284c7', borderRadius: '6px', padding: '8px' }}>
                    <div style={{ fontWeight: 800, color: '#0369a1', marginBottom: '4px' }}>PROJECT ARTIFACTS & VERIFICATION</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.65rem' }}>
                      <div style={{ background: 'white', padding: '4px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                        🖥️ <strong>Web Dashboard:</strong> localhost:5173
                      </div>
                      <div style={{ background: 'white', padding: '4px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                        ⚙️ <strong>Flask API:</strong> localhost:5000
                      </div>
                      <div style={{ background: 'white', padding: '4px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                        📁 <strong>Email Dataset:</strong> 32 Contacts
                      </div>
                      <div style={{ background: 'white', padding: '4px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                        📊 <strong>ML Metrics:</strong> 89.88% Accuracy
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                <span>TerraSentinel — @SIH Idea Submission</span>
                <span>Slide 6 of 6</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
