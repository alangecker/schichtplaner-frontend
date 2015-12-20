
module.exports = (sequelize, DataTypes) ->
  sequelize.define("Event",
    title: DataTypes.STRING
  )
