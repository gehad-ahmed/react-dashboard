import { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Sidebar from "./components/Sidebar.tsx";
import MainContent from "./components/MainContent.tsx";
import useMediaQuery from "./components/useMediaQuery.ts";
import { ToastProvider } from "./components/ui/index.ts";
import Auth from "./components/Auth.tsx";
import { getCurrentUser, logout, type AuthUser } from "./lib/auth.ts";

const ACTIVE_PAGE_KEY = "nexus.activePage";

function readInitialPage(): string {
  if (typeof window === "undefined") return "Home";
  return window.localStorage.getItem(ACTIVE_PAGE_KEY) ?? "Home";
}

function App() {
  const [activePage, setActivePage] = useState<string>(readInitialPage);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser);
  const isMobile = useMediaQuery("(max-width: 767px)");

  // The drawer only exists on mobile; deriving this keeps it from appearing
  // "open" after growing into desktop without resetting state in an effect.
  const isDrawerOpen = isMobile && drawerOpen;

  // Persist the active page so a refresh restores it.
  useEffect(() => {
    window.localStorage.setItem(ACTIVE_PAGE_KEY, activePage);
  }, [activePage]);

  const handleSelectPage = (page: string) => {
    setActivePage(page);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <ToastProvider>
      {!user ? (
        <Auth onAuthenticated={setUser} />
      ) : (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {isMobile ? (
          <>
            {/* Top app bar (mobile only) */}
            <header
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: "56px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "0 16px",
                backgroundColor: "#1e293b",
                borderBottom: "1px solid #334155",
                zIndex: 30,
              }}
            >
              <button
                type="button"
                aria-label="Open navigation menu"
                onClick={() => setDrawerOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  color: "#e2e8f0",
                  fontSize: "24px",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <AiOutlineMenu />
              </button>
              <h2 style={{ margin: 0, fontSize: "20px" }}>Nexus</h2>
            </header>

            {/* Dimmed backdrop */}
            {isDrawerOpen && (
              <div
                onClick={() => setDrawerOpen(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  zIndex: 40,
                }}
              />
            )}

            {/* Off-canvas left drawer */}
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                zIndex: 50,
                transform: isDrawerOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.3s ease",
                boxShadow: isDrawerOpen ? "2px 0 16px rgba(0,0,0,0.5)" : "none",
              }}
            >
              <Sidebar activePage={activePage} setActivePage={handleSelectPage} userName={user.name} onLogout={handleLogout} />
            </div>

            {/* Content sits below the fixed app bar */}
            <div style={{ flex: 1, minWidth: 0, paddingTop: "56px" }}>
              <MainContent activePage={activePage} isMobile={isMobile} />
            </div>
          </>
        ) : (
          <>
            <Sidebar activePage={activePage} setActivePage={handleSelectPage} userName={user.name} onLogout={handleLogout} />
            <MainContent activePage={activePage} isMobile={isMobile} />
          </>
        )}
      </div>
      )}
    </ToastProvider>
  );
}

export default App;
