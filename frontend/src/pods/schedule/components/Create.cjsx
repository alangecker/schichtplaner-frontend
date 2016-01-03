React = require 'react'

Actions = require '../Actions'
Store = require '../Store'

Form = require 'react-materialform'
TextField = require 'react-materialform/TextField'
Select = require 'react-materialform/Select'
Hour = require 'react-materialform/Hour'
TextArea = require 'react-materialform/TextArea'
SubmitButton = require 'react-materialform/SubmitButton'


helpers = require '../helpers'


module.exports = React.createClass
  displayName: 'ScheduleCreate'

  saveForm: (values) ->
    values.eventId = Store.getEventIdByName(@props.routeParams.event)
    Actions.create values

  render: ->
    <div>
        <h4 className="header">Neuen Schichtplan erstellen</h4>
        <Form className="row" onSubmit={@saveForm} overlay={true}>
          <div className="col s12 m6">
            <TextField
              name="title"
              label="Titel"
              checkValue={helpers.checks.title} />
          </div>
          <div className="col s12 m6">
            <Select
              name="rating"
              label="Bewertung"
              options={helpers.ratings}
              value={0}
              checkValue={helpers.checks.rating} />
          </div>
          <div className="col s12 m6">
            <Hour
              name="start"
              label="Beginn"
              checkValue={helpers.checks.start} />
          </div>
          <div className="col s12 m6">
            <Hour
              name="end"
              label="Ende"
              checkValue={helpers.checks.end} />
          </div>
          <div className="col s12">
            <TextArea
              name="description"
              label="Beschreibung" />
          </div>
          <div className="col s12 right-align">
            <SubmitButton>
              <i className="mdi mdi-send right"></i>Erstellen
            </SubmitButton>
          </div>
        </Form>
    </div>
