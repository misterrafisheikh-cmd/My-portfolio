// ============================================================
// App — the top of the whole React app. Sets up the router (which URL
// shows which page) and wraps everything in AdminAuthProvider so the
// admin login state is available everywhere. This file rarely needs
// editing unless you're adding a whole new page/route.
// ============================================================
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import RequireAdminAuth from "./components/RequireAdminAuth.jsx";
import Toast from "./components/Toast.jsx";
import Home from "./pages/Home.jsx";
import ArticleReader from "./pages/ArticleReader.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminContent from "./pages/AdminContent.jsx";

// Add a new page by creating pages/YourPage.jsx and adding a <Route>
// below. See README.md for the full walkthrough.
export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/read/:sectionId/:itemId" element={<ArticleReader />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdminAuth>
                <AdminDashboard />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/admin/content"
            element={
              <RequireAdminAuth>
                <AdminContent />
              </RequireAdminAuth>
            }
          />
        </Routes>
        <Toast />
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
