import React, { useState, useEffect } from 'react'
import localStorage from 'local-storage'
import { search } from './utils'
import './AutoCompleteText.css'

import SelectedSuggestions from './SelectedSuggestions'

function AutoComplete() {

  const [suggestions, setSuggestions] = useState([])
  const [text, setText] = useState("")
  const [suggestionSelected, setSuggestionSelected] = useState([''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect( () => {
    setSuggestionSelected(getLocalStorage())
  },[])

  const reqForSuggestionApi = async value => {
    setIsLoading(true)

    const data = await search('https://cors-anywhere.herokuapp.com/http://en.wikipedia.org/w/api.php?action=opensearch&limit=10&format=json&search=' + value)
    
    if (data.message) {
      setError(data)
      setIsLoading(false)
    }else if (!data[1])  {
      setIsLoading(true)
    }else {
      let suggestions = data[1].map(item => item)
      if(suggestions.length > 0) {
        setSuggestions(suggestions)
        setIsLoading(false)
        setError(null)
      } else {
        setSuggestions(["No suggestions found"])
        setIsLoading(false)
        setError(null)

      }
    }
  }

  const handleSearchTextChange= async e => {
    const value = e.target.value
    if (value === '') {
      setSuggestions([])
      setText(value)
      setError(null)
    } else {
      reqForSuggestionApi(value)
      setText(value)
    }
  }

  const getLocalStorage = () => {
    const localStorageData = localStorage.get('searchItems')
    if(localStorageData === null) {
      return []
    } else return localStorageData
  }

  const handleRemove = (itemIndexToRemove) => {
    const itemList = [...suggestionSelected];
    itemList.splice(itemIndexToRemove, 1);
    setSuggestionSelected(itemList);

    localStorage.set('searchItems', itemList);
  }

  const handleRemoveAll = () => {
    setSuggestionSelected([]);
    localStorage.set('searchItems', []);
  }

  const onSuggestionSelected = (value) => {
    var newItem = {[+(new Date())]: value}
    
    setText('')
    setSuggestions([])
    setSuggestionSelected([...suggestionSelected, newItem])

    var suggestionSelectedForLocalStorage = getLocalStorage()
    suggestionSelectedForLocalStorage.push(newItem)
    localStorage.set('searchItems', suggestionSelectedForLocalStorage);
  }

  const renderSuggestions = () => {
    if(suggestions.length === 0) {
      return null
    }

    return (
        <ul className="suggestionLists">
          { suggestions.map( (item, index) => <li key={index} onClick={() => onSuggestionSelected(item)}>{item}</li>)}
        </ul>
    )
  }

  return (
    <div className="AutoCompleteText">
      <div className="InputAndSuggestionContainer">
        <input value={text} onChange={e => handleSearchTextChange(e)} type="text"/>
        <div className="suggestionListsContainer">
          {error ? <div className="errorMsg"><h3>{error.message}</h3></div> : null} 
          { 
            !isLoading ? (renderSuggestions()) 
            : 
            (<h3 className="loadingMsg">Loading...</h3>)
          } 
        </div>
      </div>
      <SelectedSuggestions suggestionSelected={suggestionSelected} 
        handleRemove={handleRemove}
        handleRemoveAll={handleRemoveAll}
      />
    </div>
  )
}

export default AutoComplete
