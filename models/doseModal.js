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

    const rs = await request.query(q);
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

    const rs = await request.query(q);
    return rs;
  } catch (err) {
    console.error(err);
  }
};

exports.getdosageunit = async (condition) => {
  //หน่วยยา
  const q = `
   SELECT 
    dbo.ms_dosageunit.DispensedUnitCd, 
    dbo.ms_dosageunit.DispensedUnitTH,
    dbo.ms_dosageunit.DispensedUnitEN 
    FROM 
    dbo.ms_dosageunit
    ${condition}
  `;
  try {
    await sql.connect(dbConfig);
    const request = new sql.Request();

    const rs = await request.query(q);
    return rs;
  } catch (err) {
    console.error(err);
  }
};
exports.getInstructionModel = async (condition) => {
  //วิธีใช้
  const q = `
    Select  
    dbo.ms_Instruction.InstructionCd,  
    dbo.ms_Instruction.InstructionNameTH,  
    dbo.ms_Instruction.InstructionNameEN,  
    dbo.ms_Instruction.dose  
    FROM  
    dbo.ms_Instruction
    ${condition}
  `;
  try {
    await sql.connect(dbConfig);
    const request = new sql.Request();

    const rs = await request.query(q);
    return rs;
  } catch (err) {
    console.error(err);
  }
};

exports.getFrequencyModel = async (condition) => {
  //ความถี่
  const q = `
     Select    
          dbo.ms_frequency_code.frequency_code,    
          dbo.ms_frequency_code.frequency_nameTH,    
          dbo.ms_frequency_code.frequency_nameEN,    
          dbo.ms_frequency_code.qty_per_day,    
          dbo.ms_frequency_code.frequency_count,    
          dbo.ms_frequency_code.lastmodify,    
          dbo.ms_frequency_code.status,    
          dbo.ms_frequency_code.frequency_onlydays,    
          dbo.ms_frequency_code.oddday,    
          dbo.ms_frequency_code.EveryOtherDay,    
          dbo.ms_frequency_code.qty_per_day2    
          FROM    
          dbo.ms_frequency_code   
    ${condition}
  `;
  try {
    await sql.connect(dbConfig);
    const request = new sql.Request();

    const rs = await request.query(q);
    return rs;
  } catch (err) {
    console.error(err);
  }
};

exports.getTimecodeModel = async (condition) => {
  //เวลา
  const q = `
        Select 
          dbo.ms_time.timecode, 
          dbo.ms_time.timeTH, 
          dbo.ms_time.timeEN, 
          dbo.ms_time.timecount 
          FROM 
        dbo.ms_time
    ${condition}
  `;
  try {
    await sql.connect(dbConfig);
    const request = new sql.Request();

    const rs = await request.query(q);
    return rs;
  } catch (err) {
    console.error(err);
  }
};
exports.getOrderUnitModel = async (condition) => {
  //หน่วยจำนวนจ่าย
  const q = `
        Select 
           dbo.ms_orderunit.DispensedTotalUnitCd,  
           dbo.ms_orderunit.DispensedTotalUnitTH, 
           dbo.ms_orderunit.DispensedTotalUnitEN 
           FROM 
           dbo.ms_orderunit 
    ${condition}
  `;
  try {
    await sql.connect(dbConfig);
    const request = new sql.Request();

    const rs = await request.query(q);
    return rs;
  } catch (err) {
    console.error(err);
  }
};
exports.getShearchDrugListModel = async (condition) => {
  const q = `
              SELECT   
        dbo.ms_drug.orderitemcode,   
        dbo.ms_drug.orderitemTHname,   
        dbo.ms_drug.orderitemENname,   
        dbo.ms_drug.genericname,   
        ISNULL(dbo.ms_drug.unused,'N') As unused,   
        ISNULL(dbo.ms_drug.sendmachine,'N') As sendmachine,   
        ISNULL(dbo.ms_drug.sendmix,'N') As sendmix,   
        dbo.ms_drug.instructioncode_ipd,   
        ISNULL(dbo.ms_drug.dispensedose_ipd,0) As dispensedose_ipd,    
        dbo.ms_drug.dosageunitcode_ipd,   
        dbo.ms_drug.frequencycode_ipd,   
        dbo.ms_drug.timecode_ipd,   
        dbo.ms_drug.instructioncode_opd,   
        ISNULL(dbo.ms_drug.dispensedose_opd,0) As dispensedose_opd,   
        dbo.ms_drug.dosageunitcode_opd,   
        dbo.ms_drug.frequencycode_opd,   
        dbo.ms_drug.timecode_opd,   
        ISNULL(dbo.ms_drug.cost,0) As cost,  
        ISNULL(dbo.ms_drug.IPDprice,0) As IPDprice,   
        ISNULL(dbo.ms_drug.OPDprice,0) As OPDprice,    
        ISNULL(dbo.ms_drug.medicalsupplies,'N') As medicalsupplies,    
        dbo.ms_drug.capacity,   
        dbo.ms_drug.capacity_unit,  
        dbo.ms_drug.Inventorycode,  
        dbo.ms_drug.drugform,  
        'เลือก' as selectdrug  
        FROM  
        dbo.ms_drug  
        LEFT JOIN dbo.ms_drugindex ON   
        dbo.ms_drug.orderitemcode = dbo.ms_drugindex.orderitemcode  
					${condition}
        GROUP BY   
        dbo.ms_drug.orderitemcode,   
        dbo.ms_drug.orderitemTHname,   
        dbo.ms_drug.orderitemENname,   
        dbo.ms_drug.genericname,   
        dbo.ms_drug.unused,   
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
        dbo.ms_drug.medicalsupplies,   
        dbo.ms_drug.capacity,   
        dbo.ms_drug.capacity_unit,  
        dbo.ms_drug.Inventorycode,  
        dbo.ms_drug.drugform  
  `;
  try {
    await sql.connect(dbConfig);
    const request = new sql.Request();

    const rs = await request.query(q);
    return rs;
  } catch (err) {
    console.error(err);
  }
};
exports.getDrugByIdModel = async (condition) => {
  const q = `
          SELECT     
          dbo.ms_drug.orderitemcode,     
          dbo.ms_drug.orderitemTHname,     
          dbo.ms_drug.orderitemENname,     
          dbo.ms_drug.genericname,     
          ISNULL(dbo.ms_drug.unused,'N') AS unused,     
          dbo.ms_drug.barcode,     
          dbo.ms_drug.Strength,     
          dbo.ms_drug.dosageunitcode,     
          dbo.ms_drug.capacity,     
          dbo.ms_drug.capacity_unit,     
          dbo.ms_drug.capacity_orderunit,     
          dbo.ms_drug.orderunitcode,     
          dbo.ms_drug.description,     
          dbo.ms_drug.dateupdate,     
          dbo.ms_drug.locationcode,     
          dbo.ms_drug.highalert,     
          dbo.ms_drug.multidose,     
          dbo.ms_drug.shelfzone,     
          dbo.ms_drug.shelfname,     
          dbo.ms_drug.shelfzone2,     
          dbo.ms_drug.shelfname2,     
          ISNULL(dbo.ms_drug.edned,0) AS edned,     
          dbo.ms_drug.stdcode,     
          ISNULL(dbo.ms_drug.drugaccountcode,'ก') AS drugaccountcode,     
          dbo.ms_drug.dosegeform,     
          dbo.ms_drug.displaycolour,     
          dbo.ms_drug.DIDcode,     
          dbo.ms_drug.TMTcode,     
          dbo.ms_drug.GFMIScode,     
          dbo.ms_drug.GPOcode,     
          dbo.ms_drug.Inventorycode,     
          dbo.ms_drug.cost,     
          dbo.ms_drug.IPDprice,     
          dbo.ms_drug.OPDprice,     
          ISNULL(dbo.ms_drug.sendmachine,'N') AS sendmachine,     
          ISNULL(dbo.ms_drug.sendmix,'N') AS sendmix,     
          dbo.ms_drug.print_ipd_injection_sticker,     
          dbo.ms_drug.pharmacoindex,     
          dbo.ms_drug.pharmacoindexaddition1,     
          dbo.ms_drug.pharmacoindexaddition2,     
          dbo.ms_drug.pharmacoindexaddition3,     
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
          dbo.ms_drug.notify_text,     
          dbo.ms_drug.lactation_text,     
          dbo.ms_drug.pragnancy_text,     
          dbo.ms_drug.agestart,     
          dbo.ms_drug.ageend,     
          dbo.ms_drug.age_text,     
          dbo.ms_drug.spesification_text,     
          dbo.ms_drug.adverse_reaction_text,     
          dbo.ms_drug.contraindications_text,     
          dbo.ms_drug.precaution_text,     
          dbo.ms_drug.storage_text,     
          dbo.ms_drug.maxdoseperdose,     
          dbo.ms_drug.maxdoseperday,     
          dbo.ms_drug.maxduration,     
          dbo.ms_drug.mintimenextdose,     
          ISNULL(dbo.ms_drug.medicalsupplies,'N') AS medicalsupplies,     
          dbo.ms_drug.picname,     
          dbo.ms_drug.locationname1,           
          dbo.ms_drug.locationname2,           
          ISNULL(dbo.ms_drug.drugtype,'0') As drugtype,     
          dbo.ms_drug.pricedoseunitstatus,           
          dbo.ms_drug.priceunitstatus,           
          ISNULL(dbo.ms_drug.diluentstatus,'N') AS diluentstatus,           
          ISNULL(dbo.ms_drug.continuestatus,'N') AS continuestatus,           
          ISNULL(dbo.ms_drug.freezestatus,'N') AS freezestatus,           
          ISNULL(dbo.ms_drug.lightstatus,'N') AS lightstatus,           
          ISNULL(dbo.ms_drug.priceunittotalstatus,'N') AS priceunittotalstatus,           
            ISNULL(dbo.ms_drug.paystatus,'N') AS paystatus,           
            ISNULL(dbo.ms_drug.logstatus,'N') AS logstatus,           
            dbo.ms_drug.drugform,           
            dbo.ms_drug.printstatus,           
            dbo.ms_drug.sendStore,           
            dbo.ms_drug.sendF3F4,           
            dbo.ms_drug.pack,           
            dbo.ms_drug.free,           
            dbo.ms_drug.searchindex,           
            dbo.ms_drug.sendTPN,          
            dbo.ms_drug.sendChemo,          
            dbo.ms_drug.DoseCal,          
            dbo.ms_drug.UnitDoseCal,          
            dbo.ms_drug.CalStatus,          
            dbo.ms_drug.DrugAge,          
            dbo.ms_drug.GeneralChemo,          
            ISNULL(dbo.ms_drug.ChemicalStatus,'N') AS ChemicalStatus,    
            ISNULL(dbo.ms_drug.MasterCTX,0) AS MasterCTX,    
            ISNULL(dbo.ms_drug.PercentCTX,0) AS PercentCTX,    
            dbo.ms_drug.vehicletype    
            From ms_drug  
            ${condition}
  `;
  try {
    await sql.connect(dbConfig);
    const request = new sql.Request();

    const rs = await request.query(q);
    return rs;
  } catch (err) {
    console.error(err);
  }
};
