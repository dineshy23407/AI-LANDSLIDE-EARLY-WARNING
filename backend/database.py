"""
AI-Based Early Warning & Landslide Risk Monitoring System
North Eastern Region of India - Smart India Hackathon 2026

Database Module:
SQLite persistence for monitoring sites, telemetry logs, risk classifications, and alerts.
Supports dynamic addition of custom monitoring locations across the North Eastern Region of India.
"""

import os
import sqlite3
import datetime
import random

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'landslide_monitor.db')

DEFAULT_SITES = [
    # Sikkim
    {
        'site_id': 'A-02',
        'name': 'Gangtok-Nathula Slope Corridor (NH-10)',
        'state': 'Sikkim',
        'latitude': 27.3389,
        'longitude': 88.6065,
        'elevation_m': 1650,
        'terrain_type': 'Metamorphic Gneiss/Schist, High Monsoon Seepage',
        'description': 'Critical arterial transport corridor prone to debris flow and rainfall-triggered pore pressure slips.'
    },
    {
        'site_id': 'SK-02',
        'name': 'Mangan-Chungthang Road Cut',
        'state': 'Sikkim',
        'latitude': 27.5120,
        'longitude': 88.5340,
        'elevation_m': 1420,
        'terrain_type': 'Fragile Phyllite & Weathered Schist Escarpment',
        'description': 'High-altitude military & civilian supply link susceptible to torrential flash debris torrents.'
    },
    # Mizoram
    {
        'site_id': 'B-04',
        'name': 'Champhai Ridge Slopes',
        'state': 'Mizoram',
        'latitude': 23.4757,
        'longitude': 93.3282,
        'elevation_m': 1320,
        'terrain_type': 'Folded Sedimentary Sandstone & Shale, Seismic Zone V',
        'description': 'Tectonically active anticlinal ridge with steep cut slopes and shallow structural slide vulnerability.'
    },
    {
        'site_id': 'MZ-02',
        'name': 'Aizawl Hunthar Sinking Zone',
        'state': 'Mizoram',
        'latitude': 23.7380,
        'longitude': 92.7090,
        'elevation_m': 980,
        'terrain_type': 'Saturated Silty Claystone Regolith, Progressive Creep',
        'description': 'Active urban sinking slope corridor threatening residential infrastructure and bypass transport.'
    },
    # Assam
    {
        'site_id': 'C-01',
        'name': 'Dima Hasao Hill Rail Section (Haflong)',
        'state': 'Assam',
        'latitude': 25.1834,
        'longitude': 93.0234,
        'elevation_m': 680,
        'terrain_type': 'Lateritic Clay & Tertiary Sandstone Cutting',
        'description': 'Strategic railway hill section prone to flash mudslides and embankment erosion during heavy cloudbursts.'
    },
    {
        'site_id': 'AS-02',
        'name': 'Guwahati Kamakhya-Narakasur Hill Slopes',
        'state': 'Assam',
        'latitude': 26.1664,
        'longitude': 91.7062,
        'elevation_m': 280,
        'terrain_type': 'Weathered Granite Gneiss with High Slump Tendency',
        'description': 'Densely populated peri-urban hill slopes exposed to high-intensity urban slope failures during flash rains.'
    },
    # Meghalaya
    {
        'site_id': 'ML-01',
        'name': 'Shillong-Cherrapunji Escarpment (NH-206)',
        'state': 'Meghalaya',
        'latitude': 25.2986,
        'longitude': 91.7378,
        'elevation_m': 1480,
        'terrain_type': 'Sandstone Sandwiched with Thin Shale Bands, Extreme Rainfall',
        'description': 'Southern plateau rim experiencing world-record precipitation; rapid saturation triggers massive planar rockslides.'
    },
    {
        'site_id': 'ML-02',
        'name': 'Umiam-Nongpoh Slope Cutting (Ri-Bhoi)',
        'state': 'Meghalaya',
        'latitude': 25.7500,
        'longitude': 91.8800,
        'elevation_m': 720,
        'terrain_type': 'Deep Red Residual Laterite over Archaean Gneiss',
        'description': 'Heavily trafficked national highway corridor with steep highway embankments prone to translational slips.'
    },
    # Arunachal Pradesh
    {
        'site_id': 'AR-01',
        'name': 'Tawang BCT Highway Pass (Sela Corridor)',
        'state': 'Arunachal Pradesh',
        'latitude': 27.5861,
        'longitude': 91.8594,
        'elevation_m': 2250,
        'terrain_type': 'Tectonic Thrust Belt, Fractured Quartzite & Mica Schist',
        'description': 'Critical border defence highway subjected to combined freeze-thaw degradation and monsoon slope collapses.'
    },
    {
        'site_id': 'AR-02',
        'name': 'Itanagar Papum Pare Ridge Slopes',
        'state': 'Arunachal Pradesh',
        'latitude': 27.0844,
        'longitude': 93.6053,
        'elevation_m': 450,
        'terrain_type': 'Siwalik Soft Sedimentary Sandstone & Conglomerate',
        'description': 'Young, poorly consolidated sub-Himalayan hills susceptible to toe-cutting landslides by swollen streams.'
    },
    # Nagaland
    {
        'site_id': 'NL-01',
        'name': 'Kohima-Chumukedima Bypass (NH-29)',
        'state': 'Nagaland',
        'latitude': 25.6751,
        'longitude': 94.1086,
        'elevation_m': 1440,
        'terrain_type': 'Disang Shales, High Plasticity Crushed Claystone',
        'description': 'Notorious chronic sinking zone along lifeline highway connecting Dimapur and Kohima with repeated slope subsidence.'
    },
    # Manipur
    {
        'site_id': 'MN-01',
        'name': 'Imphal-Jiribam Highway (NH-37 Corridor)',
        'state': 'Manipur',
        'latitude': 24.8170,
        'longitude': 93.4200,
        'elevation_m': 890,
        'terrain_type': 'Steep Weathered Turbidite Sandstone & Splintery Shale',
        'description': 'Vital freight corridor through rugged Barail hills severely affected by seasonal monsoon debris avalanches.'
    },
    {
        'site_id': 'MN-02',
        'name': 'Tupul Valley Corridor (Noney)',
        'state': 'Manipur',
        'latitude': 24.7083,
        'longitude': 93.6333,
        'elevation_m': 640,
        'terrain_type': 'Sheared Ijai River Valley Slope, High Clay Moisture',
        'description': 'Geologically fragile gorge section susceptible to rapid translational slope failures and river blockages.'
    },
    # Tripura
    {
        'site_id': 'TR-01',
        'name': 'Jampui Hills Ridge Slopes',
        'state': 'Tripura',
        'latitude': 23.9000,
        'longitude': 92.2800,
        'elevation_m': 930,
        'terrain_type': 'Tertiary Folded Soft Sandstone & Siltstone',
        'description': 'Highest elevation ridge in Tripura with steep terrace settlements vulnerable to slope erosion during cyclone rainfalls.'
    }
]

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def seed_history_for_site(site_id, cursor=None):
    """
    Seeds initial 25 historical telemetry points for a site so that
    time-series trend charts render instantly and realistically.
    """
    should_close = False
    if cursor is None:
        conn = get_db_connection()
        cursor = conn.cursor()
        should_close = True

    # Check if telemetry already exists for this site
    cursor.execute("SELECT COUNT(*) as cnt FROM telemetry WHERE site_id = ?", (site_id,))
    if cursor.fetchone()['cnt'] > 0:
        if should_close:
            conn.close()
        return

    now = datetime.datetime.now()
    # Vary base values slightly by site characteristics
    for i in range(25, 0, -1):
        t_point = now - datetime.timedelta(minutes=i * 5)
        time_str = t_point.strftime('%Y-%m-%d %H:%M:%S')

        rf = max(0.0, round(14.0 + 8.0 * (random.random() - 0.4), 1))
        sm = max(15.0, round(36.0 + 10.0 * (random.random() - 0.5), 1))
        tilt = max(0.2, round(1.2 + 0.6 * (random.random() - 0.5), 2))
        vib = max(0.04, round(0.16 + 0.1 * (random.random() - 0.5), 3))
        risk = 'LOW'
        conf = round(0.85 + random.random() * 0.10, 2)
        r_idx = round(15.0 + random.random() * 8.0, 1)

        cursor.execute('''
            INSERT INTO telemetry (timestamp, site_id, rainfall, soil_moisture, tilt, vibration, risk_level, confidence, risk_index, is_simulated)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        ''', (time_str, site_id, rf, sm, tilt, vib, risk, conf, r_idx))

    if should_close:
        conn.commit()
        conn.close()

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Table 1: Monitoring Sites
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sites (
            site_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            state TEXT NOT NULL,
            latitude REAL,
            longitude REAL,
            elevation_m INTEGER,
            terrain_type TEXT,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Table 2: Sensor Telemetry & Classification Log
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS telemetry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            site_id TEXT NOT NULL,
            rainfall REAL NOT NULL,
            soil_moisture REAL NOT NULL,
            tilt REAL NOT NULL,
            vibration REAL NOT NULL,
            risk_level TEXT NOT NULL,
            confidence REAL NOT NULL,
            risk_index REAL NOT NULL,
            is_simulated INTEGER DEFAULT 1,
            FOREIGN KEY (site_id) REFERENCES sites(site_id)
        )
    ''')

    # Table 3: Alert Events Log
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            site_id TEXT NOT NULL,
            risk_level TEXT NOT NULL,
            message TEXT NOT NULL,
            advisory_action TEXT NOT NULL,
            status TEXT DEFAULT 'ACTIVE',
            FOREIGN KEY (site_id) REFERENCES sites(site_id)
        )
    ''')

    # Table 4: Citizen & Authority Alert Subscribers
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            role TEXT NOT NULL,
            site_id TEXT DEFAULT 'ALL',
            alert_level_threshold TEXT DEFAULT 'HIGH',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Table 5: Recorded Historical Landslides Catalog (NER)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS landslide_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_name TEXT NOT NULL,
            state TEXT NOT NULL,
            location TEXT NOT NULL,
            site_id TEXT,
            date TEXT NOT NULL,
            rainfall_mm REAL,
            tilt_deg REAL,
            vibration_mps2 REAL,
            trigger_type TEXT,
            impact_summary TEXT,
            severity TEXT
        )
    ''')

    # Table 6: Email Alert Dispatch Logs
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS email_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            recipient_email TEXT NOT NULL,
            recipient_name TEXT,
            site_id TEXT,
            risk_level TEXT,
            predicted_lead_time TEXT,
            subject TEXT,
            email_body_html TEXT,
            delivery_status TEXT DEFAULT 'DELIVERED'
        )
    ''')

    # Insert or update default sites across the 8 North Eastern states
    for s in DEFAULT_SITES:
        cursor.execute('''
            INSERT OR IGNORE INTO sites (site_id, name, state, latitude, longitude, elevation_m, terrain_type, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (s['site_id'], s['name'], s['state'], s['latitude'], s['longitude'], s['elevation_m'], s['terrain_type'], s['description']))
        seed_history_for_site(s['site_id'], cursor)

    # Inbuilt Stakeholder & Citizen Alert Email Dataset from alert_emails.csv
    emails_csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'alert_emails.csv')
    if os.path.exists(emails_csv_path):
        import csv
        with open(emails_csv_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if not row or not row.get('email'):
                    continue
                name_val = (row.get('name') or 'Officer').strip()
                email_val = (row.get('email') or '').strip().lower()
                role_val = (row.get('role') or 'Emergency Responder').strip()
                site_id_val = (row.get('site_id') or 'ALL').strip().upper()
                thresh_val = (row.get('alert_level_threshold') or 'HIGH').strip().upper()
                cursor.execute('''
                    INSERT OR REPLACE INTO subscribers (name, email, role, site_id, alert_level_threshold)
                    VALUES (?, ?, ?, ?, ?)
                ''', (name_val, email_val, role_val, site_id_val, thresh_val))

    # Seed historical catastrophic landslides catalog if empty
    cursor.execute("SELECT COUNT(*) as cnt FROM landslide_events")
    if cursor.fetchone()['cnt'] == 0:
        events = [
            ('Gangtok NH-10 Monsoon Debris Slide', 'Sikkim', 'Gangtok-Nathula Corridor', 'A-02', '2024-06-18', 125.4, 14.5, 2.8, 'Torrential Monsoon & Saturated Regolith', 'NH-10 highway closed for 5 days; arterial transport severed.', 'VERY HIGH'),
            ('Haflong Railway Embankment Washout', 'Assam', 'Dima Hasao Hill Rail Section', 'C-01', '2022-05-15', 170.0, 16.8, 3.2, 'Cloudburst & Lateritic Liquefaction', 'Hill section rail tracks left suspended; severe damage to station cuttings.', 'VERY HIGH'),
            ('Tupul Valley Catastrophic Debris Avalanche', 'Manipur', 'Tupul Railway Yard Corridor', 'MN-02', '2022-06-30', 145.0, 18.2, 3.8, 'Saturated Riverbank Slip & Heavy Rain', 'Major slope detachment into Ijai River gorge; massive infrastructure loss.', 'VERY HIGH'),
            ('Champhai Ridge Shear Slip', 'Mizoram', 'Champhai Ridge Slopes', 'B-04', '2023-08-27', 92.0, 10.4, 2.4, 'Pre-Monsoon Saturation & Microtremors', 'Cracks along bypass ridge and damage to retaining masonry structures.', 'HIGH'),
            ('Cherrapunji Escarpment Planar Rockfall', 'Meghalaya', 'Shillong-Cherrapunji Escarpment', 'ML-01', '2023-07-12', 195.0, 15.0, 2.6, 'Pore Water Pressure Surge in Shale Beds', 'Major rockfall across highway; tourist traffic suspended.', 'VERY HIGH'),
            ('Kohima-Chumukedima Subsidence Event', 'Nagaland', 'Kohima Chumukedima Bypass', 'NL-01', '2023-09-04', 88.5, 11.2, 1.9, 'Progressive Creep in Disang Shales', 'Continuous sinking of pavement bed by 1.8 meters over 48 hours.', 'HIGH'),
            ('Mangan-Chungthang Flash Slide', 'Sikkim', 'Mangan Road Cut', 'SK-02', '2023-10-05', 135.0, 16.0, 3.1, 'Lachen River Flash Flood & Toe Erosion', 'Valley cut undercut by raging torrent; 3 culverts destroyed.', 'VERY HIGH')
        ]
        for ev in events:
            cursor.execute('''
                INSERT INTO landslide_events (event_name, state, location, site_id, date, rainfall_mm, tilt_deg, vibration_mps2, trigger_type, impact_summary, severity)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', ev)

    # Initial demonstration alert if none exist
    cursor.execute("SELECT COUNT(*) as cnt FROM alerts")
    if cursor.fetchone()['cnt'] == 0:
        now = datetime.datetime.now()
        cursor.execute('''
            INSERT INTO alerts (timestamp, site_id, risk_level, message, advisory_action, status)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            (now - datetime.timedelta(hours=2)).strftime('%Y-%m-%d %H:%M:%S'),
            'A-02',
            'MEDIUM',
            'Elevated soil moisture detected following persistent monsoon shower.',
            'Deploy local highway patrol to inspect culvert runoff and rockfall netting.',
            'LOGGED'
        ))

    conn.commit()
    conn.close()
    print("[Database] SQLite database initialized with North Eastern Region monitoring network.")

def add_custom_site(site_id, name, state, latitude=None, longitude=None, elevation_m=1000, terrain_type="Steep Hill Slope", description=""):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Generate a clean ID if none provided
    if not site_id or not site_id.strip():
        prefix = state[:2].upper() if state else "NE"
        rand_num = random.randint(10, 99)
        site_id = f"{prefix}-{rand_num}"

    site_id = site_id.strip().upper()

    cursor.execute('''
        INSERT INTO sites (site_id, name, state, latitude, longitude, elevation_m, terrain_type, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(site_id) DO UPDATE SET
            name=excluded.name,
            state=excluded.state,
            latitude=excluded.latitude,
            longitude=excluded.longitude,
            elevation_m=excluded.elevation_m,
            terrain_type=excluded.terrain_type,
            description=excluded.description
    ''', (site_id, name.strip(), state.strip(), latitude, longitude, elevation_m, terrain_type.strip(), description.strip()))

    # Seed baseline history
    seed_history_for_site(site_id, cursor)

    conn.commit()
    
    # Retrieve the inserted site
    cursor.execute("SELECT * FROM sites WHERE site_id = ?", (site_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def log_telemetry(site_id, rainfall, soil_moisture, tilt, vibration, risk_level, confidence, risk_index, is_simulated=1):
    conn = get_db_connection()
    cursor = conn.cursor()
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    cursor.execute('''
        INSERT INTO telemetry (timestamp, site_id, rainfall, soil_moisture, tilt, vibration, risk_level, confidence, risk_index, is_simulated)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (timestamp, site_id, rainfall, soil_moisture, tilt, vibration, risk_level, confidence, risk_index, is_simulated))
    
    row_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return row_id

def log_alert(site_id, risk_level, message, advisory_action, status='ACTIVE'):
    conn = get_db_connection()
    cursor = conn.cursor()
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    cursor.execute('''
        INSERT INTO alerts (timestamp, site_id, risk_level, message, advisory_action, status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (timestamp, site_id, risk_level, message, advisory_action, status))

    row_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return row_id

def get_recent_telemetry(site_id=None, limit=30):
    conn = get_db_connection()
    cursor = conn.cursor()

    if site_id:
        cursor.execute('''
            SELECT * FROM telemetry
            WHERE site_id = ?
            ORDER BY id DESC
            LIMIT ?
        ''', (site_id, limit))
    else:
        cursor.execute('''
            SELECT * FROM telemetry
            ORDER BY id DESC
            LIMIT ?
        ''', (limit,))

    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in reversed(rows)]

def get_recent_alerts(site_id=None, limit=20):
    conn = get_db_connection()
    cursor = conn.cursor()

    if site_id:
        cursor.execute('''
            SELECT * FROM alerts
            WHERE site_id = ?
            ORDER BY id DESC
            LIMIT ?
        ''', (site_id, limit))
    else:
        cursor.execute('''
            SELECT * FROM alerts
            ORDER BY id DESC
            LIMIT ?
        ''', (limit,))

    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_all_sites():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM sites ORDER BY state ASC, name ASC')
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# --- Citizen & Authority Alert Subscribers ---

def get_subscribers(site_id=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if site_id:
        cursor.execute('''
            SELECT * FROM subscribers
            WHERE site_id = ? OR site_id = 'ALL'
            ORDER BY id ASC
        ''', (site_id,))
    else:
        cursor.execute('SELECT * FROM subscribers ORDER BY id ASC')
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def add_subscriber(name, email, role, site_id='ALL', alert_level_threshold='HIGH'):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO subscribers (name, email, role, site_id, alert_level_threshold)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
            name=excluded.name,
            role=excluded.role,
            site_id=excluded.site_id,
            alert_level_threshold=excluded.alert_level_threshold
    ''', (name.strip(), email.strip().lower(), role.strip(), site_id.strip().upper(), alert_level_threshold.strip().upper()))
    sub_id = cursor.lastrowid
    conn.commit()
    
    cursor.execute('SELECT * FROM subscribers WHERE email = ?', (email.strip().lower(),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else {'id': sub_id, 'name': name, 'email': email, 'role': role}

def delete_subscriber(subscriber_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM subscribers WHERE id = ?', (subscriber_id,))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    return affected > 0

# --- Historical Landslide Events Catalog ---

def get_historical_landslide_events(site_id=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if site_id:
        cursor.execute('''
            SELECT * FROM landslide_events
            WHERE site_id = ?
            ORDER BY date DESC
        ''', (site_id,))
        rows = cursor.fetchall()
        if not rows:
            # If none for specific site, return all to allow comparative benchmarking
            cursor.execute('SELECT * FROM landslide_events ORDER BY date DESC')
            rows = cursor.fetchall()
    else:
        cursor.execute('SELECT * FROM landslide_events ORDER BY date DESC')
        rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# --- Email Alert Dispatch Audit Logs ---

def log_email_dispatch(recipient_email, recipient_name, site_id, risk_level, predicted_lead_time, subject, email_body_html, delivery_status='DELIVERED'):
    conn = get_db_connection()
    cursor = conn.cursor()
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    cursor.execute('''
        INSERT INTO email_logs (timestamp, recipient_email, recipient_name, site_id, risk_level, predicted_lead_time, subject, email_body_html, delivery_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (timestamp, recipient_email, recipient_name, site_id, risk_level, predicted_lead_time, subject, email_body_html, delivery_status))
    log_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return log_id

def get_email_logs(limit=30):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, timestamp, recipient_email, recipient_name, site_id, risk_level, predicted_lead_time, subject, delivery_status, email_body_html
        FROM email_logs
        ORDER BY id DESC
        LIMIT ?
    ''', (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

if __name__ == '__main__':
    init_db()

