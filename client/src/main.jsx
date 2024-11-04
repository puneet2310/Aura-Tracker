import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
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
        path: '/set-acad-goals',
        element: <SetAcademicGoals />,
      },
      {
        path: '/all-acad-goals',
        element: <AllAcadGoals />,
      },
      {
        path: '/about', // Add this route for the About Us page
        element: <AboutUs />,
      },
      {
        path: '/timetable',
        element: <TimetablePage/>
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
