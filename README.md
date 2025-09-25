# Disaster Preparedness App (D-Prep)

A comprehensive disaster preparedness training platform designed to educate students and teachers about emergency response procedures.  
The app combines interactive simulations, video-based learning, structured modules, and gamified features to make disaster management education engaging and effective.

---

## Features

- **Interactive Disaster Simulations**  
  Practice earthquake, fire, flood, cyclone, and landslide response through scenario-based simulations.

- **Video-Based Learning Modules**  
  Structured training content with progress tracking for students and teachers.

- **Alerts & Announcements**  
  Stay updated with region-specific disaster alerts and admin notices.

- **Role-Based Dashboards**  
  Separate views and permissions for Students, Teachers, and Admins.

- **Gamification**  
  Earn points, climb leaderboards, and encourage participation with game-like features.

---

## Deployed App

[Visit the App](#) *(https://sih-2025-production-b822.up.railway.app/)*

---

## Technology Stack

- **Frontend:** React.js + Bootstrap  
- **Backend:** Node.js + Express  
- **Database:** MongoDB  
- **Authentication:** Firebase  
- **Deployment:** Railway  

---

## Installation & Setup

```bash
# Prerequisites
# - Node.js (v18 or higher)
# - MongoDB connection string
# - Firebase project credentials

# 1. Clone the repository
git clone https://github.com/your-username/disaster-preparedness-app.git
cd disaster-preparedness-app

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create a `.env` file inside the backend directory with the following:
# (replace placeholder values with your own)
MONGO_URI=your-mongodb-uri
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
FIREBASE_PROJECT_ID=your-firebase-project-id

# 4. Start the development servers
# In one terminal (backend)
cd backend
npm run dev

# In another terminal (frontend)
cd frontend
npm start

# 5. Open your browser and visit
http://localhost:3000
