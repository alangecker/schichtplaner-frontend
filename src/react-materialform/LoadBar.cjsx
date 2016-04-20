React = require 'react'
require './styles/LoadBar'

module.exports = React.createClass
  displayName: 'LoadBar'
  render: ->
    <div className="load">
      <div className="bar" style={width:(if @props.load > 1 then '100' else @props.load*100)+'%'}></div>
      {if @props.load > 1
        <div className="overloadbar" style={width:(@props.load-1)*100+'%'}></div>
      }
      <div className="label">{Math.round(@props.load*100)}%</div>

    </div>
