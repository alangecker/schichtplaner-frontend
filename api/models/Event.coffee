
module.exports = (sequelize, DataTypes) ->
  sequelize.define("Event",
    title: DataTypes.STRING
    start: DataTypes.STRING
    end: DataTypes.STRING
    password: DataTypes.STRING
  )
