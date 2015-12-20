
module.exports = (sequelize, DataTypes) ->
  sequelize.define "Poll",
    title: DataTypes.STRING
    deadline: DataTypes.DATE
