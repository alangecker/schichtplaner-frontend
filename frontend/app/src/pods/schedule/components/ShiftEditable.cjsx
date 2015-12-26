React = require 'react'
moment = require 'moment'

ShiftActions = require '../../shift/Actions'
GroupPicker = require 'pods/user/components/GroupPicker'
ShiftCommentPicker = require './ShiftCommentPicker'

module.exports = React.createClass
  displayName: 'ShiftEditable'

  getInitialState: ->
    newComment: null


  updated: (top, height) ->
    if(top != null)
      start = moment(@props.gridStart).add(top/@props.hourHeight*60, 'm')
    else
      start = moment(@props.start)

    end = moment(start).add(height/@props.hourHeight*60, 'm')
    return if start.isSame(@props.start) && end.isSame(@props.end)
    @props.onUpdate @props.id, start.format(), end.format()

  remove: (e) ->
    e.preventDefault()
    e.stopPropagation()
    @props.onDelete @props.id

  updateGroups: (groupIds) ->
    ShiftActions.updateGroups(@props.id, groupIds)

  updateComment: ->
    @setState newComment: @refs.comment


  onPickerOpen: ->
    $(@refs.event).addClass('picker-open')

  onPickerClose: ->
    $(@refs.event).removeClass('picker-open')

  render: ->
    <div className="event editable" onMouseDown={@onMouseDown} ref="event">
      <div className="buttons">
        <a href="#" onClick={@remove}>X</a>
      </div>
      <div className="time">
        {moment(@props.start).format('HH:mm')+' - '+moment(@props.end).format('HH:mm')}
      </div>
      <GroupPicker
        multiple={true}
        selected={@props.AllowedGroups}
        nullAreAll={true}
        allLabel="Für "
        prefix="nur für "
        placeholder="Einschränken..."
        description="Schicht nur für folgende Gruppen möglich"
        onPickerOpen={@onPickerOpen}
        onPickerClose={@onPickerClose}
        onUpdate={@updateGroups}
        />
      <div className="comment truncate">
        {# TODO: change comment
          if @props.comment
            @props.comment
        }
      </div>
    </div>







  snapY: (height) ->
    return height-height%(@props.hourHeight/2)

  getMinimumTop: ->
    return 0 if not @props.minValue
    hours = @props.minValue.diff(@props.gridStart, 'm')
    minTop = Math.ceil(hours/60)*@props.hourHeight
    minTop = 0 if minTop < 0
    return minTop



  # Drag & Drop
  # ====================================
  onMouseDown: (e) ->
    e.preventDefault()
    $(@refs.event).addClass('onEdit')
    container = $(@refs.event).parent()
    position =  e.pageY - container.offset().top

    # which action should be triggered?
    if position <= 2
      @doResizeTop(e, container)
    else if position >= container.height()-2
      @doResizeBottom(e, container)
    else
      @doMove(e, container)


  doMove: (e, container) ->
    minTop = @getMinimumTop()

    offset = e.screenY-container.position().top
    body = $(document.body)
    body.css 'cursor', 'move'

    body.on 'mousemove', (e) =>
        y = e.screenY-offset
        maxHeight = @props.gridEnd.diff(@props.gridStart, 'h')*@props.hourHeight
        if y <= minTop
          y = minTop
        else if y+container.height() > maxHeight
          y = maxHeight-container.height()

        container.css 'top', @snapY(y)

    body.on 'mouseup', (e) =>
      @release()
      @updated @snapY(e.screenY-offset), container.height()

  doResizeTop: (e, container) ->
    minTop = @getMinimumTop()
    offset = e.screenY-container.position().top
    heightOffset = container.position().top+container.height()
    grid = $(document)
    body = $(document.body)
    $(document.body).css 'cursor', 'row-resize'

    body.on 'mousemove', (e) =>
      top = @snapY(e.screenY-offset, 1)
      height = @snapY(heightOffset-top, 1)
      if(top >= minTop)
        container.css 'top', top
        container.css 'height', height

    body.on 'mouseup', (e) =>
      @release()
      @updated @snapY(e.screenY-offset), container.height()

  doResizeBottom: (e, container) ->
    offset = e.screenY-container.height()
    grid = $(document)
    body = $(document.body)
    $(document.body).css 'cursor', 'row-resize'

    body.on 'mousemove', (e) =>
      height = @snapY(e.screenY-offset)
      if(height > 0)
        container.css 'height', height


    body.on 'mouseup', (e) =>
      @release()
      @updated null, container.height()

  release: ->
    body = $(document.body)
    body.off 'mousemove'
    body.off 'mouseup'
    $(@refs.event).removeClass('onEdit')
    body.css 'cursor', ''
