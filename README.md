# UniCal AI 📅

**Your University. All Events. One Place.**

UniCal AI is an AI-powered university companion designed to bring academic information, events, examinations, announcements, placements, and student schedules together in one centralized platform.

It provides students with an organized dashboard to stay updated with university activities, while administrators can manage and publish important university information through a dedicated admin panel.

## ✨ Features

### 🎓 Student Portal

- **Personalized Dashboard:** View important university updates and upcoming activities.
- **Academic Calendar:** Explore examination schedules, holidays, academic events, and important dates.
- **Events & Announcements:** Stay informed about workshops, seminars, hackathons, and university notices.
- **My Schedule:** Keep track of personal academic activities and upcoming deadlines.
- **Placement Updates:** Access placement drives, opportunities, and recruitment information.
- **AI Assistant:** Ask university-related questions using a conversational interface.
- **Google Calendar Integration:** Add supported university events to your personal calendar.

### 🛠️ Admin Panel

- **Dashboard:** Access essential university management functions.
- **User Management:** Manage registered students and user accounts.
- **Event Management:** Create, update, and manage university events.
- **Announcement Management:** Publish and manage university notices.
- **Club Management:** Maintain university club information and activities.
- **Placement Management:** Add and update placement opportunities.
- **FAQ Management:** Maintain frequently asked questions and answers.
- **University Data:** Manage information used throughout the platform.

### 🤖 AI-Powered Assistance

- Conversational interface for university-related queries.
- Designed to help students find academic and university information.
- Provides a centralized way to access information without manually navigating multiple sections.

### 🔐 Authentication & Security

- Student registration and login.
- Separate student and administrator access.
- JWT-based authentication.
- Password hashing using bcrypt.
- Protected routes and role-based access.

## 🧰 Tech Stack

| Category       | Technologies              |
| -------------- | ------------------------- |
| Frontend       | React 19, TypeScript      |
| Build Tool     | Vite                      |
| Styling        | Tailwind CSS 4            |
| Routing        | React Router              |
| HTTP Client    | Axios                     |
| Icons          | Lucide React, React Icons |
| Backend        | Node.js / Bun, Express.js |
| Database       | MongoDB, Mongoose         |
| Authentication | JWT, bcrypt               |

## 📁 Project Structure

```text
UniCal-AI/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── index.ts
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Bun runtime
- MongoDB database

### 1. Clone the Repository

```bash
git clone https://github.com/Bibek-M/UniCal-AI.git

cd UniCal-AI
```

### 2. Setup Frontend

```bash
cd frontend

npm install

npm run dev
```

The frontend development server will start using Vite.

### 3. Setup Backend

Open another terminal:

```bash
cd server

bun install

bun run index.ts
```

Configure the required environment variables for the backend before starting the server.

## 🌐 Deployment

The project is currently completed and runs locally. Public deployment is planned.

| Component | Planned Platform |
| --------- | ---------------- |
| Frontend  | Netlify          |
| Backend   | Render           |
| Database  | MongoDB          |

Deployment links will be added once hosting is configured.

## 🎯 Project Objective

The primary objective of UniCal AI is to simplify how students access university-related information by combining multiple academic and administrative resources into one platform.

Instead of checking multiple sources for examination dates, academic schedules, notices, and events, students can access everything through a centralized interface with AI-powered assistance.

- GitHub: [Bibek-M](https://github.com/Bibek-M)

---

*UniCal AI – Plan Better. Do More. Stay Informed.*


