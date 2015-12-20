React = require 'react'


MenuEntry = React.createClass
  displayName: 'MenuEntry'
  handleClick: (e) ->
    e.preventDefault() if not @props.href or @props.href == '#'
    @props.handler @props.value
  render: ->
      classNames = []
      classNames.push 'active selected' if @props.active
      classNames.push @props.className if @props.className

      <li className={classNames.join(' ')}>
        {if @props.disabled
          <span>{@props.children}</span>
        else
          <a href={if @props.href then @props.href else '#'} onClick={@handleClick}>{@props.children}</a>
        }
      </li>

# ------------------------------------------------


module.exports = React.createClass
  displayName: 'DropDown'

  componentDidMount: ->
    $(@refs.button).dropdown(belowOrigin:true)

  change: (value) ->
    @props.onChange value if @props.onChange

  focus: (e) ->
    @props.onFocus() if @props.onFocus

  getMenu: (menu) ->
    entries = []
    for option,i in menu
      entries.push <MenuEntry key={i} {...option} active={@props.activeValue != undefined && option.value == @props.activeValue} handler={@change}>
                      {option.label}
                  </MenuEntry>

    return entries

  render: ->
    <div className={if @props.className then @props.className} style={@props.style}>
      <input type="text" className="select-dropdown" readOnly="true" value={@props.buttonText} data-activates={@props.id} ref="button" onClick={@focus} />
      <ul id={@props.id} className="dropdown-content select-dropdown">
        {@getMenu(@props.menu)}
      </ul>
    </div>
