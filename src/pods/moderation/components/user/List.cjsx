React = require 'react'
{Table, Column, Cell} = require 'fixed-data-table'
LoadBar = require 'react-materialform/LoadBar'
Table = require 'responsive-fixed-data-table'

Picture = React
rows = {
  length:120
}

module.exports = React.createClass
  displayName: 'UserList'
  render: ->
    height = 45+51*rows.length
    height = 500 if height > 500
    # width={800}
    # height={height}
    <div style={height:'80%',width:'100%',position:'fixed'}>
      <Table
        rowHeight={50}
        rowsCount={120}
        headerHeight={30}>
        <Column
          header={<Cell></Cell>}
          cell={<img src="https://s3.amazonaws.com/uifaces/faces/twitter/aaronalfred/128.jpg" height="50"/>}
          width={50}
          fixed={true}
        />
        <Column
          columnKey="name"
          header={<Cell>Name</Cell>}
          cell={<Cell>Musti</Cell>}
          width={100}
          fixed={true}
        />
        <Column
          header={<Cell>Auslastung</Cell>}
          cell={<Cell>
              <LoadBar load={Math.random()} />
              <span>15 Schichten</span>
            </Cell>}
          width={100}
          fixed={true}
        />
        <Column
          header={<Cell>Gruppen</Cell>}
          cell={<Cell>Küchenteam & Ordner</Cell>}
          width={100}
        />
        <Column
          columnKey="name"
          header={<Cell>Answesend</Cell>}
          cell={<Cell>von Fr. 14:00<br />bis So. 13:00</Cell>}
          width={100}
        />
        <Column
          header={<Cell>Vorname</Cell>}
          cell={<Cell>Max</Cell>}
          width={100}
        />
        <Column
          header={<Cell>Nachname</Cell>}
          cell={<Cell>Muster</Cell>}
          width={100}
        />
        <Column
          header={<Cell>Geburtstag</Cell>}
          cell={<Cell>17.2.1337</Cell>}
          width={100}
        />
        <Column
          header={<Cell>E-Mail</Cell>}
          cell={<Cell>max@mustermanns.de</Cell>}
          width={100}
        />
        <Column
          header={<Cell>Handynummer</Cell>}
          cell={<Cell>+49 1512 / 7561542</Cell>}
          width={100}
        />
        <Column
          header={<Cell>dabei über</Cell>}
          cell={<Cell>Herbert</Cell>}
          width={100}
        />
      </Table>
    </div>
