import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider, useDispatch } from 'react-redux';
import store from './store/store.js';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import SetAcademicGoals from './components/AcademicGoals/SetAcademicGoals.jsx';
import AllAcadGoals from './components/AcademicGoals/AllAcadGoals.jsx';
import AboutUs from './pages/AboutUs'; // Import the AboutUs component
import 'antd/dist/reset.css';
import TimetablePage from './components/TimeTables/TimetablePage.jsx'
import EditTimetableForm from './components/TimeTables/EditTimetableForm.jsx';
import Profile from './components/Profile/Profile.jsx';
import Contact from './components/Contact/Contact.jsx';
import DisplayStudent from './components/Dashboard/DisplayStudent.jsx';
import AttendancePage from './components/Attendance/AttendancePage.jsx';
import ViewAttendance from './components/Attendance/ViewAttendance.jsx';
import SetAssignment from './components/Assignment/SetAssignment.jsx';
import AllAssignments from './components/Assignment/AllAssignments.jsx';
import AcademicGoals from './components/Dashboard/AcademicGoals.jsx';
import Connect from './components/Dashboard/Connect.jsx';
import { useEffect } from 'react';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/dashboard/set-acad-goals',
        element: <SetAcademicGoals />,
      },
      {
        path: '/dashboard/all-acad-goals',
        element: <AllAcadGoals />,
      },
      {
        path: '/dashboard/view-acad-goals',
        element: <AcademicGoals />,
      },
      {
        path: '/about', // Add this route for the About Us page
        element: <AboutUs />,
      },
      {
        path: '/dashboard/timetable',
        element: <TimetablePage/>
      },
      {
        path: '/dashboard/timetable/edit',
        element: <EditTimetableForm/>
      },
      {
        path: '/dashboard/profile',
        element: <Profile />
      },
      {
        path: '/dashboard/contact',
        element: <Contact />
      },
      {
        path: '/dashboard/students',
        element: <DisplayStudent />
      },
      {
        path: '/dashboard/faculty/take-attendance',
        element: <AttendancePage />
      },
      {
        path: '/dashboard/faculty/upload-assignment',
        element: <SetAssignment />
      },
      {
        path: '/dashboard/attendance',
        element: <ViewAttendance />
      },
      {
        path: '/dashboard/all-assignments',
        element: <AllAssignments/>
      },
      {
        path: '/connect',
        element: <Connect/>
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>,
);
