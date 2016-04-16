React = require 'react'
liquidFlux = require 'liquidFlux/frontend'
UserStore = require '../Store'
Shift = require './WidgetShift'


module.exports = React.createClass
  mixins:[liquidFlux.mixin]
  displayName: 'UserWidgetContent'

  getFluxStates: (props) ->
    console.log 'update widget'
    return {
      user: UserStore.getEventUser(props.id, props.eventId)
    }
  setStoreListener: -> [
      [UserStore, @refreshFluxStates, 'CHANGED_USER', (user) ->
        console.log user, user.event.id, @props.eventId
        return user.event.id == @props.eventId
      ]
  ]
  contextTypes:
    dayThreshold: React.PropTypes.number

  # id, list (-> prev,next), event
  render: ->
    return <div>Lade... </div> if not @state.user or not @state.user.events or not @state.user.events[@props.eventId]
    event = @state.user.events[@props.eventId]

    days = {}
    for shift in event.shifts
      start = moment(shift.start)
      if start.hour() < @context.dayThreshold
        start.subtract(1, 'd')
      days[start.format('dddd')] = [] if not days[start.format('dddd')]
      days[start.format('dddd')].push shift

    <div>
      <img src="http://cdn0.peterkroener.de/images/peterkroener.de/profil-peter-kroener.jpg" className="profilpicture" />
      <h4>{@state.user.name}</h4>
      <div className="input-field">
            <div>{@state.user.firstname+' '+@state.user.surname}</div>
            <label className="active">Voller Name</label>
      </div>
      {if event.MainPosition
        name = event.MainPosition.name.split('/')
        name[1] = name[0] if not name[1]
        <div className="input-field">
          <div>{name[1]}</div>
          <label className="active">Hauptposition</label>
        </div>
      }
      <div className="input-field">
            <div>
              <small>von</small> {moment(event.from).format('dddd, H')} Uhr<br />
              <small>bis</small> {moment(event.until).format('dddd, H')} Uhr
            </div>
            <label className="active">Anwesend</label>
      </div>
      { if @state.user.referer
        <div className="input-field">
          <div>{@state.user.referer}</div>
          <label className="active">dabei über</label>
        </div>
      }
      { if false # TODO: check if moderator
        load = @state.user.load/@state.user.maxLoad
        loadClass = 'load'+Math.round(load*5)

        <div className="row">
          <div className="col s6 input-field">
                <div>{moment(@state.user.birthday).format('DD.MM.YYYY')}</div>
                <label className="active">Geburtstag</label>
          </div>
          <div className="col s6 input-field">
                <div>
                  <div className={"cur "+loadClass} style={{width:(load*100*0.7)+'%'}}></div>
                  <div className="max"></div>
                </div>
                <label className="active">Auslastung</label>
          </div>
        </div>
      }
      {for day,shifts of days
        <div key={day}>
          <h5>{day}</h5>
          <ul className="collection shifts">
          {for shift in shifts
            <Shift userId={@props.userId} {...shift} key={shift.id} />
          }
          </ul>
        </div>
      }
      {if true # TODO: check if mod
        <div>
          <h5>Kontakt</h5>
          <ul className="collection">
            <li className="collection-item"><small>Email:</small> {@state.user.contact.email}</li>
            <li className="collection-item"><small>Telefon:</small> {@state.user.contact.mobile}</li>
          </ul>
        </div>
      }

    </div>
