React = require 'react'
moment = require 'moment'

liquidFlux = require 'liquidFlux/frontend'
ShiftStore = require '../../shift/Store'
ShiftActions = require '../../shift/Actions'


Timetable = require 'react-timetable'

Shift = require './Shift'
ShiftEditable = require './ShiftEditable'



module.exports = React.createClass
  mixins: [liquidFlux.mixin]
  displayName: 'EditTimeline'

  getFluxStates: (props) ->
    shifts: ShiftStore.getShiftsByScheduleId(props.scheduleId)

  setStoreListener: -> [
      [ShiftStore, @refreshFluxStates] # TODO: nicht bei allen Schedules
  ]


  updateShift: (shiftId, start, end) ->
    ShiftActions.updateTimes shiftId, start, end
#
  addShift: (time) ->
    return if moment().isAfter(time)
    ShiftActions.add @props.scheduleId, time.format(), time.add(2,'h').format()

  deleteShift: (shiftId) ->
    ShiftActions.delete shiftId

  render: ->
    now = moment()
    <div className="edit">

        <Timetable start={@props.start} end={@props.end} onHourClick={@addShift}>
          {for shift in @state.shifts
            if shift.UserId or now.isAfter(shift.start)
              <Shift {...shift} key={shift.id} className="disabled">

              </Shift>
            else
              <ShiftEditable {...shift} key={shift.id} onUpdate={@updateShift}  onDelete={@deleteShift} minValue={now} />

          }
        </Timetable>
    </div>
