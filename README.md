# NagarNetra — AI Engine

Python + FastAPI + YOLOv8 pothole detection microservice.

---

## Setup & Run Locally

```bash
# 1. Clone / enter the folder
cd nagarnetra-ai

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the server
python main.py
```

Server starts at: http://localhost:8000
API docs (auto-generated): http://localhost:8000/docs

---

## Endpoints

### GET /health
Confirm server is running.

### POST /detect
Send a pothole photo with GPS data, get back severity classification.

---

## Testing with Postman

1. Open Postman → New Request → POST
2. URL: http://localhost:8000/detect
3. Body tab → select "form-data"
4. Add these fields:

| Key        | Type | Value                          |
|------------|------|--------------------------------|
| image      | File | select any pothole photo       |
| lat        | Text | 21.1458                        |
| lon        | Text | 79.0882                        |
| timestamp  | Text | 2024-07-15T14:32:00Z           |
| sha256_hash| Text | abc123 (placeholder for now)   |
| device_id  | Text | test-device                    |

5. Hit Send.

---

## Example Response

```json
{
  "success": true,
  "complaint_id": "NGN-1720954320",
  "processing_time_seconds": 0.843,
  "metadata": {
    "lat": 21.1458,
    "lon": 79.0882,
    "timestamp": "2024-07-15T14:32:00Z",
    "sha256_hash": "abc123",
    "device_id": "test-device"
  },
  "primary_severity": {
    "level": "L2",
    "label": "Moderate",
    "description": "Medium pothole. Repair within the month.",
    "urgency": "Medium",
    "estimated_repair_days": 7
  },
  "detection": {
    "image_dimensions": { "width": 1920, "height": 1080 },
    "total_detections": 1,
    "detections": [
      {
        "class": "pothole",
        "confidence": 0.847,
        "bounding_box": { "x1": 420, "y1": 310, "x2": 680, "y2": 490 },
        "area_percentage": 6.32,
        "severity": {
          "level": "L2",
          "label": "Moderate",
          "urgency": "Medium",
          "estimated_repair_days": 7
        }
      }
    ]
  },
  "pothole_detected": true,
  "rti_eligible": true
}
```

---

## Deploy to Railway

1. Push this folder to a GitHub repo
2. Go to railway.app → New Project → Deploy from GitHub
3. Railway auto-detects Python and installs requirements.txt
4. Add start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Done. Railway gives you a public URL.

---

## Notes

- Model weights (yolov8s.pt) download automatically on first run (~22MB)
- Use `opencv-python-headless` not `opencv-python` on servers (no display needed)
- Fine-tuning on Indian road pothole dataset comes in the next step
torch==2.5.1
torchvision==0.20.1
torchaudio==2.5.1
