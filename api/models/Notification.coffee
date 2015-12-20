
module.exports = (sequelize, DataTypes) ->
  sequelize.define "Notification",
    UserId: DataTypes.INTEGER
    message: DataTypes.TEXT
    time: DataTypes.DATE
    smsPending: DataTypes.BOOLEAN
