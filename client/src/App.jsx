import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './hooks/getCurrentUser';
import Sidebar from './components/Sidebar/Sidebar';
import { disconnectSocket } from './store/socketSlice';
import { initializeSocket } from './store/socketThunk';
function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Get the current route location
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData); 

  useEffect(() => {
    if (userData?._id) {
      dispatch(initializeSocket(userData._id)); // Initialize socket on user login
    }

    return () => {
      dispatch(disconnectSocket()); // Clean up socket on unmount
    };
  }, [authStatus, dispatch]);

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
  const showFooter = !location.pathname.startsWith('/connect');
  
  return (
    <div className="flex max-h-screen overflow-hidden custom-scrollbar">
      {/* Conditionally render Sidebar */}
      {showSidebar && <Sidebar />}

      <div className="flex flex-col flex-1 overflow-auto custom-scrollbar">
        {/* Conditionally render Header */}
        {showFooter && <Header />}
        <main className={`flex-1  bg-gray-100 mih-h-screen`}>
          <Outlet />
        </main>
        {/* Footer */}
        {showFooter && <Footer />}
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
