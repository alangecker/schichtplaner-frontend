liquidFlux = require 'liquidFlux/backend'
models = require './models'
config = require './config'


liquidFlux.Router.add(require './pods/schedule/routes')
liquidFlux.Router.add(require './pods/shift/routes')
liquidFlux.Router.add(require './pods/user/routes')

models.sequelize.sync().then ->
  liquidFlux.Redis.connect(config.redis)
