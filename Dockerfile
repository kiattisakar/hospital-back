# # ใช้ Node.js runtime เป็นอิมเมจฐาน
# FROM node:16

# # ตั้งค่าไดเรกทอรีทำงานในคอนเทนเนอร์
# WORKDIR /app

# # คัดลอก package.json และ package-lock.json (หรือ yarn.lock) ก่อน
# COPY package*.json ./

# # ติดตั้งแพ็คเกจที่ต้องการ
# RUN npm install

# # คัดลอกโค้ดแอปพลิเคชันที่เหลือ
# COPY . .

# # เปิดพอร์ตที่แอปพลิเคชันใช้
# EXPOSE 3000

# # กำหนดคำสั่งในการรันแอปพลิเคชัน
# CMD ["node", "index.js"]


# ///

# ใช้ node เป็น base image
FROM node:18-alpine

WORKDIR /app

# คัดลอก package.json และติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอกโค้ด backend ทั้งหมด
COPY . .

# เปิดพอร์ต (สมมุติใช้ 3000)
EXPOSE 3000

# สั่งรันเซิร์ฟเวอร์
CMD ["node", "index.js"]


