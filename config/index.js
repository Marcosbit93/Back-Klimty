const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './.env') })

module.exports = {
  name: process.env["DB_NAME"],
  port: process.env["PORT"],
  pass: process.env["PASS"],
  host: process.env["HOST"]
}





