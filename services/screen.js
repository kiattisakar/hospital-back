const sql = require('mssql');
const dbConfig = require('../config/dbConfig'); // นำเข้าค่าการกำหนดค่าฐานข้อมูล

// ฟังก์ชันสำหรับการดึงข้อมูลจากฐานข้อมูล
async function screen(req, res) {
    const { selectroom } = req.body; // ยังไม่ได้

    try {
        await sql.connect(dbConfig); // เชื่อมต่อกับฐานข้อมูลโดยใช้ค่าการกำหนดที่ได้รับ

        let query = `
        SELECT
            dbo.prescription.wardcode,
            dbo.prescription.wardname,
            COUNT(*) AS counpres
        FROM
            dbo.prescription
        WHERE 
            dbo.prescription.genorderdatetime Is NULL
            AND prescription.ordercreatedate BETWEEN '2024-06-28 08:00' AND '2024-06-29 07:59:00'
            AND ISNULL(dbo.prescription.frequencycode,'') NOT In ('S','E','STAT')
            AND dbo.prescription.ordertype <> '1'
            AND dbo.prescription.fromlocationname = 'ห้องยา IPD[001]'
            AND CONVERT(DATE, ordercreatedate) = CONVERT(DATE, GETDATE())
        GROUP BY
            dbo.prescription.wardcode,
            dbo.prescription.wardname
        ORDER BY
            CAST(dbo.prescription.wardcode AS INT) ASC;
        `;

        const result = await sql.query(query);

        const finalResults = result.recordset.map(record => ({
            wardcode: record.wardcode,
            wardname: `[ ${record.wardcode} ] ${record.wardname}`,
            // wardname: record.wardname,
            counpres: record.counpres
        }));

        res.status(200).json(finalResults);
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Internal Server Error');
    } finally {
        await sql.close(); // ปิดการเชื่อมต่อเมื่อเสร็จสิ้น
    }
}

module.exports = {
    screen
};


// const sql = require('mssql');
// const dbConfig = require('../config/dbConfig'); // นำเข้าค่าการกำหนดค่าฐานข้อมูล

// // ฟังก์ชันสำหรับการดึงข้อมูลจากฐานข้อมูล
// async function screen(req, res) {
//     const { wardcode } = req.body;

//     try {
//         await sql.connect(dbConfig); // เชื่อมต่อกับฐานข้อมูลโดยใช้ค่าการกำหนดที่ได้รับ

//         let query = `
//         SELECT
//             wardcode,
//             wardname,
//             COUNT(*) AS counpres
//         FROM
//             dbo.prescription
//         WHERE 
//             genorderdatetime IS NULL
//             AND ISNULL(frequencycode, '') NOT IN ('S', 'E', 'STAT')
//             AND dbo.prescription.ordertype <> '1'
//             AND dbo.prescription.fromlocationname = 'ห้องยา IPD[001]'
//             AND CONVERT(DATE, ordercreatedate) = CONVERT(DATE, GETDATE())
//         GROUP BY
//             wardcode,
//             wardname
//         ORDER BY
//             CAST(wardcode AS INT) ASC;
//         `;

//         const result = await sql.query(query);

//         const finalResults = result.recordset.map(record => ({
//             wardcode: record.wardcode,
//             wardname: record.wardname,
//             counpres: record.counpres
//         }));

//         res.status(200).json(finalResults);
//     } catch (err) {
//         console.error('SQL error', err);
//         res.status(500).send('Internal Server Error');
//     } finally {
//         await sql.close(); // ปิดการเชื่อมต่อเมื่อเสร็จสิ้น
//     }
// }
// module.exports = {
//     screen
// };


// SELECT
//      wardcode,
//      wardname,
//      COUNT(*) AS counpres
// FROM
//      dbo.prescription
//      WHERE 
//      genorderdatetime IS NULL
//      AND ISNULL(frequencycode, '') NOT IN ('S', 'E', 'STAT')
//      AND dbo.prescription.ordertype <> '1'
//      AND dbo.prescription.fromlocationname = 'ห้องยา IPD[001]'
//      AND CONVERT(DATE, ordercreatedate) = CONVERT(DATE, GETDATE())
// GROUP BY
//      wardcode,
//      wardname
// ORDER BY
//      CAST(wardcode AS INT) ASC;
