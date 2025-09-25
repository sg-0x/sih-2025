# Disaster Preparedness App (D-Prep)

A comprehensive disaster preparedness training platform designed to educate students and teachers about emergency response procedures. The app combines interactive simulations, video-based learning, structured modules, and gamified features to make disaster management education engaging and effective.

---

## Deployed App

[Visit the App](https://sih-2025-production-b822.up.railway.app/)

---

## Technology Stack

- **Frontend:** React.js + Bootstrap  
- **Backend:** Node.js + Express  
- **Database:** MongoDB  
- **Authentication:** Firebase  
- **Deployment:** Railway  

---

## Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)  
- [MongoDB](https://www.mongodb.com/) connection string  
- [Firebase](https://firebase.google.com/) project credentials 

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/disaster-preparedness-app.git
   cd disaster-preparedness-app
   
2. **Install dependencies**
   ```bash
   npm install
   
3. **Set up environment variables**
   Create a .env file inside the backend directory with the following:
   ```bash
    MONGO_URI=your-mongodb-uri
    FIREBASE_API_KEY=your-firebase-api-key
    FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
    FIREBASE_PROJECT_ID=your-firebase-project-id

4. **Start the development servers**
   ```bash
   # backend
   cd backend && node server.js

   # frontend
   npm start

5. **Open your browser and visit:**
   http://localhost:3000

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.  

---

## Acknowledgments

This project was created as part of **Smart India Hackathon (SIH) 2025**.  

---
   
