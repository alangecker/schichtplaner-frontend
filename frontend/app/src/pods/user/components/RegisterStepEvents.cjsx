React = require 'react'
moment = require 'moment'
liquidFlux = require 'liquidFlux/frontend'


Form = require 'react-materialform'
TextField = require 'react-materialform/TextField'
SubmitButton = require 'react-materialform/SubmitButton'
HourRangeSlider = require 'react-materialform/HourRangeSlider'

UserStore = require '../Store'
UserSelect = require './UserSelect'
checks = require('../helpers').checks

module.exports = React.createClass
  displayName: 'Step4'
  mixins:[liquidFlux.mixin]



  submit: (values) ->
    @props.submit @props.step, values


  render: ->
    <Form className="content" onSubmit={@submit}>
      <div className="row">
        <div className="col s12 m8 offset-m2">
          <HourRangeSlider
            name="present"
            label="Anwesend"
            start={'2016-01-01'}
            end={'2016-01-03'}
            value={{start:'2016-01-01',end:'2016-01-02'}}
            min={3} />
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
          <UserSelect
            name="favoriteSchedule"
            label="Lieblingsposition"
            value={@props.favoritePartners} />
        </div>
        <div className="col s12 m5">
          <blockquote>
            Wo würdest du denn gerne arbeiten?
            <small>Wird berücksichtigt, aber für unbeliebtere Jobs muss hald auch wer machen
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
