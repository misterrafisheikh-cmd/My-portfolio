import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";

// Wrap any admin-only route with this — redirects to the login page
// if there's no token. The token's validity is still checked for real
// on every API call (see lib/api.js) since a client-side check like
// this one is only a UX convenience, not the actual security boundary.
export default function RequireAdminAuth({ children }) {
  const { isAuthed } = useAdminAuth();
  if (!isAuthed) return <Navigate to="/admin/login" replace />;
  return children;
}
