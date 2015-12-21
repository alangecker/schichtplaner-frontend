config =
  development:
    port: 3000
    CORSallowOringin: 'http://localhost:4000'
    db:
      database: "schichtplaner"
      host: "localhost"
      dialect: "postgres"
      username: 'postgres'
      password: 'password'
      logging: false
    redis: 'redis://localhost:6379'


module.exports = config[process.env.NODE_ENV || "development"]
