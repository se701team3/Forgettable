/* eslint-disable max-len */
import {Button} from '@mui/material';
import React from 'react';
import CustomButton from '../../components/CustomButton/CustomButton';
import SearchBar from '../../components/SearchBar/SearchBar';
import classes from './App.module.css';
import AddIcon from '@mui/icons-material/Add';
import PersonCardSummary from '../../components/PersonCardSummary/PersonCardSummary';
import PersonDrawer from '../../components/PersonDrawer/PersonDrawer';
import {Link} from 'react-router-dom';

// The maximum summary cards shown on the large screens, small screens show less
const MAX_LATEST_CARDS = 12;

function App() {
  const [selectedInfo, setSelectedInfo] = React.useState(undefined);
  // @TODO: Input real data. Get 12 people and 12 encounters. Get all info needed for seach bar. Get user.
  // @TODO: On click on person, go to their page.
  // @TOOD: Style button properly
  // @TODO: Resize Search bar

  // BLOCKED ON:
  // @TODO: Need dialog/popup to do the new entry.
  // @TODO: Need encounter summary cards to do summary grid.
  // @TODO: Need encounter drawer (might make myself) to do side panel.

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

  // fill with fake data
  for (let i = 1; i < MAX_LATEST_CARDS; i++) {
    personList[i] = {...personList[0], name: 'P' + i};
  }
  // END TEMP FAKE DATA

  const handlePersonHover = (event, index) => {
    setSelectedInfo({
      type: 'person',
      info: personList[index],
    });
  };

  return (
    <>
      {selectedInfo && <SummaryDrawer summaryInfo={selectedInfo}/>}
      <div className={classes.home_container}>
        <div className={classes.home_title}>
          Hi {user.first_name}, Welcome back!
        </div>
        <div className={classes.home_searchArea}>
          <SearchBar />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className={classes.home_newEntryBtn}
          >
            New Entry
          </Button>
        </div>
        <div className={classes.home_subtitleContainer}>
          <div className={classes.home_subtitle}>Recently Updated</div>
          <Link to="/people" style={{textDecoration: 'none'}}><CustomButton btnText='View All' onClick={() => {}} /></Link>
        </div>
        <div className={classes.home_cardGridContainer + ' ' + classes.home_personGridContainer}>
          {personList.map((person, index) => {
            return (
              <div key={index} className={classes.home_cardWrapper} onMouseEnter={(event) => handlePersonHover(event, index)}>
                <PersonCardSummary
                  id={person.id}
                  name={person.name}
                  img={person.img}
                  firstMet={person.firstMet}
                  onClick={() => {}}
                />
              </div>);
          })}
        </div>
        <div className={classes.home_subtitleContainer}>
          <div className={classes.home_subtitle}>Recently Encounters</div>
          <Link to="/encounters" style={{textDecoration: 'none'}}><CustomButton btnText='View All' onClick={() => {}} /></Link>
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
    return ('TO BE IMPLEMENTED'); // @TODO replace with encounter drawer once that is available.
  }
}

export default App;
