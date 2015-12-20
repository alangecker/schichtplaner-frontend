liquidFlux = require './liquidFlux'
models = require './models'
config = require './config'


liquidFlux.Router.add(require './pods/schedule/routes')
liquidFlux.Router.add(require './pods/shift/routes')
liquidFlux.Router.add(require './pods/user/routes')

console.log liquidFlux.Router._routes
models.sequelize.sync().then ->
  liquidFlux.Connector.listen(config.port)
