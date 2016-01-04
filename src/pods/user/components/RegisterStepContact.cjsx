React = require 'react'
liquidFlux = require 'liquidFlux/frontend'

Form = require 'react-materialform'
TextField = require 'react-materialform/TextField'
SubmitButton = require 'react-materialform/SubmitButton'

UserStore = require '../Store'
UserActions = require '../Actions'
checks = require('../helpers').checks

module.exports = React.createClass
  displayName: 'Step3'
  mixins:[liquidFlux.mixin]

  getInitialState: ->
    mobile: null
    inVerification: false
  setStoreListener: -> [
      [UserStore, (=>@forceUpdate()), 'NUMBERINUSE']
      [UserStore, (=>@forceUpdate()), 'SMSVERIFY']
  ]
  verify: (values) ->
    UserActions.sendVerifySMS(values.mobile)
    @setState
      mobile: values.mobile
      inVerification: true

  restart: ->
    @setState inVerification: false

  submit: (values) ->
    @props.submit @props.step, values

  render: ->
    if @state.inVerification
      <Form className="content" onSubmit={@submit}>
        <div className="row">
          <div className="col s12 m4 offset-m2">
            <TextField
              name="mobile"
              label="Handynummer"
              value={@state.mobile}
              disabled={true} />
          </div>
          <div className="col s12 m5">
            <blockquote>
              Damit wir dich auch erreichen können<br/>
              <small>Wärend dem Event kriegste auch die ein oder andere Benachrichtigung</small>
            </blockquote>
          </div>
        </div>
        <div className="row">
          <div className="col s12 m4 offset-m2">
            <TextField
              name="code"
              label="Bestätigungscode"
              value={@state.code}
              checkValue={[checks.required,checks.verifyCode]} />
          </div>
          <div className="col s12 m5">
            <blockquote>
              Du erhältst gleich einen Code per SMS, gib den dann hier ein
              <br /><b>ZUM TESTEN IMMER 12345</b>
            </blockquote>
          </div>
        </div>
        <div className="row">
          <div className="col s6 right-align">
            <button className="waves-effect waves-light btn orange" onClick={@restart}>
              <i className="mdi mdi-arrow-left"></i>
            </button>
            <SubmitButton>
              <i className="mdi mdi-send right"></i>Weiter
            </SubmitButton>
          </div>
        </div>
      </Form>
    else
      <Form className="content" onSubmit={@verify}>
        <div className="row">
          <div className="col s12 m4 offset-m2">
            <TextField
              name="mobile"
              label="Handynummer"
              value={@props.mobile}
              checkValue={[checks.required,checks.mobile]} />
          </div>
          <div className="col s12 m5">
            <blockquote>
              Damit wir dich erreichen können<br/>
              <small>Wärend dem Event kriegste auch die ein oder andere Benachrichtigung</small>
            </blockquote>
          </div>
        </div>
        <div className="row">
          <div className="col s6 right-align">
            <SubmitButton>
              <i className="mdi mdi-send right"></i>Bestätigen
            </SubmitButton>
            <TextField name="code" className="hide"/>
          </div>
        </div>
      </Form>
