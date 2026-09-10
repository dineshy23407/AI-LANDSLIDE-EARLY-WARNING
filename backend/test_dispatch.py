import requests

res = requests.post('http://127.0.0.1:5000/api/alerts/email/send', json={'site_id': 'A-02', 'risk_level': 'VERY HIGH'})
print("Status:", res.status_code)
print("Data:", res.json())

logs_res = requests.get('http://127.0.0.1:5000/api/alerts/email/logs')
print("Logs count:", len(logs_res.json().get('logs', [])))
