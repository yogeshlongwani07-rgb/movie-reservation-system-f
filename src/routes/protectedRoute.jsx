import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function ProtectedRoute({ children, role }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useAuth();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getProfile(role);
        console.log(profile);
        setIsAuthenticated(true);
        setUser(profile.data.user);
      } catch (err) {
        console.log(err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    if (!user) {
      fetchProfile();
    }
  }, [role]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/${role}/login`} />;
  }

  return children;
}
