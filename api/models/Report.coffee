
module.exports = (sequelize, DataTypes) ->
  sequelize.define("Report",
    ShiftId: DataTypes.INTEGER
    stress: DataTypes.INTEGER
    fun: DataTypes.INTEGER
    comment: DataTypes.TEXT
  )
