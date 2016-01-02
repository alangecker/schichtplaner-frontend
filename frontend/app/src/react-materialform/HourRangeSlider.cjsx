React = require 'react'
InputMixin = require './common/InputMixin'


module.exports = React.createClass
  mixins: [InputMixin]
  displayName: 'HourRangeSlider'

  onChange: ->
    # @update @refs.input.value


  startLeftDrag: (e) ->
    @startDrag 'left', e

  startRightDrag: (e) ->
    @startDrag 'right', e

  startDrag: (target, e) ->
    e.preventDefault()

    # times
    start = moment(@props.start)
    range = moment(@props.end).diff(start, 'h')

    # DOM
    wrapper = $(@refs.wrapper)
    body = $(document.body)
    left = $(@refs.left)
    right = $(@refs.right)
    active = if target == 'left' then left else right

    # add active-classes
    active.addClass('noUi-active')
    wrapper.addClass('noUi-state-drag')


    width = wrapper.width()
    startX = e.pageX-(active.offset().left-wrapper.offset().left)
    moving = (e2) =>
      position = e2.pageX-startX
      hours = Math.round(position/width*range)

      if target == 'left'
        if position <= width && hours > 0
          cur = moment(start).add(hours, 'h')
          curEnd = @getValue().end
          if moment(cur).add(@props.min, 'h').isBefore(curEnd)
            @update
              start: cur.format()
              end: curEnd
      else
        if position <= width && hours > 0
          cur = moment(start).add(hours, 'h')
          curStart = @getValue().start
          if moment(cur).subtract(@props.min, 'h').isAfter(curStart)
            @update
              start: curStart
              end: cur.format()
        ;
      # active.css('left', (position/width*100)+'%')



    body.on 'mousemove', moving

    body.on 'mouseup', ->
      active.removeClass('noUi-active')
      wrapper.removeClass('noUi-state-drag')
      body.off 'mousemove', moving


  render: ->
    start = moment(@props.start)
    range = moment(@props.end).diff(start, 'h')
    left = moment(@getValue().start).diff(start, 'h')/range
    right = moment(@getValue().end).diff(start, 'h')/range
    <div className="input-field">
      <div ref="wrapper" className="noUi-target noUi-ltr noUi-horizontal noUi-background">
        <div className="noUi-base">
          <div ref="left" className="noUi-origin noUi-connect" style={{left: (left*100)+'%'}}>
            <div onMouseDown={@startLeftDrag} className="noUi-handle noUi-handle-lower">
              <div className="range-label"><span>8</span></div>
            </div>
          </div>
          <div ref="right" className="noUi-origin noUi-background" style={{left: (right*100)+'%'}}>
            <div onMouseDown={@startRightDrag} className="noUi-handle noUi-handle-upper">
              <div className="range-label"><span>80</span></div>
            </div>
          </div>
        </div>
      </div>
      <label htmlFor={"reactform-#{@props.name}"} data-error={@state.errorText} className="active">{@props.label}</label>
    </div>
