React = require 'react'
{Table, Column, Cell} = require 'fixed-data-table'

rows = [
  ['a1', 'b1', 'c1']
  ['a2', 'b2', 'c2']
  ['a3', 'b3', 'c3']
]

ImageCell

module.exports = React.createClass
  displayName: 'UserList'
  render: ->
    <Table
      rowHeight={50}
      rowsCount={rows.length}
      width={900}
      height={500}
      headerHeight={50}>
      <Column
        header={<Cell></Cell>}
        cell={<Cell>Column 1 static content</Cell>}
        width={100}
      />
      <Column
        columnKey="name"
        header={<Cell>Name</Cell>}
        cell={<Cell>Column 2</Cell>}
        width={100}
      />
      <Column
        header={<Cell>Vorname</Cell>}
        cell={<Cell>Column 3</Cell>}
        width={100}
      />
      <Column
        header={<Cell>Vorname</Cell>}
        cell={<Cell>Column 3</Cell>}
        width={100}
      />
      <Column
        header={<Cell>Vorname</Cell>}
        cell={<Cell>Column 3</Cell>}
        width={100}
      />
      <Column
        header={<Cell>Geburtstag</Cell>}
        cell={<Cell>Column 3</Cell>}
        width={100}
      />
      <Column
        header={<Cell>E-Mail</Cell>}
        cell={<Cell>Column 3</Cell>}
        width={100}
      />
      <Column
        header={<Cell>Handynummer</Cell>}
        cell={<Cell>Column 3</Cell>}
        width={100}
      />
      <Column
        header={<Cell>Handynummer</Cell>}
        cell={<Cell>Column 3</Cell>}
        width={100}
      />
      <Column
        header={<Cell>Handynummer</Cell>}
        cell={<Cell>Column 3</Cell>}
        width={100}
      />
      <Column
        header={<Cell>Anwesend</Cell>}
        cell={<Cell>Column 3</Cell>}
        width={100}
      />
      <Column
        header={<Cell>Anwesend</Cell>}
        cell={<Cell>Column 3</Cell>}
        width={100}
      />
      <Column
        header={<Cell>Handynummer</Cell>}
        cell={<Cell>Column 3</Cell>}
        width={100}
      />
    </Table>
