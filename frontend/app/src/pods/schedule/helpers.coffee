moment = require 'moment'
module.exports =
  checks:
    title: (value) ->
      return 'Bitte angeben' if not value
      return 'Nur ein \'/\' möglich' if value.split('/').length > 2

    rating: (value) ->
      return 'Ungültiger Wert' if value < -2 or value > 2

    start: (value, form) ->
      return 'Bitte angeben' if not value
      m = moment(value)
      return 'Ungültig' if not m.isValid()
      end = moment(form.end)
      return 'Muss vorm Ende beginnen' if not m.isBefore(end)
      return 'Maximal 7 Tage' if end.diff(m, 'days') > 7

    end: (value, form) ->
      return 'Bitte angeben' if not value
      m = moment(value)
      return 'Ungültig' if not m.isValid()
      start = moment(form.start)
      return 'Muss nach dem Start beginnen' if not m.isAfter(start)
      return 'Maximal 7 Tage' if m.diff(start, 'days') > 7

  ratings: [
      {value:2, label:'Sehr hässlich'}
      {value:1, label:'Unschön'}
      {value:0, label:'Neutral'}
      {value:-1, label:'Angenehm'}
      {value:-2, label:'Sehr angenehm'}
    ]
