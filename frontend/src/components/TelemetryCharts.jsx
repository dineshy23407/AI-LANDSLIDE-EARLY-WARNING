import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, Activity, Droplets } from 'lucide-react';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TelemetryCharts({ history }) {
  const [activeTab, setActiveTab] = useState('hydro'); // 'hydro' | 'kinematic' | 'risk'

  if (!history || history.length === 0) {
    return (
      <div className="glass-card" style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
        Awaiting telemetry time-series points...
      </div>
    );
  }

  // Format timestamps for chart labels (HH:MM:SS)
  const labels = history.map(item => {
    if (!item.timestamp) return '';
    const parts = item.timestamp.split(' ');
    return parts.length > 1 ? parts[1].substring(0, 5) : item.timestamp;
  });

  // Base options for dark mode charts
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    plugins: {
      legend: {
        labels: {
          color: '#D1D5DB',
          font: { family: 'Inter', size: 11 },
          boxWidth: 12
        }
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#F3F4F6',
        bodyColor: '#D1D5DB',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 10
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9CA3AF', font: { size: 10 } }
      }
    }
  };

  // Chart 1: Rainfall vs Soil Moisture
  const hydroData = {
    labels,
    datasets: [
      {
        label: 'Rainfall (mm/24h)',
        data: history.map(h => h.rainfall),
        borderColor: '#06B6D4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        yAxisID: 'yRain',
        tension: 0.35,
        fill: true,
        pointRadius: 2.5
      },
      {
        label: 'Soil Moisture (%)',
        data: history.map(h => h.soil_moisture),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        yAxisID: 'yMoist',
        tension: 0.35,
        borderDash: [4, 4],
        pointRadius: 2.5
      }
    ]
  };

  const hydroOptions = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      yRain: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Rainfall (mm)', color: '#06B6D4', font: { size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#06B6D4', font: { size: 10 } }
      },
      yMoist: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 100,
        title: { display: true, text: 'Soil Moisture (%)', color: '#3B82F6', font: { size: 10 } },
        grid: { drawOnChartArea: false },
        ticks: { color: '#3B82F6', font: { size: 10 } }
      }
    }
  };

  // Chart 2: Tilt vs Vibration
  const kinematicData = {
    labels,
    datasets: [
      {
        label: 'Slope Tilt (°)',
        data: history.map(h => h.tilt),
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        yAxisID: 'yTilt',
        tension: 0.35,
        fill: true,
        pointRadius: 2.5
      },
      {
        label: 'Ground Vibration (m/s²)',
        data: history.map(h => h.vibration),
        borderColor: '#EC4899',
        backgroundColor: 'rgba(236, 72, 153, 0.05)',
        yAxisID: 'yVib',
        tension: 0.35,
        pointRadius: 2.5
      }
    ]
  };

  const kinematicOptions = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      yTilt: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Tilt (°)', color: '#F59E0B', font: { size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#F59E0B', font: { size: 10 } }
      },
      yVib: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'Vibration (m/s²)', color: '#EC4899', font: { size: 10 } },
        grid: { drawOnChartArea: false },
        ticks: { color: '#EC4899', font: { size: 10 } }
      }
    }
  };

  // Chart 3: Historical Risk Index
  const riskData = {
    labels,
    datasets: [
      {
        label: 'Composite Risk Index (0 - 100)',
        data: history.map(h => h.risk_index !== undefined ? h.risk_index : (h.risk_level === 'VERY HIGH' ? 90 : h.risk_level === 'HIGH' ? 70 : h.risk_level === 'MEDIUM' ? 40 : 15)),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: history.map(h => {
          if (h.risk_level === 'VERY HIGH') return '#EF4444';
          if (h.risk_level === 'HIGH') return '#F97316';
          if (h.risk_level === 'MEDIUM') return '#F59E0B';
          return '#10B981';
        })
      }
    ]
  };

  const riskOptions = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        min: 0,
        max: 100,
        title: { display: true, text: 'Risk Score (0-100)', color: '#EF4444', font: { size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9CA3AF', font: { size: 10 } }
      }
    }
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Chart Header with Navigation Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={18} color="#06B6D4" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#E5E7EB' }}>
            Historical Sensor Telemetry & Risk Trajectory
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(0, 0, 0, 0.3)', padding: '0.2rem', borderRadius: '6px' }}>
          <button
            onClick={() => setActiveTab('hydro')}
            className={`btn ${activeTab === 'hydro' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
          >
            Rain & Moisture
          </button>
          <button
            onClick={() => setActiveTab('kinematic')}
            className={`btn ${activeTab === 'kinematic' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
          >
            Tilt & Vibration
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`btn ${activeTab === 'risk' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
          >
            Risk Trajectory
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div style={{ height: '240px', width: '100%', position: 'relative' }}>
        {activeTab === 'hydro' && <Line data={hydroData} options={hydroOptions} />}
        {activeTab === 'kinematic' && <Line data={kinematicData} options={kinematicOptions} />}
        {activeTab === 'risk' && <Line data={riskData} options={riskOptions} />}
      </div>
    </div>
  );
}
