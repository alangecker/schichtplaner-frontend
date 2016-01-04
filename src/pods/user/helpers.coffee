UserStore = require './Store'

module.exports = helpers =
  checks:
    required: (value) ->
      return 'Bitte angeben' if not value or not value.trim().length
    name: (userList) -> (value) ->
      req = helpers.checks.required(value)
      return req if req
      for id,u of userList
        return 'Name ist bereits vergeben' if u.nick == value

    birthday: (value) ->
      v = moment(value)
      return 'Ungültig' if not v.isValid()
      return 'Die solltest schon geboren sein :D' if v.isAfter(moment())

    email: (value) ->
      re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return 'Ungültig' if not re.test(value)
      return 'Mail wird bereits verwendet' if UserStore.isMailInUse(value)

    password: (value,form) ->
      return 'zu easy!' if value.length < 7 || (form.email && form.email.indexOf(value) != -1) || parseInt(value).toString() == value
    password2: (value, form) ->
      return 'stimmt nicht überein' if value != form.password

    mobile: (value) ->
      v = value.replace(/\s/g, '').replace('/', '')
      v = '+'+v.substr(2) if v.substr(0,2) == '00'
      part = v.substr(1)
      return 'Ungültig' if part.length < 9 || parseInt(part).toString() != part || (v[0] != '+' && v[0] != '0')
      return 'Nummer wird bereits verwendet' if UserStore.isNumberInUse(value)

    verifyCode: (value, form) ->
      console.log value, form
      return 'Ungültig' if value.length != 5
      return 'Ungültig2' if not UserStore.isCorrectCode(form.mobile, value)
