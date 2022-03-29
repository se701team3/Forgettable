/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import CustomButton from '../../components/CustomButton/CustomButton';
import SearchBar from '../../components/SearchBar/SearchBar';
import classes from './Home.module.css';
import PersonCardSummary from '../../components/PersonCardSummary/PersonCardSummary';
import PersonDrawer from '../../components/PersonDrawer/PersonDrawer';
import { Link } from 'react-router-dom';
import IconButton from '../../components/IconButton/IconButton';
import EncounterCardSummary from '../../components/EncounterCardSummary/EncounterCardSummary';
import EncounterDrawer from '../../components/EncounterDrawer/EncounterDrawer';
import CustomModal from '../../components/CustomModal/CustomModal';
import EncountersLogo from '../../assets/icons/navbar/encounters.svg';
import PeopleLogo from '../../assets/icons/navbar/persons.svg';
import { getAllEncounters, getAllPersons } from '../../services';
import { searchBarDataFormatter } from '../../functions/searchBarDataFormatter';
import { getImageSrcFromBuffer } from '../../functions/getImageSrcFromBuffer';
import { useNavigate } from 'react-router-dom';
import {
  unmarshalPerson,
  unmarshalEncounters,
} from '../../functions/dataUnmarshaller';

function Home() {
  const [isHover, setIsHover] = useState(false);
  const navigate = useNavigate();

  const [selectedInfo, setSelectedInfo] = React.useState(undefined);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [peopleList, setPeopleList] = React.useState([]);
  const [encountersList, setEncountersList] = React.useState([]);
  const [searchBarData, setSearchBarData] = React.useState([]);

  const userName = JSON.parse(localStorage.getItem('user')).userName;

  async function getData() {
    const peopleResult = await getAllPersons();

    const unmarshalledPersons = peopleResult.map((person) =>
      unmarshalPerson(person),
    );

    setPeopleList(unmarshalledPersons);

    const encountersResult = await getAllEncounters();

    const unmarshalledEncounters = encountersResult.map((encounter) =>
      unmarshalEncounters(encounter),
    );

    setEncountersList(unmarshalledEncounters);

    const searchDataResult = searchBarDataFormatter(
        peopleResult,
        encountersResult,
    );

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
    setIsHover(true);
  };

  const handleEncounterHover = (event, index) => {
    setSelectedInfo({
      type: 'encounter',
      info: encountersList[index],
    });
    setIsHover(true);
  };

  const handleNewEntryClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleOnMouseOut = () => {
    setIsHover(false);
  };

  const handleEncounterCardClick = (encounter) => {
    navigate(`/encounters/${encounter._id}`, {
      state: {
        encounter: encounter,
      },
    });
  };

  return (
    <>
      {isHover && <SummaryDrawer summaryInfo={selectedInfo} />}

      <CustomModal open={modalOpen} onClose={handleModalClose} hasCancel={true}>
        <div className={classes.home_modalTitle}>Add a new entry</div>
        <div className={classes.home_modalButtonsContainer}>
          <Link to="/person/create" style={{ textDecoration: 'none' }}>
            <IconButton
              btnText="Person"
              onClick={() => {}}
              includeIcon={true}
              height="60px"
              maxWidth="190px"
              customIcon={PeopleLogo}
            />
          </Link>
          <div className={classes.home_verticalBreak} />
          <Link to="/encounters/create" style={{ textDecoration: 'none' }}>
            <IconButton
              btnText="Encounter"
              onClick={() => {}}
              includeIcon={true}
              height="60px"
              maxWidth="190px"
              customIcon={EncountersLogo}
            />
          </Link>
        </div>
      </CustomModal>

      <div className={classes.home_container}>
        <div className={classes.home_title}>
          Hi {userName ? userName : 'there'}, Welcome back!
        </div>

        <div className={classes.home_searchArea}>
          <SearchBar
            placeholder={'Search'}
            data={searchBarData}
            hasAutocomplete={true}
          />
          <div className={classes.home_newEntryBtn}>
            <IconButton
              btnText="New Entry"
              onClick={handleNewEntryClick}
              includeIcon={true}
            />
          </div>
        </div>

        <div className={classes.body_container}>
          <div className={classes.home_subtitleContainer}>
            <div className={classes.home_subtitle}>Recently Updated</div>
            <Link to="/people" style={{ textDecoration: 'none' }}>
              <CustomButton btnText="View All" />
            </Link>
          </div>

          <div
            className={
              classes.home_cardGridContainer +
              ' ' +
              classes.home_personGridContainer
            }
          >
            {peopleList.map((person, index) => {
              return (
                <div
                  key={index}
                  className={classes.home_cardWrapper}
                  onMouseEnter={(event) => handlePersonHover(event, index)}
                  onMouseLeave={handleOnMouseOut}
                >
                  <Link
                    to={`/person/${person._id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <PersonCardSummary
                      id={person._id}
                      name={person.first_name}
                      img={person.image}
                      firstMet={person.firstMet}
                      onClick={() => {}}
                    />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className={classes.home_subtitleContainer}>
            <div className={classes.home_subtitle}>Recent Encounters</div>
            <Link to="/encounters" style={{ textDecoration: 'none' }}>
              <CustomButton btnText="View All" />
            </Link>
          </div>

          <div
            className={
              classes.home_cardGridContainer +
              ' ' +
              classes.home_encounterGridContainer
            }
          >
            {encountersList.map((encounter, index) => {
              return (
                <div
                  key={index + 'e'}
                  className={classes.home_cardWrapper}
                  onMouseOver={(event) => handleEncounterHover(event, index)}
                  onMouseOut={handleOnMouseOut}
                >
                  <EncounterCardSummary
                    firstName={encounter.persons[0]?.first_name}
                    dateMet={new Date(encounter.date)}
                    description={encounter.description}
                    firstMet={encounter.title}
                    img={encounter.persons[0]?.image}
                    location={encounter.location}
                    onClick={() => {
                      handleEncounterCardClick(encounter);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function SummaryDrawer(summaryInfo) {
  summaryInfo = summaryInfo.summaryInfo;
  if (summaryInfo.type === 'person') {
    return (
      <PersonDrawer
        open={true}
        id={summaryInfo.info.id}
        name={summaryInfo.info.firstName}
        img={summaryInfo.info.image}
        firstMet={summaryInfo.info.firstMet}
        onClick={summaryInfo.info.onClick}
        location={summaryInfo.info.location}
        gender={summaryInfo.info.gender}
        organisation={summaryInfo.info.organisation}
        interests={summaryInfo.info.interests}
        socialMedia={summaryInfo.info.socialMedia}
        birthday={summaryInfo.info.birthday}
      />
    );
  } else if (summaryInfo.type === 'encounter') {
    return (
      <EncounterDrawer
        open={true}
        id={summaryInfo.info.id}
        encounterTitle={summaryInfo.info.title}
        img={summaryInfo.info.persons[0]?.image}
        persons={summaryInfo.info.persons}
        dateMet={new Date()}
        location={summaryInfo.info.location}
        encounterDetails={summaryInfo.info.description}
      />
    );
  }
}

export default Home;
