module.exports = (prefix) ->
  log: (args...) ->
    args[0] = "[liquidFlux/#{prefix}] #{args[0]}"
    console.log args...
  error: (args...) ->
    args[0] = "[liquidFlux/#{prefix}] #{args[0]}"
    console.error args...
