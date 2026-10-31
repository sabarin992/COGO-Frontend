# CoGo – Ride Sharing Application (Frontend)

CoGo is a ride-sharing platform that connects drivers and passengers traveling in the same direction. The frontend provides an interactive interface for ride management, vehicle management, KYC verification, real-time chat, and live location tracking.

Built with **React 19** and **Vite**, the application provides a responsive user experience with integrated maps and real-time communication.

## Features

- **Authentication:** User registration, login, Google OAuth, OTP verification, and password reset.
- **User Management:** Profile management and role-based protected routes.
- **Ride Management:** Post, edit, search, and view rides with intermediate route matching.
- **Ride Requests:** Send, accept, reject, and cancel ride requests.
- **Vehicle Management:** Add, edit, view, and delete vehicles with image uploads.
- **KYC Verification:** Document uploads, verification status, and admin review.
- **Real-Time Chat:** WebSocket-based messaging and conversation history.
- **Live Location:** Real-time driver location tracking using WebSockets and interactive maps.
- **Admin Panel:** Dashboard, user management, and KYC verification management.

## Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React 19, JavaScript |
| Build Tool | Vite |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM |
| API Communication | Axios |
| Maps & Location | Mapbox Search JS React |
| Real-Time Communication | WebSockets |
| Authentication | Google OAuth |
| UI Components | React Select, React DatePicker |
| Image Processing | React Easy Crop |
| Notifications | React Toastify |
| Icons | Lucide React |
| Code Quality | ESLint |

## Project Structure

```text
COGO-Frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── common/
│   │   ├── kyc/
│   │   ├── map/
│   │   ├── modals/
│   │   ├── profile/
│   │   ├── ride/
│   │   └── vehicle/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── kyc/
│   │   ├── profile/
│   │   ├── ride/
│   │   └── vehicle/
│   ├── routes/
│   ├── services/
│   ├── api.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js
- npm
- Git
- CoGo backend

### 1. Clone the Repository

```bash
git clone <your-frontend-repository-url>

cd COGO-Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_MAPBOX_API_KEY=your_mapbox_api_key
VITE_MAPBOX_TOKEN=your_mapbox_access_token
VITE_NINJA_API_KEY=your_api_ninjas_api_key
```

Configure only the variables required by your application. Never expose private credentials through `VITE_` environment variables.

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

### 5. Production Build

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### 6. Run Code Quality Checks

```bash
npm run lint
```

## Backend Integration

CoGo frontend communicates with the FastAPI backend for authentication, ride operations, vehicle management, KYC verification, chat, and live location tracking.

**Backend Repository:** [CoGo Backend](https://github.com/sabarin992/COGO-Backend)

Ensure the backend is running and `VITE_API_URL` points to the correct API endpoint.

## Future Improvements

- Stripe payment integration.
- Emergency SOS interface.
- Enhanced admin dashboard.
- Sales and transaction reports.

## Security

- Keep `.env` files out of version control.
- Use `.env.example` for documenting required environment variables.
- Never expose private API credentials in frontend code.