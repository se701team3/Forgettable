import React, {useEffect, useState} from 'react';
import EncounterCard from '../../components/EncounterCard/EncounterCard';
import IconButton from '../../components/IconButton/IconButton';
import PersonDrawer from '../../components/PersonDrawer/PersonDrawer';
import {createPerson, getPerson} from '../../services';
import classes from './PersonPage.module.css';
import {ENCOUNTERS} from './PlaceholderData';
import {useParams} from 'react-router-dom';

const PersonPage = (props) => {
  // TODO: this needs to be passed in as a routing parameter
  const {id} = useParams();

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
      encounters: ENCOUNTERS,
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
          onClick={() => {}}
          onDelete={() => {}}
          date={encounter.date}
          isInitialEncounter={false}
        />
      </div>
    );
  };

  return (
    <div className={classes.PersonPage}>
      <PersonDrawer
        open={true}
        img={person.img}
        staticDrawer={true}
        name={`${person.firstName} ${person.lastName}`}
        firstMet={person.firstMet}
        interests={person.interests}
        organisation={person.organisation}
        location={person.location}
        gender={person.gender}
        birthday={person.birthday}
        socialMedias={person.socialMedia}
        data-testid="drawer-component"
      />
      <div className={classes.ContentContainer}>
        <div className={classes.TitleContainer} >
          <h1 className={classes.Title}>
            You encountered
            <br/>
            {person.firstName} {person.encounters.length} times
          </h1>
          <div className={classes.ButtonContainer}>
            <IconButton
              btnText="New Encounter"
              onClick={() => {}}
              includeIcon={true}
              height="66px"
            />
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
