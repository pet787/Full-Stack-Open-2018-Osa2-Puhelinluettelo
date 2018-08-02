import React from 'react';
import Filter from './Filter'
import PersonLine from './PersonLine'
import PersonsService from '../services/persons'

class App extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            persons: [],
            newName: '',
            newNumber: '',
            rajaa: '',
            notificationMessage : null
        }
    }

    notification= (message) => {
        this.setState({ 
            notificationMessage: message,
        })
        setTimeout(() => {
            this.setState({ notificationMessage: null })
        }, 2000)
    } 

    componentDidMount() {
        console.log('componentDidMount')
        PersonsService
        .getAll()
        .then(response => {
            console.log('componentDidMount promise fulfilled')
            this.setState({ persons: response })
        })
    }
    
    addPerson(personName, personNumber ) {
        const newPersonObject = { 
            name: personName, 
            number: personNumber 
        }
        console.log("addPerson", newPersonObject);
        PersonsService
        .createPerson(newPersonObject)
        .then(newPerson => {
          this.setState({
            persons : this.state.persons.concat(newPerson), 
            newName: '', 
            newNumber: '' 
          })
          document.getElementById("nimi").value = "";
          document.getElementById("numero").value = "";
          this.notification("lisättiin " + personName );
        })
        .catch(error => {
            this.notification( personName + " lisäys palautti virheen"  );
        })
    }

    updatePerson(id, name, number) {
        const newPersonObject = { 
            name: name, 
            number: number 
        }
        console.log( "updatePerson", newPersonObject );
        PersonsService
        .updatePerson( id, newPersonObject )
        .then( response => {
            console.log("update response", response)
            const persons = this.state.persons;
            this.setState({
                persons : persons.map( 
                    person => person.id !== id ? person : response 
                ), 
                newName: '', 
                newNumber: '' 
              })
          document.getElementById("nimi").value = "";
          document.getElementById("numero").value = "";
          this.notification("muutettiin " + name );
        })
        .catch(error => {
            this.notification( name + " lisätään muutoksen sijaan"  );
            this.addPerson(name,number);
        })
    }

    addName = (event) => {
        event.preventDefault();
        const persons = this.state.persons;
        const personName = this.state.newName;
        const personNumber = this.state.newNumber;
        let person = persons.filter(person => person.name === personName )
        if ( person.length === 0 ) {
            this.addPerson(personName, personNumber )
        } else {
            const confirm = window.confirm( 
                personName + " on jo luettelossa, korvataanko vanha numero?" 
            );
            if ( confirm ) {
                const personId = person[0].id;
                this.updatePerson(personId, personName, personNumber );
            }    
        }
    }

    deleteName = (id) => () => {
        return () => {
            const personName = this.state.persons.filter(p => p.id === id)[0].name
            const confirm = window.confirm("Poistetaanko " + personName + "?" );
            if (confirm) {
                console.log( "Delete", personName )
                const persons = this.state.persons.filter(p => p.id !== id)
                PersonsService
                .deletePerson(id)
                .then(response => {
                    this.notification( "poistettiin " + personName );
                })
                .catch(error => {
                    this.notification( personName + " poisto palautti virheen"  );
                })
                this.setState({ persons: persons })
            }
        }
      }

    changeRajaa =(value) => {
        this.setState({ rajaa: value })
    }

    changeName = (event) => {
        this.setState({ newName: event.target.value })
    }

    changeNumero = (event) => {
        this.setState({ newNumber: event.target.value })
    }

    render() {

        const Rajaa = (person) => {
            const s = person.name.toLowerCase();
            return s.search( this.state.rajaa ) >= 0;
        }
        
        const Notification = ({ message }) => {
            if (message === null) {
              return null
            }
            return (
              <div className="notification">
                {message}
              </div>
            )
          }

        return (
            <div>
            <h2>Puhelinluettelo</h2>
            <Notification message={this.state.notificationMessage}/>
            <form onSubmit={this.addName}>
            <Filter onChange = {this.changeRajaa}/>
            <h2>Lisää uusi tai muuta olemassa olevaa</h2>
            <div>
                nimi: <input id="nimi" onChange={this.changeName}/>
            </div>
            <div>
                numero: <input id="numero" onChange={this.changeNumero}/>
            </div>
            <div>
                <button type="submit">lisää</button>
            </div>
            </form>
            <h2>Numerot</h2>
            <table><tbody>
            <tr>
                <th>Nimi</th>
                <th>Numero</th>
                <th>Poista</th>
            </tr>
            {this.state.persons
                .filter(Rajaa)
                .map(person => <PersonLine 
                    key={person.id} 
                    person={person} 
                    onClickDelete={this.deleteName(person.id)}
                />)
            }
            </tbody></table>
        </div>
        )
    }
}

export default App