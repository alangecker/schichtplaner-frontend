React = require 'react'
liquidFlux = require 'liquidFlux/frontend'

Form = require 'react-materialform'
TextField = require 'react-materialform/TextField'
SubmitButton = require 'react-materialform/SubmitButton'

UserStore = require '../Store'
checks = require('../helpers').checks

module.exports = React.createClass
  displayName: 'Step2'
  mixins:[liquidFlux.mixin]

  setStoreListener: -> [
      [UserStore, (=>@forceUpdate()), 'MAILINUSE']
  ]
  submit: (values) ->
    @props.submit @props.step, values

  render: ->
    <Form className="content" onSubmit={@submit}>
      <div className="row">
        <div className="col s12 m4 offset-m2">
          <TextField
            name="email"
            label="E-Mail"
            value={@props.email}
            checkValue={[checks.required,checks.email]} />
        </div>
        <div className="col s12 m5">
          <blockquote>Damit kannst du dich hier anmelden</blockquote>
        </div>
      </div>
      <div className="row">
        <div className="col s6 m2 offset-m2">
          <TextField
            name="password"
            label="Passwort"
            type="password"
            checkValue={[checks.required,checks.password]} />
        </div>
        <div className="col s6 m2">
          <TextField
            name="password2"
            type="password"
            label="...wiederholen"
            checkValue={[checks.required,checks.password2]} />
        </div>
        <div className="col s12 m5">
          <blockquote>keine Beschwerden wenn jemand mit euren Schichten dank schlechtem Passwort Unfug treibt! :D</blockquote>
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
