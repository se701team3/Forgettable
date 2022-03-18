import React, {useEffect, useState} from 'react';
import EncounterCard from '../../components/EncounterCard/EncounterCard';
import IconButton from '../../components/IconButton/IconButton';
import PersonDrawer from '../../components/PersonDrawer/PersonDrawer';
import {createPerson, getPerson} from '../../services';
import classes from './PersonPage.module.css';
import {ENCOUNTERS} from './PlaceholderData';
import {Link, Navigate, useParams} from 'react-router-dom';
// import {useHistory} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import EncounterDetailsModal from '../../components/EncounterDetailsModal/EncounterDetailsModal';

/*
 * This is the detailed person profile page. Displays the information
 * of a single person. Includes all of their details, and encounters.
 *
 * Author: Mercury Lin (lin8231)
 */
const PersonPage = (props) => {
  const {id} = useParams();
  const navigate = useNavigate();

  const [selectedEncounter, setSelectedEncounter] = useState();
  const [modalOpen, setModalOpen] = useState(false);

  const [person, setPerson] = useState({
    firstName: '',
    lastName: '',
    birthday: null,
    gender: '',
    location: '',
    howWeMet: '',
    firstMet: null,
    interests: [],
    organisation: '',
    socialMedia: [],
    img: '',
    encounters: [],
    timeUpdated: null,
  });

  useEffect(async () => {
    const result = await getPerson(id);
    console.log('result', result);
    setPerson({
      firstName: result.first_name,
      lastName: result.last_name,
      birthday: result.birthday,
      gender: result.gender,
      location: result.location,
      howWeMet: result.how_we_met,
      interests: result.interests,
      organisation: result.organisation,
      socialMedia: convertSocialMedia(result.socialMedia),
      img: result.image,
      encounters: result.encounters,
      timeUpdated: result.timeUpdated,
    });
  }, [id]);

  const convertSocialMedia = (socialMedias) => {
    if (!socialMedias) return null;

    const socialMediaArray = [];

    for (const [key, value] of Object.entries(socialMedias)) {
      socialMediaArray.push({
        name: key,
        link: value,
      });
    }

    return socialMediaArray;
  };

  const createEncounterComponent = (encounter, i) => {
    return (
      <div className={classes.CardWrapper} key={encounter.id || i}>
        <EncounterCard
          title={encounter.title}
          description={encounter.description}
          persons={encounter.persons}
          location={encounter.location}
          onDelete={() => {}}
          date={encounter.date}
          isInitialEncounter={false}
          onClick={() => onClick(encounter)}
        />
      </div>
    );
  };

  const onClick = (encounter) => {
    console.log('card click');
    console.log(encounter);
    setSelectedEncounter(encounter);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const onDelete = () => {
    console.log('delete');
  };

  return (
    <div className={classes.PersonPage}>
      {selectedEncounter && <EncounterDetailsModal
        open={modalOpen}
        onClose={handleModalClose}
        encounter={selectedEncounter}
        onDelete={onDelete}
      />}
      <PersonDrawer
        open={true}
        img={person.img}
        staticDrawer={true}
        name={`${person.firstName} ${person.lastName || ''}`}
        firstMet={person.firstMet}
        interests={person.interests}
        organisation={person.organisation}
        location={person.location}
        gender={person.gender}
        birthday={person.birthday}
        socialMedias={person.socialMedia}
        data-testid="drawer-component"
        onEdit={() => navigate(`edit`)}
      />
      <div className={classes.ContentContainer}>
        <div className={classes.TitleContainer} >
          <h1 className={classes.Title}>
            You encountered
            <br/>
            {person.firstName} {person.encounters.length} times
          </h1>
          <div className={classes.ButtonContainer}>
            <Link to={{
              pathname: `/encounters/create`,
              state: {
                person: person,
              },
            }}
            style={{textDecoration: 'none'}}
            >
              <IconButton
                btnText="New Encounter"
                onClick={() => {}}
                includeIcon={true}
                height="66px"
              />
            </Link>
          </div>
        </div>
        <div className={classes.EncountersContainer}>
          {
            person.encounters.map((encounter, i) => {
              return createEncounterComponent(encounter, i);
            })
          }
        </div>
      </div>
    </div>
  );
};

export default PersonPage;
