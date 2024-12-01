import React from "react";
import { useNavigate } from "react-router-dom"; // เพิ่มการนำเข้า useNavigate
import "./Rules.css";
import backgroundImage from "../assets/images/Test4.jpg";

const Rules: React.FC = () => {
  const navigate = useNavigate(); // ใช้ useNavigate เพื่อจัดการการนำทาง

  return (
    <div
      className="rules-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <section className="section">
        <h1>วิธีการเล่นและกติกา</h1>
        <h2>1. การหมุนกาชาปอง</h2>
        <p>
          ผู้เล่นสามารถหมุนตู้กาชาปองเพื่อสุ่มได้หนึ่งครั้งต่อการเล่น
          ในแต่ละการหมุน จะมีโอกาสสุ่มได้โปเกมอนแบบต่างๆ
          ซึ่งมีระดับความหายากและโอกาสดรอปแตกต่างกัน ความหายากของการ์ดมี 3
          ระดับ: <strong>Common</strong>, <strong>Uncommon</strong>, และ{" "}
          <strong>Rare</strong>
        </p>

        <h2>2. อัตราการดรอป</h2>
        <ul>
          <li>
            <strong>Common</strong>: มีโอกาสได้ 60% ของการหมุน
          </li>
          <li>
            <strong>Uncommon</strong>: มีโอกาสได้ 30%
          </li>
          <li>
            <strong>Rare</strong>: มีโอกาสได้ 10%
          </li>
          <li>
            ทุกๆ การหมุนครั้งที่ 6 จะการันตีได้การ์ดระดับ <strong>Rare</strong>{" "}
            หนึ่งใบ
          </li>
        </ul>

        <h2>3. การสะสมการ์ด</h2>
        <p>
          ผู้เล่นสามารถสะสมโปเกมอนในคอลเล็กชันของตนเอง
          การ์ดที่ได้จะถูกเก็บไว้ในคอลเล็กชันโดยอัตโนมัติ
          หากผู้เล่นได้โปเกมอนที่มีอยู่ในคอลเล็กชันแล้ว ระบบจะเพิ่มค่าพลัง
          <strong> power_up_points</strong> ของโปเกมอนตัวนั้น
          แทนที่จะเพิ่มการ์ดซ้ำใหม่
        </p>

        <h2>4. การจัดการคอลเล็กชัน</h2>
        <p>
          ผู้เล่นสามารถเข้าไปดูคอลเล็กชันโปเกมอนของตนเองเพื่อดูว่าได้การ์ดอะไรบ้าง
          และสามารถตรวจสอบข้อมูลการ์ด เช่น ชื่อ, ประเภท, รูปภาพ และค่าพลังสะสม
        </p>
      </section>

      {/* ปุ่มกลับหน้า Game */}
      <button className="back-button" onClick={() => navigate("/game")}>
        กลับหน้า Game
      </button>
    </div>
  );
};

export default Rules;
