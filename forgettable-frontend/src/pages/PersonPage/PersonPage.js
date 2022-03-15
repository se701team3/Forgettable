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
            Mercury 4 times
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
              title="Aenean et quam"
              description="Nunc aliquet leo vitae sapien varius ullamcorper. Donec eget vestibulum turpis. Suspendisse dolor urna, ultricies in neque quis, dictum sodales arcu. "
              persons={[
                {
                  first_name: 'Mercury',
                  last_name: 'Lin',
                  img: 'https://user-images.githubusercontent.com/62003343/158300159-495244dd-f05e-4384-9fac-ddf88a06be39.gif',
                },
              ]}
              location='Auckland'
              onClick={() => {}}
              onDelete={() => {}}
              date={new Date()}
              isInitialEncounter={false}
            />
          </div>
          <div className={classes.CardWrapper}>
            <EncounterCard
              title="Sed a est venenatis"
              description="Sed sed urna dui. Nam gravida, leo ac molestie pulvinar, odio erat egestas lorem, in ullamcorper lacus eros eu purus. Proin nulla neque, tristique ac euismod ut, convallis vitae mi. "
              persons={[
                {
                  first_name: 'Mercury',
                  last_name: 'Lin',
                  img: 'https://user-images.githubusercontent.com/62003343/158300159-495244dd-f05e-4384-9fac-ddf88a06be39.gif',

                },
              ]}
              location='Auckland'
              onClick={() => {}}
              date={new Date()}
              onDelete={() => {}}
              isInitialEncounter={false}
            />
          </div>

          <div className={classes.CardWrapper}>
            <EncounterCard
              title="Good times!"
              description="Diam dictum vestibulum mi nulla vestibulum, id nibh. Nunc consequat amet commodo turpis tellus. Scelerisque a pellentesque vel accumsan sed mauris, ac turpis pharetra. Sem tristique nulla cursus praesent tincidunt integer faucibus in aliquam. Pretium nam enim ut suspendisse dictum. Arcu tristique turpis nam nunc nisl. Mi, molestie quis tincidunt ipsum hendrerit. Lacinia at ut dui nibh placerat scelerisque congue egestas ut. Et fusce odio amet, etiam consectetur ipsum a. Adipiscing iaculis dictum nisl lobortis. Pharetra nunc semper adipiscing massa aenean eu iaculis risus. At quam feugiat lorem ac dui. A, facilisi lectus mus iaculis convallis proin semper dolor accumsan. Ut nibh quis porttitor faucibus sagittis netus sit quis."
              persons={[
                {
                  first_name: 'Mercury',
                  last_name: 'Lin',
                  img: 'https://user-images.githubusercontent.com/62003343/158300159-495244dd-f05e-4384-9fac-ddf88a06be39.gif',

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
              description="Diam dictum vestibulum mi nulla vestibulum, id nibh. Nunc consequat amet commodo turpis tellus. Scelerisque a pellentesque vel accumsan sed mauris, ac turpis pharetra. Sem tristique nulla cursus praesent tincidunt integer ..."
              persons={[
                {
                  first_name: 'Mercury',
                  last_name: 'Lin',
                  img: 'https://user-images.githubusercontent.com/62003343/158300159-495244dd-f05e-4384-9fac-ddf88a06be39.gif',

                },
              ]}
              location='Auckland'
              onClick={() => {}}
              onDelete={() => {}}
              isInitialEncounter={true}
              date={new Date()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonPage;
