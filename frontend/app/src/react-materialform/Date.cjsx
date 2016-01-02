React = require 'react'
moment = require 'moment'

InputMixin = require './common/InputMixin'
DropDown = require './common/DropDown.cjsx'



module.exports = React.createClass
  mixins: [InputMixin]
  displayName: 'Date'

  element: null
  componentDidMount: ->
      $(@refs.date).pickadate
        selectMonths: true
        #selectYears: true
        selectYears: 70
        closeOnSelect: true
        onSet: @changeDate

        # de_DE
        monthsFull: [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ],
        monthsShort: [ 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez' ],
        weekdaysFull: [ 'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag' ],
        weekdaysShort: [ 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa' ],
        today: 'Heute',
        clear: 'Löschen',
        close: 'Fertig',
        firstDay: 1,
        format: 'dddd, dd. mmmm yyyy',

        min: if @props.min then moment(@props.min).toDate()
        max: if @props.max then moment(@props.max).toDate()

  componentDidUpdate: ->
    @componentDidMount()

  changeDate: (e) ->
    @touch()
    old = moment @getValue()
    newDay = moment.unix(e.select/1000)
    newDay.hour(old.hour()) if old.isValid()
    @update newDay.format()



  render: ->
      <div className="input-field">
        <input
          id={"reactform-#{@props.name}-day"}
          type="date"
          className="datepicker"
          ref="date"
          data-value={moment(@getValue()).format("YYYY/MM/DD")}
          value={moment(@getValue()).format("dddd, D. MMM YYYY")}
          className={if @state.errorText and @isTouched() then 'invalid' else ''}
          onChange={@changeDate} />
        <label htmlFor={"reactform-#{@props.name}-day"} data-error={@state.errorText} className="active">{@props.label}</label>
    </div>
