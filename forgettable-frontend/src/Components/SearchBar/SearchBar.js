import React, { useState } from 'react';
import './SearchBar.css';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

function SearchBar({ placeholder, data }) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState('');

  // this const gets the string input from the search bar, filters the data array to match the string
  // then sets that as the filtered dataset to be used with the suggestions

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.title.toLowerCase().includes(searchWord.toLowerCase());
    });
    if (searchWord === '') {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered('');
  };

  return (
    <div className="search">
      <div className="searchInputs">
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />
        {/* The search icon is variable so that it shows the search icon when the text is empty
         while it shows the clear button when there is text, allowing for easy search bar clearing */}
        <div className="searchIcon">
          {wordEntered === '' ? (
            <SearchIcon />
          ) : (
            <CloseIcon id="clearBtn" onClick={clearInput} />
          )}
        </div>
      </div>
      {filteredData.length !== 0 && (
      <div className="dataResult">
        {/* This results are sliced to the first 15 results, so that the list isn't too long
        Right now it is set to grab the link on the mock dataset and use that to open a new page
        but it will be changed with the api */}
        {filteredData.slice(0, 15).map((value, key) => {
          return (
            <a className="dataItem" href={value.link} target="_blank">
              <p>{value.title}</p>
            </a>
          );
        })}
      </div>
      )}
    </div>
  );
}

export default SearchBar;
