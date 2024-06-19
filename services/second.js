const sql = require('mssql');
const { pool, poolConnect } = require('../models/db');

async function second(req, res) {
    const { orderdate, ptstatus, wardcode } = req.body;

    try {
        await poolConnect;

        let query = `
            SELECT
                ms_patientadmit.admitteddate,
                ms_patientDischarge.dischargeddate,
                ms_patientadmit.hn,
                ms_patientadmit.an,
                CASE WHEN ms_patient.patientlanguage = 'TH' THEN ms_patient.patientnameTH ELSE ms_patient.patientnameEN END AS patientname,
                ms_ward.wardcode,
                ('[' + ms_ward.wardcode + '] ' + ms_ward.warddesc) AS warddesc
            FROM
                dbo.ms_patient
                LEFT JOIN dbo.ms_patientadmit ON dbo.ms_patient.hn = dbo.ms_patientadmit.hn
                LEFT JOIN dbo.ms_bedmove ON dbo.ms_patientadmit.an = dbo.ms_bedmove.an
                LEFT JOIN dbo.ms_ward ON dbo.ms_bedmove.towardcode = dbo.ms_ward.wardcode
                LEFT JOIN dbo.ms_patientDischarge ON dbo.ms_patientadmit.an = dbo.ms_patientDischarge.an 
                    AND dbo.ms_patientadmit.hn = dbo.ms_patientDischarge.hn
            WHERE
                dbo.ms_bedmove.status = 0
                AND (dbo.ms_patientadmit.DCdatetime >= '${orderdate} 00:00:00' OR dbo.ms_patientadmit.DCdatetime IS NULL)
                ${ptstatus}
                AND ms_ward.wardcode = '${wardcode}'
            GROUP BY
                ms_patientadmit.admitteddate,
                ms_patientDischarge.dischargeddate,
                ms_patientadmit.hn,
                ms_patientadmit.an,
                ms_patient.patientlanguage,
                ms_patient.patientnameTH,
                ms_patient.patientnameEN,
                ms_ward.wardcode,
                ms_ward.warddesc
            ORDER BY
                ms_patientadmit.admitteddate ASC
        `;

        const result = await pool.request().query(query);

        const finalResults = result.recordset.map(record => ({
            admitteddate: record.admitteddate,
            dischargeddate: record.dischargeddate,
            hn: record.hn,
            an: record.an,
            patientname: record.patientname,
            warddesc: record.warddesc
        }));

        res.status(200).json(finalResults);
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    second
};


// test postman
// {
//     "orderdate": "2023-6-18",
//     "ptstatus": "AND maritalstatus = '0'",
//     "wardcode": "1"
// }

