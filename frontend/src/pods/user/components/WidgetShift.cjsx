React = require 'react'


module.exports = React.createClass
  displayName: 'UserWidgetShift'


  render: ->
    schedule = @props.schedule.split('/')
    schedule[1] = schedule[0] if not schedule[1]
    partners = ""
    for partner,i in @props.partners
      partners += partner
      if i == @props.partners.length-2
        partners += ' & '
      else if i < @props.partners.length-2
        partners += ', '

    start = moment(@props.start)

    <li className="collection-item row">
      <div className="col s8">
        <div className="title">{schedule[1]}</div>
        {if @props.partners.length
          <div><small>mit:</small> {partners}</div>
        }
      </div>
      <div className="col s3">
        <small>von</small> {start.format('HH:mm')}<br />
        <small>bis</small> {moment(@props.end).format('HH:mm')}
      </div>
      <div className="col s1">
      {if @props.opened and @props.userId != 0 and start.isBefore(moment().subtract(1, 'h')) #TODO: @state.loggedinId
        <a href="#/2016/trade/1234"><i className="mdi mdi-repeat" /></a>
      }
      </div>
    </li>
