React = require 'react'
moment = require 'moment'
liquidFlux = require 'liquidFlux/frontend'


UserStore = require '../Store'
UserSelect = require './UserSelect'
ScheduleStore = require 'pods/schedule/Store'


module.exports = React.createClass
  displayName: 'Summary'
  mixins:[liquidFlux.mixin]

  getFluxStates: (props)->
    users: UserStore.getUserNames()
    event: ScheduleStore.getEvent(props.event)

  setStoreListener: -> [
      [UserStore, @refreshFluxStates, 'USERNAMES']
      [ScheduleStore, @refreshFluxStates]
  ]
  render: ->
    referer = @state.users[@props.refererId].nick if @state.users[@props.refererId]
    <div className="row content step-summary">
      <div className="col s12 m3 offset-m2">
        <img src={@props.photo} />
      </div>
      <div className="col s12 m7">

        <h3 className="header">Zusammenfassung</h3>
        <div><small>Du bist</small> {@props.firstname} <b>'{@props.name}'</b> {@props.surname}</div>
        <div><small>geboren am</small> {moment(@props.birthday).format('DD. MMMM YYYY')}</div>
        {if referer
          # TODO: email, phone, present, favorites 
          <div><small>dabei bist du über</small> {referer}</div>
        }

        <blockquote>
          Stimmt denn alles?<br />
          <small>mit den Reitern oben kannst du nochmal zurück</small>
        </blockquote>
        <button className="btn">
          Abschicken
        </button>
      </div>
    </div>
