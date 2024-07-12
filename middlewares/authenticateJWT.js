// // middlewares/authenticateJWT.js
// const jwt = require('jsonwebtoken');
// const JWT_SECRET = 'your_jwt_secret_key';

// const authenticateJWT = (req, res, next) => {
//     const authHeader = req.header('Authorization');
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//         return res.status(403).send('Access denied');
//     }

//     jwt.verify(token, JWT_SECRET, (err, user) => {
//         if (err) {
//             return res.status(403).send('Invalid token');
//         }

//         req.user = user;
//         next();
//     });
// };

// module.exports = authenticateJWT;

const jwt = require('jsonwebtoken');
const secretKey = 'your_jwt_secret_key'; // เปลี่ยนเป็น secret key ของคุณ

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = authenticateJWT;
