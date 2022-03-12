import React from 'react';
import classes from './PersonDrawer.module.css';
import {Avatar, Drawer} from '@mui/material';
import PropTypes from 'prop-types';
import {getFirstMetTimeString} from '../../functions/dateFormatter';
import {capitalise} from '../../functions/stringFormatter';
import convertSocialMediaNamesToIcons, {convertSocialMediaToIcon} from '../../functions/socialMediaIconConverter';
import {IconButton} from '@mui/material';

const PersonDrawer = (props) => {
  const unknownDetail = <span className={classes.UnknownText}>Unknown</span>;

  return (
    <Drawer
      sx={{
        'width': '460px',
        'flexShrink': 0,
        '& .MuiDrawer-paper': {
          width: '460px',
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="right"
      open={open}
    >
      <div className={classes.PersonDrawer}>
        <div className={classes.ContentContainer}>
          <Avatar
            alt={props.name}
            // this style is written inline because MUI does not support className
            style={{
              height: '200px',
              width: '200px',
              backgroundColor:
                getComputedStyle(document.body).getPropertyValue('--prmry'),
              fontSize:
                getComputedStyle(document.body).getPropertyValue('--text-xxlarge')
              ,
            }}
            src={props.img}
          />
          <div className={classes.InfoHeader}>
            <h1>{props.name}</h1>
            <h2>First met {getFirstMetTimeString(props.firstMet)}</h2>
          </div>
          <div className={classes.InfoContent}>
            <p>
              {'Age: '}
              {props.birthday?
              <span className={classes.KnownText}>34</span> :
              unknownDetail}
            </p>
            <p>
              {'Gender: '}
              {props.gender ?
              <span className={classes.KnownText}>{capitalise(props.gender)}</span> :
              unknownDetail}
            </p>
            <p>
              {'Birthday: '}
              {props.birthday ?
              <span className={classes.KnownText}>{getBirthdayString(props.birthday)}</span> :
              unknownDetail}
            </p>
            <p>
              {'Organisation: '}
              {props.organisation ?
              <span className={classes.KnownText}>{capitalise(props.organisation)}</span> :
              unknownDetail}
            </p>
            <p>
              {' Location: '}
              {props.location ?
              <span className={classes.KnownText}>{capitalise(props.location)}</span> :
              unknownDetail}
            </p>
            <p>
              {'Date first met: '}
              {props.firstMet ?
                <span className={classes.KnownText}>{getFirstMetTimeString(props.firstMet)}</span> :
                 unknownDetail}
            </p>
            <p>
              {'Interests: '}
              {props.interests ?
               <span className={classes.KnownText}>{props.interests.join(', ')}</span> :
               unknownDetail}
            </p>
            <p>
              {'Social media: '}
              {props.socialMedias?.length ?
               <div className={classes.SocialMediaContainer}>
                 {props.socialMedias.map((socialMedia) => {
                   const icon = convertSocialMediaToIcon(socialMedia.name);

                   return (icon ?
                    <IconButton onClick={() => window.open(socialMedia.link, '_blank')}>
                      <img src={icon} alt={socialMedia.name} />
                    </IconButton> :
                    null
                   );
                 })}
               </div> :unknownDetail}
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

PersonDrawer.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  img: PropTypes.string,
  socialMedias: PropTypes.arrayOf(Object), // See below for an example
  // [{name: 'facebook', link: 'https://www.google.com/'}, {name: 'instagram', link: 'https://www.google.com/'}]
  firstMet: PropTypes.instanceOf(Date),
  location: PropTypes.string,
  interests: PropTypes.arrayOf(PropTypes.string),
};

export default PersonDrawer;
