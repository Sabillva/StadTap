"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";

// Auth Pages
import SignUp from "./pages/SignUp";
import SignUpStep2 from "./pages/SignUpStep2";
import Login from "./pages/Login";

// Main Pages
import Stadiums from "./pages/Stadiums";
import StadiumDetail from "./pages/StadiumDetail";
import Reserve from "./pages/Reserve";
import MyReservations from "./pages/MyReservations";
import ReservationTime from "./pages/ReservationTime";
import Payment from "./pages/Payment";

// Teams Pages
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import CreateTeam from "./pages/CreateTeam";
import EditTeam from "./pages/EditTeam";

// Matches Pages
import Matches from "./pages/Matches";
import MatchDetail from "./pages/MatchDetail";
import CreateMatch from "./pages/CreateMatch";
import EditMatch from "./pages/EditMatch";

// Profile Page
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

// Dashboard
import Dashboard from "./pages/Dashboard";

// Layout
import MainLayout from "./components/layouts/MainLayout";

// Context
export const AuthContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  // Stadium owner route component
  const StadiumOwnerRoute = ({ children }) => {
    if (!user || user.userType !== "owner") {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup/step2" element={<SignUpStep2 />} />
        <Route path="/login" element={<Login />} />

        {/* Payment Route - Moved inside Protected Routes but outside MainLayout */}
        <Route
          path="/payment/:id"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/stadiums" />} />
          <Route path="stadiums" element={<Stadiums />} />
          <Route path="stadiums/:id" element={<StadiumDetail />} />
          <Route path="reserve" element={<Reserve />} />
          <Route path="reserve/:id" element={<ReservationTime />} />
          <Route path="my-reservations" element={<MyReservations />} />

          {/* Teams Routes */}
          <Route path="teams" element={<Teams />} />
          <Route path="teams/:id" element={<TeamDetail />} />
          <Route path="teams/create" element={<CreateTeam />} />
          <Route path="teams/edit/:id" element={<EditTeam />} />

          {/* Matches Routes */}
          <Route path="matches" element={<Matches />} />
          <Route path="matches/:id" element={<MatchDetail />} />
          <Route path="matches/create" element={<CreateMatch />} />
          <Route path="matches/edit/:id" element={<EditMatch />} />

          {/* Profile Routes */}
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />

          {/* Stadium Owner Dashboard */}
          <Route
            path="dashboard"
            element={
              <StadiumOwnerRoute>
                <Dashboard />
              </StadiumOwnerRoute>
            }
          />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
