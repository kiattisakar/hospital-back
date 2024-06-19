const sql = require('mssql');
const { pool, poolConnect } = require('../models/db');

async function first(req, res) {
    const { wardcode } = req.body; // รับค่า wardcode จากผู้ใช้หรือส่วนต่อประกอบที่จะต้องใช้ในคำสั่ง SQL ในการค้นหา
    const search = req.body.search || ''; // รับค่า search จากผู้ใช้หรือส่วนต่อประกอบที่จะต้องใช้ในคำสั่ง SQL ในการค้นหา
    const ptstatus = req.body.ptstatus || ''; // รับค่า ptstatus จากผู้ใช้หรือส่วนต่อประกอบที่จะต้องใช้ในคำสั่ง SQL ในการค้นหา

    try {
        await poolConnect; // รอการเชื่อมต่อกับฐานข้อมูล

        // คำสั่ง SQL สำหรับดึงข้อมูลที่ต้องการจากตาราง
        let query = `
        SELECT    
                dbo.ms_ward.wardcode,    
                ('[' + dbo.ms_ward.wardcode + '] ' + dbo.ms_ward.warddesc) as warddesc,     
                count(DISTINCT dbo.ms_patientadmit.an) As countadmit     
           FROM    
                dbo.ms_patient    
                Left Join dbo.ms_patientadmit ON dbo.ms_patient.hn = dbo.ms_patientadmit.hn     
                Left Join dbo.ms_bedmove ON dbo.ms_patientadmit.an = dbo.ms_bedmove.an     
                Left Join dbo.ms_ward ON dbo.ms_bedmove.towardcode = dbo.ms_ward.wardcode     
                Left Join dbo.ms_patientDischarge ON  dbo.ms_patientadmit.an = dbo.ms_patientDischarge.an And dbo.ms_patientadmit.hn = dbo.ms_patientDischarge.hn     
           WHERE   dbo.ms_bedmove.status = 0   
                And dbo.ms_ward.wardcode Not IN ('1420')   
                AND dbo.ms_patientadmit.DCdatetime is null 
           GROUP BY   
                dbo.ms_ward.wardcode,    
                ('[' + dbo.ms_ward.wardcode + '] ' + dbo.ms_ward.warddesc)    
                ORDER BY CONVERT(INT,ms_ward.wardcode) ASC
           `;

        // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
        const result = await pool.request()
            .input('wardcode', sql.NVarChar, wardcode)
            .query(query);

        // เตรียมข้อมูลในรูปแบบที่ต้องการ
        const finalResults = result.recordset.map(record => ({
            wardcode: record.wardcode,
            warddesc: record.warddesc,
            countadmit: record.countadmit
        }));

        res.status(200).json(finalResults); // ส่งผลลัพธ์กลับไปยังผู้เรียกใช้
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    first
};
