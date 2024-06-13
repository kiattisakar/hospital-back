// const sql = require('mssql');
// const config = require('../config/dbConfig');

// async function get_data() {
//     try {
//         await sql.connect(config);
//         const result = await sql.query`SELECT * FROM ms_ward`;
//         return result.recordset;
//     } catch (err) {
//         console.error('Error:', err);
//         throw err;
//     } finally {
//         sql.close();
//     }
// }

// module.exports = get_data;
