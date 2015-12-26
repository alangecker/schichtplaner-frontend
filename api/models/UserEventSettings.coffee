
module.exports = (sequelize, DataTypes) ->
  sequelize.define("UserEventSettings",
    UserId: DataTypes.INTEGER
    EventId: DataTypes.INTEGER
    from: DataTypes.DATE
    until: DataTypes.DATE
    MainScheduleId: DataTypes.INTEGER
    setupScore: DataTypes.INTEGER
    deconstructionScore: DataTypes.INTEGER
    # classMethods:
    #   associate: (models) ->
    #
  )
