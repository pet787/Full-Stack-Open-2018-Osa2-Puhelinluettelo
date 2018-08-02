import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    const nonExisting = {
      id: 10,
      name: 'Error test case',
      number: '111-111-111',
    } 
    let result = request.then(response => response.data.concat(nonExisting))
    return result
}

const createPerson = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const updatePerson = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const deletePerson = (id) => {
    console.log("delete",id)
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}
  
export default { getAll, createPerson, updatePerson, deletePerson }