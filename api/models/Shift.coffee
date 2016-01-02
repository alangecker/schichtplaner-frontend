
module.exports = (sequelize, DataTypes) ->
  sequelize.define("Shift",
    ScheduleId: DataTypes.INTEGER
    start: DataTypes.DATE
    end: DataTypes.DATE
    comment: DataTypes.TEXT
    UserId: DataTypes.INTEGER
    score: DataTypes.INTEGER
    opened: DataTypes.BOOLEAN
  )
