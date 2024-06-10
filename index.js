const sql = require('mssql');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // เพิ่มการเรียกใช้งาน middleware CORS ที่นี่

const app = express();

// กำหนดค่าการเชื่อมต่อ
const config = {
    user: 'sa', // ชื่อผู้ใช้งาน SQL Server
    password: '1234', // รหัสผ่าน
    server: '10.1.10.65', // ชื่อเซิร์ฟเวอร์หรือ IP Address
    database: 'MYdata', // ชื่อฐานข้อมูล
    options: {
        encrypt: true, // ใช้การเข้ารหัสการเชื่อมต่อ (สำหรับ Azure)
        trustServerCertificate: true // ใช้หากคุณเชื่อมต่อกับเซิร์ฟเวอร์ที่มี self-signed certificate
    }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

pool.on('error', err => {
    console.error('SQL Pool Error:', err);
});

// Secret key สำหรับ JWT
const JWT_SECRET = 'your_jwt_secret_key';

app.use(bodyParser.json());
app.use(cors()); // เรียกใช้ middleware CORS ที่นี่


app.post('/register', async (req, res) => {
    try {
        await poolConnect; // รอให้การเชื่อมต่อเปิด
        const { name, f_name, l_name, position, Department, Room, Username, Password, confirmPassword } = req.body;

        if (!name || !f_name || !l_name || !position || !Department || !Room || !Username || !Password || !confirmPassword) {
            res.status(400).send('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if (Password !== confirmPassword) {
            res.status(400).send('รหัสผ่านไม่ตรงกัน');
            return;
        }

        const request = pool.request();
        request.input('Username', sql.NVarChar, Username);
        const result = await request.query('SELECT * FROM users WHERE Username = @Username');

        if (result.recordset.length > 0) {
            res.status(409).send('ชื่อผู้ใช้นี้ถูกใช้งานแล้ว');
            return;
        }

        const insertUserQuery = 'INSERT INTO users (name, f_name, l_name, position, Department, Room, Username, Password) VALUES (@name, @f_name, @l_name, @position, @Department, @Room, @Username, @Password)';
        request.input('name', sql.NVarChar, name);
        request.input('f_name', sql.NVarChar, f_name);
        request.input('l_name', sql.NVarChar, l_name);
        request.input('position', sql.NVarChar, position);
        request.input('Department', sql.NVarChar, Department);
        request.input('Room', sql.NVarChar, Room);
        request.input('Password', sql.NVarChar, Password);
        await request.query(insertUserQuery);

        res.send('การลงทะเบียนสำเร็จ');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to register user');
    }
});

app.post('/login', async (req, res) => {
    try {
        await poolConnect; // รอให้การเชื่อมต่อเปิด
        const { Username, Password } = req.body;

        if (!Username || !Password) {
            res.status(400).send('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        const request = pool.request();
        request.input('Username', sql.NVarChar, Username);
        const result = await request.query('SELECT * FROM users WHERE Username = @Username');
        const user = result.recordset[0];

        if (user && Password === user.Password) {
            // สร้าง JWT token
            const token = jwt.sign({ userId: user.id, username: user.Username }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'เข้าสู่ระบบสำเร็จ', token: token });
        } else {
            res.status(401).send('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to login');
    }
});

// Middleware สำหรับตรวจสอบ JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).send('Access denied');
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }

        req.user = user;
        next();
    });
};

// ตัวอย่างการใช้งาน Middleware สำหรับ route ที่ต้องการการยืนยันตัวตน
app.get('/protected', authenticateJWT, (req, res) => {
    res.send('This is a protected route');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
