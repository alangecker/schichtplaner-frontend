require '../styles/DropDown'
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

  getInitialState: ->
    searchString: ''

  componentDidMount: ->
    $(@refs.button).dropdown(belowOrigin:true)
    if @props.searchable
      $(@refs.search).click (e) ->
        e.preventDefault()
        e.stopPropagation()

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

  updateSearch: ->
    @setState searchString: @refs.search.value


  render: ->
    menu = @props.menu
    if @props.searchable && @state.searchString
      searching = @state.searchString.toLowerCase()
      menu = menu.filter (o) ->
        if o.searchKeys
          for key in o.searchKeys
            return true if key.toLowerCase().indexOf(searching) == 0
        return false

    <div className={if @props.className then @props.className} style={@props.style}>
      <input type="text" className="select-dropdown" tabIndex="-1" readOnly="true" value={@props.buttonText} data-activates={@props.id} ref="button" onClick={@focus} />
      <ul id={@props.id} className="dropdown-content select-dropdown">
        {if @props.searchable
          <li className="search">
            <input ref="search" type="text" placeholder="Suche..." value={@state.searchString} onChange={@updateSearch}/>
          </li>
        }
        {@getMenu(menu)}
      </ul>
    </div>
