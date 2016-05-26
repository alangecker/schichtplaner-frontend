React = require 'react'
liquidFlux = require 'liquidFlux/frontend'
DropDown = require 'react-materialform/common/DropDown'

module.exports = React.createClass
  displayName: 'UserCenter'

  render: ->
    if false
      <div>
        <a href="#/login" className="button">Moderation</a>
        <DropDown
          id="usercenter-selector"
          menu={[]}
          className=""
          buttonText={'Andi'}
          style={{width:80}} />
      </div>
    else
      <div>
        <a href={"#/#{@props.event}/moderation"} className="button">Moderation</a>
        <a href="#/login" className="button">Login</a>
        <a href="#/register" className="button">Registrierung</a>
      </div>
