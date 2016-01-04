React = require 'react'

InputMixin = require './common/InputMixin'
DropDown = require './common/DropDown.cjsx'


module.exports = React.createClass
  mixins: [InputMixin]
  displayName: 'Select'

  onChange: (value) ->
    @update value

  getLabel: ->
    value = @getValue()
    for option in @props.options
      return option.label if option.value == value
    return @props.placeholder
  render: ->
    <div className="select-wrapper input-field">
      <span className="caret">▼</span>
      <DropDown
        id={"reactform-#{@props.name}"}
        menu={@props.options}
        onChange={@onChange}
        onFocus={@touch}
        className={if @state.errorText and @isTouched() then 'invalid' else ''}
        buttonText={@getLabel()}
        activeValue={@getValue()}  />

      <label htmlFor={"reactform-#{@props.name}"} data-error={@state.errorText} className="active">{@props.label}</label>
    </div>
