import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from './hooks/getCurrentUser';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Get the current route location

  useEffect(() => {
    getCurrentUser(dispatch) // Get current user data
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch]);

  // Check if the current route should show the sidebar
  const showSidebar = location.pathname.startsWith('/dashboard');
  // const showHeader = !location.pathname.startsWith('/dashboard');

  return (
    <div className="flex max-h-screen overflow-hidden">
      {/* Conditionally render Sidebar */}
      {showSidebar && <Sidebar />}

      <div className="flex flex-col flex-1 overflow-auto">
        {/* Conditionally render Header */}
        {<Header />}
        <main className={`flex-1  bg-gray-100 mih-h-screen`}>
          <Outlet />
        </main>
        {/* Footer */}
        <Footer />
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
