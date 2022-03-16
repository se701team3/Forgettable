/* eslint-disable max-len */
import React from 'react';
import CustomButton from '../../Components/CustomButton/CustomButton';
import SearchBar from '../../Components/SearchBar/SearchBar';
import classes from './App.module.css';
import PersonCardSummary from '../../Components/PersonCardSummary/PersonCardSummary';
import PersonDrawer from '../../Components/PersonDrawer/PersonDrawer';
import {Link} from 'react-router-dom';
import IconButton from '../../Components/IconButton/IconButton';

// The maximum summary cards shown on the large screens, small screens show less
const MAX_LATEST_CARDS = 12;

function App() {
  const [selectedInfo, setSelectedInfo] = React.useState(undefined);
  // @TODO: Input real data. Get 12 people and 12 encounters. Get all info needed for seach bar. Get user.

  // TEMPORARY FAKE DATA
  const user = {first_name: 'PersonName'};
  const personList = [{
    id: '0',
    name: 'Name',
    img: 'https://avatars.githubusercontent.com/u/28725774?v=4',
    firstMet: new Date(),
    socialMedias: [{name: 'facebook', link: 'https://www.google.com/'}, {name: 'instagram', link: 'https://www.google.com/'}],
    location: 'Auckland',
    interests: ['art', 'sewing', 'coding'],
  },
  ];
  for (let i = 1; i < MAX_LATEST_CARDS; i++) {
    personList[i] = {...personList[0], name: 'P' + i};
  }

  const searchBarData = [{title: 'fgdgf', type: 'encounters', id: '0'}, {title: 'joe', type: 'people', id: '1'}, {title: 'xi', type: 'people', id: '2'}, {title: 'abcdef', type: 'encounters', id: '3'}];
  // END TEMP FAKE DATA

  const handlePersonHover = (event, index) => {
    setSelectedInfo({
      type: 'person',
      info: personList[index],
    });
  };

  const handleNewEntryClick = (event) => {
    // @TODO: Need dialog/popup to do the new entry.
  };

  return (
    <>
      {selectedInfo && <SummaryDrawer summaryInfo={selectedInfo} />}

      <div className={classes.home_container}>
        <div className={classes.home_title}>
          Hi {user.first_name}, Welcome back!
        </div>

        <div className={classes.home_searchArea}>
          <SearchBar placeholder={'Search'} data={searchBarData} hasAutocomplete={true} />
          <div className={classes.home_newEntryBtn}>
            <IconButton btnText="New Entry" onClick={handleNewEntryClick} includeIcon={true} />
          </div>
        </div>

        <div className={classes.home_subtitleContainer}>
          <div className={classes.home_subtitle}>Recently Updated</div>
          <Link to="/people" style={{textDecoration: 'none'}}><CustomButton btnText='View All' /></Link>
        </div>

        <div className={classes.home_cardGridContainer + ' ' + classes.home_personGridContainer}>
          {personList.map((person, index) => {
            return (
              <div key={index} className={classes.home_cardWrapper} onMouseEnter={(event) => handlePersonHover(event, index)}>
                <Link to={`/people/${person.id}`} style={{textDecoration: 'none'}}>
                  <PersonCardSummary
                    id={person.id}
                    name={person.name}
                    img={person.img}
                    firstMet={person.firstMet}
                    onClick={() => { }}
                  />
                </Link>
              </div>);
          })}
        </div>

        <div className={classes.home_subtitleContainer}>
          <div className={classes.home_subtitle}>Recently Encounters</div>
          <Link to="/encounters" style={{textDecoration: 'none'}}><CustomButton btnText='View All' /></Link>
        </div>

        <div>This is where the encounters grid will go</div>
      </div>
    </>
  );
}

function SummaryDrawer(summaryInfo) {
  summaryInfo = summaryInfo.summaryInfo;
  if (summaryInfo.type === 'person') {
    return <PersonDrawer
      open={true}
      id={summaryInfo.info.id}
      name={summaryInfo.info.name}
      img={summaryInfo.info.img}
      firstMet={summaryInfo.info.firstMet}
      onClick={summaryInfo.info.onClick}
      location={summaryInfo.info.location}
      gender={summaryInfo.info.gender}
      organisation={summaryInfo.info.organisation}
      interests={summaryInfo.info.interests}
      socialMedias={summaryInfo.info.socialMedias}
    />;
  } else if (summaryInfo.type === 'encounter') {
    return (''); // @TODO replace with encounter drawer once that is available.
  }
}

export default App;
