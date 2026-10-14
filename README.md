# CoGo - Ride Sharing Application (Frontend)

CoGo is a ride-sharing application that connects drivers and passengers travelling in the same direction. The frontend provides an interactive user interface for authentication, ride management, vehicle management, KYC verification, real-time chat, and live location tracking.

## Features

### Authentication and User Management

- User registration and login
- Google authentication
- OTP verification
- Forgot password and password reset
- Protected routes based on user roles
- User profile management

### Ride Management

- Post and edit rides
- Search for available rides
- Intermediate route matching
- View ride details
- Manage ride requests
- View bookings and booking details
- Ride request status tracking

### Vehicle Management

- Add and edit vehicles
- View registered vehicles
- Upload and preview vehicle images
- Delete vehicles

### KYC Verification

- Upload KYC documents
- View submitted documents and verification status
- Preview documents and images
- Admin-side KYC review and rejection handling

### Real-Time Features

- Chat between ride participants
- Live location tracking
- Interactive maps and location search
- Real-time location updates using WebSockets

### Admin Panel

- Admin login
- Admin dashboard
- User management
- KYC verification management

## Technology Stack

### Frontend

- **React 19** - Building reusable UI components and interactive interfaces.
- **Vite** - Frontend development server and build tool.
- **JavaScript (ES Modules)** - Application logic and component development.
- **Tailwind CSS 4** - Utility-first styling.
- **React Router DOM** - Client-side routing and navigation.
- **Axios** - Communicating with backend APIs.
- **Lucide React** - Icons for the user interface.

### Maps and Location

- **Mapbox Search JS React** - Location search and address selection.
- **WebSockets** - Real-time communication with the backend for live location updates.

### Authentication

- **Google OAuth** - Google sign-in integration.
- **React Router DOM** - Protected and role-based navigation.

### UI Libraries

- **React DatePicker** - Date selection.
- **React Select** - Customizable selection controls.
- **React Easy Crop** - Image cropping.
- **React Toastify** - Toast notifications.

### Development Tools

- **ESLint** - Code quality and linting.
- **Vite** - Development server and production builds.

## Project Structure

```text
frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api.js                      # API client configuration
│   ├── assets/                     # Images and static assets
│   ├── components/
│   │   ├── admin/                  # Admin UI components
│   │   ├── auth/                   # Authentication forms
│   │   ├── chat/                   # Chat components
│   │   ├── common/                 # Shared UI components
│   │   ├── kyc/                    # KYC components
│   │   ├── map/                    # Maps and live tracking
│   │   ├── modals/                 # Reusable modals
│   │   ├── profile/                # Profile components
│   │   ├── ride/                   # Ride-related components
│   │   └── vehicle/                # Vehicle components
│   ├── context/                    # Shared application state
│   ├── hooks/                      # Custom React hooks
│   ├── layouts/                    # User, profile and admin layouts
│   ├── pages/
│   │   ├── admin/                  # Admin pages
│   │   ├── auth/                   # Authentication pages
│   │   ├── kyc/                    # KYC pages
│   │   ├── profile/                # Profile pages
│   │   ├── ride/                   # Ride and booking pages
│   │   └── vehicle/                # Vehicle pages
│   ├── routes/                     # Route configuration
│   ├── services/                   # API service modules
│   ├── App.jsx                     # Root application component
│   ├── App.css                     # Application styles
│   ├── index.css                   # Global styles
│   └── main.jsx                    # Application entry point
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Installation and Setup

Follow these steps to set up and run the CoGo frontend locally.

### Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- Git
- CoGo backend running locally or accessible through a configured API URL

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-project-folder>/frontend
```

Replace the placeholders with your actual GitHub repository URL and project folder name.

If you already have the project on your computer, navigate directly to its frontend directory:

```bash
cd frontend
```

### 2. Install Dependencies

Install the required Node.js packages:

```bash
npm install
```

This command installs the dependencies listed in `package.json`.

### 3. Configure Environment Variables

Create a `.env` file in the frontend root directory, alongside `package.json`.

Configure the following environment variables:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the FastAPI backend. |
| `VITE_GOOGLE_CLIENT_ID` | Client ID used for Google authentication. |
| `VITE_MAPBOX_API_KEY` | API key used for Mapbox-related functionality, if referenced by your application. |
| `VITE_MAPBOX_TOKEN` | Access token used for Mapbox maps and location services, if referenced by your application. |
| `VITE_NINJA_API_KEY` | API key used to access API Ninjas services, depending on your implementation. |

Example `.env` configuration:

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_MAPBOX_API_KEY=your-mapbox-api-key
VITE_MAPBOX_TOKEN=your-mapbox-access-token
VITE_NINJA_API_KEY=your-api-ninjas-api-key
```

Replace the example values with your actual configuration.

**Important security notes:**
- Never commit your `.env` file or actual credentials to GitHub.
- Add `.env` to your `.gitignore` file.
- Vite exposes variables prefixed with `VITE_` to client-side code. Do not store private secrets in these variables. If an API key must remain secret, make requests through your backend instead.
- Restart the Vite development server after changing environment variables.
- Verify the exact variable names used in your frontend code. For example, `VITE_MAPBOX_API_KEY` and `VITE_MAPBOX_TOKEN` may serve different purposes, or one may be unused.


### 4. Run the Development Server

Start the frontend:

```bash
npm run dev
```

Vite will display a local URL in the terminal, usually:

```text
http://localhost:5173
```

Open that URL in your browser to access the application.

Ensure the FastAPI backend is running and the frontend API configuration points to the correct backend URL.

### 5. Build for Production

Create an optimized production build:

```bash
npm run build
```

The generated production files will be placed in the `dist/` directory.

### 6. Preview the Production Build

To preview the generated build locally:

```bash
npm run preview
```

Use the local URL displayed in your terminal to view the production build.

### 7. Run Code Quality Checks

Run ESLint to check the frontend code:

```bash
npm run lint
```

## Backend Integration

The CoGo frontend communicates with the FastAPI backend for authentication, ride management, vehicle operations, KYC verification, chat, and live location features.

Make sure the backend is configured and running before testing features that require API access.

## Future Improvements

- **Payment Integration:** Integrate Stripe into the frontend to support secure online ride payments.
- **SOS Management:** Add an emergency SOS interface for passengers and drivers, allowing users to request assistance during a ride.
- **Admin Dashboard Enhancements:** Expand the admin dashboard with additional management and monitoring features.
- **Sales Reports:** Add an admin-side sales reporting interface to display revenue, payment transactions, completed rides, and sales performance.


