import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Game from "./components/Game";
import Register from "./components/Register";
import Loading from "./components/Loading";
import Login from "./components/Login";
import Collection from "./components/Collection";
import AboutMe from "./components/AboutMe";
import Rules from "./components/Rules";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(
    localStorage.getItem("username")
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  // บันทึกสถานะผู้ใช้ใน localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("username", user);
      // หลังจากล็อกอิน ให้ตรวจสอบ lastPath และเปลี่ยนเส้นทางไปยัง path นั้น
      const lastPath = localStorage.getItem("lastPath");
      if (lastPath) {
        localStorage.removeItem("lastPath");
        window.location.replace(lastPath); // ส่งผู้ใช้กลับไปยังเส้นทางเดิม
      }
    } else {
      localStorage.removeItem("username");
    }
  }, [user]);

  // สร้างสถานะการโหลด
  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(loadingInterval);
  }, []);

  // ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("username");
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar user={user} onLogout={handleLogout} />
        {isLoading ? (
          <Loading progress={progress} />
        ) : (
          <Routes>
            {/* เส้นทางหลัก */}
            <Route
              path="/"
              element={<Navigate to={user ? "/game" : "/login"} />}
            />
            {/* หน้า Login */}
            <Route
              path="/login"
              element={<Login onLogin={(username) => setUser(username)} />}
            />
            {/* หน้า Game */}
            <Route
              path="/game"
              element={
                <ProtectedRoute user={user}>
                  <Game username={user!} onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            {/* หน้า Register */}
            <Route
              path="/register"
              element={<Register onLogin={(username) => setUser(username)} />}
            />
            {/* หน้า Collection */}
            <Route
              path="/collection"
              element={
                <ProtectedRoute user={user}>
                  <Collection />
                </ProtectedRoute>
              }
            />
            {/* หน้า Home */}
            <Route
              path="/home"
              element={<Home onLogin={(username) => setUser(username)} />}
            />
            {/* หน้า About Me */}
            <Route path="/aboutMe" element={<AboutMe />} />
            {/* หน้า Rules */}
            <Route path="/rules" element={<Rules />} />
          </Routes>
        )}
        <Footer />
      </div>
    </Router>
  );
};

// คอมโพเนนต์ ProtectedRoute สำหรับป้องกันเส้นทางที่ต้องล็อกอิน
const ProtectedRoute: React.FC<{
  user: string | null;
  children: React.ReactNode;
}> = ({ user, children }) => {
  const location = useLocation();

  if (!user) {
    // เก็บ path ล่าสุดใน localStorage
    localStorage.setItem("lastPath", location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default App;
