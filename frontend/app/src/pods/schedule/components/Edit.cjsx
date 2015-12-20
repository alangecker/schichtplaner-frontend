React = require 'react'
liquidFlux = require 'liquidFlux'
ScheduleStore = require '../Store'
ScheduleActions = require '../Actions'

EditTimetable = require './EditTimetable'

Form = require 'react-materialform'
TextField = require 'react-materialform/TextField'
Select = require 'react-materialform/Select'
Hour = require 'react-materialform/Hour'
TextArea = require 'react-materialform/TextArea'
SubmitButton = require 'react-materialform/SubmitButton'

helpers = require '../helpers'

module.exports = React.createClass
  mixins: [liquidFlux.mixin]
  displayName: 'ScheduleEdit'

  getFluxStates: ->
    schedule: ScheduleStore.getSchedule(@props.params.scheduleId)

  setStoreListener: -> [
      [ScheduleStore, @refreshFluxStates]
  ]

  saveForm: (values) ->
    values.id = @state.schedule.id
    ScheduleActions.update values

  render: ->
    return <div /> unless @state.schedule
    <div>
        <h4 className="header">Schichtplan bearbeiten</h4>
        <Form className="row" onSubmit={@saveForm} onlyChanges={true} overlay={true}>
          <div className="col s12 m6">
            <TextField
              name="title"
              label="Titel"
              value={@state.schedule.title}
              checkValue={helpers.checks.title} />
          </div>
          <div className="col s12 m6">
            <Select
              name="rating"
              label="Bewertung"
              value={@state.schedule.rating}
              options={helpers.ratings}
              checkValue={helpers.checks.rating} />
          </div>
          <div className="col s12 m6">
            <Hour
              name="start"
              label="Beginn"
              value={@state.schedule.start}
              checkValue={helpers.checks.start} />
          </div>
          <div className="col s12 m6">
            <Hour
              name="end"
              label="Ende"
              value={@state.schedule.end}
              checkValue={helpers.checks.end} />
          </div>
          <div className="col s12">
            <TextArea
              name="description"
              label="Beschreibung"
              value={@state.schedule.description} />
          </div>
          <div className="col s12 right-align">
            <SubmitButton>
              <i className="mdi mdi-send right"></i>Speichern
            </SubmitButton>
          </div>
        </Form>
        <p style={{marginTop:'50px'}}/>
        <EditTimetable scheduleId={@state.schedule.id} start={@state.schedule.start} end={@state.schedule.end} />
    </div>
