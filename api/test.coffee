
sha3 = require 'sha3'
config =
  secret: '123456'


sha3 = require 'sha3'
generateCode = (string,length=5) ->
  mod = Math.pow(10, length+1)
  d = new sha3.SHA3Hash(224)
  d.update(string+config.secret)
  s = d.digest('hex')
  res = ''
  for i in [0...length]
    res += s.charCodeAt(i)%10
  console.log res


console.log generateCode('+49151271234578')
