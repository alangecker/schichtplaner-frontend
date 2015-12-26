
module.exports = (sequelize, DataTypes) ->
  sequelize.define("Group",
    name: DataTypes.STRING
  )
