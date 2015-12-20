
module.exports = (db, sequelize) ->



  # Event
  db.Event.hasMany(db.Schedule)

  # Schedule
  db.Schedule.belongsTo(db.Event)
  db.Schedule.hasMany(db.Shift)

  # Shift
  db.Shift.belongsToMany(db.Group, {through:sequelize.define('ShiftAllowedGroups'),as:'AllowedGroups'})
  db.Shift.belongsTo(db.Schedule)
  db.Shift.belongsTo(db.User, {foreignKey:'UserId'})
  db.User.hasMany(db.Shift, {foreignKey:'UserId'})

  # User
  db.User.belongsTo(db.User, {as:'Referer', foreignKey:'RefererId'})
  UserGroups = sequelize.define('UserGroups')
  db.User.belongsToMany(db.Group, {through:UserGroups})
  db.Group.belongsToMany(db.User, {through:UserGroups})
  db.User.hasOne(db.UserEventSettings, {foreignKey:'UserId'})
  db.UserEventSettings.belongsTo(db.Schedule, {as: 'MainPosition', foreignKey:'MainScheduleId'})
  db.UserEventSettings.belongsToMany(db.User, {through:sequelize.define('FavoritePartner'), as: 'FavoritePartner'})

  # Notifications
  db.User.hasMany(db.Notification, {foreignKey:'UserId'})

  # Polls
  db.Poll.hasMany(db.PollQuestion, {foreignKey:'PollId'})
  db.PollQuestion.belongsTo(db.Poll, {foreignKey:'PollId'})
  db.PollQuestion.belongsToMany(db.User, {through:db.PollVote, as: 'Vote', foreignKey:'PollQuestionId'})
  db.User.belongsToMany(db.PollQuestion, {through:db.PollVote, as: 'Vote'})

  # Report
  Partner = sequelize.define('ReportPartner', {present:db.Sequelize.BOOLEAN})
  db.Shift.hasOne(db.Report, {foreignKey:'ReportId'})
  db.Report.belongsTo(db.Shift, {foreignKey:'ShiftId'})
  db.Report.belongsToMany(db.User, {through: Partner, as: 'Partner'})
