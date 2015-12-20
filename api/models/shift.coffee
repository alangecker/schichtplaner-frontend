
module.exports = (sequelize, DataTypes) ->
  sequelize.define("Shift",
    ScheduleId: DataTypes.INTEGER
    start: DataTypes.STRING
    end: DataTypes.STRING
    UserId: DataTypes.INTEGER
    score: DataTypes.INTEGER
  )
