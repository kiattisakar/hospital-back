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
