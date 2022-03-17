/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
import React, { useEffect } from 'react';
import CustomButton from '../../components/CustomButton/CustomButton';
import SearchBar from '../../components/SearchBar/SearchBar';
import classes from './Home.module.css';
import PersonCardSummary from '../../components/PersonCardSummary/PersonCardSummary';
import PersonDrawer from '../../components/PersonDrawer/PersonDrawer';
import {Link} from 'react-router-dom';
import IconButton from '../../components/IconButton/IconButton';
import EncounterSummary from '../../components/EncounterCardSummary/EncounterSummary';
import EncounterDrawer from '../../components/EncounterDrawer/EncounterDrawer';
import CustomModal from '../../components/CustomModal/CustomModal';
import EncountersLogo from '../../assets/icons/navbar/encounters.svg';
import PeopleLogo from '../../assets/icons/navbar/persons.svg';
import { getAllEncounters, getAllPersons } from '../../services';
import { searchBarDataFormatter } from '../../functions/searchBarDataFormatter';

function Home() {
  const [selectedInfo, setSelectedInfo] = React.useState(undefined);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [peopleList, setPeopleList] = React.useState([]);
  const [encountersList, setEncountersList] = React.useState([]);
  const [searchBarData, setSearchBarData] = React.useState([]);

  const user = localStorage.getItem('userName');

  async function getData() {
    let peopleResult = [];
    peopleResult = await getAllPersons();
    setPeopleList(peopleResult);
    let encountersResult = [];
    encountersResult = await getAllEncounters();

    encountersResult.forEach((encounter) => {
      const people = encounter.persons.map((personID) => peopleResult.find((element) => element._id === personID));
      encounter.persons = people;
    });

    setEncountersList(encountersResult);

    const searchDataResult = searchBarDataFormatter(peopleResult, encountersResult);

    setSearchBarData(searchDataResult);
  }

  useEffect(() => {
    try {
      getData();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handlePersonHover = (event, index) => {
    setSelectedInfo({
      type: 'person',
      info: peopleList[index],
    });
  };

  const handleEncounterHover = (event, index) => {
    setSelectedInfo({
      type: 'encounter',
      info: encountersList[index],
    });
  };

  const handleNewEntryClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      {selectedInfo && <SummaryDrawer summaryInfo={selectedInfo} />}

      <CustomModal open={modalOpen} onClose={handleModalClose} hasCancel={true}>
        <div className={classes.home_modalTitle}>Add a new entry</div>
        <div className={classes.home_modalButtonsContainer}>
          <Link to="/people/new" style={{textDecoration: 'none'}}>
            <IconButton
              btnText="Person"
              onClick={()=>{}}
              includeIcon={true}
              height='60px'
              maxWidth='190px'
              customIcon={PeopleLogo}/>
          </Link>
          <div className={classes.home_verticalBreak} />
          <Link to="/encounters/new" style={{textDecoration: 'none'}}>
            <IconButton
              btnText="Encounter"
              onClick={()=>{}}
              includeIcon={true}
              height='60px'
              maxWidth='190px'
              customIcon={EncountersLogo}/>
          </Link>
        </div>
      </CustomModal>

      <div className={classes.home_container}>
        <div className={classes.home_title}>
          Hi {user ? user : 'there'}, Welcome back!
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
          {peopleList.map((person, index) => {
            return (
              <div key={index} className={classes.home_cardWrapper} onMouseEnter={(event) => handlePersonHover(event, index)}>
                <Link to={`/person/${person._id}`} style={{textDecoration: 'none'}}>
                  <PersonCardSummary
                    id={person._id}
                    name={person.first_name}
                    img={person.image}
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

        <div className={classes.home_cardGridContainer + ' ' + classes.home_encounterGridContainer}>
          {encountersList.map((encounter, index) => {
            return (
              <div key={index + 'e'} className={classes.home_cardWrapper} onMouseEnter={(event) => handleEncounterHover(event, index)}>
                <Link to={`/encounters/${encounter._id}`} style={{textDecoration: 'none'}}>
                  <EncounterSummary
                    name={encounter.persons[0]?.first_name}
                    date={encounter.date}
                    description={encounter.description}
                    summary={encounter.title}
                    src={encounter.persons[0]?.image}
                  />
                </Link>
              </div>);
          })}
        </div>

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
      name={summaryInfo.info.first_name}
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
    return <EncounterDrawer
      open={true}
      id={summaryInfo.info.id}
      encounterTitle={summaryInfo.info.title}
      img={summaryInfo.info.persons[0]?.img}
      persons={summaryInfo.info.persons}
      dateMet={summaryInfo.info.date}
      location={summaryInfo.info.location}
      encounterDetail={summaryInfo.info.description} // TODO: remove this when typo is fixed.
      encounterDetails={summaryInfo.info.description}
    />;
  }
}

export default Home;
