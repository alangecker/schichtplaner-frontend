React = require 'react'
moment = require 'moment'
liquidFlux = require 'liquidFlux/frontend'


Form = require 'react-materialform'
TextField = require 'react-materialform/TextField'
SubmitButton = require 'react-materialform/SubmitButton'
HourRangeSlider = require 'react-materialform/HourRangeSlider'
SelectMultiple = require 'react-materialform/SelectMultiple'

UserStore = require '../Store'
UserSelect = require './UserSelect'
ScheduleStore = require 'pods/schedule/Store'

checks = require('../helpers').checks

module.exports = React.createClass
  displayName: 'Step4'
  mixins:[liquidFlux.mixin]

  # states
  getFluxState: (props)->
    event: ScheduleStore.getEvent(props.event)

  setStoreListener: -> [
      [ScheduleStore, @refreshFluxStates]
  ]

  submit: (values) ->
    @props.submit @props.step, values

  render: ->
    if @state.event && @state.event.schedules
      scheduleOptions = @state.event.schedules.map (schedule) ->
        t = schedule.title.split('/')
        if t.length > 1
          title = t[1]
          keys = t[1].split(' ')
          keys.push t[0]
        else
          title = schedule.title
          keys = title.split(' ')
        return {
          label: title
          searchKeys: keys
          value: schedule.id
        }
    else
      scheduleOptions = []

    <Form className="content" onSubmit={@submit}>
      <div className="row">
        <div className="col s12 m8 offset-m2">
          <HourRangeSlider
            name="present"
            label="Anwesend"
            start={@state.event.start}
            end={@state.event.end}
            value={if @props.present then @props.present else {start:@state.event.start,end:@state.event.end}}
            min={3}
            format={'ddd HH:mm'} />
        </div>
      </div>
      <div className="row">
        <div className="col s12 m4 offset-m2">
          <UserSelect
            name="favoritePartners"
            label="Lieblingspartner*Innen"
            multiple={true}
            value={if @props.favoritePartners then @props.favoritePartners else []} />
        </div>
        <div className="col s12 m5">
          <blockquote>Mit wem würdest du gerne zusammenarbeiten?<br /><small>Noch garnicht in der Liste? kannst du auch nachträglich noch ändern!</small></blockquote>
        </div>
      </div>
      <div className="row">
        <div className="col s12 m4 offset-m2">
          {
            [] # TODO: noch unschick
          }
          <SelectMultiple
            name="favoriteSchedule"
            label="Lieblingspositionen"
            value={@props.favoriteSchedule || []}
            options={scheduleOptions} />
        </div>
        <div className="col s12 m5">
          <blockquote>
            Wo würdest du denn gerne arbeiten?<br />
            <small>Wird berücksichtigt, aber unbeliebtere Jobs muss hald auch wer machen</small>
          </blockquote>
        </div>
      </div>
      <div className="row">
        <div className="col s6 right-align">
          <SubmitButton>
            <i className="mdi mdi-send right"></i>Weiter
          </SubmitButton>
        </div>
      </div>
    </Form>
