# ใช้ Node.js base image
FROM node:16

# กำหนด working directory ใน container
WORKDIR /app

# ติดตั้ง Bun และเพิ่ม PATH
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# คัดลอกไฟล์ package.json และ bun.lockb (ถ้ามี)
COPY package.json bun.lockb* ./

# ติดตั้ง dependencies โดยใช้ Bun
RUN bun install

# คัดลอกไฟล์ทั้งหมดในโฟลเดอร์ไปยัง container
COPY . .

# สร้าง build ของ Frontend
RUN bun run build

# เพิ่ม serve.json เพื่อสนับสนุน React Router
RUN echo '{ "rewrites": [ { "source": "**", "destination": "/index.html" } ] }' > build/serve.json

# ติดตั้ง serve โดยใช้ Bun (ลดการใช้ npm)
RUN bun add serve

# เปิดเผยพอร์ต 3001
EXPOSE 3000

# รัน Frontend server
CMD ["bun", "serve", "-s", "build", "-l", "3000"]
