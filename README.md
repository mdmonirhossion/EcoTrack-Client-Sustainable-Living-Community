# EcoTrack - Sustainable Living Community

A community platform where eco-conscious people discover and join sustainability challenges, share practical eco-tips, browse local green events, and track personal environmental impact.

## Live Site URL

https://ecotrack-sustainable-community.web.app

## Features

- **Discover Challenges**: Browse active sustainability challenges with categories, impact metrics, and participation stats
- **Join & Track Progress**: Join challenges and track your personal progress from the protected My Activities dashboard
- **Firebase Authentication**: Secure login with Email/Password and Google sign-in
- **Dynamic Home Sections**: Live community statistics, recent eco tips, and upcoming local green events pulled from database
- **Protected Routes**: Private dashboard routes redirect to login and preserve intended destination after authentication
- **Styled Notifications**: Toast notifications for all success/error feedback (no default browser alerts)
- **Responsive Design**: Mobile-friendly with hamburger navigation and adaptive layouts
- **Advanced Filtering**: Filter challenges by category, participant count, and start/end dates using MongoDB operators

## Tech Stack (Client)

- React 19 + Vite
- React Router 7
- Firebase Authentication
- Tailwind CSS
- Axios
- React Hot Toast

## Tech Stack (Server)

- Express.js
- MongoDB + Mongoose
- Firebase Admin SDK
- Node.js

## Getting Started

### Client Setup
```bash
cd Ecotrack\ Community-client
npm install
npm run dev
```

### Server Setup
```bash
cd Ecotrack-Community-server
npm install
npm run dev
```

## Project Structure

- **Client**: React SPA with protected/private routes
- **Server**: Express REST API with MongoDB
- **Authentication**: Firebase (client) + Firebase Admin (server)

## Routes

### Public Routes
- `/` - Home
- `/challenges` - Browse challenges
- `/challenges/:id` - Challenge detail
- `/login` - Login page
- `/register` - Register page
- `/tips` - Community tips
- `/events` - Upcoming events

### Protected Routes
- `/challenges/add` - Create new challenge
- `/challenges/join/:id` - Join a challenge
- `/my-activities` - User progress dashboard

## API Endpoints

- `GET /api/challenges` - List challenges (supports filters)
- `GET /api/challenges/:id` - Challenge detail
- `POST /api/challenges` - Create challenge (protected)
- `POST /api/challenges/join/:id` - Join challenge (protected)
- `GET /api/user-challenges` - User's joined challenges (protected)
- `PATCH /api/user-challenges/:id` - Update progress (protected)
- `GET /api/tips` - Community tips
- `GET /api/events` - Upcoming events
- `GET /api/stats` - Community statistics