const sql = require('mssql');
const dbConfig = require('../config/dbConfig'); // นำเข้าค่าการกำหนดค่าฐานข้อมูล

// ฟังก์ชันสำหรับการดึงข้อมูลจากฐานข้อมูล
async function screentwo(req, res) {
    const { selectroom } = req.body; // รับค่า selectroom, startDate, และ endDate จาก request body

    try {
        await sql.connect(dbConfig); // เชื่อมต่อกับฐานข้อมูลโดยใช้ค่าการกำหนดที่ได้รับ

        let query = `
        SELECT     
            CONVERT(VARCHAR(10), dbo.prescription.ordercreatedate, 103) AS takedate,      
            dbo.prescription.prescriptionno,     
            dbo.prescription.hn,     
            dbo.prescription.an,     
            dbo.prescription.patientname,     
            dbo.prescription.wardcode,     
            dbo.prescription.wardname,     
            dbo.prescription.bedcode,     
            dbo.prescription.ordertype,     
            '' AS prioritycode,     
            FORMAT(dbo.prescription.genorderdatetime, 'yyyyMMdd') AS genorderdatetime,    
            dbo.prescription.fromlocationname    
        FROM     
            dbo.prescription     
        LEFT JOIN dbo.ms_ward ON dbo.prescription.wardcode = dbo.ms_ward.wardcode     
        LEFT JOIN dbo.ms_drug ON dbo.prescription.orderitemcode = dbo.ms_drug.orderitemcode     
        WHERE
            dbo.prescription.genorderdatetime IS NULL
            AND ISNULL(dbo.prescription.frequencycode, '') NOT IN ('S', 'E', 'STAT')
            AND dbo.prescription.ordertype <> '1'
            AND dbo.prescription.fromlocationname = 'ห้องยา IPD[001]'
            ${selectroom ? `AND dbo.prescription.wardcode = @selectroom` : ''}
            AND prescription.ordercreatedate BETWEEN '2024-06-28 08:00' AND '2024-06-29 07:59:00'

        GROUP BY     
            CONVERT(VARCHAR(10), dbo.prescription.ordercreatedate, 103),     
            dbo.prescription.prescriptionno,     
            dbo.prescription.hn,     
            dbo.prescription.an,     
            dbo.prescription.patientname,     
            dbo.prescription.wardcode,     
            dbo.prescription.wardname,     
            dbo.prescription.bedcode,     
            dbo.prescription.ordertype,     
            FORMAT(dbo.prescription.genorderdatetime, 'yyyyMMdd'),    
            dbo.prescription.fromlocationname    
        ORDER BY     
            dbo.prescription.prescriptionno;
        `;

        const request = new sql.Request();
        if (selectroom) {
            request.input('selectroom', sql.VarChar, selectroom); // เพิ่มค่า selectroom เข้าไปใน request
        }

        const result = await request.query(query);

        const finalResults = result.recordset.map(record => ({
            takedate: record.takedate,
            prescriptionno: record.prescriptionno,
            hn: record.hn,
            an: record.an,
            patientname: record.patientname,
            wardcode: record.wardcode,
            wardname: record.wardname,
            bedcode: record.bedcode,
            ordertype: record.ordertype,
            prioritycode: record.prioritycode,
            genorderdatetime: record.genorderdatetime,
            fromlocationname: record.fromlocationname
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
    screentwo
};
