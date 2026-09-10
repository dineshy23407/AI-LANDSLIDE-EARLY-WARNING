# AI-Based Early Warning & Landslide Risk Monitoring System
### Smart India Hackathon 2026 | North Eastern Region of India

An end-to-end AI-powered early warning and geotechnical slope stability monitoring prototype designed for the steep, monsoon-vulnerable, and seismically active terrains of the North Eastern Region of India (e.g., Sikkim, Mizoram, Assam).

> [!NOTE]
> **PROTOTYPE DEMONSTRATION NOTICE**: Sensor readings (rainfall, soil moisture, tilt, vibration) are synthesized using a physics-correlated simulation engine. No physical IoT hardware, cloud accounts, or paid APIs are required.
>
> **SCIENTIFIC DISCLAIMER**: Landslide risk levels and model probabilities represent statistical machine-learning estimations. They do not claim physical certainty or guarantee whether a landslide will or will not occur.

---

## 🏔️ North Eastern Region Context & Monitoring Sites

The North Eastern Region (NER) of India falls under seismic zones IV and V, characterized by fragile metamorphic formations, steep road cuttings (e.g., NH-10), and severe monsoon pore-water pressure surges. This system monitors three simulated strategic slope corridors:

1. **Site A-02: Gangtok-Nathula Slope Corridor (East Sikkim)**
   - *Elevation*: 1,650m | *Terrain*: Metamorphic gneiss and mica schist with heavy monsoon groundwater seepage.
2. **Site B-04: Champhai Ridge Slopes (Mizoram)**
   - *Elevation*: 1,320m | *Terrain*: Folded Tertiary sandstone and shale in an earthquake-prone anticlinal ridge.
3. **Site C-01: Dima Hasao Hill Rail Section (Assam)**
   - *Elevation*: 680m | *Terrain*: Lateritic clay and steep railway cutting fills vulnerable to flash mudslides.

---

## ⚙️ Architecture & Data Pipeline

```
  Simulated Geophone / Inclinometer / Tipping-Bucket Telemetry
                             ↓
              [ Physics Telemetry Engine ]
        (Continuous temporal drift & scenario triggers)
                             ↓
                 [ Flask REST API Server ]
                             ↓
         [ Preprocessing & Feature Extraction ]
                             ↓
          [ Random Forest Classifier Model ]
        (Trained on 4,200 physics-informed samples)
                             ↓
      [ Risk Classification & Confidence Estimation ]
     (LOW, MEDIUM, HIGH, VERY HIGH + 0-100 Risk Index)
                             ↓
             [ SQLite Telemetry & Alert DB ]
                             ↓
             [ React + Vite Command Center ]
    (Interactive Gauges, Chart.js Trends, SOP Advisories)
```

---

## 🧠 Machine Learning Model Pipeline

- **Algorithm**: `RandomForestClassifier` (150 estimators, max depth 12, balanced class weighting)
- **Features**:
  - `rainfall` (mm/24h): Cumulative surface precipitation
  - `soil_moisture` (%): Volumetric water saturation & pore-water pressure proxy
  - `tilt` (degrees °): Inclinometer angular shear displacement
  - `vibration` (m/s²): Geophone ground motion & seismic vibration
- **Target Classes**:
  - `LOW`: Stable geotechnical equilibrium
  - `MEDIUM`: Moderate saturation & initial creep
  - `HIGH`: Severe pore-pressure surge & accelerated tilt
  - `VERY HIGH`: Critical failure threshold breached / rupture shock
- **Evaluation Metrics** (on holdout test set $N=840$):
  - **Overall Accuracy**: **89.88%**
  - **Macro F1-Score**: **0.8844**
  - **5-Fold Cross-Validation Accuracy**: **89.02% (± 0.017)**
  - **Feature Importances**: Rainfall (42.98%), Tilt (23.16%), Soil Moisture (18.11%), Vibration (15.75%)

---

## 🚀 Quick-Start Instructions

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

### Step 1: Start Backend API
Open a terminal in the project root:
```bash
# Windows
run_backend.bat

# Or manually:
cd backend
python -m pip install -r requirements.txt
python app.py
```
The Flask REST API will start on **`http://127.0.0.1:5000`**.

### Step 2: Start Frontend Dashboard
Open a second terminal in the project root:
```bash
# Windows
run_frontend.bat

# Or manually:
cd frontend
npm install
npm run dev
```
The Vite React dashboard will start on **`http://localhost:5173`**.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status, model verification, disclaimers |
| `GET` | `/api/sites` | List of NER monitoring sites with coordinates and terrain data |
| `GET` | `/api/sensors/live?site_id=A-02` | Live telemetry tick, ML classification, confidence, SOP advisory |
| `POST` | `/api/predict` | Custom inference endpoint for external/manual telemetry inputs |
| `GET` | `/api/history?site_id=A-02&limit=30` | Historical sensor time-series & risk index scores |
| `GET` | `/api/alerts?site_id=A-02&limit=20` | Logged hazard alert audit trail from SQLite |
| `GET` | `/api/model/metrics` | Model performance report, confusion matrix, feature weights |
| `POST` | `/api/simulate/scenario` | Inject scenario (`NORMAL_DRY`, `PRE_MONSOON`, `MONSOON_DELUGE`, `CRITICAL_FAILURE`) |
| `POST` | `/api/simulate/override` | Set custom manual values for rainfall, moisture, tilt, vibration |
| `POST` | `/api/simulate/reset` | Reset site telemetry back to automatic baseline drift |

---

## 🧪 Interactive Hackathon Demo Controls

The frontend includes a built-in **Scenario Injector** for live demonstration to judges:
1. **Normal Dry (LOW)**: Sets sunny, dry conditions ($5\text{ mm}$ rain, $28\%$ moisture).
2. **Pre-Monsoon (MEDIUM)**: Sets intermittent showers ($35\text{ mm}$ rain, $55\%$ moisture).
3. **Heavy Monsoon (HIGH)**: Sets intense highway rainfall ($88\text{ mm}$ rain, $81\%$ moisture, $7.6^\circ$ tilt).
4. **Cloudburst Slip (CRITICAL)**: Triggers catastrophic slope failure ($145\text{ mm}$ rain, $94\%$ moisture, $15.2^\circ$ tilt, $3.4\text{ m/s}^2$ tremor). Watch the dashboard turn into a pulsing red alert with NDRF evacuation advisories!
5. **Custom Sliders**: Drag sliders to test arbitrary parameter boundaries live.
6. **ML Model Specs Modal**: Click the top-right button to inspect the real confusion matrix and feature importances.

---

## 📁 Repository Structure

```
AI-LANSLIDE-EARLY-WARNING/
├── backend/
│   ├── app.py                          # Flask REST API server & endpoints
│   ├── database.py                     # SQLite persistence & telemetry logger
│   ├── simulator.py                    # Multi-site telemetry simulation engine
│   ├── requirements.txt                # Python backend dependencies
│   ├── test_backend.py                 # Automated unit and integration test suite
│   ├── landslide_monitor.db            # SQLite database file
│   └── model/
│       ├── dataset_generator.py        # Physics-informed synthetic dataset generator
│       ├── train_model.py              # ML training, cross-validation & evaluation script
│       ├── landslide_rf_model.joblib   # Trained Random Forest model artifact
│       ├── model_metrics.json          # Exported evaluation metrics & confusion matrix
│       └── data/
│           ├── synthetic_landslide_train.csv
│           └── synthetic_landslide_test.csv
├── frontend/
│   ├── index.html                      # HTML template with fonts
│   ├── package.json                    # React, Vite, Chart.js, Lucide-react dependencies
│   ├── vite.config.js                  # Vite server & proxy configuration
│   └── src/
│       ├── main.jsx                    # React mount entry point
│       ├── App.jsx                     # Dashboard orchestrator & polling logic
│       ├── index.css                   # Responsive dark command-center styles
│       ├── api.js                      # Axios client with fallback handlers
│       ├── components/
│       │   ├── Header.jsx              # Title, live clock & prototype disclaimer
│       │   ├── SiteSelector.jsx        # Monitoring site switcher (A-02, B-04, C-01)
│       │   ├── SensorCards.jsx         # Telemetry digital gauge cards
│       │   ├── RiskDisplay.jsx         # Risk badge, confidence & probability bars
│       │   ├── AdvisoryBanner.jsx      # Early warning SOP & disaster action protocol
│       │   ├── TelemetryCharts.jsx     # Chart.js time-series graphs
│       │   ├── SimulationControl.jsx   # Interactive scenario buttons & custom sliders
│       │   ├── AlertLogTable.jsx       # Real-time SQLite alert audit table
│       │   └── ModelMetricsModal.jsx   # ML validation & confusion matrix modal
│       └── utils/
│           └── constants.js            # Thresholds, site metadata, color definitions
├── run_backend.bat / .sh               # Backend startup scripts
├── run_frontend.bat / .sh              # Frontend startup scripts
└── README.md                           # Documentation & architecture overview
```
