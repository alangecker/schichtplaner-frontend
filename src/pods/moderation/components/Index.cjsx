# require '../styles/event'
React = require 'react'


module.exports = React.createClass
  displayName: 'Moderator'


  render: ->
    <div className="content">
        <h4 className="header">Moderation</h4>
        <ul className="tabs content" ref="tabs">
            <li className="tab col s3">
              <a href={"#/#{@props.params.event}/moderation/user"} className={if false then 'active'}>Helfer</a>
            </li>
            <li className="tab col s3">
              <a href={"#/#{@props.params.event}/moderation/shifts"} className={if false then 'active'}>Schichten</a>
            </li>
            <li className="tab col s3">
              <a href={"#/#{@props.params.event}/moderation/conflicts"} className={if false then 'active'}>Konflikte</a>
            </li>
        </ul>
        {@props.children}
    </div>
