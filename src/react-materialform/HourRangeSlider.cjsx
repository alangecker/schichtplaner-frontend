React = require 'react'
InputMixin = require './common/InputMixin'

require './styles/slider'

module.exports = React.createClass
  mixins: [InputMixin]
  displayName: 'HourRangeSlider'

  onChange: ->
    @update @refs.input.value

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
    $('.noUi-handle', active).addClass('noUi-active')
    wrapper.addClass('noUi-state-drag')


    width = wrapper.width()
    startX = e.pageX-(active.offset().left-wrapper.offset().left)
    moving = (e2) =>
      position = e2.pageX-startX
      hours = Math.round(position/width*range)

      if target == 'left'
        cur = moment(start).add(hours, 'h')
        curEnd = @getValue().end
        if position <= width && hours >= 0
          if moment(cur).add(@props.min-1, 'h').isBefore(curEnd)
            @update
              start: cur.format()
              end: curEnd
          else
            ;#TODO: set to max possible
        else
          @update
            start: @props.start
            end: curEnd

      else
        cur = moment(start).add(hours, 'h')
        curStart = @getValue().start
        if position <= width && hours >= 0
          if moment(cur).subtract(@props.min-1, 'h').isAfter(curStart)
            @update
              start: curStart
              end: cur.format()
          else
            ;#TODO: set to max possible
        else
          @update
            start: curStart
            end: @props.end

    body.on 'mousemove', moving

    body.on 'mouseup', ->
      $('.noUi-handle', active).removeClass('noUi-active')
      wrapper.removeClass('noUi-state-drag')
      body.off 'mousemove', moving


  render: ->
    rangeStart = moment(@props.start)
    range = moment(@props.end).diff(rangeStart, 'h')

    start = moment(@getValue().start)
    end = moment(@getValue().end)

    left = start.diff(rangeStart, 'h')/range
    right = end.diff(rangeStart, 'h')/range
    <div className="input-field range-slider">
      <div ref="wrapper" className="noUi-target noUi-ltr noUi-horizontal noUi-background">
        <div className="noUi-base">
          <div ref="left" className="noUi-origin noUi-connect" style={{left: (left*100)+'%'}}>
            <div onMouseDown={@startLeftDrag} className="noUi-handle noUi-handle-lower">
            </div>
          </div>
          <div ref="right" className="noUi-origin noUi-background" style={{left: (right*100)+'%'}}>
            <div onMouseDown={@startRightDrag} className="noUi-handle noUi-handle-upper">
            </div>
          </div>
        </div>
      </div>
      <div className="current">
        <div style={{float:'right'}}><small>Bis:</small> {end.format(@props.format)}</div>
        <div><small>Von:</small> {start.format(@props.format)}</div>
      </div>
      <label htmlFor={"reactform-#{@props.name}"} data-error={@state.errorText} className="active">{@props.label}</label>
    </div>
