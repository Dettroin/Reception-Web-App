# Reception Web Application

A modern, responsive reception and front desk management system built with the MERN stack (MongoDB, Express, React, Node.js). 

## Features

- **Dashboard**: A comprehensive overview of today's activities, including total visitors, appointments, pending enquiries, and call logs. Features a quick "New Enquiry" button for fast data entry.
- **Visitor Management**: Track visitors currently inside the building, log new entries, and handle check-outs seamlessly.
- **Appointments**: Schedule and view upcoming appointments.
- **Enquiries**: Log, track, and manage queries and requests from guests or callers.
- **Call Log**: Keep a record of all incoming, outgoing, and missed calls.
- **Real-time Notifications**: Instant toast popup notifications that alert the front desk when new entries (visitors, appointments, enquiries, calls) are logged, fully synchronized with the server clock to prevent missed alerts.

## Tech Stack

### Frontend
- **React (Vite)**
- **Tailwind CSS** (Styling & Animations)
- **Lucide React** (Icons)
- **React Hot Toast** (Notifications)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database & ODM)
- **Zod** (Validation)

## Recent Updates
- Added a "New Enquiry" button directly on the Dashboard for quick access, opening a modal to log enquiries without navigating away.
- Fixed a bug with real-time popup notifications by synchronizing the notification baseline time with the server clock instead of the local browser clock, ensuring accurate alerts for all new entries.

## Running Locally

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file with your MONGODB_URI and JWT_SECRET
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```