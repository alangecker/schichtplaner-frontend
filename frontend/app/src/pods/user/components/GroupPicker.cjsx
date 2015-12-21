React = require 'react'
liquidFlux = require 'liquidFlux/frontend'
Picker = require 'react-materialform/common/Picker'
UserStore = require '../Store'


Option = React.createClass
  click: (e) ->
    @props.toggle(parseInt(@props.value))
  render: ->
    <li className="" onClick={@click}><span><input type="checkbox" checked={@props.checked} value={@props.value}/><label></label>{@props.label}</span></li>



module.exports = React.createClass
  mixins: [liquidFlux.mixin]
  displayName: 'GroupPicker'

  getInitialStates: ->
    selected: []

  getFluxStates: (props) ->
    groups: UserStore.getGroups()

  setStoreListener: -> [
      [UserStore, @refreshFluxStates, 'CHANGE_GROUPS']
  ]
  componentWillMount: ->
    @setState selected: @props.selected

  componentWillReceiveProps: (nextProps) ->
    @setState selected: nextProps.selected

  toggle: (id) ->
    selected = @state.selected
    if selected.length == 0 && @props.nullAreAll
      for g of @state.groups
        g = parseInt(g)
       selected.push g if g != id
    else if selected.indexOf(id) != -1
      selected.splice(selected.indexOf(id), 1) if selected.length > 1 || not @props.nullAreAll
    else
      selected.push id
    @setState selected: selected

  setAll: ->
    if @state.selected.length == 0
      selected = @state.selected
      selected.push parseInt(g) for g of @state.groups
      @setState selected: selected
    else
      @setState selected: []


  save: ->
    @props.onPickerClose() if @props.onPickerClose
    @props.onUpdate(@state.selected) if @props.onUpdate

  open: ->
    @props.onPickerOpen() if @props.onPickerOpen

  render: ->
    if @state.selected.length
      label = @props.prefix
      for id,i in @state.selected
        label += @state.groups[id]
        if i == @state.selected.length-2
          label += ' & '
        else if i != @state.selected.length-1
          label += ', '
    else
      label = @props.placeholder

    <Picker onClose={@save} onOpen={@open} label={label} className={@props.className}>
      <div className="picker__date-display">
        <div className="picker__weekday-display">Gruppen</div>
        <div className="picker__year-display"><div>{@props.description}</div></div>
      </div>
      <ul>
        {if @props.nullAreAll
          <li className="disabled" onClick={@setAll}><span><input type="checkbox" checked={@state.selected.length == 0} /><label></label>Für alle</span></li>
        }
        {for id,name of @state.groups
          id = parseInt(id)
          <Option key={id} checked={(@props.nullAreAll && @state.selected.length == 0) or @state.selected.indexOf(id) != -1} value={id} label={name} toggle={@toggle} />
        }
      </ul>
      <div className="picker__footer">
        <button className="btn-flat picker__close" type="button" data-close="true">Fertig</button>
      </div>
    </Picker>
