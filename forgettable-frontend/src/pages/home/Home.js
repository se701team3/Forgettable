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
import GoalSummary from '../../components/GoalSummary/GoalSummary';
import EncountersLogo from '../../assets/icons/navbar/encounters.svg';
import PeopleLogo from '../../assets/icons/navbar/persons.svg';
import { getAllEncounters, getAllPersons, getPeopleWithUpcomingBirthday, getGoal, getUser } from '../../services';
import { searchBarDataFormatter } from '../../functions/searchBarDataFormatter';
import { useNavigate } from 'react-router-dom';
import { unmarshalPerson, unmarshalEncounters, unmarshalGoal } from '../../functions/dataUnmarshaller';
import UpcomingBirthdaySummary from '../../components/UpcomingBirthdaySummary/UpcomingBirthdaySummary';
import SearchFilterModal from '../../components/SearchFilterModal/SearchFilterModal';
import Streaks from '../../components/Streaks/Streaks';

function Home() {
  const [isHover, setIsHover] = useState(false);
  const navigate = useNavigate();

  const [selectedInfo, setSelectedInfo] = React.useState(undefined);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [peopleList, setPeopleList] = React.useState([]);
  const [encountersList, setEncountersList] = React.useState([]);
  const [searchBarData, setSearchBarData] = React.useState([]);
  const [currentGoal, setCurrentGoal] = React.useState();
  const [upcomingBirthdayList, setUpcomingBirthdayList] = React.useState([]);
  const userName = JSON.parse(localStorage.getItem('user')).userName;

  const [searchFilterModalOpen, setSearchFilterModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');

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

    await updateGoal();

    setSearchBarData(searchDataResult);

    const upcomingBirthdays = await getPeopleWithUpcomingBirthday();

    setUpcomingBirthdayList(upcomingBirthdays);
  }

  const updateGoal = async () => {
    const user = await getUser();
    const goalResult = await getGoal(user.goals[0]);
    const unmarshalledGoal = unmarshalGoal(goalResult);
    if (!unmarshalledGoal.encountered) {
      setCurrentGoal(null);
    } else {
      setCurrentGoal(unmarshalledGoal);
    }
  };

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

  const toggleFilters = () => {
    setSearchFilterModalOpen(!searchFilterModalOpen);
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
          <SearchBar placeholder={'Search'} data={searchBarData} hasAutocomplete={true} toggleFilters={toggleFilters} filterEnabled={searchFilterModalOpen} datatype={selectedFilter} />
          <div className={classes.home_newEntryBtn}>
            <IconButton
              btnText="New Entry"
              onClick={handleNewEntryClick}
              includeIcon={true}
            />
          </div>
        </div>

        <div className={classes.body_container}>
          <div className={classes.streaks_container}>
            <Streaks encounter={encountersList}/>
          </div>
          <div className={classes.home_subtitleContainer}>
            <div className={classes.home_subtitle}>Current Goal</div>
          </div>
          <div className={classes.home_cardGridContainer}>
            <GoalSummary goal={currentGoal} update={updateGoal} />
          </div>


          <div className={classes.home_subtitleContainer}>
            <div className={classes.home_subtitle}>Recently Updated</div>
            <Link to="/people" style={{ textDecoration: 'none' }}>
              <CustomButton btnText="View All" />
            </Link>
          </div >


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
          <div className={classes.home_subtitleContainer}>
            <div className={classes.home_subtitle}>Upcoming Birthdays</div>
          </div>

          <div className={classes.home_cardGridContainer + ' ' + classes.home_encounterGridContainer}>
            {upcomingBirthdayList.map((birthdayPerson, index) => {
              return (
                // Uses same hover handler as person card summary as per specification
                <div key={index + 'e'} className={classes.home_cardWrapper} onMouseOver={(event) => handlePersonHover(event, index)} onMouseOut={handleOnMouseOut}>
                  <Link to={`/person/${birthdayPerson._id}`} style={{textDecoration: 'none'}}>
                    <UpcomingBirthdaySummary
                      firstName={birthdayPerson.first_name}
                      birthday={birthdayPerson.birthday}
                      img={birthdayPerson.image}
                      onClick={() => { }}
                    />
                  </Link>
                </div>);
            })}
          </div>
        </div>
        <SearchFilterModal open={searchFilterModalOpen} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
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
