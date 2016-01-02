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
    secret: '8sd2w41d8sd41qw5das7d84gr5we15sd4s'
    passwordSalt: 'sda786_as8j2'

module.exports = config[process.env.NODE_ENV || "development"]
