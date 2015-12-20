
module.exports = (sequelize, DataTypes) ->
  sequelize.define "PollVote",
    PollQuestionId: DataTypes.INTEGER
    UserId: DataTypes.INTEGER
    answer: DataTypes.TEXT
