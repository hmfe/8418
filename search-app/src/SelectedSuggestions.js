import React from 'react'
import './AutoCompleteText.css'
import moment from 'moment'

export default function SelectedSuggestions(props) {

  function onClickRemove(e) {
    props.handleRemove(e.target.id)
  }

  function onClickRemoveAll() {
    props.handleRemoveAll()
  }

  function renderSelectedSuggestions () {
    const { suggestionSelected } = props
    if(suggestionSelected.length === 0) {
      return <h3>No Search history</h3>
    }
    return (
      <React.Fragment>
        <header className="historyHeaders">
          <h2>Search history</h2>
          <h4 className="clearSearch" onClick={onClickRemoveAll}>Clear search history</h4>
        </header>

        <ul className="selectedLists">
          { suggestionSelected.map( (item, index) => {
            // console.log(Object.keys(item))
            return (
              <li key={Object.keys(item)} className="selectedListItem">
                <span className="selectedListTitle">{item[Object.keys(item)]}</span>
                <div className="rightGroup">
                  <span className="selectedListDate" > 
                    {moment(Number(Object.keys(item))).format('YYYY-MM-DD HH:mm A')}
                  </span>
                  <span
                    id={index} 
                    className="cross" onClick={onClickRemove}>
                  </span>
                </div>
                
              </li>
            )
            }
          )}
        </ul>
        </ React.Fragment>
    )
  }

  return (
    <div className="selecgedSuggestionContainer">
        { renderSelectedSuggestions() }
    </div>
  )
}
