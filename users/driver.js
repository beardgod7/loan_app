const Pool = require('pg').Pool
const dotenv = require('dotenv')
dotenv.config()
const pool = new Pool ({
    user:"postgres",
    password:"francis",
    database:'loan',
    host:'localhost',
    port:5432
})
;process.env.PASS_key

module.exports = pool;
