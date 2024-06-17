const sql = require('mssql');
const { pool, poolConnect } = require('../models/db');

// async function compare(req, res) {
//     const { wardcode } = req.body; // รับค่า wardcode จากผู้ใช้หรือส่วนต่อประกอบที่จะต้องใช้ในคำสั่ง SQL ในการค้นหา

//     try {
//         await poolConnect; // รอการเชื่อมต่อกับฐานข้อมูล

//         // คำสั่ง SQL สำหรับดึงข้อมูลที่ต้องการจากตาราง
//         const query = `
//             SELECT
//                 w.warddesc AS ตึก,
//                 p.patientnameTH AS ชื่อ,
//                 an.an AS an
//             FROM
//                 ms_ward w
//                 JOIN ms_bedmove an ON w.wardcode = an.fromwardcode
//                 JOIN ms_patientadmit pa ON an.an = pa.an
//                 JOIN ms_patient p ON pa.hn = p.hn
//             WHERE
//                 w.wardcode = @wardcode`;

//         // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
//         const result = await pool.request()
//             .input('wardcode', sql.NVarChar, wardcode)
//             .query(query);

//         res.status(200).json(result.recordset); // ส่งผลลัพธ์กลับไปยังผู้เรียกใช้
//     } catch (err) {
//         console.error('SQL error', err);
//         res.status(500).send('Internal Server Error');
//     }
// }

async function compare(req, res) {
    const { wardcode } = req.body; // รับค่า wardcode จากผู้ใช้หรือส่วนต่อประกอบที่จะต้องใช้ในคำสั่ง SQL ในการค้นหา

    try {
        await poolConnect; // รอการเชื่อมต่อกับฐานข้อมูล

        // คำสั่ง SQL สำหรับดึงข้อมูลที่ต้องการจากตาราง
        const query = `
            SELECT
                w.warddesc AS warddesc,
                p.patientnameTH AS patientnameTH,
                pa.an AS an,
                pa.admitteddate AS admitteddate,
                pa.hn AS hn
            FROM
                ms_ward w
                JOIN ms_bedmove bm ON w.wardcode = bm.fromwardcode
                JOIN ms_patientadmit pa ON bm.an = pa.an
                JOIN ms_patient p ON pa.hn = p.hn
                JOIN ms_patientDischarge pd ON pa.hn = pd.hn
            WHERE
                w.wardcode = @wardcode`;

        // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
        const result = await pool.request()
            .input('wardcode', sql.NVarChar, wardcode)
            .query(query);

        // เตรียมข้อมูลในรูปแบบที่ต้องการ
        const finalResults = result.recordset.map(record => ({
            "Admitdate Date": new Date(record.admitteddate).toLocaleDateString('th-TH', {
                year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
            }),
            hn: record.hn,
            an: record.an,
            patientnameTH: record.patientnameTH,
            warddesc: record.warddesc
        }));

        res.status(200).json(finalResults); // ส่งผลลัพธ์กลับไปยังผู้เรียกใช้
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = {
    compare
}
