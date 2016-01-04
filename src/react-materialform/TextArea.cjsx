React = require 'react'

InputMixin = require './common/InputMixin'


module.exports = React.createClass
  mixins: [InputMixin]
  displayName: 'TextArea'

  onChange: ->
    @update @refs.textarea.value

  render: ->
    <div className="input-field">
      <textarea
        id={"reactform-#{@props.name}"}
        ref="textarea"
        className={"materialize-textarea"+(if @state.errorText and @isTouched() then ' invalid' else '')}
        value={@getValue()}
        onChange={@onChange}
        onFocus={@touch}
        />

      <label htmlFor={"reactform-#{@props.name}"} data-error={@state.errorText} className="active">{@props.label}</label>
    </div>
