import React from 'react'
import './AutoCompleteText.css'
import moment from 'moment'

function SelectedSuggestions(props) {

  const onClickRemove = (e) => {
    props.handleRemove(e.target.id)
  }

  const onClickRemoveAll = () => {
    props.handleRemoveAll()
  }

  const renderSelectedSuggestions = () => {
    const { suggestionSelected } = props

    if(suggestionSelected.length === 0) {
      return <h3>No Search history</h3>
    }

    return (
      <>
        <header className="historyHeaders">
          <h2>Search history</h2>
          <h4 className="clearSearch" onClick={onClickRemoveAll}>Clear search history</h4>
        </header>

        <ul className="selectedLists">
          { suggestionSelected.map( (item, index) => {
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
      </>
    )
  }

  return (
    <div className="selecgedSuggestionContainer">
        { renderSelectedSuggestions() }
    </div>
  )
}

export default SelectedSuggestions
