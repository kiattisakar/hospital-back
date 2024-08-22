// const sql = require("mssql");
// const dbConfig = require("../config/dbConfig"); // นำเข้าค่าการกำหนดค่าฐานข้อมูล
// const moment = require("moment");

// // ฟังก์ชันสำหรับการดึงข้อมูลจากฐานข้อมูล
// async function screentwo(req, res) {
//   const { wardcode } = req.body; // รับค่า wardcode, startDate, และ endDate จาก request body

//   // Get current time
//   const now = moment();

//   // Define start and end dates
//   let startDate;
//   let endDate;

//   if (now.hour() > 8 || (now.hour() === 8 && now.minute() > 0)) {
//     // Current time is after 08:00:00
//     startDate = now
//       .startOf("day")
//       .add(8, "hours")
//       .format("YYYY-MM-DD HH:mm:ss");
//     endDate = now
//       .startOf("day")
//       .add(1, "days")
//       .add(7, "hours")
//       .add(59, "minutes")
//       .format("YYYY-MM-DD HH:mm:ss");
//   } else {
//     // Current time is before or equal to 08:00:00
//     startDate = now
//       .startOf("day")
//       .subtract(1, "days")
//       .add(8, "hours")
//       .format("YYYY-MM-DD HH:mm:ss");
//     endDate = now
//       .startOf("day")
//       .add(7, "hours")
//       .add(59, "minutes")
//       .format("YYYY-MM-DD HH:mm:ss");
//   }

//   try {
//     await sql.connect(dbConfig); // เชื่อมต่อกับฐานข้อมูลโดยใช้ค่าการกำหนดที่ได้รับ

//     let query = `
//         SELECT
//     dbo.prescription.orderitemcode,
//     CONVERT(VARCHAR(10), dbo.prescription.ordercreatedate, 103) AS takedate,
//     dbo.prescription.prescriptionno,
//     dbo.prescription.hn,
//     dbo.prescription.an,
//     dbo.prescription.patientname,
//     dbo.prescription.wardcode,
//     dbo.prescription.wardname,
//     dbo.prescription.bedcode,
//     dbo.prescription.ordertype,
//     '' AS prioritycode,
//     FORMAT(dbo.prescription.genorderdatetime, 'yyyyMMdd') AS genorderdatetime,
//     dbo.prescription.fromlocationname
// FROM
//     dbo.prescription
// LEFT JOIN dbo.ms_ward ON dbo.prescription.wardcode = dbo.ms_ward.wardcode
// LEFT JOIN dbo.ms_drug ON dbo.prescription.orderitemcode = dbo.ms_drug.orderitemcode
// WHERE
//     dbo.prescription.genorderdatetime IS NULL
//     AND ISNULL(dbo.prescription.frequencycode, '') NOT IN ('S', 'E', 'STAT')
//     AND dbo.prescription.ordertype <> '1'
//     AND dbo.prescription.fromlocationname = 'ห้องยา IPD[001]'
//     ${wardcode ? `AND dbo.prescription.wardcode = @wardcode` : ""}
//     AND dbo.prescription.ordercreatedate BETWEEN '${startDate}' AND '${endDate}'
// GROUP BY
//     dbo.prescription.orderitemcode,
//     CONVERT(VARCHAR(10), dbo.prescription.ordercreatedate, 103),
//     dbo.prescription.prescriptionno,
//     dbo.prescription.hn,
//     dbo.prescription.an,
//     dbo.prescription.patientname,
//     dbo.prescription.wardcode,
//     dbo.prescription.wardname,
//     dbo.prescription.bedcode,
//     dbo.prescription.ordertype,
//     FORMAT(dbo.prescription.genorderdatetime, 'yyyyMMdd'),
//     dbo.prescription.fromlocationname
// ORDER BY
//     dbo.prescription.prescriptionno;
//         `;

//     const request = new sql.Request();
//     if (wardcode) {
//       request.input("wardcode", sql.VarChar, wardcode); // เพิ่มค่า wardcode เข้าไปใน request
//     }

//     const result = await request.query(query);

//     const finalResults = result.recordset.map((record) => {
//       const status = record.status ? "Screen แล้ว" : "รอ Screen"; // if else โง่ๆ

//       return {
//         takedate: record.takedate,
//         ordertype: record.ordertype,
//         prescriptionno: record.prescriptionno,
//         hn: record.hn,
//         an: record.an,
//         patientname: record.patientname,
//         wardcode: record.wardcode,
//         wardname: record.wardname,
//         bedcode: record.bedcode,
//         prioritycode: record.prioritycode,
//         genorderdatetime: record.genorderdatetime,
//         fromlocationname: record.fromlocationname,
//         status: status, // เพิ่มค่า gen ที่ตรวจสอบจาก genorderdatetime
//         orderitemcode: record.orderitemcode, // เพื่อให้ sccren3
//       };
//     });

//     res.status(200).json(finalResults);
//   } catch (err) {
//     console.error("SQL error", err);
//     res.status(500).send("Internal Server Error");
//   } finally {
//     await sql.close(); // ปิดการเชื่อมต่อเมื่อเสร็จสิ้น
//   }
// }

// module.exports = {
//   screentwo,
// };

const sql = require("mssql");
const dbConfig = require("../config/dbConfig"); // นำเข้าค่าการกำหนดค่าฐานข้อมูล
const moment = require("moment");

// ฟังก์ชันสำหรับการดึงข้อมูลจากฐานข้อมูล
async function screentwo(req, res) {
  const { wardcode, selectroom } = req.body; // รับค่า wardcode และ selectroom จาก request body

  // ตรวจสอบค่าที่รับมาจาก Frontend
  console.log("Received wardcode:", wardcode);
  console.log("Received selectroom:", selectroom);

  // Get current time
  const now = moment();

  // Define start and end dates
  let startDate;
  let endDate;

  if (now.hour() > 8 || (now.hour() === 8 && now.minute() > 0)) {
    // Current time is after 08:00:00
    startDate = now
      .startOf("day")
      .add(8, "hours")
      .format("YYYY-MM-DD HH:mm:ss");
    endDate = now
      .startOf("day")
      .add(1, "days")
      .add(7, "hours")
      .add(59, "minutes")
      .format("YYYY-MM-DD HH:mm:ss");
  } else {
    // Current time is before or equal to 08:00:00
    startDate = now
      .startOf("day")
      .subtract(1, "days")
      .add(8, "hours")
      .format("YYYY-MM-DD HH:mm:ss");
    endDate = now
      .startOf("day")
      .add(7, "hours")
      .add(59, "minutes")
      .format("YYYY-MM-DD HH:mm:ss");
  }

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
            ${
              selectroom
                ? `AND dbo.prescription.fromlocationname = @selectroom`
                : ""
            }
            ${wardcode ? `AND dbo.prescription.wardcode = @wardcode` : ""}
            AND dbo.prescription.ordercreatedate BETWEEN '${startDate}' AND '${endDate}'
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
    if (wardcode) {
      request.input("wardcode", sql.VarChar, wardcode); // เพิ่มค่า wardcode เข้าไปใน request
    }
    if (selectroom) {
      request.input("selectroom", sql.VarChar, selectroom); // เพิ่มค่า selectroom เข้าไปใน request
    }

    const result = await request.query(query);

    const finalResults = result.recordset.map((record) => {
      const status = record.status ? "Screen แล้ว" : "รอ Screen"; // if else โง่ๆ

      return {
        takedate: record.takedate,
        ordertype: record.ordertype,
        prescriptionno: record.prescriptionno,
        hn: record.hn,
        an: record.an,
        patientname: record.patientname,
        wardcode: record.wardcode,
        wardname: record.wardname,
        bedcode: record.bedcode,
        prioritycode: record.prioritycode,
        genorderdatetime: record.genorderdatetime,
        fromlocationname: record.fromlocationname,
        status: status, // เพิ่มค่า gen ที่ตรวจสอบจาก genorderdatetime
        orderitemcode: record.orderitemcode, // เพื่อให้ sc
      };
    });

    res.status(200).json(finalResults);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Internal Server Error");
  } finally {
    await sql.close(); // ปิดการเชื่อมต่อเมื่อเสร็จสิ้น
  }
}

module.exports = {
  screentwo,
};
