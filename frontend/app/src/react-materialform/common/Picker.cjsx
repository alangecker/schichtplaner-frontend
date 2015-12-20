React = require 'react'




module.exports = React.createClass
  displayName: 'Picker'
  getInitialState: ->
    open: false


  componentDidUpdate: ->
    closeButtons = $('[data-close]', @refs.box)
    closeButtons.off("click", @close)
    closeButtons.on("click", @close)

  close: ->
    @setState open: false
    @props.onClose() if @props.onClose
  open: ->
    @setState open: true
    @props.onOpen() if @props.onOpen

  dont: (e)->
    e.preventDefault()
    e.stopPropagation()

  render: ->
    <div className={@props.className}>
      <input onClick={@open} id="test" type="text" className="picker__input picker__input--active truncate"  value={@props.label} readOnly={true} tabindex="-1"/>
      {if @state.open
        <div className="picker picker--focused picker--opened" id="test_root" tabindex="0" aria-hidden="false">
          <div className="picker__holder" onClick={@close}>
            <div className="picker__frame" onClick={@dont}>
              <div className="picker__wrap">
                <div className="picker__box" ref="box">
                  {@props.children}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
