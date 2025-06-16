const express = require("express");
const router = express.Router();
const doseController = require("../controllers/doseController");
//(url+/dose/.....)
//------------------------หน้า F5 คีย์ยา---------------------------------------------
router.get("/getDoseBySearch", doseController.getSearch); // ค้นหาชื่อยา ที่หน้าเพิ่มรายการยา [chkKeydrug ,txtorderitemname]
router.get("/getDiluentname", doseController.getDiluentname); // ค้นหาตัวทำละลาย { txtdiluentname, diluentnameID }
router.get("/getDoseUnit", doseController.getDosageUnit); // หน่วยของยา และหน่ยอของตัวทำละลาย { txtNameUnit } ใช้ได้ทั้ง
router.get("/getInstruction", doseController.getInstructionController); // วิธีใช้ยา { txtInstructionName } ใช้ได้ทั้ง
router.get("/getFrequency", doseController.getFrequencyController); // ความถี่ { txtFrequencycode } ใช้ได้ทั้ง

module.exports = router;
