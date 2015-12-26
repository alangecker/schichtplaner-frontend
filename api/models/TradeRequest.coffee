module.exports = (sequelize, DataTypes) ->
  sequelize.define("TradeRequest",
    ShiftId: DataTypes.INTEGER
    ForShiftId: DataTypes.INTEGER
    byModerator: DataTypes.INTEGER
  )
