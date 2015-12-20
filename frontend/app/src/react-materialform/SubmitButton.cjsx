React = require 'react'

module.exports = React.createClass
  displayName: 'SubmitButton'

  click: (e) ->
    e.preventDefault()
    @props._form_handlers.submit()

  render: ->
    <button
      className={"waves-effect waves-light btn"+(if @props.className then ' '+@props.className else '')}
      onClick={@click}
      style={@props.style}
      disabled={@props._form_errors.length}>
      {@props.children}
    </button>
