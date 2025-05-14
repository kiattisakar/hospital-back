// // ทดสอบเทส
// const medIPD = async (req, res) => {
//   await poolConnect;
//   const { an, roomType } = req.body; // รับ roomType จากฟรอนต์เอนด์
//   const moment = require("moment");
//   const now = moment();
//   let startDate, endDate, roomCondition;
//   let yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

//   try {
//     const request = pool.request();
//     request.input("an", sql.VarChar, an);

//     if (now.format("HHmm") >= 800 && now.format("HHmm") <= 2359) {
//       startDate = now
//         .startOf("day")
//         .add(8, "hours")
//         .format("YYYY-MM-DD HH:mm:ss");
//       endDate = now
//         .add(1, "days")
//         .startOf("day")
//         .add(7, "hours")
//         .add(59, "minutes")
//         .format("YYYY-MM-DD HH:mm:ss");
//     } else {
//       startDate = now
//         .subtract(1, "days")
//         .startOf("day")
//         .add(8, "hours")
//         .format("YYYY-MM-DD HH:mm:ss");
//       endDate = now
//         .startOf("day")
//         .add(7, "hours")
//         .add(59, "minutes")
//         .format("YYYY-MM-DD HH:mm:ss");
//     }

//     switch (roomType) {
//       case "IV":
//         roomCondition = "AND med.sendmix = 'Y'";
//         break;
//       case "Chemo":
//         roomCondition = "AND med.sendchemo = 'Y'";
//         break;
//       case "TPN":
//         roomCondition = "AND med.sendtpn = 'Y'";
//         break;
//       default:
//         roomCondition = ""; // สำหรับ IPD
//     }
//     const result = await request.query(
//       `
//       SELECT
//         null as dispensstatus,
//         med.meditemindex,
//         med.seq,
//         med.seqmax,
//         med.hn,
//         med.an,
//         med.prioritycode,
//         pr.prioritydesc,
//         med.takedate,
//         med.ordercreatedate,
//         med.orderitemcode,
//         med.orderitemname,
//         dg.orderitemENname,
//         dg.displaycolour,
//         convert(float, ISNULL(med.orderqty, 0)) As orderqty,
//         med.orderunitcode,
//         dou.DispensedTotalUnitTH,
//         med.instructioncode,
//         Ins.InstructionNameTH,
//         convert(float,ISNULL(med.dosage,0)) As dosage,
//         med.dosageunitcode,
//         dos.DispensedUnitTH,
//         med.frequencycode,
//         fc.frequency_nameTH,
//         ISNULL(fc.qty_per_day,0) As qty_per_day,
//         fc.frequency_onlydays,
//         fc.oddday,
//         med.timecode,
//         ft.timeTH,
//         med.timecount,
//         ISNULL(med.durationcode,'0') As durationcode,
//         med.usercreatecode,
//         us.fullname,
//         med.orderacceptfromip,
//         med.computername,
//         med.departmentcode,
//         med.itemlotcode,
//         med.itemlotexpire,
//         med.doctorcode,
//         med.doctorname,
//         med.freetext1,
//         med.freetext2,
//         med.lastmodified,
//         med.[language],
//         med.ordertype,
//         med.highalert,
//         med.shelfzone,
//         med.shelfname,
//         med.varymeal,
//         med.varymealtime,
//         med.voiddatetime,
//         convert(float,ISNULL(med.price,0)) As price,
//         convert(float,ISNULL(med.totalprice,0)) As totalprice,
//         med.sendmachine,
//         med.sendmix,
//         ISNULL(med.sendchemo,'N') As sendchemo,
//         ISNULL(med.sendtpn,'N') As sendtpn,
//         med.drugusagecode,
//         med.tmtcode,
//         med.startdate,
//         med.enddate,
//         med.offstatus,
//         med.groupdrug,
//         med.sendmixcode,
//         med.sendmixname,
//         convert(float,med.vol) as vol,
//         med.dosageunitforVol,
//         med.pricetype,
//         med.printstatus,
//         med.itemidentify,
//         med.printdrp,
//         convert(float,ISNULL(med.firstdose,0)) As firstdose,
//         med.diluentadd,
//         med.orderfrom,
//         med.holddatetime,
//         ISNULL(med.varymealstatus,'N') As varymealstatus,
//         med.freetext3,
//         med.odddatetime,
//         med.oddday as odd,
//         med.paytype,
//         ISNULL(med.firstdosestatus,'0') As firstdosestatus,
//         ISNULL(med.firsttimecount,1) As firsttimecount,
//         med.DIDcode,
//         ISNULL(med.continuestatus,'N') as continuestatus,
//         mer.meditemindex,
//         Case WHEN mer.meditemindex Is Not NULL THEN
//         'MRC'
//         Else '' END as MRC,
//         ISNULL(med.statustimeend,'N') As statustimeend,
//         med.timestart,
//         med.timeend,
//         med.odddatetime,
//         isnull(med.dosecal,0) as dosecal,
//         med.statuscal,
//         isnull(med.dayend,0) As dayend,
//         med.protocolcode
//         From
//         dbo.ms_medicationprofile med
//         Left Join dbo.ms_medicationrecconcile mer On mer.meditemindex = med.meditemindex
//         Left Join dbo.ms_dosageunit dos On med.dosageunitcode = dos.DispensedUnitCd
//         Left Join dbo.ms_orderunit  dou On med.orderunitcode = dou.DispensedTotalUnitCd
//         Left Join dbo.ms_frequency_code fc On med.frequencycode = fc.frequency_code
//         Left Join dbo.ms_time ft On med.timecode = ft.timecode
//         Left Join dbo.ms_Instruction Ins On med.instructioncode = Ins.InstructionCd
//         Left Join dbo.ms_priority pr On med.prioritycode = pr.prioritycode
//         Left Join dbo.ms_users us On us.userID = med.usercreatecode
//         Left Join dbo.ms_drug dg On dg.orderitemcode = med.orderitemcode
//           WHERE
//           (med.voiddatetime IS NULL OR med.voiddatetime BETWEEN '${startDate}' AND '${endDate}')
//           AND (med.enddate >= '${yesterday}' OR med.enddate IS NULL)
//           AND (med.ordercreatedate BETWEEN '${startDate}' AND '${endDate}'
//             OR med.prioritycode IN ('C', 'CS', 'H'))
//           ${roomCondition}
//           AND med.an = @an
//           ORDER BY med.voiddatetime ASC, med.prioritycode ASC, med.ordercreatedate ASC
//       `
//     );

//     res.status(200).json(result.recordset); // ส่งผลลัพธ์กลับไปยังผู้เรียกใช้ในรูปแบบ JSON
//   } catch (err) {
//     console.error("SQL error", err); // แสดงข้อผิดพลาดใน console
//     res.status(500).send("Server error"); // ส่งข้อผิดพลาดกลับไปยังผู้เรียกใช้
//   }
// };

// module.exports = {
//   medIPD,
// };

// อันที่กำลังใช้
// const { pool, poolConnect, sql } = require("../../models/db");

// const medIPD = async (req, res) => {
//   await poolConnect; // รอจนกระทั่งการเชื่อมต่อสำเร็จ
//   const { an, roomType } = req.body; // รับค่า an และ roomType จาก body ของ request
//   const moment = require("moment");
//   const now = moment();
//   let startDate, endDate, roomCondition;
//   let yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

//   try {
//     const request = pool.request(); // สร้างคำขอ SQL
//     request.input("an", sql.VarChar, an); // กำหนดค่า an ให้กับพารามิเตอร์ @an
//     console.log("Received roomType from Frontend:", roomType); // ตรวจสอบค่าที่ได้รับ

//     if (now.format("HHmm") >= 800 && now.format("HHmm") <= 2359) {
//       startDate = now
//         .startOf("day")
//         .add(8, "hours")
//         .format("YYYY-MM-DD HH:mm:ss");
//       endDate = now
//         .add(1, "days")
//         .startOf("day")
//         .add(7, "hours")
//         .add(59, "minutes")
//         .format("YYYY-MM-DD HH:mm:ss");
//     } else if (now.format("HHmm") >= 0 && now.format("HHmm") <= 759) {
//       startDate = now
//         .subtract(1, "days")
//         .startOf("day")
//         .add(8, "hours")
//         .format("YYYY-MM-DD HH:mm:ss");
//       endDate = now
//         .startOf("day")
//         .add(7, "hours")
//         .add(59, "minutes")
//         .format("YYYY-MM-DD HH:mm:ss");
//     }

//     if (process.env.NODE_ENV === "development") {
//       console.log("Start Date:", startDate);
//       console.log("End Date:", endDate);
//       console.log("Yesterday:", yesterday);
//     }

//     roomCondition =
//       {
//         IV: "AND med.sendmix = 'Y'",
//         Chemo: "AND med.sendchemo = 'Y'",
//         TPN: "AND med.sendtpn = 'Y'",
//       }[roomType] || ""; // Default to empty string if roomType is not defined

//     const result = await request.query(
//       `
//       SELECT
//         null as dispensstatus,
//         med.meditemindex,
//         med.seq,
//         med.seqmax,
//         med.hn,
//         med.an,
//         med.prioritycode,
//         pr.prioritydesc,
//         med.takedate,
//         med.ordercreatedate,
//         med.orderitemcode,
//         med.orderitemname,
//         dg.orderitemENname,
//         dg.displaycolour,
//         convert(float, ISNULL(med.orderqty, 0)) As orderqty,
//         med.orderunitcode,
//         dou.DispensedTotalUnitTH,
//         med.instructioncode,
//         Ins.InstructionNameTH,
//         convert(float,ISNULL(med.dosage,0)) As dosage,
//         med.dosageunitcode,
//         dos.DispensedUnitTH,
//         med.frequencycode,
//         fc.frequency_nameTH,
//         ISNULL(fc.qty_per_day,0) As qty_per_day,
//         fc.frequency_onlydays,
//         fc.oddday,
//         med.timecode,
//         ft.timeTH,
//         med.timecount,
//         ISNULL(med.durationcode,'0') As durationcode,
//         med.usercreatecode,
//         us.fullname,
//         med.orderacceptfromip,
//         med.computername,
//         med.departmentcode,
//         med.itemlotcode,
//         med.itemlotexpire,
//         med.doctorcode,
//         med.doctorname,
//         med.freetext1,
//         med.freetext2,
//         med.lastmodified,
//         med.[language],
//         med.ordertype,
//         med.highalert,
//         med.shelfzone,
//         med.shelfname,
//         med.varymeal,
//         med.varymealtime,
//         med.voiddatetime,
//         convert(float,ISNULL(med.price,0)) As price,
//         convert(float,ISNULL(med.totalprice,0)) As totalprice,
//         med.sendmachine,
//         med.sendmix,
//         ISNULL(med.sendchemo,'N') As sendchemo,
//         ISNULL(med.sendtpn,'N') As sendtpn,
//         med.drugusagecode,
//         med.tmtcode,
//         med.startdate,
//         med.enddate,
//         med.offstatus,
//         med.groupdrug,
//         med.sendmixcode,
//         med.sendmixname,
//         convert(float,med.vol) as vol,
//         med.dosageunitforVol,
//         med.pricetype,
//         med.printstatus,
//         med.itemidentify,
//         med.printdrp,
//         convert(float,ISNULL(med.firstdose,0)) As firstdose,
//         med.diluentadd,
//         med.orderfrom,
//         med.holddatetime,
//         ISNULL(med.varymealstatus,'N') As varymealstatus,
//         med.freetext3,
//         med.odddatetime,
//         med.oddday as odd,
//         med.paytype,
//         ISNULL(med.firstdosestatus,'0') As firstdosestatus,
//         ISNULL(med.firsttimecount,1) As firsttimecount,
//         med.DIDcode,
//         ISNULL(med.continuestatus,'N') as continuestatus,
//         mer.meditemindex,
//         Case WHEN mer.meditemindex Is Not NULL THEN
//         'MRC'
//         Else '' END as MRC,
//         ISNULL(med.statustimeend,'N') As statustimeend,
//         med.timestart,
//         med.timeend,
//         med.odddatetime,
//         isnull(med.dosecal,0) as dosecal,
//         med.statuscal,
//         isnull(med.dayend,0) As dayend,
//         med.protocolcode
//         From
//         dbo.ms_medicationprofile med
//         Left Join dbo.ms_medicationrecconcile mer On mer.meditemindex = med.meditemindex
//         Left Join dbo.ms_dosageunit dos On med.dosageunitcode = dos.DispensedUnitCd
//         Left Join dbo.ms_orderunit  dou On med.orderunitcode = dou.DispensedTotalUnitCd
//         Left Join dbo.ms_frequency_code fc On med.frequencycode = fc.frequency_code
//         Left Join dbo.ms_time ft On med.timecode = ft.timecode
//         Left Join dbo.ms_Instruction Ins On med.instructioncode = Ins.InstructionCd
//         Left Join dbo.ms_priority pr On med.prioritycode = pr.prioritycode
//         Left Join dbo.ms_users us On us.userID = med.usercreatecode
//         Left Join dbo.ms_drug dg On dg.orderitemcode = med.orderitemcode
//           WHERE
//           (med.voiddatetime IS NULL OR med.voiddatetime BETWEEN '${startDate}' AND '${endDate}')
//           AND (med.enddate >= '${yesterday}' OR med.enddate IS NULL)
//           AND (med.ordercreatedate BETWEEN '${startDate}' AND '${endDate}'
//             OR med.prioritycode IN ('C', 'CS', 'H'))
//           ${roomCondition}
//           AND med.an = @an
//           ORDER BY med.voiddatetime ASC, med.prioritycode ASC, med.ordercreatedate ASC
//       `
//     );
//     console.log("Response data sent to Frontend:", result.recordset);

//     res.status(200).json(result.recordset); // ส่งผลลัพธ์กลับไปยังผู้เรียกใช้ในรูปแบบ JSON
//   } catch (err) {
//     console.error("SQL error", err); // แสดงข้อผิดพลาดใน console
//     res.status(500).send("Server error"); // ส่งข้อผิดพลาดกลับไปยังผู้เรียกใช้
//     console.log("Received roomType from Frontend:", roomType);
//   }
// };

// module.exports = {
//   medIPD,
// };

const { pool, poolConnect, sql } = require("../../models/db");

const medIPD = async (req, res) => {
  await poolConnect;
  const { an, roomType } = req.body;
  console.log("Received from Frontend:", { an, roomType });

  const moment = require("moment");
  const now = moment();
  let startDate, endDate;
  let yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

  try {
    const request = pool.request();
    request.input("an", sql.VarChar, an);

    if (now.format("HHmm") >= 800 && now.format("HHmm") <= 2359) {
      startDate = now
        .startOf("day")
        .add(8, "hours")
        .format("YYYY-MM-DD HH:mm:ss");
      endDate = now
        .add(1, "days")
        .startOf("day")
        .add(7, "hours")
        .add(59, "minutes")
        .format("YYYY-MM-DD HH:mm:ss");
    } else {
      startDate = now
        .subtract(1, "days")
        .startOf("day")
        .add(8, "hours")
        .format("YYYY-MM-DD HH:mm:ss");
      endDate = now
        .startOf("day")
        .add(7, "hours")
        .add(59, "minutes")
        .format("YYYY-MM-DD HH:mm:ss");
    }

    const roomCondition =
      {
        IV: "AND med.sendmix = 'Y'",
        Chemo: "AND med.sendchemo = 'Y'",
        TPN: "AND med.sendtpn = 'Y'",
      }[roomType] || "";

    const result = await request.query(
      `      SELECT
        null as dispensstatus,
        med.meditemindex,
        med.seq,
        med.seqmax,
        med.hn,
        med.an,
        med.prioritycode,
        pr.prioritydesc,
        med.takedate,
        med.ordercreatedate,
        med.orderitemcode,
        med.orderitemname,
        dg.orderitemENname,
        dg.displaycolour,
        convert(float, ISNULL(med.orderqty, 0)) As orderqty,
        med.orderunitcode,
        dou.DispensedTotalUnitTH,
        med.instructioncode,
        Ins.InstructionNameTH,
        convert(float,ISNULL(med.dosage,0)) As dosage,
        med.dosageunitcode,
        dos.DispensedUnitTH,
        med.frequencycode,
        fc.frequency_nameTH,
        ISNULL(fc.qty_per_day,0) As qty_per_day,
        fc.frequency_onlydays,
        fc.oddday,
        med.timecode,
        ft.timeTH,
        med.timecount,
        ISNULL(med.durationcode,'0') As durationcode,
        med.usercreatecode,
        us.fullname,
        med.orderacceptfromip,
        med.computername,
        med.departmentcode,
        med.itemlotcode,
        med.itemlotexpire,
        med.doctorcode,
        med.doctorname,
        med.freetext1,
        med.freetext2,
        med.lastmodified,
        med.[language],
        med.ordertype,
        med.highalert,
        med.shelfzone,
        med.shelfname,
        med.varymeal,
        med.varymealtime,
        med.voiddatetime,
        convert(float,ISNULL(med.price,0)) As price,
        convert(float,ISNULL(med.totalprice,0)) As totalprice,
        med.sendmachine,
        med.sendmix,
        ISNULL(med.sendchemo,'N') As sendchemo,
        ISNULL(med.sendtpn,'N') As sendtpn,
        med.drugusagecode,
        med.tmtcode,
        med.startdate,
        med.enddate,
        med.offstatus,
        med.groupdrug,
        med.sendmixcode,
        med.sendmixname,
        convert(float,med.vol) as vol,
        med.dosageunitforVol,
        med.pricetype,
        med.printstatus,
        med.itemidentify,
        med.printdrp,
        convert(float,ISNULL(med.firstdose,0)) As firstdose,
        med.diluentadd,
        med.orderfrom,
        med.holddatetime,
        ISNULL(med.varymealstatus,'N') As varymealstatus,
        med.freetext3,
        med.odddatetime,
        med.oddday as odd,
        med.paytype,
        ISNULL(med.firstdosestatus,'0') As firstdosestatus,
        ISNULL(med.firsttimecount,1) As firsttimecount,
        med.DIDcode,
        ISNULL(med.continuestatus,'N') as continuestatus,
        mer.meditemindex,
        Case WHEN mer.meditemindex Is Not NULL THEN
        'MRC'
        Else '' END as MRC,
        ISNULL(med.statustimeend,'N') As statustimeend,
        med.timestart,
        med.timeend,
        med.odddatetime,
        isnull(med.dosecal,0) as dosecal,
        med.statuscal,
        isnull(med.dayend,0) As dayend,
        med.protocolcode
        From
        dbo.ms_medicationprofile med
        Left Join dbo.ms_medicationrecconcile mer On mer.meditemindex = med.meditemindex
        Left Join dbo.ms_dosageunit dos On med.dosageunitcode = dos.DispensedUnitCd
        Left Join dbo.ms_orderunit  dou On med.orderunitcode = dou.DispensedTotalUnitCd
        Left Join dbo.ms_frequency_code fc On med.frequencycode = fc.frequency_code
        Left Join dbo.ms_time ft On med.timecode = ft.timecode
        Left Join dbo.ms_Instruction Ins On med.instructioncode = Ins.InstructionCd
        Left Join dbo.ms_priority pr On med.prioritycode = pr.prioritycode
        Left Join dbo.ms_users us On us.userID = med.usercreatecode
        Left Join dbo.ms_drug dg On dg.orderitemcode = med.orderitemcode
          WHERE
          (med.voiddatetime IS NULL OR med.voiddatetime BETWEEN '${startDate}' AND '${endDate}')
          AND (med.enddate >= '${yesterday}' OR med.enddate IS NULL)
          AND (med.ordercreatedate BETWEEN '${startDate}' AND '${endDate}'
            OR med.prioritycode IN ('C', 'CS', 'H'))
          ${roomCondition}
          AND med.an = @an
          ORDER BY med.voiddatetime ASC, med.prioritycode ASC, med.ordercreatedate ASC`
    );

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Server error");
  }
};

module.exports = { medIPD };

// โคดเก่า
// const { pool, poolConnect, sql } = require("../../models/db");

// const medIPD = async (req, res) => {
//   await poolConnect; // รอจนกระทั่งการเชื่อมต่อสำเร็จ
//   const { an } = req.body; // รับค่า an จาก body ของ request
//   const moment = require("moment");
//   const now = moment();
//   let startDate, endDate, roomCondition;
//   let yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

//   try {
//     const request = pool.request(); // สร้างคำขอ SQL
//     request.input("an", sql.VarChar, an); // กำหนดค่า an ให้กับพารามิเตอร์ @an

//     if (now.format("HHmm") >= 800 && now.format("HHmm") <= 2359) {
//       startDate = now
//         .startOf("day")
//         .add(8, "hours")
//         .format("YYYY-MM-DD HH:mm:ss");
//       endDate = now
//         .add(1, "days")
//         .startOf("day")
//         .add(7, "hours")
//         .add(59, "minutes")
//         .format("YYYY-MM-DD HH:mm:ss");
//     } else if (now.format("HHmm") >= 0 && now.format("HHmm") <= 759) {
//       startDate = now
//         .subtract(1, "days")
//         .startOf("day")
//         .add(8, "hours")
//         .format("YYYY-MM-DD HH:mm:ss");
//       endDate = now
//         .startOf("day")
//         .add(7, "hours")
//         .add(59, "minutes")
//         .format("YYYY-MM-DD HH:mm:ss");
//     }
//     console.log("Start Date:", startDate);
//     console.log("End Date:", endDate);
//     console.log("Yesterday:", yesterday);

//     switch (roomType) {
//       case "IV":
//         roomCondition = "AND med.sendmix = 'Y'";
//         break;
//       case "Chemo":
//         roomCondition = "AND med.sendchemo = 'Y'";
//         break;
//       case "TPN":
//         roomCondition = "AND med.sendtpn = 'Y'";
//         break;
//       default:
//         roomCondition = ""; // Default condition for "IPD"
//     }

//     const result = await request.query(
//       `
//     SELECT
//         null as dispensstatus,
//         med.meditemindex,
//         med.seq,
//         med.seqmax,
//         med.hn,
//         med.an,
//         med.prioritycode,
//         pr.prioritydesc,
//         med.takedate,
//         med.ordercreatedate,
//         med.orderitemcode,
//         med.orderitemname,
//         dg.orderitemENname,
//         dg.displaycolour,
//         convert(float, ISNULL(med.orderqty, 0)) As orderqty,
//         med.orderunitcode,
//         dou.DispensedTotalUnitTH,
//         med.instructioncode,
//         Ins.InstructionNameTH,
//         convert(float,ISNULL(med.dosage,0)) As dosage,
//         med.dosageunitcode,
//         dos.DispensedUnitTH,
//         med.frequencycode,
//         fc.frequency_nameTH,
//         ISNULL(fc.qty_per_day,0) As qty_per_day,
//         fc.frequency_onlydays,
//         fc.oddday,
//         med.timecode,
//         ft.timeTH,
//         med.timecount,
//         ISNULL(med.durationcode,'0') As durationcode,
//         med.usercreatecode,
//         us.fullname,
//         med.orderacceptfromip,
//         med.computername,
//         med.departmentcode,
//         med.itemlotcode,
//         med.itemlotexpire,
//         med.doctorcode,
//         med.doctorname,
//         med.freetext1,
//         med.freetext2,
//         med.lastmodified,
//         med.[language],
//         med.ordertype,
//         med.highalert,
//         med.shelfzone,
//         med.shelfname,
//         med.varymeal,
//         med.varymealtime,
//         med.voiddatetime,
//         convert(float,ISNULL(med.price,0)) As price,
//         convert(float,ISNULL(med.totalprice,0)) As totalprice,
//         med.sendmachine,
//         med.sendmix,
//         ISNULL(med.sendchemo,'N') As sendchemo,
//         ISNULL(med.sendtpn,'N') As sendtpn,
//         med.drugusagecode,
//         med.tmtcode,
//         med.startdate,
//         med.enddate,
//         med.offstatus,
//         med.groupdrug,
//         med.sendmixcode,
//         med.sendmixname,
//         convert(float,med.vol) as vol,
//         med.dosageunitforVol,
//         med.pricetype,
//         med.printstatus,
//         med.itemidentify,
//         med.printdrp,
//         convert(float,ISNULL(med.firstdose,0)) As firstdose,
//         med.diluentadd,
//         med.orderfrom,
//         med.holddatetime,
//         ISNULL(med.varymealstatus,'N') As varymealstatus,
//         med.freetext3,
//         med.odddatetime,
//         med.oddday as odd,
//         med.paytype,
//         ISNULL(med.firstdosestatus,'0') As firstdosestatus,
//         ISNULL(med.firsttimecount,1) As firsttimecount,
//         med.DIDcode,
//         ISNULL(med.continuestatus,'N') as continuestatus,
//         mer.meditemindex,
//         Case WHEN mer.meditemindex Is Not NULL THEN
//         'MRC'
//         Else '' END as MRC,
//         ISNULL(med.statustimeend,'N') As statustimeend,
//         med.timestart,
//         med.timeend,
//         med.odddatetime,
//         isnull(med.dosecal,0) as dosecal,
//         med.statuscal,
//         isnull(med.dayend,0) As dayend,
//         med.protocolcode
//         From
//         dbo.ms_medicationprofile med
//         Left Join dbo.ms_medicationrecconcile mer On mer.meditemindex = med.meditemindex
//         Left Join dbo.ms_dosageunit dos On med.dosageunitcode = dos.DispensedUnitCd
//         Left Join dbo.ms_orderunit  dou On med.orderunitcode = dou.DispensedTotalUnitCd
//         Left Join dbo.ms_frequency_code fc On med.frequencycode = fc.frequency_code
//         Left Join dbo.ms_time ft On med.timecode = ft.timecode
//         Left Join dbo.ms_Instruction Ins On med.instructioncode = Ins.InstructionCd
//         Left Join dbo.ms_priority pr On med.prioritycode = pr.prioritycode
//         Left Join dbo.ms_users us On us.userID = med.usercreatecode
//         Left Join dbo.ms_drug dg On dg.orderitemcode = med.orderitemcode
//         WHERE (med.voiddatetime IS NULL OR med.voiddatetime
// 					between '${startDate}'
//           AND '${endDate}')
//           And (med.enddate >= '${yesterday}' or med.enddate IS NULL)
//           And (med.ordercreatedate between '${startDate}'
//           AND '${endDate}'
// 					OR med.prioritycode ='C' OR med.prioritycode ='CS' OR med.prioritycode ='H')
//           '${roomCondition}'
// 					And med.an = @an

//         ORDER BY med.voiddatetime ASC,
//         med.prioritycode ASC,
//         med.ordercreatedate ASC,
//         med.groupdrug Asc,
//         med.seq ASC

//     `
//     );

//     res.status(200).json(result.recordset); // ส่งผลลัพธ์กลับไปยังผู้เรียกใช้ในรูปแบบ JSON
//   } catch (err) {
//     console.error("SQL error", err); // แสดงข้อผิดพลาดใน console
//     res.status(500).send("Server error"); // ส่งข้อผิดพลาดกลับไปยังผู้เรียกใช้
//   }
// };

// module.exports = {
//   medIPD,
// };
