# 🔍 Local Monitoring Stack Setup

This directory contains a complete local monitoring stack using Docker Compose with Prometheus, Loki, and Grafana.

## 📊 Architecture

```
┌─────────────────┐
│  ATS Backend    │ (/metrics)
│  (Port 3000)    │
└────────┬────────┘
         │
         └──────────────────┐
                            │
                    ┌───────▼────────┐
                    │  Prometheus    │
                    │  (Port 9090)   │
                    └────────┬───────┘
                             │
                    ┌────────▼──────────┐
                    │     Grafana       │
         ┌──────────▶  (Port 3001)      │◀──────────┐
         │          └──────────────────┘           │
         │                                         │
    ┌────┴────┐                            ┌──────┴───┐
    │  Loki   │                            │ Dashboards
    │(Port    │                            │  & Alerts
    │ 3100)   │                            │
    └─────────┘                            └───────────┘
```

## 🚀 Quick Start

### 1. **Enable Metrics in Backend**

Ensure `PROMETHEUS_ENABLED=true` in your `.env`:

```bash
cd backend
cat .env | grep PROMETHEUS_ENABLED
# Should show: PROMETHEUS_ENABLED=true
```

### 2. **Start the Monitoring Stack**

From the project root:

```bash
docker-compose up -d
```

### 3. **Access the Services**

| Service             | URL                           | Credentials   |
| ------------------- | ----------------------------- | ------------- |
| **Grafana**         | http://localhost:3001         | admin / admin |
| **Prometheus**      | http://localhost:9090         | -             |
| **Loki**            | http://localhost:3100         | -             |
| **Backend Metrics** | http://localhost:3000/metrics | -             |

## 📈 What's Included

### Prometheus Configuration

- **File**: `prometheus.yml`
- **Scrapes**: Backend metrics every 5 seconds
- **Targets**:
  - ATS Backend: `http://host.docker.internal:3000/metrics`
  - Prometheus: `http://localhost:9090`
  - Loki: `http://host.docker.internal:3100`

### Grafana Dashboard

- **Pre-configured Dashboard**: "ATS Backend Metrics"
- **Auto-loads** when Grafana starts
- **Panels include**:
  - HTTP Request Duration (p95)
  - HTTP Requests Rate
  - Active Jobs
  - Applications (Last Hour)
  - 5xx Errors (5min)
  - HTTP Response Status Codes
  - Success Rate

### Metrics Tracked

From the backend Prometheus exporter:

- `hybrid_ats_http_request_duration_seconds` - Request latency
- `hybrid_ats_http_requests_total` - Total requests by method/route/status
- `hybrid_ats_active_jobs_total` - Number of active job postings
- `hybrid_ats_applications_total` - Total job applications
- Standard Node.js metrics (CPU, memory, etc.)

## 🛠 Configuration Files

```
monitoring/
├── docker-compose.yml              # Main Docker container orchestration
├── prometheus.yml                   # Prometheus scrape configuration
├── loki-config.yml                 # Loki log aggregation setup
├── grafana/
│   └── provisioning/
│       ├── datasources/
│       │   └── datasources.yml     # Datasource configuration
│       └── dashboards/
│           └── dashboards.yml      # Dashboard provisioning
└── dashboards/
    └── ats-backend-metrics.json    # Pre-built dashboard
```

## 🔧 Common Tasks

### View Prometheus Targets

1. Go to http://localhost:9090
2. Click **Status** → **Targets**
3. Verify "ats-backend" is "UP"

### Query Metrics in Prometheus

1. Go to http://localhost:9090
2. Enter a metric in the search box, e.g.:
   - `hybrid_ats_http_requests_total`
   - `hybrid_ats_active_jobs_total`
3. Click **Execute**

### Explore Logs in Loki

1. Go to http://localhost:3001 (Grafana)
2. Click **Explore**
3. Change datasource to **Loki**
4. Build log queries using labels like `app`, `env`, `service`

### Modify Dashboard

1. Go to http://localhost:3001 → **ATS Backend Metrics**
2. Click **Edit** (pencil icon)
3. Add/modify panels and save
4. Changes persist in the dashboard volume

### Stop the Stack

```bash
docker-compose down
# Or include volumes
docker-compose down -v
```

## 📝 Backend Integration

The backend already exports metrics via:

- **Prometheus Middleware** (`backend/middleware/prometheusMiddleware.js`)
- **Pino HTTP Middleware** (`backend/middleware/pinoHttpMiddleware.js`)
- **Prometheus Config** (`backend/config/prometheus.js`)

### Enabling/Disabling Prometheus

Edit `.env`:

```env
PROMETHEUS_ENABLED=true    # Enables /metrics endpoint
```

### Custom Metrics

Add custom metrics in `backend/config/prometheus.js`:

```javascript
export const myMetric = new client.Counter({
  name: "hybrid_ats_my_metric",
  help: "My custom metric",
  registers: [register],
});
```

Then use in your code:

```javascript
myMetric.inc();
```

## 🐛 Troubleshooting

### Prometheus Not Scraping Metrics

- Ensure backend is running: `http://localhost:3000/metrics`
- Check Prometheus targets: http://localhost:9090/targets
- Verify `host.docker.internal` resolves (macOS/Windows only)
- For Linux, use `localhost` instead in `prometheus.yml`

### Grafana Dashboard Empty

- Wait 30-60 seconds for first metrics to be scraped
- Check if backend is generating traffic (make API calls)
- Verify Prometheus datasource is working in Grafana Settings

### Port Conflicts

If ports (3000, 3001, 9090, 3100) are in use:

- Edit `docker-compose.yml` to use different ports
- Update queries accordingly

## 📚 Additional Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Loki Documentation](https://grafana.com/docs/loki/)
- [prom-client Library](https://github.com/siimon/prom-client)

## 🎯 Next Steps

1. **Generate Traffic**: Make API calls to the backend to see metrics
2. **Create Alerts**: Add alert rules in Prometheus
3. **Custom Dashboards**: Create more dashboards for specific use cases
4. **Production Setup**: For production, use Grafana Cloud and update env vars

---

**Note**: This is a development-only setup. For production, use Grafana Cloud with API keys and enable authentication.
