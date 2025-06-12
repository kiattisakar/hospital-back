const sql = require("mssql");
const dbConfig = require("../config/dbConfig");
const mysql = require("mysql2/promise");
exports.getSearch = async (condition) => {
  try {
    await sql.connect(dbConfig);

    const q = `
 Select
 dbo.ms_drug.orderitemcode, 
 dbo.ms_drug.orderitemTHname, 
 dbo.ms_drug.orderitemENname, 
 dbo.ms_drug.genericname, 
 ISNULL(dbo.ms_drug.sendmachine,'N') As sendmachine, 
 ISNULL(dbo.ms_drug.sendmix,'N') As sendmix, 
 dbo.ms_drug.instructioncode_ipd, 
 convert(float,ISNULL(dbo.ms_drug.dispensedose_ipd,0)) As dispensedose_ipd,  
 dbo.ms_drug.dosageunitcode_ipd, 
 dbo.ms_drug.frequencycode_ipd, 
 dbo.ms_drug.timecode_ipd, 
 dbo.ms_drug.instructioncode_opd, 
 convert(float,ISNULL(dbo.ms_drug.dispensedose_opd,0)) As dispensedose_opd, 
 dbo.ms_drug.dosageunitcode_opd, 
 dbo.ms_drug.frequencycode_opd, 
 dbo.ms_drug.timecode_opd, 
 convert(float,ISNULL(dbo.ms_drug.cost,0)) As cost,
 convert(float,ISNULL(dbo.ms_drug.IPDprice,0)) As IPDprice, 
 convert(float,ISNULL(dbo.ms_drug.OPDprice,0)) As OPDprice,  
 dbo.ms_drug.orderunitcode, 
 dbo.ms_orderunit.DispensedTotalUnitTH, 
 dbo.ms_drug.dosageunitcode, 
 dbo.ms_drug.diluentstatus, 
 CONVERT(FLOAT,ISNULL( dbo.ms_drug.capacity,0)) AS capacity,  
 dbo.ms_drug.capacity_unit, 
 dbo.ms_drug.pricedoseunitstatus, 
 dbo.ms_drug.priceunitstatus, 
 dbo.ms_drug.priceunittotalstatus, 
 dbo.ms_drug.paystatus, 
 dbo.ms_drug.displaycolour, 
 dbo.ms_drug.printstatus, 
 dbo.ms_drug.edned,
 ISNULL(dbo.ms_drug.continuestatus,'N') As continuestatus,
 dbo.ms_drug.DIDcode,
 dbo.ms_drug.fontBold
 FROM dbo.ms_drug
 LEFT JOIN dbo.ms_drugindex ON dbo.ms_drug.orderitemcode = dbo.ms_drugindex.orderitemcode
 LEFT JOIN dbo.ms_orderunit ON dbo.ms_orderunit.DispensedTotalUnitCd = dbo.ms_drug.orderunitcode
 ${condition} GROUP BY 
 dbo.ms_drug.orderitemcode, 
 dbo.ms_drug.orderitemTHname, 
 dbo.ms_drug.orderitemENname, 
 dbo.ms_drug.genericname, 
 dbo.ms_drug.sendmachine, 
 dbo.ms_drug.sendmix, 
 dbo.ms_drug.instructioncode_ipd, 
 dbo.ms_drug.dispensedose_ipd, 
 dbo.ms_drug.dosageunitcode_ipd, 
 dbo.ms_drug.frequencycode_ipd, 
 dbo.ms_drug.timecode_ipd, 
 dbo.ms_drug.instructioncode_opd, 
 dbo.ms_drug.dispensedose_opd, 
 dbo.ms_drug.dosageunitcode_opd, 
 dbo.ms_drug.frequencycode_opd, 
 dbo.ms_drug.timecode_opd, 
 dbo.ms_drug.cost, 
 dbo.ms_drug.IPDprice, 
 dbo.ms_drug.OPDprice, 
 dbo.ms_drug.orderunitcode, 
 dbo.ms_orderunit.DispensedTotalUnitTH, 
 dbo.ms_drug.dosageunitcode, 
 dbo.ms_drug.diluentstatus, 
 dbo.ms_drug.capacity, 
 dbo.ms_drug.capacity_unit, 
 dbo.ms_drug.pricedoseunitstatus, 
 dbo.ms_drug.priceunitstatus, 
 dbo.ms_drug.priceunittotalstatus, 
 dbo.ms_drug.paystatus, 
 dbo.ms_drug.displaycolour, 
 dbo.ms_drug.printstatus, 
 dbo.ms_drug.edned,
 dbo.ms_drug.continuestatus,
 dbo.ms_drug.DIDcode,
 dbo.ms_drug.fontBold
`;

    const request = new sql.Request();

    const result = await request.query(q);

    return result.recordset;
  } catch (err) {
    console.error(err);
    return err;
  }
};
exports.getChkKeydrugSearch = async (condition) => {
  const q = `SELECT TOP 10
  tmt.TPUCode, 
  gpu.GPUID,
  tp2tpu.TPID,
  gp2tp.GPID,
  tmt.ActiveIngredient, 
  tmt.Strength, 
  tmt.Dosageform,
  tmt.Contvalue,
  tmt.Contunit,
  tmt.DispUnit,
  tmt.TradeName,
  tmt.Manufacturer
FROM Unitdose.dbo.ms_mastertmt tmt
LEFT JOIN Unitdose.dbo.ms_mastergpu gpu ON gpu.TPUID = tmt.TPUCode 
LEFT JOIN Unitdose.dbo.ms_TPToTPU tp2tpu ON tp2tpu.TPUID = tmt.TPUCode
LEFT JOIN Unitdose.dbo.ms_GPtoTP gp2tp ON gp2tp.TPID = tp2tpu.TPID`;
  try {
    await sql.connect(dbConfig);
    const request = new sql.Request();
    const rs = await request.query(q + condition);
    return rs;
  } catch (err) {
    console.error(err);
  }
};

exports.getDiluentname = async (condition) => {
  const q = `
Select 
 '' AS orderitemcode, 
 dbo.ms_drug.orderitemcode, 
 CASE WHEN dbo.ms_diluent.diluentorderitemcode Is NULL THen 
 dbo.ms_drug.orderitemcode 
 Else 
 dbo.ms_diluent.diluentorderitemcode END as diluentorderitemcode, 
 CASE WHEN dbo.ms_diluent.diluentname Is NULL THen 
 dbo.ms_drug.orderitemTHname 
 Else 
 dbo.ms_diluent.diluentname End As diluentname, 
 '' As diluentstatus, 
 Case WHEN dbo.ms_diluent.vol Is NULL THen 
 dbo.ms_drug.capacity 
 Else 
 dbo.ms_diluent.vol End As vol, 
 '' AS seq, 
 Convert(float, ISNULL(dbo.ms_drug.cost, 0)) As cost, 
 Convert(float, ISNULL(dbo.ms_drug.IPDprice, 0)) As IPDprice, 
 Convert(float, ISNULL(dbo.ms_drug.OPDprice, 0)) As OPDprice, 
 ISNULL(dbo.ms_drug_tmt.tmtcode,'0') AS tmtcode  
 FROM 
 dbo.ms_drug 
 Left Join dbo.ms_diluent ON dbo.ms_diluent.diluentorderitemcode = dbo.ms_drug.orderitemcode 
 Left Join dbo.ms_drug_tmt On dbo.ms_drug.orderitemcode = dbo.ms_drug_tmt.orderitemcode 
 ${condition} 
 GROUP BY 
 dbo.ms_drug.orderitemcode, 
 dbo.ms_drug.orderitemTHname, 
 dbo.ms_drug.capacity, 
 dbo.ms_diluent.diluentorderitemcode, 
 dbo.ms_diluent.diluentname, 
 dbo.ms_diluent.vol, 
 dbo.ms_drug.cost, 
 dbo.ms_drug.IPDprice, 
 dbo.ms_drug.OPDprice, 
 dbo.ms_drug_tmt.tmtcode`;
  try {
    await sql.connect(dbConfig);
    const request = new sql.Request();
    
    const rs = await request.query(q );
    return rs;
  } catch (err) {
    console.error(err);
  }
};

exports.getDiluentItem = async (Id) => {
  const q = `
   Select   
          dbo.ms_diluent.orderitemcode,    
          dbo.ms_diluent.diluentorderitemcode,    
          dbo.ms_diluent.diluentname,    
          dbo.ms_drug.diluentstatus,    
          convert(float,dbo.ms_diluent.vol) As vol,    
          dbo.ms_diluent.seq,   
          convert(float,ISNULL(dbo.ms_drug.cost,0)) As cost,   
          convert(float,ISNULL(dbo.ms_drug.IPDprice,0)) As IPDprice,    
          convert(float,ISNULL(dbo.ms_drug.OPDprice,0)) As OPDprice,     
          ISNULL(dbo.ms_drug_tmt.tmtcode,'0') AS tmtcode    
          FROM   
          dbo.ms_diluent   
          Left JOIN dbo.ms_drug On dbo.ms_diluent.diluentorderitemcode = dbo.ms_drug.orderitemcode   
          Left Join dbo.ms_drug_tmt On dbo.ms_drug.orderitemcode = dbo.ms_drug_tmt.orderitemcode   
           Where dbo.ms_diluent.orderitemcode ='${Id}' AND dbo.ms_drug.unused = 'Y'
          GROUP BY   
          dbo.ms_diluent.orderitemcode,    
          dbo.ms_diluent.diluentorderitemcode,    
          dbo.ms_diluent.diluentname,    
          dbo.ms_drug.diluentstatus,    
          dbo.ms_diluent.vol,    
          dbo.ms_diluent.seq,    
          dbo.ms_drug.cost,    
          dbo.ms_drug.IPDprice,    
          dbo.ms_drug.OPDprice,     
          dbo.ms_drug_tmt.tmtcode    
          ORDER BY dbo.ms_diluent.seq `;
  try {
    await sql.connect(dbConfig);
    const request = new sql.Request();
  
    const rs = await request.query(q );
    return rs;
  } catch (err) {
    console.error(err);
  }
};
