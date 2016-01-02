React = require 'react'
liquidFlux = require 'liquidFlux/frontend'
InputMixin = require 'react-materialform/common/InputMixin'
DropDown = require 'react-materialform/common/DropDown.cjsx'

# Select = require 'react-materialform/Select'
# Hour = require 'react-materialform/Hour'
# TextArea = require 'react-materialform/TextArea'
# SubmitButton = require 'react-materialform/SubmitButton'

UserStore = require '../Store'



module.exports = React.createClass
  displayName: 'UserPicker'
  mixins:[InputMixin,liquidFlux.mixin]

  getFluxStates: (props)->
    users: UserStore.getUserNames()

  setStoreListener: -> [
      [UserStore, @refreshFluxStates, 'USERNAMES']
  ]


  onChange: (value)->
    if @props.multiple
      cur = @getValue()
      if cur.indexOf(value) != -1
        cur.splice(cur.indexOf(value), 1)
      else
        cur.push value
      @update cur
    else
      @update value

  render: ->

    label = 'auswählen...'
    value = @getValue()
    if @props.multiple
      if value.length
        label = ''
        for userId,i in value
          label += @state.users[userId].nick
          if i < value.length-2
            label += ', '
          else if i == value.length-2
            label += ' & '
    else
      label = @state.users[value].nick if value && @state.users[value]

    # ------------------

    if @props.nullLabel
      options = [
        {
          label: @props.nullLabel
          value: 0
        }
      ]
    else
      options=[]


    for id,u of @state.users
      options.push
        label: u.nick
        searchKeys: [u.sur, u.first, u.nick]
        value: id
        selected: (@props.multiple && value.indexOf(id) != -1)

    if @props.multiple
      for o in options
        o.className = 'active selected' if o.selected

      options.sort (a,b) ->
        return -1 if a.selected && !b.selected
        return 1 if !a.selected && b.selected
        return 0
        # TODO: check sort order



    <div className="select-wrapper input-field">
      <span className="caret">▼</span>
      <DropDown
        id={"reactform-#{@props.name}"}
        menu={options}
        searchable={true}
        onChange={@onChange}
        onFocus={@touch}
        className={if @state.errorText and @isTouched() then 'invalid' else ''}
        buttonText={label} />

      <label htmlFor={"reactform-#{@props.name}"} data-error={@state.errorText} className="active">{@props.label}</label>
    </div>
