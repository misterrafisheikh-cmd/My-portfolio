// ============================================================
// App — the top of the whole React app: which URL shows which page.
//  /                      -> Home (one-page portfolio)
//  /read/:section/:item   -> full article reader
//  /admin, /admin/...     -> password-protected dashboard
//  /<slug>                -> a section ticked "Show on its own page"
//                            (e.g. /research) — MUST stay the last route.
// Pages are loaded lazily: the browser only downloads the code for
// the page being opened, which keeps the first load small and fast.
// ============================================================
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import { ContentProvider } from "./context/ContentContext.jsx";
import RequireAdminAuth from "./components/RequireAdminAuth.jsx";
import ScrollToHash from "./components/ScrollToHash.jsx";
import Toast from "./components/Toast.jsx";
import Home from "./pages/Home.jsx"; // not lazy: it's what most visitors see first

const ArticleReader = lazy(() => import("./pages/ArticleReader.jsx"));
const SectionPage = lazy(() => import("./pages/SectionPage.jsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const AdminContent = lazy(() => import("./pages/AdminContent.jsx"));

// Wraps every public page: loads the content ONCE and keeps it while
// you move between pages (no re-fetch, no flash).
function PublicLayout() {
  return (
    <ContentProvider>
      <ScrollToHash />
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </ContentProvider>
  );
}

// Add a new page by creating pages/YourPage.jsx and adding a <Route>
// below (above the "/:slug" one). See README.md.
export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Suspense fallback={null}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/read/:sectionId/:itemId" element={<ArticleReader />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<RequireAdminAuth><AdminDashboard /></RequireAdminAuth>} />
            <Route path="/admin/content" element={<RequireAdminAuth><AdminContent /></RequireAdminAuth>} />
            <Route element={<PublicLayout />}>
              <Route path="/:slug" element={<SectionPage />} />
            </Route>
          </Routes>
        </Suspense>
        <Toast />
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
