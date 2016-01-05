React = require 'react'
moment = require 'moment'
liquidFlux = require 'liquidFlux/frontend'

Form = require 'react-materialform'
TextField = require 'react-materialform/TextField'
ImageUpload = require 'react-materialform/ImageUpload'
Date = require 'react-materialform/Date'
SubmitButton = require 'react-materialform/SubmitButton'

UserStore = require '../Store'
UserSelect = require './UserSelect'
checks = require('../helpers').checks

module.exports = React.createClass
  displayName: 'Step1'
  mixins:[liquidFlux.mixin]

  getFluxStates: (props)->
    users: UserStore.getUserNames()

  setStoreListener: -> [
      [UserStore, @refreshFluxStates, 'USERNAMES']
  ]

  submit: (values) ->
    @props.submit @props.step, values


  render: ->
    <Form className="content" onSubmit={@submit}>
      <div className="row">
        <div className="col s12 m4 offset-m2">
          <TextField
            name="name"
            label="Dein Spitzname"
            value={@props.name}
            checkValue={checks.name(@state.users)} />
        </div>
        <div className="col s12 m5">
          <blockquote>Der Name wird im Schichtplan angezeigt</blockquote>
        </div>
      </div>
      <div className="row">
        <div className="col s6 m2 offset-m2">
          <TextField
            name="firstname"
            label="Vorname"
            value={@props.firstname}
            checkValue={checks.required} />
        </div>
        <div className="col s6 m2">
          <TextField
            name="surname"
            label="Nachname"
            value={@props.surname}
            checkValue={checks.required} />
        </div>
      </div>
      <div className="row">
        <div className="col s12 m4 offset-m2">
          <ImageUpload
            name="photo"
            label="Foto"
            height={500}
            width={400}
            value={@props.photo} />
        </div>
        <div className="col s12 m5">
          <blockquote>Für den Schichtplan und deinen Helferausweis<br/><small>d.h. bitte Gesicht gut erkenntlich!</small></blockquote>
        </div>
      </div>
      <div className="row">
        <div className="col s12 m4 offset-m2">
          <Date
            name="birthday"
            label="Geburtstag"
            value={@props.birthday}
            checkValue={checks.birthday}
            min="1950-01-01"
            max="2009-12-31"
             />
        </div>
        <div className="col s12 m5">
          <blockquote>Nicht öffentlich, nur für rechtliches Gedöns</blockquote>
        </div>
      </div>
      <div className="row">
        <div className="col s12 m4 offset-m2">
          <UserSelect
            name="refererId"
            label="Dabei über"
            value={@props.refererId}
            searchable={true}
            nullLabel="bin Gratler der ersten Stunde" />
        </div>
        <div className="col s12 m5">
          <blockquote>Wie kamst du zu uns?<br /><small>Falls du schon lange dabei bist, brauchst du es nicht mehr ausfüllen</small></blockquote>
        </div>
      </div>
      <div className="row">
        <div className="col s6 right-align">
          <SubmitButton>
            <i className="mdi mdi-send right"></i>Weiter
          </SubmitButton>
        </div>
      </div>
    </Form>
