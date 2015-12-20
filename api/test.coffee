
pro = new Promise (fullfill) ->
    fullfill('test')

pro.then((p) -> return 'asasd').then(console.log)
