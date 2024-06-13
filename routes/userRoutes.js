// routes/userRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController');
const authenticateJWT = require('../middlewares/authenticateJWT.js');
const { get_data, getWardData } = require('../services/getDataFromWardTable.js'); // เพิ่มบรรทัดนี

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', authenticateJWT, (req, res) => {
    res.send('This is a protected route');
});

// router.get('/ms_ward', async (req, res) => {
//     try {
//         const data = await getdata();
//         res.json(data);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Failed to fetch data from ms_ward table');
//     }
// });

router.get('/ms_ward', get_data);

// เส้นทางที่ถูกต้องสำหรับ getWardData
router.get('/getWardData', getWardData);

module.exports = router;

