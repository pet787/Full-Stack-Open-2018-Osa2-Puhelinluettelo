import React from 'react';

const Filter = ({onChange}) => {
    
    const onChangeRajaa = (event) => {
        onChange( event.target.value )    
    }
    
    return ( 
        <div>
            rajaa näytettäviä <input id="rajaa" onChange={onChangeRajaa}/>
        </div>
    )
}

export default Filter;
