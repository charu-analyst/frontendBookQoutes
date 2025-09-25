import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import BookQuoteShorts from './components/BookQuoteShorts';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import { jwtDecode } from 'jwt-decode';
function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser(decodedToken);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false); 
  }, []);
useEffect(() => {
  // Clear token on browser/tab close
  const handleBeforeUnload = () => {
    localStorage.removeItem('authToken');
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, []);
  const handleSignIn = (userData, token) => {
    localStorage.setItem('authToken', token);
    
    try {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error decoding token:', error);
      handleLogout(); 
    }
  };


  const handleSignUp = (userData, token) => {
    localStorage.setItem('authToken', token);
    
    try {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error decoding token:', error);
      handleLogout(); // Logout if token is invalid
    }
  };
 const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };
  const switchToSignUp = () => setShowSignUp(true);
  const switchToSignIn = () => setShowSignUp(false);

   // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return showSignUp ? (
      <SignUp 
        onSignUp={handleSignUp} 
        onSwitchToSignIn={switchToSignIn} 
      />
    ) : (
      <SignIn 
        onSignIn={handleSignIn} 
        onSwitchToSignUp={switchToSignUp} 
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<BookQuoteShorts user={user} onLogout={handleLogout} />} />
      <Route path="/signin" element={<Navigate to="/" replace />} />
      <Route path="/signup" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;