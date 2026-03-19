# 🛡️ SafeSaathi - AI-Powered Safety Route Planner

SafeSaathi is a comprehensive web platform designed to enhance personal safety through intelligent route planning. It uses machine learning to identify the safest paths, provides real-time safety analytics, emergency features, and community-driven incident reporting.

## ✨ Key Features

- **🛣️ Safety Route Planner** - Get AI-powered route recommendations with color-coded safety levels
- **📍 Real-time Safety Analysis** - View crime statistics, CCTV coverage, police presence, and lighting conditions
- **🚨 Emergency SOS** - Quick emergency alert system with location sharing
- **🚕 Emergency Cab Booking** - Direct integration for emergency transportation
- **👥 Community Forum** - Share safety incidents and learn from community experiences
- **🤖 AI Safety Plan** - Personalized safety recommendations based on your journey details
- **📊 Safety Metrics** - Detailed analysis including distance, crime reports, CCTV cameras, and police proximity

---

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI framework
- **Vite 6** - Build tool with HMR
- **Tailwind CSS 4** - Styling
- **Leaflet** - Interactive mapping
- **Axios** - API communication
- **React Router v7** - Navigation

### Backend
- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server
- **Pandas & NumPy** - Data processing
- **Scikit-learn** - Machine learning
- **Flask** (alternative) - Additional API endpoints

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **pip** - Python package manager
- **npm** - Node package manager

Verify installations:
```bash
node --version
npm --version
python --version
```

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/SafeSaathi.git
cd SafeSaathi
```

### Step 2: Backend Setup

#### 2.1 Create Python Virtual Environment

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

#### 2.2 Install Python Dependencies

```bash
cd backend
pip install flask flask-cors pandas scikit-learn joblib fastapi uvicorn python-multipart
```

#### 2.3 Verify Model Files

Ensure these files exist in the `backend/` directory:
- `safety_model.pkl` - Trained ML model
- `borivali_dahisar_safety_routes_updated.csv` - Route data

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend Directory

```bash
cd ../frontend
```

#### 3.2 Install Node Dependencies


* HTML
* CSS
* JavaScript

### Backend

* Python (FastAPI)



## 🚀 How to Run the Project Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/NishaSherigar/SafeSaathi.git
```

```bash
cd SafeSaathi
```



### 2️⃣ Run the Frontend

Make sure Node.js is installed.


```bash
npm install
```


#### 3.3 Configure Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

---

## ▶️ Running the Application

### Terminal 1: Start Backend Server

```bash
.venv\Scripts\activate
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Expected: `INFO: Uvicorn running on http://0.0.0.0:8000`

✅ Backend ready at: `http://localhost:8000`

---

### Terminal 2: Start Frontend Server

```bash
cd frontend
npm run dev
```

Expected: `VITE v6.3.0 ready in 2465 ms`

✅ Frontend ready at: `http://localhost:5173`

---


### 3️⃣ Run the Backend

Make sure Python is installed.

Install required packages:

```bash
pip install fastapi uvicorn
```

Start the backend server:

```bash
python -m uvicorn main:app --reload
```

The backend will run at:

```
http://localhost:8000
```

## 📖 How to Use

1. Navigate to [http://localhost:5173](http://localhost:5173)
2. Click "Safety Route Planner"
3. Enter source and destination
4. Click "Find Safe Routes"
5. View color-coded routes (Green=Safe, Yellow=Moderate, Red=Risky)

---

## 🧠 Safety Score Calculation

Scores are dynamically calculated using a trained ML model based on:

- Crime Reports
- CCTV Coverage
- Police Presence
- Street Lighting
- Pedestrian Friendliness
- Traffic Density

---

## 🔧 Troubleshooting

### "Failed to fetch" error
- Verify backend is running on port 8000
- Check `.env` has correct `VITE_API_URL`

### Model not loading
- Verify `safety_model.pkl` exists in `backend/`
- Check CSV files are present

### Python venv not activating
```bash
.venv\Scripts\activate.bat
```

---


## ⚠️ Safety Disclaimer

SafeSaathi provides recommendations based on available data. Users should:
- Always verify route safety before traveling
- Trust their instincts and local knowledge
- Report safety concerns to authorities

**Your safety is our priority. Travel wisely! 🛡️**

## 📽️ Demo Video

📽️ **Demo Video:**
[https://drive.google.com/file/d/1iiiJLK23wBhjqU9a4BK4UuqCnXLK1Nwz/view?usp=sharing](https://drive.google.com/file/d/1iiiJLK23wBhjqU9a4BK4UuqCnXLK1Nwz/view?usp=sharing)



## 📌 Future Enhancements

* AI/ML-based threat detection
* Risk-level classification
* Crime-aware safety recommendations
* Admin monitoring dashboard



