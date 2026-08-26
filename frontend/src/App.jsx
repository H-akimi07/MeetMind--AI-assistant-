import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Meetings from "./pages/Meetings";
import MyMeetings from "./pages/MyMeetings.jsx";
import CreateMeeting from "./pages/CreateMeeting";
import MeetingDetails from "./pages/MeetingDetails.jsx";
import JoinMeeting from "./pages/JoinMeeting";
import AIAnalyticsPage from "./pages/AIAnalyticsPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import NotFound from "./pages/NotFound.jsx";
import Contact from "./pages/Contact";

import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/meetings"
            element={
              <ProtectedRoute>
                <Meetings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/meetings/:id"
            element={
              <ProtectedRoute>
                <MeetingDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-meeting"
            element={
              <ProtectedRoute>
                <CreateMeeting />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-meetings"
            element={
              <ProtectedRoute>
                <MyMeetings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/join-meeting"
            element={
              <ProtectedRoute>
                <JoinMeeting />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/ai-analytics"
            element={
              <ProtectedRoute>
                <AIAnalyticsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={<Navigate to="/profile" replace />}
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
