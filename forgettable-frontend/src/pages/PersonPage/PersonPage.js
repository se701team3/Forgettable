import React from 'react';
import EncounterCard from '../../components/EncounterCard/EncounterCard';
import IconButton from '../../components/IconButton/IconButton';
import PersonDrawer from '../../components/PersonDrawer/PersonDrawer';
import classes from './PersonPage.module.css';

const PersonPage = (props) => {
  return (
    <div className={classes.PersonPage}>
      <PersonDrawer
        open={true}
        img="https://user-images.githubusercontent.com/62003343/158300159-495244dd-f05e-4384-9fac-ddf88a06be39.gif"
        staticDrawer={true}
        name={'Mercury Lin'}
        firstMet={new Date()}
        interests={['art', 'sewing', 'coding']}
        organisation="Team3"
        gender="Female"
        birthday={new Date('01-01-2010')}
        socialMedias={[{name: 'facebook', link: 'link'}, {name: 'instagram', link: 'link'}]}
      />
      <div className={classes.ContentContainer}>
        <div className={classes.TitleContainer} >
          <h1 className={classes.Title}>
            You encountered
            <br/>
            Mercury 4721894 times
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
          <div className={classes.CardWrapper}>
            <EncounterCard
              title="Good times!"
              description="We had a lot of fun"
              persons={[
                {
                  first_name: 'Mercury',
                  last_name: 'Lin',
                },
              ]}
              location='Auckland'
              onClick={() => {}}
              onDelete={() => {}}
              isInitialEncounter={true}
            />
          </div>
          <div className={classes.CardWrapper}>
            <EncounterCard
              title="Good times!"
              description="We had a lot of fun"
              persons={[
                {
                  first_name: 'Mercury',
                  last_name: 'Lin',
                },
              ]}
              location='Auckland'
              onClick={() => {}}
              onDelete={() => {}}
              isInitialEncounter={false}
            />
          </div>
          <div className={classes.CardWrapper}>
            <EncounterCard
              title="Good times!"
              description="We had a lot of fun"
              persons={[
                {
                  first_name: 'Mercury',
                  last_name: 'Lin',
                },
              ]}
              location='Auckland'
              onClick={() => {}}
              onDelete={() => {}}
              isInitialEncounter={false}
            />
          </div>

          <div className={classes.CardWrapper}>
            <EncounterCard
              title="Good times!"
              description="We had a lot of fun"
              persons={[
                {
                  first_name: 'Mercury',
                  last_name: 'Lin',
                },
              ]}
              location='Auckland'
              onClick={() => {}}
              onDelete={() => {}}
              isInitialEncounter={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonPage;
