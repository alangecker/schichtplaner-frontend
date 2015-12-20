React = require 'react'

InputMixin = require './common/InputMixin'


module.exports = React.createClass
  mixins: [InputMixin]
  displayName: 'TextField'

  onChange: ->
    @update @refs.input.value

  render: ->
    <div className="input-field">
      <input
        placeholder=""
        id={"reactform-#{@props.name}"}
        type="text"
        value={@getValue()}
        onChange={@onChange}
        onFocus={@touch}
        ref="input"
        className={if @state.errorText and @isTouched() then 'invalid' else ''} />

      <label htmlFor={"reactform-#{@props.name}"} data-error={@state.errorText} className="active">{@props.label}</label>
    </div>
