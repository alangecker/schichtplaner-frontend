fs        = require "fs"
path      = require "path"
Sequelize = require "sequelize"
config    = require '../config'
relationships = require './_relationships'
sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db);
db        = {};

fs
  .readdirSync(__dirname)
  .filter( (file) -> file.indexOf(".") != 0 && file != "index.coffee" && file != '_relationships.coffee')
  .forEach (file) ->
    model = sequelize.import path.join(__dirname, file)
    db[model.name] = model if model

Object.keys(db).forEach (modelName) ->
  db[modelName].associate(db) if "associate" in db[modelName]



db.sequelize = sequelize
db.Sequelize = Sequelize

relationships(db, sequelize)

db.error = (err) ->
  console.log "------------------------"
  if err.parent
    console.log "#{err.name}: #{err.message}"
    console.log "#{err.parent.sql}"
  else
    console.log 'Sequelize Error: '
    console.log err
  console.log "------------------------"




module.exports = db
