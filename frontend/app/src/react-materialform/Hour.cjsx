React = require 'react'
moment = require 'moment'

InputMixin = require './common/InputMixin'
DropDown = require './common/DropDown.cjsx'


hours = []
for i in [0...24]
  hours.push
    value: i
    label: (if i < 10 then ' '+i else i)+':00 Uhr'


module.exports = React.createClass
  mixins: [InputMixin]
  displayName: 'Hour'

  element: null
  componentDidMount: ->
      document.picker = $(@refs.date).pickadate
        selectMonths: true
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



  componentDidUpdate: ->
    @componentDidMount()

  changeDate: (e) ->
    console.log e
    @touch()
    old = moment @getValue()
    newDay = moment.unix(e.select/1000)
    newDay.hour(old.hour()) if old.isValid()
    @update newDay.format()
    console.log  newDay.format()

  changeHour: (hour) ->
    date = moment @getValue()
    date.hour(hour)
    @update date.format()




  getHourText: -> moment(@getValue()).format('HH:mm')

  render: ->
    <div className="row">
      <div className="col s8 m7 input-field">
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
      <div className="select-wrapper input-field col s4 m5" style={{paddingRight:0}}>
        <span className="caret">▼</span>
        <DropDown
          id={"reactform-#{@props.name}-hour"}
          menu={hours}
          onChange={@changeHour}
          onFocus={@touch}
          buttonText={@getHourText()} />
      </div>
    </div>
