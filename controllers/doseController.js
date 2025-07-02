const doseModel = require("../models/doseModal");

exports.getSearch = async (req, res) => {
  const { chkKeydrug, txtorderitemname } = req.query;

  let condition = "";
  let rs = "";
  const isKeydrug = chkKeydrug === "true"; // ใช้ string เปรียบเทียบ
  const safeText = txtorderitemname?.replace(/'/g, "''"); // Escape single quotes
  try {
    if (isKeydrug) {
      if (txtorderitemname == null) {
        return;
      }
      if (txtorderitemname.length > 4) {
        condition = `\n where tmt.ActiveIngredient Like ' %${safeText}% ' Or (tmt.TPUCode Like '%${safeText}%' Or tp2tpu.TPID Like '%${safeText}%' Or gp2tp.GPID Like '%${safeText}%' Or tmt.TradeName LIKE '%${safeText}%')`;
      } else {
        condition = `\n where tmt.ActiveIngredient Like ' ${safeText}% ' Or (tmt.TPUCode Like '${safeText}%' Or tp2tpu.TPID Like '${safeText}%' Or gp2tp.GPID Like '${safeText}%' Or tmt.TradeName LIKE '${safeText}%')`;
      }
      rs = await doseModel.getChkKeydrugSearch(condition);
    } else {
      if (txtorderitemname == null) {
        return;
      }
      if (txtorderitemname.length > 6) {
        condition = `where  dbo.ms_drug.unused = 'Y' And (dbo.ms_drugindex.drugindexname Like '%${safeText}%' OR dbo.ms_drug.orderitemTHname LIKE '%${safeText}%' OR dbo.ms_drug.orderitemENname LIKE '%${safeText}%')`;
      } else {
        condition = `where  dbo.ms_drug.unused = 'Y' And (dbo.ms_drugindex.drugindexname Like '${safeText}%' OR dbo.ms_drug.orderitemTHname LIKE '${safeText}%' OR dbo.ms_drug.orderitemENname LIKE '${safeText}%') OR (dbo.ms_drug.unused = 'Y' AND dbo.ms_drug.orderitemcode LIKE '${safeText}%' AND dbo.ms_drug.searchindex = 'Y')`;
      }
      rs = await doseModel.getSearch(condition);
    }
    res.status(200).json(rs);
  } catch (err) {
    console.error(`error : ${err}`);
    res.status(500).send(`error : ${err}`);
  }
};

exports.getDiluentname = async (req, res) => {
  const { txtdiluentname, diluentnameID } = req.query;
  try {
    let condition = "";
    let rs = "";
    condition = `Where dbo.ms_diluent.orderitemcode ='${diluentnameID}' AND dbo.ms_drug.unused = 'Y'`;
    rs = await doseModel.getDiluentItem(condition);

    if (!rs || rs.length <= 0) {
      const keyword = txtdiluentname.replaceAll("%", ""); // ลบ % ทั้งหมดก่อน

      condition =
        " WHERE (ms_drug.orderitemcode LIKE '" +
        keyword +
        "%' AND dbo.ms_drug.diluentstatus = 'Y' AND dbo.ms_drug.unused = 'Y')";

      condition +=
        " OR (dbo.ms_diluent.diluentorderitemcode LIKE '" +
        keyword +
        "%' AND dbo.ms_drug.unused = 'Y')";

      condition +=
        " OR (dbo.ms_diluent.diluentname LIKE '" +
        keyword +
        "%' AND dbo.ms_drug.unused = 'Y')";

      rs = await doseModel.getDiluentname(condition);
    }

    res.status(200).json(rs);
  } catch (err) {
    res.status(400).json(`err : ${err}`);
  }
};

exports.getDosageUnit = async (req, res) => {
  const { txtNameUnit } = req.query;
  try {
    let condition = "";
    let rs = "";
    condition = `WHERE DispensedUnitCd LIKE '${txtNameUnit}%' OR DispensedUnitTH LIKE '${txtNameUnit}%' OR DispensedUnitEN LIKE '${txtNameUnit}%' `;
    rs = await doseModel.getdosageunit(condition);
    res.status(200).json(rs);
  } catch (err) {
    res.status(400).json("Err : " + err);
  }
};
exports.getInstructionController = async (req, res) => {
  const { txtInstructionName } = req.query;
  try {
    let condition = "";
    let rs = "";
    condition = ` WHERE substring(InstructionCd,1,1) in ('${txtInstructionName}')`;
    condition += ` OR InstructionCd Like '${txtInstructionName}%'`;
    condition += ` OR InstructionNameTH Like '${txtInstructionName}%' `;
    condition += ` OR substring(InstructionNameTH,1,1) in ('${txtInstructionName}')`;
    rs = await doseModel.getInstructionModel(condition);
    res.status(200).json(rs);
  } catch (err) {
    res.status(400).json("Err : " + err);
  }
};
exports.getFrequencyController = async (req, res) => {
  const { txtFrequencycode } = req.query;
  try {
    let condition = "";
    let rs = "";
    condition = ` WHERE frequency_code Like '${txtFrequencycode}%'`;
    rs = await doseModel.getFrequencyModel(condition);
    res.status(200).json(rs);
  } catch (err) {
    res.status(400).json("Err : " + err);
  }
};

exports.getTimeCodeController = async (req, res) => {
  const { txttimecode } = req.query;
  try {
    let condition = "";
    let rs = "";
    condition = ` WHERE timecode Like '${txttimecode}%' OR substring(timecode,1,1) in ('${txttimecode}') OR timeTH Like '${txttimecode}' OR timeEN Like '${txttimecode}%'`;
    rs = await doseModel.getTimecodeModel(condition);
    res.status(200).json(rs);
  } catch (err) {
    res.status(400).json("Err : " + err);
  }
};

exports.getOrderUnitController = async (req, res) => {
  const { txtOrderUnit } = req.query;
  try {
    let condition = "";
    let rs = "";
    condition = ` WHERE DispensedTotalUnitCd Like '${txtOrderUnit}%' `;
    condition += ` OR substring(DispensedTotalUnitTH,1,1) in ('${txtOrderUnit}') `;
    condition += ` OR DispensedTotalUnitTH Like '${txtOrderUnit}%' `;
    condition += ` OR DispensedTotalUnitEN Like '${txtOrderUnit}%' `;
    rs = await doseModel.getOrderUnitModel(condition);
    res.status(200).json(rs);
  } catch (err) {
    res.status(400).json("Err : " + err);
  }
};

exports.getShearchDrugListController = async (req, res) => {
  const { txtSearch, showDataFunc, rdOpen, rdClose } = req.query;
  try {
    let condition = "";
    let rs = "";
    if (showDataFunc === "2") {
      condition = showDatamedisup(txtSearch, rdOpen, rdClose);
    } else if (showDataFunc === "1") {
      condition = showDatanonmedisup(txtSearch, rdOpen, rdClose);
    } else {
      condition = showData(txtSearch, rdOpen, rdClose);
    }
    rs = await doseModel.getShearchDrugListModel(condition);
    res.status(200).json(rs);
  } catch (err) {
    res.status(400).json(`Err : ${err}`);
  }
};
function showDatanonmedisup(txtSearch, rdOpen, rdClose) {
  let condition = "";
  if (!txtSearch) {
    if (rdOpen === "true") {
      condition =
        "where ISNULL(dbo.ms_drug.medicalsupplies, 0) <> 'Y' And dbo.ms_drug.unused = 'Y'";
    } else if (rdClose === "true") {
      condition =
        "where ISNULL(dbo.ms_drug.medicalsupplies, 0) <> 'Y' And dbo.ms_drug.unused = 'N'";
    } else {
      condition = "where ISNULL(dbo.ms_drug.medicalsupplies, 0) <> 'Y'";
    }
  } else {
    if (txtSearch.length > 4) {
      if (rdOpen === "true") {
        condition = `where ISNULL(dbo.ms_drug.medicalsupplies, 0) <> 'Y' And dbo.ms_drug.unused = 'Y' And (dbo.ms_drugindex.drugindexname Like '%${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '%${txtSearch}%')`;
      } else if (rdClose === "true") {
        condition = `where ISNULL(dbo.ms_drug.medicalsupplies, 0) <> 'Y' And dbo.ms_drug.unused = 'N' And (dbo.ms_drugindex.drugindexname Like '%${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '%${txtSearch}%')`;
      } else {
        condition = `where ISNULL(dbo.ms_drug.medicalsupplies, 0) <> 'Y' And (dbo.ms_drugindex.drugindexname Like '%${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '%${txtSearch}%')`;
      }
    } else {
      if (rdOpen === "true") {
        condition = `where ISNULL(dbo.ms_drug.medicalsupplies, 0) <> 'Y' And dbo.ms_drug.unused = 'Y' And (dbo.ms_drugindex.drugindexname Like '${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '${txtSearch}%')`;
      } else if (rdClose === "true") {
        condition = `where ISNULL(dbo.ms_drug.medicalsupplies, 0) <> 'Y' And dbo.ms_drug.unused = 'N' And (dbo.ms_drugindex.drugindexname Like '${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '${txtSearch}%')`;
      } else {
        condition = `where ISNULL(dbo.ms_drug.medicalsupplies, 0) <> 'Y' And (dbo.ms_drugindex.drugindexname Like '${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '${txtSearch}%')`;
      }
    }
  }
  return condition;
}
function showData(txtSearch, rdOpen, rdClose) {
  let condition = "";
  if (!txtSearch) {
    if (rdOpen === "true") {
      condition = "where dbo.ms_drug.unused = 'Y'";
    } else if (rdClose === "true") {
      condition = "where dbo.ms_drug.unused = 'N'";
    } else {
      condition = "";
    }
  } else {
    if (txtSearch.length > 4) {
      if (rdOpen === "true") {
        condition = `where dbo.ms_drug.unused = 'Y' And (dbo.ms_drugindex.drugindexname Like '%${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '%${txtSearch}%')`;
      } else if (rdClose === "true") {
        condition = `where dbo.ms_drug.unused = 'N' And (dbo.ms_drugindex.drugindexname Like '%${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '%${txtSearch}%')`;
      } else {
        condition = `where dbo.ms_drugindex.drugindexname Like '%${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '%${txtSearch}%')`;
      }
    } else {
      if (rdOpen === "true") {
        condition = `where dbo.ms_drug.unused = 'Y' And (dbo.ms_drugindex.drugindexname Like '${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '${txtSearch}%')`;
      } else if (rdClose === "true") {
        condition = `where dbo.ms_drug.unused = 'N' And (dbo.ms_drugindex.drugindexname Like '${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '${txtSearch}%')`;
      } else {
        condition = `where dbo.ms_drugindex.drugindexname Like '${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '${txtSearch}%')`;
      }
    }
  }
  return condition;
}
function showDatamedisup(txtSearch, rdOpen, rdClose) {
  let condition = "";
  if (!txtSearch) {
    if (rdOpen === "true") {
      condition =
        "where dbo.ms_drug.medicalsupplies = 'Y' And dbo.ms_drug.unused = 'Y'";
    } else if (rdClose === "true") {
      condition =
        "where dbo.ms_drug.medicalsupplies = 'Y' And dbo.ms_drug.unused = 'N'";
    } else {
      console.log(`open = ${rdOpen} ,close = ${rdClose}`);
      condition = "where dbo.ms_drug.medicalsupplies = 'Y'";
    }
  } else {
    if (txtSearch.length > 4) {
      if (rdOpen === "true") {
        condition = `where dbo.ms_drug.medicalsupplies = 'Y' And dbo.ms_drug.unused = 'Y' And (dbo.ms_drugindex.drugindexname Like '%${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '%${txtSearch}%')`;
      } else if (rdClose === "true") {
        condition = `where dbo.ms_drug.medicalsupplies = 'Y' And dbo.ms_drug.unused = 'N' And (dbo.ms_drugindex.drugindexname Like '%${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '%${txtSearch}%')`;
      } else {
        condition = `where dbo.ms_drug.medicalsupplies = 'Y' And (dbo.ms_drugindex.drugindexname Like '%${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '%${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '%${txtSearch}%')`;
      }
    } else {
      if (rdOpen === "true") {
        condition = `where dbo.ms_drug.medicalsupplies = 'Y' And dbo.ms_drug.unused = 'Y' And (dbo.ms_drugindex.drugindexname Like '${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '${txtSearch}%')`;
      } else if (rdClose === "true") {
        condition = `where dbo.ms_drug.medicalsupplies = 'Y' And dbo.ms_drug.unused = 'N' And (dbo.ms_drugindex.drugindexname Like '${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '${txtSearch}%')`;
      } else {
        condition = `where dbo.ms_drug.medicalsupplies = 'Y' And (dbo.ms_drugindex.drugindexname Like '${txtSearch}%' OR dbo.ms_drug.orderitemcode LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemTHname LIKE '${txtSearch}%' OR dbo.ms_drug.orderitemENname LIKE '${txtSearch}%')`;
      }
    }
  }
  return condition;
}

exports.getDrugByIdController = async (req, res) => {
  const { drugId } = req.query;
  try {
    let condition = "";
    let rs = "";
    condition = ` WHERE dbo.ms_drug.orderitemcode =  '${drugId}' `;
    rs = await doseModel.getDrugByIdModel(condition);
    res.status(200).json(rs["recordsets"]);
  } catch (err) {
    res.status(400).json("Err : " + err);
  }
};

exports.dtdosageunit = async (req, res) => {
  const { txtOrderUnit } = req.query;
  try {
    let condition = "";
    let rs = "";
    condition = ` WHERE DispensedUnitCd = '${txtOrderUnit}' `;

    rs = await doseModel.getdosageunit(condition);
    res.status(200).json(rs.recordsets);
  } catch (err) {
    res.status(400).json("Err : " + err);
  }
};
exports.dtOrderUnitController = async (req, res) => {
  const { txtOrderUnit } = req.query;
  try {
    let condition = "";
    let rs = "";
     condition = ` WHERE DispensedTotalUnitCd = '${txtOrderUnit}' `;
    rs = await doseModel.getOrderUnitModel(condition);
    res.status(200).json(rs);
  } catch (err) {
    res.status(400).json("Err : " + err);
  }
};