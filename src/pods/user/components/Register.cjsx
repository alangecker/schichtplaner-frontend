require '../styles/register.sass'

React = require 'react'
liquidFlux = require 'liquidFlux/frontend'
ScheduleStore = require 'pods/schedule/Store'

stepComponents = [
  require './RegisterStepInfo'
  require './RegisterStepAccount'
  require './RegisterStepContact'
  require './RegisterStepEvents'
  require './RegisterStepSummary'
]


module.exports = React.createClass
  displayName: 'Register'
  mixins:[liquidFlux.mixin]

  # States
  getInitialState: ->
    maxStep: 5
    values: {
      "name":"Jörgi",
      "firstname":"Jörg",
      "surname":"Petri",
      "birthday":"1990-05-10T00:00:00+02:00",
      "refererId":["2"],
      "email":"joergi@gratlerverein.de",
      "password":"test12345",
      "password2":"test12345",
      "mobile":"0123456789",
      "code":"12345",
      "present":{"start":"2016-07-29T20:00:00+02:00","end":"2016-07-31T10:00:00+02:00"},
      "favoritePartners":[],
      "favoritePositions":[]
    }

  getFluxState: (props)->
    events: ScheduleStore.getEvents()

  setStoreListener: -> [
      [ScheduleStore, @refreshFluxStates]
  ]


  # handler
  continue: (step, values) ->
    newValues = @state.values
    newValues[key]=value for key,value of values
    @setState values: newValues
    # TODO: maybe central goTo method?
    document.location.hash = '/register/'+(step+1)
    if step == @state.maxStep
      @setState maxStep: step+1


  # render
  render: ->
    activeEvent = null
    max = 0
    for title,event of @state.events
      activeEvent = title if moment(event.start).unix() >= max


    currentStep = parseInt(@props.params.step)
    currentStep = 1 if currentStep > @state.maxStep || currentStep < 1 || !currentStep
    steps = [
      'Über dich'
      'Account'
      'Kontakt'
      'Festival'
      'Fertig'
    ]
    Component = stepComponents[currentStep-1]

    <div>
      <h4 className="header content">
        Registrierung
      </h4>
      <ul className="tabs content" ref="tabs">
         {for step,i in steps
            if i < @state.maxStep
              <li key={i} className="tab col s3" style={{width:(100/steps.length)+'%'}}>
                <a href={"#/register/#{i+1}"} className={if i+1 == currentStep then 'active'}>{step}</a>
              </li>
            else
              <li key={i} className="tab col s3 disabled" style={{width:(100/steps.length)+'%'}}>
                <a>{step}</a>
              </li>
         }
      </ul>
      <Component event={activeEvent} {...@state.values} submit={@continue} step={currentStep} />

    </div>
