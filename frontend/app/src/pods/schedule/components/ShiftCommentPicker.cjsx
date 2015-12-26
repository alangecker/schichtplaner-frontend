React = require 'react'
Picker = require 'react-materialform/common/Picker'


module.exports = React.createClass
  displayName: 'ShiftCommentPicker'

  getInitialState: ->
    value: @props.value

  componentWillReceiveProps: (nextProps) ->
    @setState value: nextProps.value if @props.value == @state.value

  onClose: ->
    @props.onClose() if @props.onClose
  onOpen: ->
    @props.onOpen() if @props.onOpen

  onChange: ->
    console.log 'change!'
    @setState value: @refs.comment.value

  render: ->
        <Picker onClose={@onClose} onOpen={@onOpen} label={@props.value}>
          <div className="picker__date-display">
            <div className="picker__weekday-display">Kommentar bearbeiten</div>
          </div>
          <div>
            <div className="input-field">
              <textarea
                ref="comment"
                className="materialize-textarea"
                value={@state.value}
                onChange={@onChange}
                />
            </div>
          </div>
          <div className="picker__footer">
            <button className="btn-flat picker__close" type="button" data-close="true">Fertig</button>
          </div>
        </Picker>
