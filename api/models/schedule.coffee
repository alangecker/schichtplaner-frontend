
module.exports = (sequelize, DataTypes) ->
  sequelize.define("Schedule",
    EventId: DataTypes.INTEGER
    title: DataTypes.STRING
    start: DataTypes.DATE
    end: DataTypes.DATE
    rating: DataTypes.INTEGER
    description: DataTypes.TEXT
  )
