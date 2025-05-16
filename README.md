# Smart City Management - Frontend (React)

This is the frontend dashboard for Smart City Management.  
It displays real-time data for **Traffic**, **Energy**, **Waste**, and **Emergency** services.

Built with **React** and **Bootstrap**.

---

## 📦 Features
- ✅ Traffic Heatmap (with live WebSocket updates)
- ✅ Energy Monitoring Dashboard
- 🔄 Waste Collection Dashboard 
- 🔄 Emergency Incident Dashboard (with live WebSocket updates)

---

## 🚀 How to Run Locally

1. Clone this repository:
    ```bash
    git clone https://github.com/Saifza/smart-city-management-frontend.git
    cd smart-city-management-frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the app:
    ```bash
    npm start
    ```

4. The frontend will run at:
    ```
    http://localhost:3000
    ```

---

## 🛠️ Technologies Used
- React 18
- Axios (API calls)
- Bootstrap 5
- Google Maps API (Heatmap layer)
- WebSocket (SockJS, STOMP)

---

## 🔮 Future Plans
- Dynamic multi-city support for all services
- Admin controls for simulation
- Authentication & User Management
- Dockerize frontend for easy deployment

---

## 👨‍💻 Developers
- Saif Zaman

---

## ⚡ Notes
- Backend API must be running at `http://localhost:8081` (Traffic), 'http://localhost:8082' (waste), `http://localhost:8083' (energy) and `http://localhost:8084' (emergency)   for full      	functionality.
- Google Maps API key is required (already configured).

