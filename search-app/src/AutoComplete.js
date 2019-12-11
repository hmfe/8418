import React, { Component } from 'react'
import localStorage from 'local-storage'
import { search } from './utils'
import './AutoCompleteText.css'

import SelectedSuggestions from './SelectedSuggestions'

export default class AutoComplete extends Component {

    state = {
      suggestions: [],
      text: '',
      suggestionSelected: [],
      isLoading: false,
      error: null
    }

  componentDidMount() {
      this.setState({suggestionSelected: this.getLocalStorage()})  
  }

  reqForSuggestionApi = async value => {
    this.setState({ isLoading: true})
    const data = await search('https://cors-anywhere.herokuapp.com/http://en.wikipedia.org/w/api.php?action=opensearch&limit=10&format=json&search=' + value)
    
    if (data.message) {
      this.setState({
        error: data,
        isLoading: false
      })
    }else if (!data[1])  {
      this.setState({ isLoading: true})
    }else {
      var suggestions = data[1].map(item => item)
      if(suggestions.length > 0) {
        this.setState({
          suggestions: suggestions,
          isLoading: false,
          error: null
        })
      } else {
        this.setState({
          suggestions: ["No suggestions found"],
          isLoading: false,
          error: null
        })
      }
    }
  }

  handleSearchTextChange= async e => {
    const value = e.target.value
    if (value === '') {
      this.setState({ suggestions: [], text: value, error: null})
    } else {
      this.reqForSuggestionApi(value)
      this.setState({
        text: value
      })
    }
  }

  getLocalStorage = () => {
    const localStorageData = localStorage.get('searchItems')
    if(localStorageData === null) {
      return []
    } else return localStorageData
  }

  handleRemove = (itemIndexToRemove) => {
    const itemList = [...this.state.suggestionSelected];
    itemList.splice(itemIndexToRemove, 1);
    this.setState({suggestionSelected: itemList});

    localStorage.set('searchItems', itemList);
  }

  handleRemoveAll = () => {
    this.setState({suggestionSelected: []});
    localStorage.set('searchItems', []);
  }

  onSuggestionSelected = (value) => {
    var newItem = {[+(new Date())]: value}
    this.setState( () => ({
      text: '',
      suggestions: [],
      suggestionSelected: [...this.state.suggestionSelected, newItem]
    }))
    var suggestionSelectedForLocalStorage = this.getLocalStorage()
    suggestionSelectedForLocalStorage.push(newItem)
    localStorage.set('searchItems', suggestionSelectedForLocalStorage);
  }

  renderSuggestions () {
    const { suggestions } = this.state
    if(suggestions.length === 0) {
      return null
    }

    return (
        <ul className="suggestionLists">
          { suggestions.map( (item, index) => <li key={index} onClick={() => this.onSuggestionSelected(item)}>{item}</li>)}
        </ul>
    )
  }

  render() {
    const { text, isLoading, error } = this.state
    return (
      <div className="AutoCompleteText">
        <div className="InputAndSuggestionContainer">
          <input value={text} onChange={e => this.handleSearchTextChange(e)} type="text"/>
          <div className="suggestionListsContainer">
            {error ? <div className="errorMsg"><h3>{error.message}</h3></div> : null} 
            { 
              !isLoading ? (this.renderSuggestions()) 
              : 
              (<h3 className="loadingMsg">Loading...</h3>)
            } 
          </div>
        </div>
        <SelectedSuggestions suggestionSelected={this.state.suggestionSelected} 
          handleRemove={this.handleRemove}
          handleRemoveAll={this.handleRemoveAll}
        />
      </div>
    )
  }
}
