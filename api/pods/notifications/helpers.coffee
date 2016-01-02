config = require '../../config'
sha3 = require 'sha3'


module.exports =
    generateCode: (string,length=5) ->
      mod = Math.pow(10, length+1)
      d = new sha3.SHA3Hash(224)
      d.update(string+config.secret)
      s = d.digest('hex')
      res = ''
      for i in [0...length]
        res += s.charCodeAt(i)%10
      return res
