import { createBrowserRouter, Outlet } from 'react-router';
import Login from './features/auth/pages/login';
import Register from './features/auth/pages/register';
import Protected from './features/auth/components/protected';
import Home from './features/interview/pages/home';
import Dashboard from './features/interview/pages/dashboard';
import Navbar from './components/ui/navbar'; 
import Footer from './components/ui/footer';
import ReportList from './features/interview/pages/reportList';

// Create a layout component that includes the Navbar and the Outlet
const RootLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 z-50">
        <Navbar /> {/* Will hover over the page */}
      </div>
      
      {/* Add pt-16 (padding-top) so the content doesn't hide behind the navbar initially */}
      <div className="flex-1 overflow-auto flex flex-col pt-[72px]">
        <div className="flex-1">
          <Outlet /> {/* This is where the individual routes get injected */}
        </div>
        <Footer />
      </div>
    </div>
  );
};

//creating routes
// Update your routing tree
export const router = createBrowserRouter([
    {
        element: <RootLayout />, // The layout wraps everything inside 'children'
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/',
                element: <Protected><Home /></Protected>
            },
            {
                path: '/dashboard',
                element: <Protected><Dashboard /></Protected>
            },
            {
                path: '/reports',
                element: <Protected><ReportList /></Protected> // Placeholder, replace with actual AllReports component when ready
            }
        ]
    }
]);