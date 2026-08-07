# Ride Sharing Application - Frontend

## About the Project

This is the frontend of my Ride Sharing Application. It is built using **React** and **Vite**. Users can create an account, log in, verify their email using OTP, upload KYC documents, post rides, and join rides.

---

## Features

* User Registration
* User Login
* Google Login
* Email OTP Verification
* Forgot Password
* Reset Password
* Profile Management
* Upload Profile Picture
* KYC Document Upload
* Post a Ride
* View Available Rides
* My Rides
* Protected Routes

---

## Technologies Used

* React
* Vite
* React Router DOM
* Axios
* Tailwind CSS

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Go to the project folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file and add:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## Run the Project

Start the development server:

```bash
npm run dev
```

The application will run at:

```text
http://localhost:5173
```

---

## Build for Production

```bash
npm run build
```

---

## Folder Structure

```text
├── dist
│   ├── assets
│   │   ├── avatar-placeholder-wLsXt_OJ.png
│   │   ├── index-B3SKJXdp.css
│   │   └── index-C4rUy5hp.js
│   ├── favicon.svg
│   ├── icons.svg
│   └── index.html
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── public
│   ├── favicon.svg
│   └── icons.svg
├── README.md
├── src
│   ├── api.js
│   ├── App.css
│   ├── App.jsx
│   ├── assets
│   │   ├── avatar-placeholder.png
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components
│   │   ├── admin
│   │   │   ├── AdminHeader.jsx
│   │   │   ├── AdminSideBar.jsx
│   │   │   └── kyc
│   │   │       ├── ImagePreviewModal.jsx
│   │   │       ├── KycDocumentPreview.jsx
│   │   │       ├── KycHeader.jsx
│   │   │       ├── KycPagination.jsx
│   │   │       ├── KycRejectionForm.jsx
│   │   │       ├── KycReviewModal.jsx
│   │   │       ├── KycStatusBadge.jsx
│   │   │       ├── KycTable.jsx
│   │   │       └── KycTableRow.jsx
│   │   ├── AdminProtectedRoute.jsx
│   │   ├── auth
│   │   │   ├── ForgotPasswordForm.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── OtpVerificationForm.jsx
│   │   │   ├── ResetPasswordForm.jsx
│   │   │   └── SignUpForm.jsx
│   │   ├── Footer.jsx
│   │   ├── GoogleAuthButton.jsx
│   │   ├── Header.jsx
│   │   ├── kyc
│   │   │   └── EmptyKycState.jsx
│   │   ├── modals
│   │   │   └── ConfirmationModal.jsx
│   │   ├── ModernImageCropper.jsx
│   │   ├── profile
│   │   │   ├── ProfileHeader.jsx
│   │   │   └── ProfileSideBar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── PublicRoute.jsx
│   │   ├── ride
│   │   │   ├── DateSelectionStep.jsx
│   │   │   ├── DeleteRideModal.jsx
│   │   │   ├── EmptyRideState.jsx
│   │   │   ├── ProgressIndicator.jsx
│   │   │   ├── ReviewRideStep.jsx
│   │   │   ├── RideCard.jsx
│   │   │   ├── RideDetailsCard.jsx
│   │   │   ├── RideDetailsStep.jsx
│   │   │   ├── RideGrid.jsx
│   │   │   ├── RideList.jsx
│   │   │   ├── RideSkeleton.jsx
│   │   │   ├── RideStatusBadge.jsx
│   │   │   ├── RideStepper.jsx
│   │   │   ├── RideWizard.jsx
│   │   │   ├── RouteSelectionStep.jsx
│   │   │   ├── StepNavigation.jsx
│   │   │   ├── TimeSelectionStep.jsx
│   │   │   └── VehicleSelectionStep.jsx
│   │   └── vehicle
│   │       ├── DeleteVehicleModal.jsx
│   │       ├── EmptyVehicleState.jsx
│   │       ├── VehicleCard.jsx
│   │       ├── VehicleForm.jsx
│   │       ├── VehicleGrid.jsx
│   │       ├── VehicleImagePreview.jsx
│   │       ├── VehicleImageUpload.jsx
│   │       └── VehicleSkeleton.jsx
│   ├── context
│   │   ├── AuthContext.jsx
│   │   └── RideContext.jsx
│   ├── index.css
│   ├── layouts
│   │   ├── AdminLayout.jsx
│   │   ├── ProfileLayout.jsx
│   │   └── UserLayout.jsx
│   ├── main.jsx
│   ├── pages
│   │   ├── admin
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminKYCVerification.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── AdminUser.jsx
│   │   ├── auth
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── OtpVerification.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── SignUp.jsx
│   │   ├── Home.jsx
│   │   ├── kyc
│   │   │   ├── AddKycDoc.jsx
│   │   │   └── KYCDocuments.jsx
│   │   ├── NotFound.jsx
│   │   ├── profile
│   │   │   ├── Edit_profile.jsx
│   │   │   └── Profile.jsx
│   │   ├── ride
│   │   │   ├── EditRide.jsx
│   │   │   ├── MyRides.jsx
│   │   │   ├── PostRide.jsx
│   │   │   ├── RideDetails.jsx
│   │   │   ├── RideFailure.jsx
│   │   │   └── RideSuccess.jsx
│   │   └── vehicle
│   │       ├── AddVehicle.jsx
│   │       ├── EditVehicle.jsx
│   │       └── VehicleList.jsx
│   ├── routes
│   │   ├── AdminRoutes.jsx
│   │   ├── AuthRoutes.jsx
│   │   ├── KYCRoutes.jsx
│   │   ├── ProfileRoutes.jsx
│   │   ├── RideRoutes.jsx
│   │   ├── UserRoutes.jsx
│   │   └── VehicleRoutes.jsx
│   └── services
│       ├── authService.js
│       ├── kycService.js
│       ├── rideService.js
│       ├── userService.js
│       └── vehicleService.js
└── vite.config.js
```

---

## Future Improvements

* Live ride tracking
* Chat between users
* Notifications
* Online payment
* Ratings and Reviews

---

## License

This project is created for learning purposes.




<!-- # React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project. -->
