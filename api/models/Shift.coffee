
module.exports = (sequelize, DataTypes) ->
  sequelize.define("Shift",
    ScheduleId: DataTypes.INTEGER
    start: DataTypes.STRING
    end: DataTypes.STRING
    comment: DataTypes.TEXT
    UserId: DataTypes.INTEGER
    score: DataTypes.INTEGER
    opened: DataTypes.BOOLEAN
  )
