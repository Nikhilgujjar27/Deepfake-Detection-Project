# DeepSentry — Master REST API Contract Specification

> **Verified API Specification** (`v2.0.0`)  
> **Base URL:** `http://127.0.0.1:8000` (Dev) / `/api/v1` (Prefix)  
> **Content-Types:** `application/json`, `multipart/form-data`

---

## 1. Master API Endpoint Summary

| Category | Method | Endpoint | Auth Required | Request Type | Success Code | Response Schema |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| **Auth** | `POST` | `/api/v1/auth/register` | No | `application/json` | `201 Created` | `Token` |
| **Auth** | `POST` | `/api/v1/auth/login` | No | `application/json` | `200 OK` | `Token` |
| **Auth** | `GET` | `/api/v1/auth/me` | **Yes** (Bearer) | None | `200 OK` | `UserResponse` |
| **Forensics** | `POST` | `/api/v1/predict/analyze` | Optional | `multipart/form-data` | `200 OK` | `PredictionResponse` |
| **History** | `GET` | `/api/v1/history/` | **Yes** (Bearer) | Query params (`skip`, `limit`) | `200 OK` | `List[ScanHistoryResponse]` |
| **History** | `GET` | `/api/v1/history/{id}` | **Yes** (Bearer) | Path param (`id`) | `200 OK` | `ScanHistoryResponse` |
| **History** | `DELETE`| `/api/v1/history/{id}` | **Yes** (Bearer) | Path param (`id`) | `200 OK` | `{"message": "..."}` |
| **System** | `GET` | `/health` | No | None | `200 OK` | `{"status": "ok", ...}` |
| **System** | `GET` | `/` | No | None | `200 OK` | `{"app": "DeepSentry", ...}` |

---

## 2. Authentication Endpoints

### 2.1 Register New Analyst Account
* **Route:** `POST /api/v1/auth/register`
* **Status Code:** `201 Created`
* **Request Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "email": "alex@example.com",
  "username": "alex_analyst",
  "password": "StrongPassword2026!"
}
```
* **Validation Rules:**
  * `email`: Valid RFC email string (stripped & lowercased)
  * `username`: Non-empty string
  * `password`: Minimum 6 characters
* **Success Response (`201 Created`):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```
* **Error Responses:**
  * `409 Conflict`: `{"detail": "An account with this email address already exists."}` or `{"detail": "This username is already taken. Please choose another."}`
  * `422 Unprocessable Entity`: `{"detail": "Password must be at least 6 characters long."}`

---

### 2.2 Login to Existing Account
* **Route:** `POST /api/v1/auth/login`
* **Status Code:** `200 OK`
* **Request Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "email": "alex@example.com",
  "password": "StrongPassword2026!"
}
```
* **Success Response (`200 OK`):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```
* **Error Responses:**
  * `401 Unauthorized`: `{"detail": "Invalid email or password. Please try again."}`
  * `403 Forbidden`: `{"detail": "This account has been deactivated."}`

---

### 2.3 Get Current User Profile
* **Route:** `GET /api/v1/auth/me`
* **Status Code:** `200 OK`
* **Request Headers:** `Authorization: Bearer <access_token>`
* **Success Response (`200 OK`):**
```json
{
  "id": 1,
  "email": "alex@example.com",
  "username": "alex_analyst",
  "is_active": true,
  "created_at": "2026-08-21T10:40:06.074725"
}
```
* **Error Responses:**
  * `401 Unauthorized`: `{"detail": "Authentication required. Please sign in."}`

---

## 3. Forensic Prediction & Analysis Endpoint

### 3.1 Analyze Media Payload
* **Route:** `POST /api/v1/predict/analyze`
* **Status Code:** `200 OK`
* **Request Headers:** 
  * `Content-Type: multipart/form-data`
  * `Authorization: Bearer <access_token>` *(Optional — if present, scan is automatically saved to user's history)*
* **Form-Data Fields:**
  * `file`: Binary file payload (JPEG, PNG, or WEBP, max $10\text{ MB}$).
* **Real Production JSON Response (`200 OK`):**
```json
{
  "final_verdict": "REAL",
  "confidence": 96.0,
  "faces_detected": 1,
  "faces": [
    {
      "face_index": 0,
      "bbox": {
        "x1": 68,
        "y1": 42,
        "x2": 184,
        "y2": 192
      },
      "vit_verdict": "REAL",
      "vit_confidence": 98.24,
      "vit_p_fake": 0.0176,
      "secondary_verdict": "REAL",
      "secondary_confidence": 92.65,
      "secondary_p_fake": 0.0735,
      "ensemble_p_fake": 0.0400,
      "verdict": "REAL",
      "confidence": 96.00,
      "attention_map": "iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAYAAAA+..."
    }
  ],
  "metadata": {
    "has_exif": true,
    "camera_make": "Apple",
    "camera_model": "iPhone 15 Pro",
    "software": "17.4.1",
    "datetime_original": "2026:08:21 14:22:05",
    "iso_speed": 64
  },
  "processing_time_ms": 482.35
}
```

* **Data Model Schema for `faces[i]` (FaceResult):**
| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `face_index` | `int` | 0-indexed index of detected face | `0` |
| `bbox` | `dict` | Coordinates `{"x1": int, "y1": int, "x2": int, "y2": int}` | `{"x1": 68, "y1": 42, ...}` |
| `vit_verdict` | `string` | Classification from ViT alone (`REAL` / `FAKE`) | `"REAL"` |
| `vit_confidence` | `float` | Certainty score of ViT alone ($0.0$–$100.0\%$) | `98.24` |
| `vit_p_fake` | `float` | Raw fake probability from ViT ($0.0$–$1.0$) | `0.0176` |
| `secondary_verdict`| `string` | Classification from Secondary model (`REAL` / `FAKE`) | `"REAL"` |
| `secondary_confidence` | `float` | Certainty score of Secondary model ($0.0$–$100.0\%$) | `92.65` |
| `secondary_p_fake`| `float` | Raw fake probability from Secondary ($0.0$–$1.0$) | `0.0735` |
| `ensemble_p_fake` | `float` | Weighted fusion: $0.60 \times P_{\text{ViT}} + 0.40 \times P_{\text{Sec}}$ | `0.0400` |
| `verdict` | `string` | Calibrated verdict: `FAKE` if $P_{\text{ens}} \ge 0.60$ else `REAL` | `"REAL"` |
| `confidence` | `float` | Calibrated certainty percentage ($0.0$–$100.0\%$) | `96.00` |
| `attention_map` | `string?` | Base64-encoded PNG of Jet self-attention rollout heatmap | `"iVBORw0KGgo..."` |

---

## 4. History Management Endpoints

### 4.1 List User's Scan History
* **Route:** `GET /api/v1/history/?skip=0&limit=50`
* **Status Code:** `200 OK`
* **Request Headers:** `Authorization: Bearer <access_token>`
* **Success Response (`200 OK`):**
```json
[
  {
    "id": 4,
    "user_id": 1,
    "filename": "portrait_capture_01.jpg",
    "file_size_bytes": 1412800,
    "final_verdict": "REAL",
    "confidence_score": 96.0,
    "vit_verdict": "REAL",
    "vit_confidence": 98.24,
    "secondary_verdict": "REAL",
    "secondary_confidence": 92.65,
    "ensemble_p_fake": 0.0400,
    "faces_detected": 1,
    "face_results": "[{\"face_index\": 0, ...}]",
    "attention_map_b64": "iVBORw0KGgoAAAANSUhEUg...",
    "processing_time_ms": 482.35,
    "created_at": "2026-08-21T10:40:07.086297"
  }
]
```

### 4.2 Delete Scan Record
* **Route:** `DELETE /api/v1/history/{scan_id}`
* **Status Code:** `200 OK`
* **Request Headers:** `Authorization: Bearer <access_token>`
* **Success Response (`200 OK`):**
```json
{
  "message": "Scan deleted successfully"
}
```
* **Error Responses:**
  * `404 Not Found`: `{"detail": "Scan not found"}`

---

## 5. System Health Check Endpoint

* **Route:** `GET /health`
* **Status Code:** `200 OK`
* **Response (`200 OK`):**
```json
{
  "status": "ok",
  "app": "DeepSentry",
  "version": "2.0.0"
}
```
