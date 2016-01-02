React = require 'react'

InputMixin = require './common/InputMixin'
DropDown = require './common/DropDown.cjsx'


module.exports = React.createClass
  mixins: [InputMixin]
  displayName: 'SelectMultiple'

  onChange: (value)->
    cur = @getValue() || []
    if cur.indexOf(value) != -1
      cur.splice(cur.indexOf(value), 1)
    else
      cur.push value
    @update cur


  render: ->
    value = @getValue() || []

     # options loaded?
    return <div>...</div> if value.length > @props.options.length

    options = $.extend(true, [], @props.options)
    optionHash = {}

    for option,i in options
      optionHash[option.value] = option
      options[i].selected = (value.indexOf(option.value) != -1)
      options[i].className = "active selected" if options[i].selected

    options.sort (a,b) ->
      return -1 if a.selected && !b.selected
      return 1 if !a.selected && b.selected
      return 0
      # TODO: check sort order


    label = 'auswählen...'
    if value.length
      label = ''
      for v,i in value
        label += optionHash[v].label
        if i < value.length-2
          label += ', '
        else if i == value.length-2
          label += ' & '

    # ------------------


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
