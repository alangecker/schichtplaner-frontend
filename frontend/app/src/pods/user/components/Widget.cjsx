React = require 'react'
liquidFlux = require 'liquidFlux/frontend'
Picker = require 'react-materialform/common/Picker'
WidgetContent = require './WidgetContent'


module.exports = React.createClass
  mixins:[liquidFlux.mixin]
  displayName: 'UserWidget'

  # id, list (-> prev,next), event
  render: ->
    <Picker showCloseButton={true} label={@props.children} className="widget-user">
      <WidgetContent id={@props.id} eventId={@props.eventId} />
    </Picker>
