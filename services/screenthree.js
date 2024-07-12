
const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

async function screenthree(dt) {
    try {
        await sql.connect(dbConfig);

        for (const item of dt) {
            const orderitemcode = item.orderitemcode.trim();
            const query = `
                SELECT
                    dbo.ms_drug.orderitemENname,
                    dbo.ms_drug.sendmachine,
                    dbo.ms_drug.sendmix,
                    dbo.ms_drug.dosegeform,
                    dbo.ms_drug.sendmachine,
                    dbo.ms_drug.sendmix,
                    dbo.ms_drug.unused,
                    dbo.ms_drug.dosageunitcode,
                    dbo.ms_dosageunit.DispensedUnitTH,
                    dbo.ms_drug.orderunitcode,
                    dbo.ms_orderunit.DispensedTotalUnitTH,
                    dbo.ms_drug.displaycolour,
                    dbo.ms_drug.tmtcode,
                    dbo.ms_drug.DIDcode,
                    dbo.ms_drug.cost,
                    dbo.ms_drug.IPDprice,
                    dbo.ms_drug.OPDprice
                FROM
                    dbo.ms_drug
                LEFT JOIN dbo.ms_dosageunit ON dbo.ms_drug.dosageunitcode = dbo.ms_dosageunit.DispensedUnitCd
                LEFT JOIN dbo.ms_orderunit ON dbo.ms_drug.orderunitcode = dbo.ms_orderunit.DispensedTotalUnitCd
                WHERE dbo.ms_drug.orderitemcode = @code
            `;

            const request = new sql.Request();
            request.input('code', sql.VarChar, orderitemcode);

            const result = await request.query(query);
            const dtDrug = result.recordset;

            let printstatus = true;
            let locationname = '';
            let admindesc = '';
            let frequencyTime = '';
            let dosecal = 0;
            const dose = parseInt(item.dosage);
            const qty = parseInt(item.orderqty);

            if (dtDrug.length > 0 && dtDrug[0].unused.trim() === 'N') {
                printstatus = false;
            }

            if (item.printstatus === '1') {
                if (item.sendmachine === 'Y') {
                    printstatus = false;
                    locationname = 'JVM';

                    if (item.instructioncode.includes('AW')) {
                        printstatus = true;
                    } else {
                        printstatus = false;
                        locationname = 'JVM';
                    }

                    if (item.frequencycode.includes('PRN')) {
                        admindesc = `[ PRN ] ${item.timedesc}`;
                        frequencyTime = '0006';
                        frequencyTime = String.format("{0:0000}", parseInt(frequencyTime) + 1);

                        for (let q = 0; q < qty - dose; q++) {
                            // Add to your data grid (equivalent in your JavaScript environment)
                        }
                    } else {
                        const resulttimecode = dttimedetail.filter(row => row.timecode === item.timecode);
                        if (resulttimecode.length > 0) {
                            const dtdetail = resulttimecode;

                            if (dtdetail[0].timetype === '2') {
                                admindesc = `[ PRN ] ${dtdetail[0].timedetailTH}`;

                                // Add to your data grid (equivalent in your JavaScript environment)
                            } else {
                                for (const detail of dtdetail) {
                                    dosecal += dose;
                                    if (dosecal <= qty) {
                                        if (detail.timedetailcode === '') {
                                            admindesc = item.freetext1;
                                        } else {
                                            admindesc = `[${detail.timedetailcode.slice(0, 2)}:${detail.timedetailcode.slice(2, 4)}] ${detail.timedetailTH}`;
                                        }

                                        // Add to your data grid (equivalent in your JavaScript environment)
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (item.sendmix === 'Y') {
                        if (item.printstatus === '2' || item.printstatus === '1') {
                            printstatus = true;
                        } else {
                            printstatus = false;
                        }
                        locationname = 'ส่งผลิด';
                    }

                    // Add to your data grid (equivalent in your JavaScript environment)
                }
            } else {
                printstatus = false;
                if (locationname === 'JVM') {
                    locationname = 'ส่งเครื่องแต่ไม่ Print';
                }

                // Add to your data grid (equivalent in your JavaScript environment)
            }
        }
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    } finally {
        await sql.close();
    }
}

module.exports = {
    screenthree
};





// const sql = require('mssql');
// const dbConfig = require('../config/dbConfig');

// // ฟังก์ชันสำหรับการดึงข้อมูล ms_drug
// async function test1(code) {
//     try {
//         await sql.connect(dbConfig);

//         const query = `
//             SELECT
//                 dbo.ms_drug.orderitemENname,
//                 dbo.ms_drug.sendmachine,
//                 dbo.ms_drug.sendmix,
//                 dbo.ms_drug.dosegeform,
//                 dbo.ms_drug.sendmachine,
//                 dbo.ms_drug.sendmix,
//                 dbo.ms_drug.unused,
//                 dbo.ms_drug.dosageunitcode,
//                 dbo.ms_dosageunit.DispensedUnitTH,
//                 dbo.ms_drug.orderunitcode,
//                 dbo.ms_orderunit.DispensedTotalUnitTH,
//                 dbo.ms_drug.displaycolour,
//                 dbo.ms_drug.tmtcode,
//                 dbo.ms_drug.DIDcode,
//                 dbo.ms_drug.cost,
//                 dbo.ms_drug.IPDprice,
//                 dbo.ms_drug.OPDprice
//             FROM
//                 dbo.ms_drug
//             LEFT JOIN dbo.ms_dosageunit ON dbo.ms_drug.dosageunitcode = dbo.ms_dosageunit.DispensedUnitCd
//             LEFT JOIN dbo.ms_orderunit ON dbo.ms_drug.orderunitcode = dbo.ms_orderunit.DispensedTotalUnitCd
//             WHERE dbo.ms_drug.orderitemcode = @code
//         `;

//         const request = new sql.Request();
//         request.input('code', sql.VarChar, code);

//         const result = await request.query(query);
//         return result.recordset;
//     } catch (err) {
//         console.error('SQL error', err);
//         throw err;
//     } finally {
//         await sql.close();
//     }
// }

// // ฟังก์ชันหลัก
// async function test2(dt) {
//     for (let i = 0; i < dt.length; i++) {
//         const orderitemcode = dt[i].orderitemcode.trim();
//         const dtDrug = await test1(orderitemcode);

//         let printstatus = true;
//         let locationname = '';
//         let admindesc = '';
//         let frequencyTime = '';
//         let dosecal = 0;
//         const dose = parseInt(dt[i].dosage);
//         const qty = parseInt(dt[i].orderqty);

//         if (dtDrug.length > 0 && dtDrug[0].unused.trim() === 'N') {
//             printstatus = false;
//         }

//         if (dt[i].printstatus === '1') {
//             if (dt[i].sendmachine === 'Y') {
//                 printstatus = false;
//                 locationname = 'JVM';

//                 if (dt[i].instructioncode.includes('AW')) {
//                     printstatus = true;
//                 } else {
//                     printstatus = false;
//                     locationname = 'JVM';
//                 }

//                 if (dt[i].frequencycode.includes('PRN')) {
//                     admindesc = `[ PRN ] ${dt[i].timedesc}`;
//                     frequencyTime = '0006';
//                     frequencyTime = String.format("{0:0000}", parseInt(frequencyTime) + 1);

//                     for (let q = 0; q < qty - dose; q++) {
//                         // Add to your data grid (equivalent in your JavaScript environment)
//                     }
//                 } else {
//                     const resulttimecode = dttimedetail.filter(row => row.timecode === dt[i].timecode);
//                     if (resulttimecode.length > 0) {
//                         const dtdetail = resulttimecode;

//                         if (dtdetail[0].timetype === '2') {
//                             admindesc = `[ PRN ] ${dtdetail[0].timedetailTH}`;

//                             // Add to your data grid (equivalent in your JavaScript environment)
//                         } else {
//                             for (let j = 0; j < dtdetail.length; j++) {
//                                 dosecal += dose;
//                                 if (dosecal <= qty) {
//                                     if (dtdetail[j].timedetailcode === '') {
//                                         admindesc = dt[i].freetext1;
//                                     } else {
//                                         admindesc = `[${dtdetail[j].timedetailcode.slice(0, 2)}:${dtdetail[j].timedetailcode.slice(2, 4)}] ${dtdetail[j].timedetailTH}`;
//                                     }

//                                     // Add to your data grid (equivalent in your JavaScript environment)
//                                 }
//                             }
//                         }
//                     }
//                 }
//             } else {
//                 if (dt[i].sendmix === 'Y') {
//                     if (dt[i].printstatus === '2' || dt[i].printstatus === '1') {
//                         printstatus = true;
//                     } else {
//                         printstatus = false;
//                     }
//                     locationname = 'ส่งผลิด';
//                 }

//                 // Add to your data grid (equivalent in your JavaScript environment)
//             }
//         } else {
//             printstatus = false;
//             if (locationname === 'JVM') {
//                 locationname = 'ส่งเครื่องแต่ไม่ Print';
//             }

//             // Add to your data grid (equivalent in your JavaScript environment)
//         }
//     }
// }

// module.exports = {
//     test1,
//     test2
// };

