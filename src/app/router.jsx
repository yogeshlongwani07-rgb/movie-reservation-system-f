import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/auth/admin/login";
import AdminSignup from "../pages/auth/admin/signup";
import UserLogin from "../pages/auth/user/login";
import UserSignup from "../pages/auth/user/signup";
import NotFound from "../pages/NotFound";
import AdminDashboard from "../pages/admin/dashboard";
import UserDashboard from "../pages/user/dashboard/index";
import Movies from "../pages/user/movie-discovery/movies";
import Shows from "../pages/user/movie-discovery/shows";
import SeatSelection from "../pages/user/movie-discovery/seatSelection";
import ProtectedRoute from "../routes/protectedRoute";
import { AuthProvider } from "../context/authContext";

export default function Router() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />}></Route>
          <Route path="/admin/signup" element={<AdminSignup />}></Route>
          <Route
            path="/admin/dashboard"
            element={
              // <ProtectedRoute role="admin">
              <AdminDashboard />
              // </ProtectedRoute>
            }
          ></Route>

          <Route path="/user/login" element={<UserLogin />}></Route>
          <Route path="/user/signup" element={<UserSignup />}></Route>
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/user/movies"
            element={
              <ProtectedRoute role="user">
                <Movies />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/user/movie/:movieId/shows"
            element={
              <ProtectedRoute role="user">
                <Shows />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/user/movie/:movieId/show/:showId/seats"
            element={
              <ProtectedRoute role="user">
                <SeatSelection />
              </ProtectedRoute>
            }
          ></Route>

          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
