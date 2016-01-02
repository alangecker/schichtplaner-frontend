React = require 'react'

InputMixin = require './common/InputMixin'


module.exports = React.createClass
  mixins: [InputMixin]
  displayName: 'TextField'

  onChange: ->
    @update @refs.input.value

  render: ->
    <div className={"input-field "+(if @props.className then @props.className else '')}>
      <input
        placeholder=""
        id={"reactform-#{@props.name}"}
        type={if @props.type then @props.type else "text"}
        value={@getValue()}
        onChange={@onChange}
        onFocus={@touch}
        ref="input"
        className={if @state.errorText and @isTouched() then 'invalid' else ''}
        disabled={@props.disabled}
        />

      <label htmlFor={"reactform-#{@props.name}"} data-error={@state.errorText} className="active">{@props.label}</label>
    </div>
