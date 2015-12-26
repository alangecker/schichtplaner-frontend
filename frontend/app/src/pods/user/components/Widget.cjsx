React = require 'react'
liquidFlux = require 'liquidFlux/frontend'
Picker = require 'react-materialform/common/Picker'
UserStore = require '../Store'


module.exports = React.createClass
  mixins:[liquidFlux.mixin]
  displayName: 'UserWidget'

  getFluxStates: (props) ->
      user: UserStore.getEventUser(props.id, props.eventId)
  setStoreListener: -> [
      [UserStore, @refreshFluxStates, 'CHANGE']
  ]
  # id, list (-> prev,next), event
  render: ->
    <Picker label={@props.children} className="widget-user">
      <img src="http://cdn0.peterkroener.de/images/peterkroener.de/profil-peter-kroener.jpg" className="profilpicture" />
      <h4>Andi <a href="#">bearbeiten</a></h4>
      <div className="input-field">
            <div>Andreas Langecker</div>
            <label className="active">Voller Name</label>
      </div>
      <div className="input-field">
            <div>02.04.1993</div>
            <label className="active">Geburtstag (only mod)</label>
      </div>
      <div className="input-field">
        <div>Helferbüro</div>
        <label className="active">Hauptposition</label>
      </div>
      <div className="input-field">
            <div><small>von</small> Freitag, 16 Uhr<br /><small>bis</small> Sonntag, 13 Uhr</div>
            <label className="active">Anwesend</label>
      </div>
      <div className="input-field">
        <div>Sandra Langecker</div>
        <label className="active">dabei über</label>
      </div>
      <div className="input-field">
            <div>
              <div className="cur" style={{width:'80%'}}></div>
              <div className="max"></div>
            </div>
            <label className="active">Auslastung (only mod)</label>
      </div>
      <h5>Freitag</h5>
      <ul className="collection shifts">
        <li className="collection-item row">
          <div className="col s8">
            <div className="title">Küche</div>
            <small>mit:</small> Michi, René & Korbi
          </div>
          <div className="col s3">
            <small>von</small> 16:00<br />
            <small>bis</small> 18:00
          </div>
          <div className="col s1">
            %
          </div>
        </li>
        <li className="collection-item row">
          <div className="col s8">
            <div className="title">Küche</div>
            <small>mit:</small> Michi, René & Korbi
          </div>
          <div className="col s3">
            <small>von</small> 16:00<br />
            <small>bis</small> 18:00
          </div>
          <div className="col s1">
            %
          </div>
        </li>
        <li className="collection-item row">
          <div className="col s8">
            <div className="title">Küche</div>
            <small>mit:</small> Michi, René & Korbi
          </div>
          <div className="col s3">
            <small>von</small> 16:00<br />
            <small>bis</small> 18:00
          </div>
          <div className="col s1">
            %
          </div>
        </li>
      </ul>
      <h5>Freitag</h5>
      <ul className="collection shifts">
        <li className="collection-item row">
          <div className="col s8">
            <div className="title">Küche</div>
            <small>mit:</small> Michi, René & Korbi
          </div>
          <div className="col s3">
            <small>von</small> 16:00<br />
            <small>bis</small> 18:00
          </div>
          <div className="col s1">
            %
          </div>
        </li>
        <li className="collection-item row">
          <div className="col s8">
            <div className="title">Küche</div>
            <small>mit:</small> Michi, René & Korbi
          </div>
          <div className="col s3">
            <small>von</small> 16:00<br />
            <small>bis</small> 18:00
          </div>
          <div className="col s1">
            %
          </div>
        </li>
        <li className="collection-item row">
          <div className="col s8">
            <div className="title">Küche</div>
            <small>mit:</small> Michi, René & Korbi
          </div>
          <div className="col s3">
            <small>von</small> 16:00<br />
            <small>bis</small> 18:00
          </div>
          <div className="col s1">
            %
          </div>
        </li>
      </ul>
      <h5>Freitag</h5>
      <ul className="collection shifts">
        <li className="collection-item row">
          <div className="col s8">
            <div className="title">Küche</div>
            <small>mit:</small> Michi, René & Korbi
          </div>
          <div className="col s3">
            <small>von</small> 16:00<br />
            <small>bis</small> 18:00
          </div>
          <div className="col s1">
            %
          </div>
        </li>
        <li className="collection-item row">
          <div className="col s8">
            <div className="title">Küche</div>
            <small>mit:</small> Michi, René & Korbi
          </div>
          <div className="col s3">
            <small>von</small> 16:00<br />
            <small>bis</small> 18:00
          </div>
          <div className="col s1">
            %
          </div>
        </li>
        <li className="collection-item row">
          <div className="col s8">
            <div className="title">Küche</div>
            <small>mit:</small> Michi, René & Korbi
          </div>
          <div className="col s3">
            <small>von</small> 16:00<br />
            <small>bis</small> 18:00
          </div>
          <div className="col s1">
            %
          </div>
        </li>
      </ul>
      <h5>Kontakt (only mod)</h5>
      <ul className="collection with-header">
        <li className="collection-item">Email: a.langecker@posteo.de</li>
        <li className="collection-item">Telefon: +49 1512 7561542</li>
      </ul>

    </Picker>
