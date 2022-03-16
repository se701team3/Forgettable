/* eslint-disable max-len */
import React, {useState} from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import classes from './SearchBar.module.css';

function SearchBar({placeholder, data, exportSearchString, hasAutocomplete}) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState('');

  // this const gets the string input from the search bar, filters the data array to match the string
  // then sets that as the filtered dataset to be used with the suggestions

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    if (hasAutocomplete === true) {
      const newFilter = data.filter((value) => {
        return value.title.toLowerCase().includes(searchWord.toLowerCase());
      });
      if (searchWord === '') {
        setFilteredData([]);
      } else {
        setFilteredData(newFilter);
      }
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered('');
  };

  if (hasAutocomplete === true) {
    return (
      <div className={classes.SearchContainer}>
        <div className={classes.SearchInputs} >
          <input className={classes.SearchNameInput}
            type="text"
            placeholder={placeholder}
            value={wordEntered}
            onChange={handleFilter}
          />
          {/* The search icon is variable so that it shows the search icon when the text is empty
           while it shows the clear button when there is text, allowing for easy search bar clearing */}
          <div className={classes.SearchIcon}>
            {wordEntered === '' ? (
              <SearchIcon />
            ) : (
              <CloseIcon id="clearBtn" className={classes.ClearBtn} onClick={clearInput} />
            )}
          </div>
        </div>
        {filteredData.length !== 0 && (
          <div className={classes.DataResult}>
            {/* This results are sliced to the first 15 results, so that the list isn't too long
          Right now it is set to grab the link on the mock dataset and use that to open a new page
          but it will be changed with the api */}
            {filteredData.slice(0, 15).map((value, key) => {
              return (
                <a className={classes.DataItem} href={window.location.href + value.type + '/' + value.id} rel="noreferrer" key={key}>
                  <p className={classes.DataItemP}>{value.title}</p>
                </a>
              );
            })}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className={classes.SearchContainer}>
        <div className={classes.SearchInputs} >
          <input className={classes.SearchNameInput}
            type="text"
            placeholder={placeholder}
            value={wordEntered}
            onChange={handleFilter}
          />
          {/* The search icon is variable so that it shows the search icon when the text is empty
           while it shows the clear button when there is text, allowing for easy search bar clearing */}
          <div className={classes.SearchIcon}>
            <SearchIcon className={classes.ClearBtn} onClick={() => exportSearchString(wordEntered)}/>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchBar;
