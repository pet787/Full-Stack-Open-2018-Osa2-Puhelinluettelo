import React from 'react'

const PersonLine = ({ person, onClickDelete }) => {
  return (
    <tr>
      <td>{person.name}</td>
      <td>{person.number}</td>
      <td><button onClick={onClickDelete(person.name)}>Poista</button></td>
    </tr>
)
}

export default PersonLine