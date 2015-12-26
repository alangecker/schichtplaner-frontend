
module.exports = (sequelize, DataTypes) ->
  sequelize.define "PollVote",
    pollQuestionId: DataTypes.INTEGER
    userId: DataTypes.INTEGER
    answer: DataTypes.TEXT
