React = require 'react'
liquidFlux = require 'liquidFlux/frontend'

stepComponents = [
  require './RegisterStepInfo'
  require './RegisterStepAccount'
  require './RegisterStepContact'
  require './RegisterStepEvents'
  # require './RegisterStepSummary'
]
module.exports = React.createClass
  displayName: 'Register'

  getInitialState: ->
    maxStep: 4
    values: {}
  continue: (step, values) ->
    newValues = @state.values
    newValues[key]=value for key,value of values
    @setState values: newValues
    # TODO: maybe central goTo method?
    document.location.hash = '/register/'+(step+1)
    if step == @state.maxStep
      @setState maxStep: step+1

  render: ->
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
              <li className="tab col s3" style={{width:(100/steps.length)+'%'}}>
                <a href={"#/register/#{i+1}"} className={if i+1 == currentStep then 'active'}>{step}</a>
              </li>
            else
              <li className="tab col s3 disabled" style={{width:(100/steps.length)+'%'}}>
                <a>{step}</a>
              </li>
         }
      </ul>
      <Component {...@state.values} submit={@continue} step={currentStep} />

    </div>
