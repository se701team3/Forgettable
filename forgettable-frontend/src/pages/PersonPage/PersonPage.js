import React from 'react';
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
            Mercury 20 times
          </h1>
          <IconButton
            btnText="New Encounter"
            onClick={() => {}}
            includeIcon={true}
            height="66px"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonPage;
