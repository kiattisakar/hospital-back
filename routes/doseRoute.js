const express = require("express");
const router = express.Router();
const doseController = require("../controllers/doseController");
//(url+/dose/.....)
//------------------------หน้า F5 คีย์ยา---------------------------------------------
router.get("/getDoseBySearch", doseController.getSearch); // ค้นหาชื่อยา ที่หน้าเพิ่มรายการยา [chkKeydrug ,txtorderitemname]
router.get("/getDiluentname", doseController.getDiluentname); // ค้นหาตัวทำละลาย { txtdiluentname, diluentnameID }
router.get("/getDoseUnit", doseController.getDosageUnit); // หน่วยของยา และหน่ยอของตัวทำละลาย { txtNameUnit }
router.get("/getInstruction", doseController.getInstructionController); // วิธีใช้ยา { txtInstructionName }
router.get("/getFrequency", doseController.getFrequencyController); // ความถี่ { txtFrequencycode }
router.get("/getTimeCode", doseController.getTimeCodeController); // เวลา { txttimecode }
router.get("/getOrderUnit", doseController.getOrderUnitController); // หน่วย { txtOrderUnit }

//---------------------------API ที่ใช้เยอะในการหาข้อมูลยาจากรหัส---------------------------------------
router.get("/getUnitByID", doseController.dtdosageunit); // หน่วย { txtOrderUnit }
router.get("/getOrderUnitByID", doseController.dtOrderUnitController); // หน่วย { txtOrderUnit }

//------------------------หน้า Setting จัดการข้อมูลยา----------------------------------
router.get(
  "/getSearchDoseManager",
  doseController.getShearchDrugListController
);
router.get("/getDrugById",doseController.getDrugByIdController) //ค้นหายาจากรหัส {drugID}
module.exports = router;
