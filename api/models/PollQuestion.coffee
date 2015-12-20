
module.exports = (sequelize, DataTypes) ->
  sequelize.define "PollQuestion",
    PollId: DataTypes.INTEGER
    type: DataTypes.JSON
