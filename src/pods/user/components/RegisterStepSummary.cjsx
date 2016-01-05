React = require 'react'
moment = require 'moment'
liquidFlux = require 'liquidFlux/frontend'


UserStore = require '../Store'
UserActions = require '../Actions'
UserSelect = require './UserSelect'
ScheduleStore = require 'pods/schedule/Store'



module.exports = React.createClass
  displayName: 'Summary'
  mixins:[liquidFlux.mixin]

  getFluxStates: (props)->
    users: UserStore.getUserNames()

  setStoreListener: -> [
      [UserStore, @refreshFluxStates, 'USERNAMES']
      [ScheduleStore, @refreshFluxStates]
  ]

  submit: ->
    data = $.extend({}, @props) # clone
    delete data.password2
    delete data.submit
    delete data.step
    UserActions.register(data)

  render: ->
    referer = @state.users[@props.refererId].nick if @state.users[@props.refererId]
    partners = ''
    if @props.favoritePartners && @props.favoritePartners.length
      for v,i in @props.favoritePartners
        partners += @state.users[v].nick if @state.users[v]
        if i < @props.favoritePartners.length-2
          partners += ', '
        else if i == @props.favoritePartners.length-2
          partners += ' & '

    positions = ''
    if @props.favoritePositions && @props.favoritePositions.length
      for id,i in @props.favoritePositions
        title = ScheduleStore.getSchedule(id).title
        if title
          title = title.split('/')
          positions += if title.length > 1 then title[1] else title[0]
        if i < @props.favoritePositions.length-2
          positions += ', '
        else if i == @props.favoritePositions.length-2
          positions += ' & '

    <div className="row content step-summary">
      <div className="col s12 m3 offset-m2">
        <img src={@props.photo} />
      </div>
      <div className="col s12 m5">

        <h3 className="header">Zusammenfassung</h3>
        <div>
          <small>Du bist</small> {@props.firstname} <b>'{@props.name}'</b> {@props.surname}
          <small>, geboren am</small> {moment(@props.birthday).format('DD. MMMM YYYY')}
          {if referer
            # TODO: email, phone, present, favorites
            <span><small>. Dabei bist du über</small> {referer}</span>
          }
        </div>
        <div><small>Deine E-Mail ist</small> {@props.email}<small> und deine Handynummer lautet</small> {@props.mobile}</div>
        <br/><div>
          <small>Am Festival anwesend sein wirst du von </small> {moment(@props.present.start).format('dddd, HH:mm')} Uhr <small> bis </small> {moment(@props.present.end).format('dddd, HH:mm')} Uhr
          {if partners
            <span><small> und würdest gerne mit</small> {partners} <small> zusammenarbeiten</small></span>
          }
          {if positions
            <span><small>, am liebsten @ </small> {positions}</span>
          }
        </div>
        <blockquote>
          Stimmt denn alles?<br />
          <small>mit den Reitern oben kannst du nochmal zurück</small>
        </blockquote>
        <button className="btn" onClick={@submit}>
          Abschicken
        </button>
      </div>
    </div>
