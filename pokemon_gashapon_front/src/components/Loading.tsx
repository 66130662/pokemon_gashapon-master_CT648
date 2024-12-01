import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/images/p_11.jpg";
import loadingSound from "../assets/sounds/loadingSound.mp3";

interface LoadingProps {
  progress: number;
}

const Loading: React.FC<LoadingProps> = ({ progress }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // ตรวจสอบสถานะล็อกอินและเส้นทางปัจจุบัน
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const currentPath = localStorage.getItem("currentPath");

    if (!isLoggedIn || isLoggedIn !== "true") {
      // ถ้าไม่ได้ล็อกอิน ส่งไปหน้า Login
      navigate("/login", { replace: true });
    } else if (currentPath) {
      // ถ้ามี currentPath ให้ส่งผู้ใช้กลับไป path นั้น
      navigate(currentPath, { replace: true });
    } else {
      // กรณีไม่มี currentPath ให้ไปที่หน้าหลัก (Home หรือ Dashboard)
      navigate("/home", { replace: true });
    }

    // เล่นเสียงพื้นหลัง
    const audio = new Audio(loadingSound);
    audio.loop = true;

    const playAudio = async () => {
      try {
        await audio.play();
        console.log("เสียงกำลังเล่น");
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเล่นเสียง:", error);
      }
    };

    playAudio();

    return () => {
      // หยุดเสียงเมื่อคอมโพเนนต์ถูกถอดออก
      audio.pause();
      audio.currentTime = 0;
    };
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        textAlign: "center",
        padding: "50px",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "6rem" }}>Loading... {progress}%</h1>
      <progress value={progress} max="100" />
    </div>
  );
};

export default Loading;
