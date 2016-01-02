React = require 'react'
InputMixin = require './common/InputMixin'
Picker = require './common/Picker'
ImageResizer = require './common/ImageResizer'

module.exports = React.createClass
  mixins: [InputMixin]
  displayName: 'ImageUpload'

  getInitialState: ->
    error: null
    currentImage: null
    pickerOpen: false
    fileName: null
    selecting: false


  onClick: ->
    @touch()
    @setState selecting: true

  onUpload: ->
    file = @refs.input.files[0]
    if file
      reader = new FileReader();
      reader.onloadend = =>
        @setState
          fileName: file.name
          currentImage: reader.result
          pickerOpen: true
      @refs.input.value = ''
      reader.readAsDataURL(file)

  openPicker: ->
    if @state.currentImage
      @setState pickerOpen: true
  closePicker: ->
    @setState pickerOpen: false

  render: ->
    <div className="input-field image">
      <img src={@getValue()} ref="preview" className="preview" onClick={@openPicker} />
      <Picker open={@state.pickerOpen} onClose={@closePicker}>
        <div className="picker__title">
          Foto zuschneiden
        </div>
        <ImageResizer
          source={@state.currentImage}
          height={@props.height}
          width={@props.width}
          onChange={@update}
          />
        <div className="picker__footer">
          <button className="btn-flat picker__close" type="button" data-close="true">Fertig</button>
        </div>
      </Picker>
      <div className="button">
        <input
          placeholder=""
          id={"reactform-#{@props.name}"}
          type="file"
          onChange={@onUpload}
          onClick={@selecting}
          ref="input" />
        <span className="truncate">{if @state.fileName then @state.fileName else 'Foto auswählen...'}</span>
      </div>
      <label htmlFor={"reactform-#{@props.name}"} data-error={@state.errorText} className="active">{@props.label}</label>
    </div>
