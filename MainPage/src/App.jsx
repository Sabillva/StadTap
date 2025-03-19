"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";

// Auth Pages
import SignUp from "./pages/SignUp";
import SignUpStep2 from "./pages/SignUpStep2";
import Login from "./pages/Login";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";

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

// Users and Chat Pages
import Users from "./pages/Users";
import UserDetail from "./pages/UserDetail";
import Chat from "./pages/Chat";
import ChatDetail from "./pages/ChatDetail";

// Stadium Owner Pages
import MyStadium from "./pages/MyStadium";
import EditStadium from "./pages/EditStadium";

// Layout
import MainLayout from "./components/layouts/MainLayout";

// Context
export const AuthContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAdmin = localStorage.getItem("admin");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (storedAdmin) {
      setUser({
        ...JSON.parse(storedAdmin),
        isAdmin: true,
      });
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

  // Admin route component
  const AdminRoute = ({ children }) => {
    if (!user || !user.isAdmin) {
      return <Navigate to="/admin/login" />;
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

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          }
        />

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

          {/* Users and Chat Routes */}
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:id" element={<ChatDetail />} />

          {/* Profile Routes */}
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />

          {/* Stadium Owner Routes */}
          <Route path="my-stadium" element={<MyStadium />} />
          <Route
            path="dashboard"
            element={
              <StadiumOwnerRoute>
                <Dashboard />
              </StadiumOwnerRoute>
            }
          />
          <Route
            path="my-stadium/edit"
            element={
              <StadiumOwnerRoute>
                <EditStadium />
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
