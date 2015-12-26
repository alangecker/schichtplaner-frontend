
module.exports = (sequelize, DataTypes) ->
  sequelize.define("User",
    email: DataTypes.STRING
    firstname: DataTypes.STRING
    surname: DataTypes.STRING
    name: DataTypes.STRING
    password: DataTypes.STRING
    hasPhoto: DataTypes.BOOLEAN # TODO: change to binary
    birthday: DataTypes.DATE
    mobile: DataTypes.STRING
    recieveSMS: DataTypes.BOOLEAN
    moderator: DataTypes.BOOLEAN
    RefererId: DataTypes.INTEGER
    #gender: DataTypes.ENUM('male', 'female')
    {indexes: [{unique: true, fields: ['email']}]}
  )
