export const RISK_LEVELS = {
  LOW: {
    label: 'LOW RISK',
    badgeText: 'STABLE / NORMAL',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    icon: 'ShieldCheck',
    description: 'Geotechnical slope equilibrium is stable. Hydrostatic pore water pressure within safe baseline limits.'
  },
  MEDIUM: {
    label: 'MEDIUM RISK',
    badgeText: 'WATCH ADVISORY',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    icon: 'AlertTriangle',
    description: 'Elevated pore moisture detected. Progressive regolith wetting and initial shear creep.'
  },
  HIGH: {
    label: 'HIGH RISK',
    badgeText: 'WARNING LEVEL',
    color: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: 'rgba(249, 115, 22, 0.5)',
    icon: 'AlertOctagon',
    description: 'Severe pore water pressure surge combined with active slope tilt displacement. High slope failure hazard.'
  },
  'VERY HIGH': {
    label: 'VERY HIGH RISK',
    badgeText: 'CRITICAL EVACUATION ALERT',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.7)',
    icon: 'Flame',
    description: 'CRITICAL FAILURE THRESHOLD BREACHED. Rapid kinematic shear displacement and dynamic rupture vibration.'
  }
};

export const SENSOR_THRESHOLDS = {
  rainfall: {
    unit: 'mm/24h',
    low: 25.0,
    medium: 60.0,
    high: 110.0,
    max: 200.0,
    label: 'Cumulative Rainfall (24h)'
  },
  soil_moisture: {
    unit: '%',
    low: 45.0,
    medium: 70.0,
    high: 85.0,
    max: 100.0,
    label: 'Soil Moisture Saturation'
  },
  tilt: {
    unit: '°',
    low: 2.5,
    medium: 6.0,
    high: 10.0,
    max: 25.0,
    label: 'Inclinometer Slope Tilt'
  },
  vibration: {
    unit: 'm/s²',
    low: 0.5,
    medium: 1.5,
    high: 2.8,
    max: 5.0,
    label: 'Seismic / Tremor Vibration'
  }
};

export const NE_STATES = [
  'Arunachal Pradesh',
  'Assam',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Sikkim',
  'Tripura'
];

export const DEFAULT_SITES = [
  {
    site_id: 'A-02',
    name: 'Gangtok-Nathula Slope Corridor (NH-10)',
    state: 'Sikkim',
    elevation: '1,650m',
    terrain: 'Metamorphic Gneiss & Mica Schist, High Seepage',
    description: 'Critical arterial transport corridor prone to debris flow and rainfall-triggered pore pressure slips.'
  },
  {
    site_id: 'SK-02',
    name: 'Mangan-Chungthang Road Cut',
    state: 'Sikkim',
    elevation: '1,420m',
    terrain: 'Fragile Phyllite & Weathered Schist Escarpment',
    description: 'High-altitude supply link susceptible to torrential flash debris torrents.'
  },
  {
    site_id: 'B-04',
    name: 'Champhai Ridge Slopes',
    state: 'Mizoram',
    elevation: '1,320m',
    terrain: 'Folded Tertiary Sandstone & Shale',
    description: 'Tectonically active anticlinal ridge with steep cut slopes and shallow structural slide vulnerability.'
  },
  {
    site_id: 'MZ-02',
    name: 'Aizawl Hunthar Sinking Zone',
    state: 'Mizoram',
    elevation: '980m',
    terrain: 'Saturated Silty Claystone Regolith, Progressive Creep',
    description: 'Active urban sinking slope corridor threatening residential infrastructure and bypass transport.'
  },
  {
    site_id: 'C-01',
    name: 'Dima Hasao Hill Rail Section (Haflong)',
    state: 'Assam',
    elevation: '680m',
    terrain: 'Lateritic Clay & Tertiary Sandstone Cutting',
    description: 'Strategic railway hill section prone to flash mudslides and embankment erosion during heavy cloudbursts.'
  },
  {
    site_id: 'AS-02',
    name: 'Guwahati Kamakhya-Narakasur Hill Slopes',
    state: 'Assam',
    elevation: '280m',
    terrain: 'Weathered Granite Gneiss with High Slump Tendency',
    description: 'Densely populated peri-urban hill slopes exposed to high-intensity urban slope failures during flash rains.'
  },
  {
    site_id: 'ML-01',
    name: 'Shillong-Cherrapunji Escarpment (NH-206)',
    state: 'Meghalaya',
    elevation: '1,480m',
    terrain: 'Sandstone Sandwiched with Thin Shale Bands, Extreme Rainfall',
    description: 'Southern plateau rim experiencing world-record precipitation; rapid saturation triggers massive rockslides.'
  },
  {
    site_id: 'ML-02',
    name: 'Umiam-Nongpoh Slope Cutting (Ri-Bhoi)',
    state: 'Meghalaya',
    elevation: '720m',
    terrain: 'Deep Red Residual Laterite over Archaean Gneiss',
    description: 'Heavily trafficked national highway corridor with steep highway embankments prone to translational slips.'
  },
  {
    site_id: 'AR-01',
    name: 'Tawang BCT Highway Pass (Sela Corridor)',
    state: 'Arunachal Pradesh',
    elevation: '2,250m',
    terrain: 'Tectonic Thrust Belt, Fractured Quartzite & Mica Schist',
    description: 'Critical border defence highway subjected to combined freeze-thaw degradation and monsoon slope collapses.'
  },
  {
    site_id: 'AR-02',
    name: 'Itanagar Papum Pare Ridge Slopes',
    state: 'Arunachal Pradesh',
    elevation: '450m',
    terrain: 'Siwalik Soft Sedimentary Sandstone & Conglomerate',
    description: 'Young, poorly consolidated sub-Himalayan hills susceptible to toe-cutting landslides by swollen streams.'
  },
  {
    site_id: 'NL-01',
    name: 'Kohima-Chumukedima Bypass (NH-29)',
    state: 'Nagaland',
    elevation: '1,440m',
    terrain: 'Disang Shales, High Plasticity Crushed Claystone',
    description: 'Notorious chronic sinking zone along lifeline highway connecting Dimapur and Kohima.'
  },
  {
    site_id: 'MN-01',
    name: 'Imphal-Jiribam Highway (NH-37 Corridor)',
    state: 'Manipur',
    elevation: '890m',
    terrain: 'Steep Weathered Turbidite Sandstone & Splintery Shale',
    description: 'Vital freight corridor through rugged Barail hills severely affected by seasonal monsoon debris avalanches.'
  },
  {
    site_id: 'MN-02',
    name: 'Tupul Valley Corridor (Noney)',
    state: 'Manipur',
    elevation: '640m',
    terrain: 'Sheared Ijai River Valley Slope, High Clay Moisture',
    description: 'Geologically fragile gorge section susceptible to rapid translational slope failures and river blockages.'
  },
  {
    site_id: 'TR-01',
    name: 'Jampui Hills Ridge Slopes',
    state: 'Tripura',
    elevation: '930m',
    terrain: 'Tertiary Folded Soft Sandstone & Siltstone',
    description: 'Highest elevation ridge in Tripura with steep terrace settlements vulnerable to slope erosion during cyclone rainfalls.'
  }
];
