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
