import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/images/p_122.jpg";
import loadingSound from "../assets/sounds/loadingSound.mp3";
import "./AboutMe.css";
import teacher from "../assets/images/teacher.png";
import student from "../assets/images/student.jpg";
import Logo from "../assets/images/Logo.png";
import Diagram from "../assets/images/Diagram.png";
import structure from "../assets/images/structure.png";
import Database from "../assets/images/Database.png";
interface HomeProps {
  onLogin: (user: string | null) => void;
}

const Home: React.FC<HomeProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate(); // ใช้ useNavigate ภายในคอมโพเนนต์ Home

  const handleLogin = () => {
    if (username) {
      console.log(`Logging in as: ${username}`);
      onLogin(username);
      navigate("/game"); // นำทางไปยังเกมหลังจากล็อกอิน
    }
  };

  const handleRegisterClick = () => {
    navigate("/register"); // ใช้ navigate เพื่อไปยังหน้า register
  };

  return (
    <div
      className="about-me-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* ปุ่มกลับหน้า Game */}
      <button className="back-button" onClick={() => navigate("/game")}>
        กลับหน้า Game
      </button>
      <section className="section1">
        <div className="section_about">
          <h1>จัดทำโดย</h1>

          <h2>66130662 หทัยรัตน์ เจนวิทยา</h2>
          <p>คณะวิศวกรรมคอมพิวเตอร์</p>
          <p>สาขาวิศวกรรมคอมพิวเตอร์</p>

          <p>วิทยาลัยวิศวกรรมศาสตร์และเทคโนโลยี มหาวิทยาลัยธุรกิจบัณฑิตย์</p>
          <img
            src={student}
            alt="student"
            className="student"
            style={{ width: "300px", height: "auto" }}
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
