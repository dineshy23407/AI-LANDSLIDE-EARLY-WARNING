"""
AI-Based Early Warning & Landslide Risk Monitoring System
North Eastern Region of India - Smart India Hackathon 2026

Email Alert Dispatch Service:
Formats and dispatches emergency warning broadcast emails to subscribed
citizens, district disaster officers, Border Roads Organisation engineers, and transport authorities.
Supports both zero-cost simulated delivery (with full in-app HTML preview) and real SMTP servers.
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import datetime
import database

def generate_alert_html(recipient_name, site_name, state, site_id, risk_level, forecast, telemetry):
    """
    Generates an official emergency alert HTML email template.
    """
    is_critical = risk_level == 'VERY HIGH'
    header_color = '#DC2626' if is_critical else '#EA580C'
    badge_bg = '#FEE2E2' if is_critical else '#FFEDD5'
    badge_text_color = '#991B1B' if is_critical else '#9A3412'

    lead_time = forecast.get('lead_time_window', '4 to 8 Hours') if forecast else '4 to 8 Hours'
    prob_6h = forecast.get('failure_probability_6h', 85.0) if forecast else 85.0
    action_rec = forecast.get('recommendation', 'Evacuate downslope habitations immediately.') if forecast else 'Follow district disaster protocols.'
    hist_match = forecast.get('historical_match') if forecast else None

    rain_val = telemetry.get('rainfall', 'N/A') if telemetry else 'N/A'
    moist_val = telemetry.get('soil_moisture', 'N/A') if telemetry else 'N/A'
    tilt_val = telemetry.get('tilt', 'N/A') if telemetry else 'N/A'
    vib_val = telemetry.get('vibration', 'N/A') if telemetry else 'N/A'

    hist_html = ""
    if hist_match:
        hist_html = f"""
        <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
            <strong style="color: #92400E; font-size: 13px;">HISTORICAL DISASTER ANALOG:</strong>
            <p style="margin: 4px 0 0; font-size: 12px; color: #78350F; line-height: 1.4;">
                {hist_match.get('narrative', '')}
            </p>
        </div>
        """

    return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Landslide Early Warning Broadcast</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #0F172A; color: #1E293B; margin: 0; padding: 20px;">
<div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
    
    <!-- Header Banner -->
    <div style="background-color: {header_color}; color: #FFFFFF; padding: 20px; text-align: center;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; opacity: 0.9;">
            DISASTER MANAGEMENT EARLY WARNING ALERT
        </div>
        <h1 style="margin: 6px 0 0; font-size: 22px; font-weight: 800;">
            {'🚨 CRITICAL: IMMINENT LANDSLIDE THREAT' if is_critical else '⚠️ WARNING: ELEVATED LANDSLIDE HAZARD'}
        </h1>
        <div style="font-size: 13px; margin-top: 4px;">
            North Eastern Region Monitoring Network | SIH 2026 Prototype
        </div>
    </div>

    <!-- Main Content Body -->
    <div style="padding: 24px;">
        <p style="margin: 0 0 16px; font-size: 14px; color: #334155;">
            Dear <strong>{recipient_name}</strong>,
        </p>
        <p style="font-size: 14px; color: #334155; line-height: 1.5; margin: 0 0 16px;">
            The automated Geotechnical Sensor Telemetry Network has detected rapid slope instability and cumulative pore saturation exceeding warning thresholds at your designated monitoring location:
        </p>

        <!-- Location & Status Card -->
        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 16px; margin-bottom: 16px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                    <td style="color: #64748B; padding: 4px 0; width: 40%;">Monitoring Site:</td>
                    <td style="color: #0F172A; font-weight: bold; padding: 4px 0;">{site_name} ({site_id})</td>
                </tr>
                <tr>
                    <td style="color: #64748B; padding: 4px 0;">State / Jurisdiction:</td>
                    <td style="color: #0F172A; font-weight: bold; padding: 4px 0;">{state}</td>
                </tr>
                <tr>
                    <td style="color: #64748B; padding: 4px 0;">Risk Classification:</td>
                    <td style="padding: 4px 0;">
                        <span style="background-color: {badge_bg}; color: {badge_text_color}; font-weight: bold; padding: 2px 8px; border-radius: 4px; font-size: 11px;">
                            {risk_level} RISK
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="color: #64748B; padding: 4px 0;">Estimated Failure Window:</td>
                    <td style="color: {header_color}; font-weight: bold; padding: 4px 0; font-size: 14px;">
                        {lead_time}
                    </td>
                </tr>
                <tr>
                    <td style="color: #64748B; padding: 4px 0;">Impending Slide Probability (6h):</td>
                    <td style="color: {header_color}; font-weight: bold; padding: 4px 0;">
                        {prob_6h}%
                    </td>
                </tr>
            </table>
        </div>

        <!-- Real-Time Telemetry Breakdown -->
        <div style="margin-bottom: 16px;">
            <div style="font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase; margin-bottom: 8px;">
                Real-Time Trigger Telemetry Parameters:
            </div>
            <div style="display: flex; gap: 8px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 12px; background: #F1F5F9; border-radius: 6px;">
                    <tr style="text-align: center; color: #475569;">
                        <th style="padding: 8px; border-right: 1px solid #E2E8F0;">Rainfall</th>
                        <th style="padding: 8px; border-right: 1px solid #E2E8F0;">Soil Saturation</th>
                        <th style="padding: 8px; border-right: 1px solid #E2E8F0;">Slope Tilt</th>
                        <th style="padding: 8px;">Vibration</th>
                    </tr>
                    <tr style="text-align: center; font-weight: bold; font-family: monospace; font-size: 14px; color: #0F172A;">
                        <td style="padding: 8px; border-right: 1px solid #E2E8F0;">{rain_val} mm</td>
                        <td style="padding: 8px; border-right: 1px solid #E2E8F0;">{moist_val} %</td>
                        <td style="padding: 8px; border-right: 1px solid #E2E8F0;">{tilt_val}°</td>
                        <td style="padding: 8px;">{vib_val} m/s²</td>
                    </tr>
                </table>
            </div>
        </div>

        {hist_html}

        <!-- Recommended Action Directive -->
        <div style="background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; padding: 14px; margin-bottom: 16px;">
            <strong style="color: #1E40AF; font-size: 13px;">RECOMMENDED CIVIL DEFENSE DIRECTIVE:</strong>
            <p style="margin: 6px 0 0; font-size: 13px; color: #1E3A8A; line-height: 1.4;">
                {action_rec}
            </p>
        </div>

        <!-- Emergency Helplines -->
        <div style="background-color: #F8FAFC; border-radius: 6px; padding: 12px; font-size: 12px; color: #64748B;">
            <strong>Emergency Contact Helplines:</strong><br>
            State Emergency Operations Centre (SEOC): <strong>1070</strong> | District Control Room: <strong>1077</strong> | NDRF 24x7 Control: <strong>011-24363260</strong>
        </div>

        <p style="margin-top: 20px; font-size: 11px; color: #94A3B8; line-height: 1.4; border-top: 1px solid #E2E8F0; padding-top: 12px;">
            <strong>Notice:</strong> This automated advisory was generated by the AI Landslide Monitoring Prototype (Smart India Hackathon 2026). Sensor values are synthesized for prototype demonstration.
        </p>
    </div>
</div>
</body>
</html>
"""

def dispatch_email_alerts(site_id, site_name, state, risk_level, forecast=None, telemetry=None, custom_recipient=None):
    """
    Dispatches warning emails to all relevant registered subscribers.
    Returns a list of dispatched email summaries.
    """
    # Query subscribers from SQLite
    subscribers = database.get_subscribers(site_id)
    if custom_recipient:
        subscribers.append(custom_recipient)

    if not subscribers:
        subscribers = [
            {'name': 'Local Emergency Warden', 'email': 'resident.alert@sih2026.in', 'role': 'District Resident'},
            {'name': 'District Disaster Control Cell', 'email': 'control.cell@ner.gov.in', 'role': 'Disaster Officer'}
        ]

    smtp_server = os.environ.get('SMTP_SERVER')
    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_pass = os.environ.get('SMTP_PASSWORD')

    lead_time = forecast.get('lead_time_window', '4 to 8 Hours') if forecast else '4 to 8 Hours'
    subject = f"🚨 URGENT: Landslide {risk_level} Warning for {site_name} ({state}) — Lead Time: {lead_time}"

    dispatched = []

    for sub in subscribers:
        rec_name = sub.get('name', 'Resident / Official')
        rec_email = sub.get('email', '')
        if not rec_email:
            continue

        html_body = generate_alert_html(
            recipient_name=rec_name,
            site_name=site_name,
            state=state,
            site_id=site_id,
            risk_level=risk_level,
            forecast=forecast,
            telemetry=telemetry
        )

        delivery_status = 'SIMULATED_DISPATCH'

        # If real SMTP credentials configured, attempt real dispatch
        if smtp_server and smtp_user and smtp_pass:
            try:
                msg = MIMEMultipart('alternative')
                msg['Subject'] = subject
                msg['From'] = smtp_user
                msg['To'] = rec_email
                msg.attach(MIMEText(html_body, 'html'))

                server = smtplib.SMTP(smtp_server, smtp_port, timeout=10)
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, [rec_email], msg.as_string())
                server.quit()
                delivery_status = 'DELIVERED_VIA_SMTP'
            except Exception as e:
                print(f"[Mailer] Real SMTP failed ({e}), logging simulated dispatch.")
                delivery_status = 'SIMULATED_DISPATCH'

        # Log dispatch into SQLite database for audit and dashboard view
        log_id = database.log_email_dispatch(
            recipient_email=rec_email,
            recipient_name=rec_name,
            site_id=site_id,
            risk_level=risk_level,
            predicted_lead_time=lead_time,
            subject=subject,
            email_body_html=html_body,
            delivery_status=delivery_status
        )

        dispatched.append({
            'log_id': log_id,
            'recipient_email': rec_email,
            'recipient_name': rec_name,
            'site_id': site_id,
            'risk_level': risk_level,
            'lead_time': lead_time,
            'status': delivery_status,
            'timestamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })

    return dispatched
