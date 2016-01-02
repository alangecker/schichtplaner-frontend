
module.exports = (sequelize, DataTypes) ->
  sequelize.define("Event",
    title: DataTypes.STRING
    start: DataTypes.DATE
    end: DataTypes.DATE
    password: DataTypes.STRING
  )
