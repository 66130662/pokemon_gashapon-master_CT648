-- ตารางผู้ใช้งาน
CREATE TABLE hj_user_id (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    pass VARCHAR(255) NOT NULL,
    consecutive_pulls INT DEFAULT 0
);

-- ตารางการสะสม Pokémon ของผู้เล่น
CREATE TABLE hj_user_pokemon (
    user_id INT REFERENCES hj_user_id(user_id),
    pokemon_id INT,
    power_up_points INT DEFAULT 0,
    PRIMARY KEY (user_id, pokemon_id)
);

-- เพิ่มข้อมูลผู้ใช้งานตัวอย่าง
INSERT INTO hj_user_id (user_name, pass)
VALUES 
    ('admin', '$2b$10$yVoMn2bV21OqqTe28twYbudOW49D4CzuD2w.0hYDQlCptYG6FIrZy');