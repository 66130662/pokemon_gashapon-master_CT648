# ใช้ Node.js version 18 เป็น base image
FROM node:18

# ตั้งค่า working directory ใน container
WORKDIR /app

# คัดลอกไฟล์ package.json และ bun.lockb (ถ้ามี)
COPY package*.json bun.lockb* ./

# ติดตั้ง bun
RUN curl -fsSL https://bun.sh/install | bash

# เพิ่ม bun ใน PATH
ENV PATH="/root/.bun/bin:$PATH"

# ติดตั้ง dependencies ด้วย bun
RUN bun install

# ติดตั้ง dotenv
RUN bun add dotenv

# ติดตั้ง axios
RUN bun add axios

# คัดลอกไฟล์ทั้งหมดไปยัง container
COPY . .

# เปิดพอร์ตที่เซิร์ฟเวอร์จะทำงาน (3001)
EXPOSE 3001

# รันเซิร์ฟเวอร์
CMD ["bun", "start"]
