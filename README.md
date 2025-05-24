MERN_Citizen-Engagement
🏛️ MERN Citizen Engagement System
A lightweight backend-driven system to help citizens submit complaints and feedback related to public services. The platform categorizes issues into Education, Health, and Sport, and routes them to the appropriate agency for timely action.

📌 Problem Statement
Complaints are often handled via fragmented or manual channels, leading to delays, unresolved issues, and poor citizen satisfaction.

✅ Project Goal
Build a Minimum Viable Product (MVP) of a Citizen Engagement System that:

Accepts complaints/feedback from citizens via a React web app,

Categorizes and routes them (e.g., to Education, Health, Sport departments),

Allows tracking of complaint status,

Supports basic admin responses to submissions.

🔧 Key Features
👥 Citizens
Submit complaints via a React-based web form,

Choose a category (Education, Health, Sport),

Track complaint status (Pending, In Progress, Resolved).

🛠 Admin
View and manage categorized complaints,

Respond to each complaint,

Update ticket status.

🛠 Tech Stack
Tech	Use
Node.js	Server environment
Express.js	Backend routing & API
MongoDB	Database
React.js	Frontend interface
JWT	Authentication for admin
dotenv	Environment configuration
concurrently	Run frontend & backend simultaneously

📁 Folder Structure
pgsql
Copy
Edit
MERN_Citizen-Engagement/
├── backend/
│   ├── models/
│   │   ├── Complaint.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── complaints.js
│   ├── db.js
│   ├── server.js          # Express backend entrypoint
│   ├── package.json
│   └── .env              # Backend environment variables
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env              # Frontend environment variables (optional)
├── package.json          # Root for running concurrently
└── README.md
⚙️ Setup Instructions
1. Clone the repo:
bash
Copy
Edit
git clone https://github.com/yourusername/MERN_Citizen-Engagement.git
cd MERN_Citizen-Engagement
2. Install dependencies for both frontend and backend:
bash
Copy
Edit
cd backend
npm install
cd ../frontend
npm install
cd ..
npm install        # for root package.json with concurrently
3. Configure environment variables:
Backend: Create backend/.env

ini
Copy
Edit
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
PORT=4000
Frontend: (optional) Create frontend/.env for React environment variables if needed, e.g.,

bash
Copy
Edit
REACT_APP_API_BASE_URL=http://localhost:4000/api
4. Run the app locally:
At the root folder, run:

bash
Copy
Edit
npm start
This uses concurrently to run both backend and frontend:

Backend will run on http://localhost:4000

Frontend will run on http://localhost:3000

📄 Root package.json scripts example for concurrently:
json
{
  "name": "mern-citizen-engagement",
  "private": true,
   "scripts": {
    "build": "npm run build:frontend",
    "build:frontend": "npm run build --prefix frontend",
    "test": "react-scripts test", 
    "eject": "react-scripts eject",
    "start": "concurrently \"npm run start:frontend\" \"npm run start:backend\"",
    "start:frontend": "npm start --prefix frontend",
    "start:backend": "npm start --prefix backend"
  },
  "dependencies": {
    "concurrently": "^9.1.2"
  },
}
🧠 Potential Extensions
Admin dashboard with charts and filtering,

Email notifications to citizens,

Audit log of complaint updates,

Mobile responsiveness or mobile app frontend.

📎 Submission Link
GitHub Repo: MERN_Citizen-Engagement