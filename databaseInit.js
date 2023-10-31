// Database initialization
const low = require('lowdb'),
  FileSync = require('lowdb/adapters/FileSync'),
  adapter = new FileSync('db.json'),
  db = low(adapter)

//db.setState({})
db.defaults({ users: []})
  .write()



module.exports.db = db;