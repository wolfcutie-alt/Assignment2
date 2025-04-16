import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Signup from "./screens/Signup";
import Posts from "./screens/Posts";
import Events from "./screens/Events";
import Message from './screens/Message'
import Announcements from './screens/Announcements'

// Protected Route component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Moderator Route component
const ModeratorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  const isModerator = user?.role === 'moderator' || user?.role === 'admin';
  
  return isModerator ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              <Route
                path="/events"
                element={
                  <PrivateRoute>
                    <Events />
                  </PrivateRoute>
                }
              />

              <Route
                path="/message"
                element={
                  <PrivateRoute>
                    <Message />
                  </PrivateRoute>
                }
              />

              <Route
                path="/announcements"
                element={
                  <PrivateRoute>
                    <Announcements />
                  </PrivateRoute>
                }
              />
              
              {/* Moderator Routes */}
              <Route
                path="/posts"
                element={
                  <ModeratorRoute>
                    <Posts />
                  </ModeratorRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
