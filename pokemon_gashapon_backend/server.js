import express from "express";
import pkg from "pg";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config(); // โหลด environment variables
const app = express();
const port = 3001;
const { Pool } = pkg;

app.use(cors());
app.use(bodyParser.json());

const client = new Pool({
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT || "5432"),
});

// ฟังก์ชันเชื่อมต่อฐานข้อมูลพร้อม Retry Logic
const connectToDatabase = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      await client.connect();
      console.log("Connected to PostgreSQL");
      break;
    } catch (err) {
      console.error(
        "Database connection failed. Retrying in 5 seconds...",
        err
      );
      retries -= 1;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  if (retries === 0) {
    console.error("Failed to connect to the database after multiple retries.");
    process.exit(1);
  }
};
connectToDatabase();
// Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
client
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));

app.get("/", (req, res) => {
  res.send("Welcome to the Pokémon Battle API!");
});

// API สำหรับดึงข้อมูล Pokémon จาก API ภายนอก
app.get("/api/pokemon", async (req, res) => {
  try {
    const response = await axios.get("http://13.228.191.168:3001/api/pokemon");
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching Pokémon data from external API:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Pokémon data from external API",
    });
  }
});

// API สำหรับดึงภาพ Pokémon จาก API ภายนอก
app.get("/api/pic_poke", async (req, res) => {
  try {
    const pokemonName = req.query.pok_name;
    console.log(`Fetching image for Pokemon: ${pokemonName}`);

    const response = await axios.get(
      `http://13.228.191.168:3001/api/pic_poke?pok_name=${pokemonName}`,
      { timeout: 5000 } // เพิ่ม timeout
    );

    console.log(`Image response:`, response.data);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching Pokemon image:`, error);
    res.status(500).json({
      success: false,
      message: `Error fetching Pokemon image: ${error.message}`,
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { user_name, pass } = req.body;
    const sql = "SELECT * FROM hj_user_id WHERE user_name = $1";
    const result = await client.query(sql, [user_name]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(pass, user.pass);
      if (isMatch) {
        res.json({
          success: true,
          user_id: user.user_id,
          username: user.user_name,
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { user_name, pass } = req.body;

    const checkUserSql = "SELECT * FROM hj_user_id WHERE user_name = $1";
    const checkResult = await client.query(checkUserSql, [user_name]);

    if (checkResult.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    const insertSql =
      "INSERT INTO hj_user_id (user_name, pass, consecutive_pulls) VALUES ($1, $2, 0) RETURNING user_id";
    const insertResult = await client.query(insertSql, [
      user_name,
      hashedPassword,
    ]);

    if (insertResult.rows.length > 0) {
      const newUserId = insertResult.rows[0].user_id;
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user_id: newUserId,
      });
    } else {
      throw new Error("Failed to insert new user");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/user", async (req, res) => {
  try {
    const username = req.query.username;
    const sql =
      "SELECT user_id, consecutive_pulls FROM hj_user_id WHERE user_name = $1";
    const result = await client.query(sql, [username]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/random-pokemon", async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // เพิ่มจำนวนครั้งที่สุ่ม
    await client.query(
      "UPDATE hj_user_id SET consecutive_pulls = consecutive_pulls + 1 WHERE user_id = $1",
      [userId]
    );

    // ดึงจำนวนครั้งที่สุ่มปัจจุบัน
    const pullsResult = await client.query(
      "SELECT consecutive_pulls FROM hj_user_id WHERE user_id = $1",
      [userId]
    );

    if (pullsResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const consecutivePulls = pullsResult.rows[0].consecutive_pulls;

    // ดึงข้อมูล Pokemon จาก API
    const pokemonResponse = await axios.get(
      "http://13.228.191.168:3001/api/pokemon"
    );
    const allPokemon = pokemonResponse.data;

    let randomPokemon;

    // กำหนดให้ได้การ์ด rare ทุกๆ 6 ครั้ง
    if (consecutivePulls % 6 === 0) {
      const rarePokemon = allPokemon.filter(
        (pokemon) => pokemon.poke_type_card === "rare"
      );
      randomPokemon =
        rarePokemon[Math.floor(Math.random() * rarePokemon.length)];
      await client.query(
        "UPDATE hj_user_id SET consecutive_pulls = 0 WHERE user_id = $1",
        [userId]
      );
      console.log("Rare card obtained, consecutive pulls reset.");
    } else {
      // ลอจิกสำหรับการสุ่มการ์ดทั่วไป
      const commonUncommonPokemon = allPokemon.filter(
        (pokemon) => pokemon.poke_type_card !== "rare"
      );
      randomPokemon =
        commonUncommonPokemon[
          Math.floor(Math.random() * commonUncommonPokemon.length)
        ];
    }

    if (!randomPokemon) {
      return res.status(404).json({ error: "No Pokemon found" });
    }

    // ดึงรูปภาพของโปเกมอนและแปลงเป็น base64
    try {
      const imageResponse = await axios.get(
        `http://13.228.191.168:3001/api/pic_poke?pok_name=${randomPokemon.pok_name.trim()}`
      );
      if (imageResponse.data) {
        // ตรวจสอบว่าข้อมูลรูปภาพอยู่ในรูปแบบใด
        if (typeof imageResponse.data === "string") {
          // ถ้าเป็น string ให้ใช้โดยตรง
          randomPokemon.image = imageResponse.data;
        } else if (imageResponse.data.pok_image) {
          // ถ้าเป็น object ที่มี pok_image
          randomPokemon.image = imageResponse.data.pok_image;
        } else {
          randomPokemon.image = null;
          console.log(`No image found for Pokemon: ${randomPokemon.pok_name}`);
        }
      }
    } catch (error) {
      console.error(
        `Error fetching image for Pokemon ${randomPokemon.pok_name}:`,
        error
      );
      randomPokemon.image = null;
    }

    // ส่งข้อมูลกลับไปยัง front-end
    res.json({
      ...randomPokemon,
      consecutive_pulls: consecutivePulls,
    });
  } catch (error) {
    console.error("Error fetching random Pokemon:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.post("/api/update-history", async (req, res) => {
  try {
    const { user_id, result } = req.body;
    const updateSql = `UPDATE user_wl SET ${result} = ${result} + 1 WHERE user_id = $1`;
    await client.query(updateSql, [user_id]);
    res.json({ success: true, message: "History updated successfully" });
  } catch (error) {
    console.error("Error updating history:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/drop-rates", (req, res) => {
  const dropRates = {
    common: 70,
    uncommon: 20,
    rare: 10,
  };
  res.json(dropRates);
});

app.post("/api/duplicate-pokemon", async (req, res) => {
  try {
    const { userId, pokemonId } = req.body;

    // ดึงข้อมูล Pokemon จาก API ภายนอกเพื่อตรวจสอบว่า Pokemon นี้มีอยู่จริง
    const pokemonResponse = await axios.get(
      "http://13.228.191.168:3001/api/pokemon"
    );
    const pokemon = pokemonResponse.data.find((p) => p.pok_id === pokemonId);

    if (!pokemon) {
      return res.status(404).json({ error: "Pokemon not found" });
    }

    // ตรวจสอบว่าผู้ใช้มี Pokemon นี้แล้วหรือไม่
    const checkResult = await client.query(
      "SELECT * FROM hj_user_pokemon WHERE user_id = $1 AND pokemon_id = $2",
      [userId, pokemonId]
    );

    if (checkResult.rows.length > 0) {
      // กรณีมี Pokemon อยู่แล้ว เพิ่ม power-up points
      await client.query(
        "UPDATE hj_user_pokemon SET power_up_points = power_up_points + 1 WHERE user_id = $1 AND pokemon_id = $2",
        [userId, pokemonId]
      );
      res.json({
        success: true,
        message: "Duplicate Pokemon. Power-up points added.",
        pokemon: pokemon,
      });
    } else {
      // กรณียังไม่มี Pokemon เพิ่มใหม่
      await client.query(
        "INSERT INTO hj_user_pokemon (user_id, pokemon_id, power_up_points) VALUES ($1, $2, 0)",
        [userId, pokemonId]
      );
      res.json({
        success: true,
        message: "New Pokemon added to collection.",
        pokemon: pokemon,
      });
    }
  } catch (error) {
    console.error("Error handling duplicate Pokemon:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
});

//ดึง collection ของผู้เล่น
app.get("/api/user-collection", async (req, res) => {
  try {
    const userId = req.query.user_id;

    // ดึงข้อมูล Pokemon ทั้งหมดจาก API ภายนอก
    const pokemonResponse = await axios.get(
      "http://13.228.191.168:3001/api/pokemon"
    );
    const allPokemon = pokemonResponse.data;

    // ดึงข้อมูล user_pokemon จากฐานข้อมูลของเรา
    const userPokemonResult = await client.query(
      "SELECT DISTINCT pokemon_id FROM hj_user_pokemon WHERE user_id = $1",
      [userId]
    );

    // สร้าง collection โดยจับคู่ข้อมูล
    const collection = await Promise.all(
      userPokemonResult.rows.map(async (userPokemon) => {
        // หา pokemon จากข้อมูลที่ดึงมาจาก API
        const pokemon = allPokemon.find(
          (p) => p.pok_id === userPokemon.pokemon_id
        );

        if (pokemon) {
          // ดึงรูปภาพจาก API ภายนอก
          const imageResponse = await axios.get(
            `http://13.228.191.168:3001/api/pic_poke?pok_name=${pokemon.pok_name.trim()}`
          );

          return {
            pok_name: pokemon.pok_name,
            poke_type_card: pokemon.poke_type_card,
            image: imageResponse.data || null,
          };
        }
        return null;
      })
    );

    // กรองเอาค่า null ออก
    const filteredCollection = collection.filter((item) => item !== null);

    res.json(filteredCollection);
  } catch (error) {
    console.error("Error fetching user collection:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/user-pokemon-points", async (req, res) => {
  try {
    const { user_id, pokemon_id } = req.query;
    const sql =
      "SELECT power_up_points FROM hj_user_pokemon WHERE user_id = $1 AND pokemon_id = $2";
    const result = await client.query(sql, [user_id, pokemon_id]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "No power-up points found" });
    }
  } catch (error) {
    console.error("Error fetching power-up points:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
