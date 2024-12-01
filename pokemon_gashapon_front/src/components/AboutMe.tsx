import React from "react";
import backgroundImage from "../assets/images/Test2.jpg";
import { useNavigate } from "react-router-dom";
import "./AboutMe.css";
import teacher from "../assets/images/teacher.png";
import student from "../assets/images/student.jpg";
import Logo from "../assets/images/Logo.png";
import Diagram from "../assets/images/Diagram.png";
import structure from "../assets/images/structure.png";
import Database from "../assets/images/Database.png";

const AboutMe: React.FC = () => {
  const navigate = useNavigate(); // ใช้ useNavigate เพื่อจัดการการนำทาง

  return (
    <div
      className="about-me-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <section className="section1">
        <div className="section_about">
          <img
            src={Logo}
            alt="Logo"
            className="Logo"
            style={{ width: "150px", height: "auto" }}
          />
          <h1>
            Welcome to Computer Engineering College of Engineering and
            Technology
          </h1>
          <h2>หลักสูตรวิศวกรรมศาสตรมหาบัณฑิต</h2>
          <p>สาขาวิชาวิศวกรรมคอมพิวเตอร์</p>

          <p>วิทยาลัยวิศวกรรมศาสตร์และเทคโนโลยี มหาวิทยาลัยธุรกิจบัณฑิตย์</p>
          <img
            src={teacher}
            alt="teacher"
            className="teacher"
            style={{ width: "200px", height: "auto" }}
          />
          <h3>ผู้ช่วยศาสตราจารย์ ดร.ชัยพร เขมะภาตะพันธ์</h3>
          <p>ผู้อำนวยการหลักสูตร</p>
          <p>สาขาวิชาวิศวกรรมคอมพิวเตอร์</p>
          <p>วิทยาลัยวิศวกรรมศาสตร์และเทคโนโลยี</p>
          <p>อาจารย์ที่ปรึกษา:</p>
          <a
            href="https://cite.dpu.ac.th/ResumeDean.html"
            target="_blank"
            rel="noopener noreferrer"
          ></a>
        </div>
      </section>

      <section className="section">
        <h1>About Me - CT648 Pokemon Gashapon</h1>
        <h2>
          1. หลักการพัฒนา ด้วย React TypeScript, Node.js Backend และ PostgreSQL
        </h2>
        <img
          src={Diagram}
          alt="Diagram"
          className="Diagram"
          style={{ width: "500px", height: "auto" }}
        />
        <p>โปรเจคถูกออกแบบมาประกอบด้วย 3 ส่วนหลัก:</p>
        <p>
          1. Frontend: พัฒนาด้วย React TypeScript เพื่อสร้าง UI
          ที่ตอบสนองและมีประสิทธิภาพ
        </p>
        <p>
          2. Backend: พัฒนาด้วย Node.js กับ Express เพื่อสร้าง RESTful API
          ที่รวดเร็วและมีประสิทธิภาพ
        </p>
        <p>
          3.Database: ใช้ PostgreSQL เพื่อจัดเก็บข้อมูลผู้ใช้,
          เก็บข้อมูลรูปภาพของโปเกมอน, เก็บข้อมูลพื้นฐานของโปเกมอน เช่น
          ชื่อและระดับความหายาก, เก็บข้อมูลโปเกมอนที่ผู้ใช้สะสมไว้
        </p>
      </section>

      <section className="section">
        <h2>2. API ที่สำคัญ</h2>
        <p>
          API ที่พัฒนาขึ้นครอบคลุมทั้งการจัดการข้อมูลผู้ใช้และการเล่นเกม ดังนี้:
        </p>

        <h3>2.1 API จัดการข้อมูลผู้ใช้</h3>
        <ul>
          <li>
            <strong>POST /api/register</strong> - ลงทะเบียนผู้ใช้ใหม่
            ตรวจสอบชื่อซ้ำ เข้ารหัสรหัสผ่านและส่ง user_id กลับหากสำเร็จ
          </li>
          <li>
            <strong>POST /api/login</strong> - ตรวจสอบชื่อผู้ใช้และรหัสผ่านด้วย
            bcrypt หากเข้าสู่ระบบสำเร็จ จะส่ง user_id และชื่อผู้ใช้กลับในรูปแบบ
            JSON
          </li>
          <li>
            <strong>GET /api/user_wl</strong> - ดึงข้อมูลชนะ/แพ้ของผู้ใช้
            สำหรับแสดงสถิติการเล่น
          </li>
          <li>
            <strong>POST /api/update-history</strong> -
            อัปเดตประวัติการชนะหรือแพ้ ในตาราง user_wl โดยใช้ user_id
            และผลการเล่น (win/loss)
          </li>
        </ul>

        <h3>2.2 API ที่เกี่ยวข้องกับเกมโปเกมอน</h3>
        <ul>
          <li>
            <strong>GET /api/pokemon</strong> -
            ดึงข้อมูลโปเกมอนทั้งหมดจากฐานข้อมูล สำหรับแสดงรายการโปเกมอน
          </li>
          <li>
            <strong>GET /api/pic_poke</strong> - รับ pok_name ใน query string
            เพื่อดึงรูปภาพของโปเกมอน
          </li>
        </ul>

        <h3>2.3 API การสุ่มและสะสมการ์ดโปเกมอน</h3>
        <ul>
          <li>
            <strong>GET /api/random-pokemon</strong> - สุ่มโปเกมอน
            อัปเดตจำนวนครั้งที่สุ่ม ทุก 6 ครั้งจะได้รับการ์ด rare
          </li>
          <li>
            <strong>GET /api/drop-rates</strong> -
            ส่งอัตราการดรอปการ์ดแต่ละระดับ (common, uncommon, rare) ในรูปแบบ
            JSON
          </li>
          <li>
            <strong>POST /api/duplicate-pokemon</strong> -
            ตรวจสอบการมีอยู่ของโปเกมอนในคอลเล็กชัน เพิ่มค่า power_up_points
            หากมีโปเกมอนซ้ำ
          </li>
        </ul>

        <h3>2.4 API สำหรับจัดการข้อมูลโปเกมอนที่สะสม</h3>
        <ul>
          <li>
            <strong>GET /api/user-collection</strong> -
            ดึงคอลเล็กชันโปเกมอนของผู้ใช้ทั้งหมด พร้อมรูปภาพ
          </li>
          <li>
            <strong>GET /api/user-pokemon-points</strong> - ดึงข้อมูล
            power_up_points ของโปเกมอนที่ผู้ใช้สะสมไว้
          </li>
        </ul>
      </section>
      <section className="section">
        <h2>3. การใช้งาน init.sql</h2>
        <p>
          ไฟล์ init.sql ใช้สำหรับการสร้างโครงสร้างฐานข้อมูลเริ่มต้น
          โดยมีการสร้างตารางดังนี้
        </p>
        <p>1. user_id: เก็บข้อมูลผู้ใช้งาน</p>
        <p>2. pokemon: ใช้สำหรับสุ่มและจัดการข้อมูลโปเกมอน เก็บข้อมูลโปเกมอน</p>
        <p>3. pic_poke: ภาพของ Pokemon</p>
        <p>4. user_pokemon:การสะสม Pokemon ของผู้เล่น collection</p>
        <p>5. user_wl: บันทึกจำนวนครั้งผู้เล่น</p>
        <p>
          ไฟล์นี้จะถูกรันอัตโนมัติเมื่อ Docker container สำหรับ PostgreSQL
          เริ่มทำงาน ทำให้ฐานข้อมูลพร้อมใช้งานทันทีหลังจาก deploy
        </p>
        <h2>โครงสร้าง Code</h2>
        <p>BreadcrumbsCT648_pokemon_gashapon-master</p>
        <img
          src={structure}
          alt="structure"
          className="structure"
          style={{ width: "300px", height: "auto" }}
        />
        <h4>Frontend</h4>
        <p>ใช้ React TypeScript</p>
        <p>ใช้ Axios สำหรับการเรียก API</p>
        <p>
          สร้าง Component ใช้ React Function Component (React.FC)
          พร้อมพารามิเตอร์ username และ onLogout ที่ส่งเข้ามาผ่าน props. ใช้
          State และ Effect Hooks เช่น useState, useEffect
          เพื่อจัดการข้อมูลและสถานะต่างๆ เช่น: isCracking: ตรวจสอบว่าไข่ Pokémon
          กำลังแตกหรือไม่ randomCard: เก็บข้อมูล Pokémon ที่สุ่มได้ dropRates:
          อัตราการดรอปของ Pokémon volume, isMuted: ควบคุมเสียงพื้นหลัง
        </p>
        <h4>Backend</h4>
        <p>ใช้ Express.js สำหรับสร้าง RESTful API</p>
        <p>เชื่อมต่อกับ PostgreSQL ผ่าน pg module</p>
        <p>ใช้ bcrypt สำหรับการเข้ารหัสรหัสผ่าน</p>
        <h4>Database</h4>
        <p>ใช้ PostgreSQL</p>
        <p>มีการสร้างตารางและความสัมพันธ์ตามที่กำหนดใน init.sql</p>
        <img
          src={Database}
          alt="Database"
          className="Database"
          style={{ width: "400px", height: "auto" }}
        />
        <h2>การทำงานของเกม</h2>
        <p>
          เริ่มเกม เมื่อผู้ใช้คลิกที่เครื่องกาชาปอง (handleMachineClick)
          จะเริ่มเกม และแสดงไข่ Pokémon
        </p>
        <p>
          สุ่ม Pokémon เมื่อคลิกที่ไข่ (handleEggClick): ดึงข้อมูล Pokémon ผ่าน
          API แสดงการ์ด Pokémon พร้อมสถิติต่างๆ (HP, Attack, Defense)
          เก็บประวัติ Pokémon ที่ได้รับไว้ใน history
        </p>
        <p>
          อัปเดตข้อมูล Pokémon ใช้ handlePokemonObtained เพื่อตรวจสอบว่า Pokémon
          ที่ได้รับซ้ำหรือไม่ และอัปเดต Power-up Points ผ่าน API
        </p>
        <h2>การพัฒนาเพิ่มเติม</h2>
        <p>หากต้องการพัฒนาหรือแก้ไขโค้ด</p>
        <p>สำหรับ Frontend: แก้ไขไฟล์ใน Folder pokemon_gashapon_front</p>
        <p>สำหรับ Backend: แก้ไขไฟล์ใน Folder pokemon_gashapon_backend</p>
        <p>
          สำหรับ Database: แก้ไขไฟล์ init.sql หรือปรับแต่งการเชื่อมต่อใน Backend
        </p>
        <h2>Credit Database </h2>
        <p>datasets</p>
        <p>
          https://www.kaggle.com/datasets/divyanshusingh369/complete-pokemon-library-32k-images-and-csv?resource=download
        </p>
      </section>

      <section className="section">
        <h2>4. วิธี Deploy</h2>
        <p>ข้อกำหนดเบื้องต้น</p>
        <p>Node.js (v18)</p>
        <p>Docker และ Docker Compose</p>
        <p>PostgreSQL</p>
        <p>Bun (สำหรับ Frontend)</p>
        <h3>4.1 นำโค้ดทั้งหมดขึ้น GitHub</h3>
        <p>
          โดยมีไฟล์ที่นี้มีบทบาทสำคัญในการ
          จัดการการทำงานและการรันโปรเจกต์ในสภาพแวดล้อมของ Docker ดังนี้
          Dockerfile (ทั้งใน Path ของ backend และ frontend)
        </p>
        <ul>
          <li>
            <strong>Dockerfile</strong> - กำหนดวิธีการสร้าง Docker image ของ
            backend และ frontend
            ทำให้แอปพลิเคชันแต่ละส่วนสามารถรันในสภาพแวดล้อมที่เหมือนกันทุกครั้ง
            ไม่ว่าจะรันที่ไหนก็ตาม
          </li>
          <li>
            <strong>docker-compose.yml</strong> -
            รวบรวมทุกบริการในไฟล์เดียวสำหรับการรันพร้อมกันทำให้การจัดการและการรันหลายบริการพร้อมกันง่ายขึ้น
            โดยสามารถใช้คำสั่งเดียวในการรันทั้งโปรเจกต์
          </li>
        </ul>

        <h3>4.2 Clone โปรเจกต์</h3>
        <p>
          เชื่อมต่อไปยังเซิร์ฟเวอร์ ใช้ SSH เพื่อเข้าถึงเซิร์ฟเวอร์ (เช่น AWS
          EC2)
        </p>
        <p>Clone โปรเจกต์จาก GitHub ลงเซิร์ฟเวอร์</p>
        <pre>
          git clone
          https://github.com/66130662/pokemon_gashapon-master_CT648.git
          <p>cd CT648_pokemon_gashapon/</p>
        </pre>

        <h3>4.3 Build และ Start Services</h3>
        <pre>sudo docker-compose up sudo docker-compose up --build -d</pre>

        <h3>4.4 เข้าใช้งาน</h3>
        <p>
          URL หรือ IP ของเซิร์ฟเวอร์:
          <br />
          Frontend: <a href="http://localhost:3000">http://localhost:3000</a>
          <br />
          Backend: <a href="http://localhost:3001">http://localhost:3001</a>
          <br />
          Example:{" "}
          <a href="http://13.215.67.233:3000/login">13.215.67.233:3000/login</a>
        </p>
      </section>

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

export default AboutMe;
