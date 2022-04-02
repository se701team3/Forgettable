import React, {useState, useEffect} from 'react';
import classes from './PersonDrawer.module.css';
import {Avatar, Drawer} from '@mui/material';
import PropTypes from 'prop-types';
import {
  calculateAge,
  getLongDateStringWithSlashes,
  getFirstMetTimeString,
} from '../../functions/dateFormatter';
import {capitalise} from '../../functions/stringFormatter';
import convertSocialMediaNamesToIcons,
{convertSocialMediaToIcon} from '../../functions/socialMediaIconConverter';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import {IconButton} from '@mui/material';
import {getLongDateStringWithSpaces} from '../../functions/dateFormatter';
import CustomButton from '../CustomButton/CustomButton';
import classNames from 'classnames';
import UnknownDetail from '../UnknownDetail/UnknownDetail';
import {getImageSrcFromBuffer} from '../../functions/getImageSrcFromBuffer';

/*
 * Side drawer for displaying the detailed information of a person.
 * The `open` and `name` props are required. Set `open` to true if
 * the drawer should be always open.
 * The `staticDrawer` boolean props toggles the drawer to be on the
 * left side of the screen with slightly different style, and adds
 * to it an Edit button.
 *
 * Author: Mercury Lin (lin8231)
 */
const PersonDrawer = (props) => {
  const theme = localStorage.getItem('theme');
  const [isDarkTheme, setIsDarkTheme] = useState(theme == 'dark');
  useEffect(() => {
    if (theme == 'dark') {
      setIsDarkTheme(true);
    } else {
      setIsDarkTheme(false);
    }
  }, [theme]);
  return (
    <Drawer
      sx={{
        'width': props.staticDrawer ? '375px' : '460px',
        'flexShrink': 0,
        '& .MuiDrawer-paper': {
          width: props.staticDrawer ? '375px' : '460px',
          boxSizing: 'border-box',
          marginLeft: '128px',
          backgroundColor: isDarkTheme ? '#141414' : '#FFFFFF',
        },
      }}
      variant="persistent"
      anchor={props.staticDrawer ? 'left' : 'right'}
      open={props.open}
      data-testid="drawer-element"
    >
      <div className={classes.PersonDrawer}>
        <div className={classes.ContentContainer}>
          <Avatar
            alt={props.name}
            // this style is written inline because MUI does not support className
            style={{
              height: '180px',
              width: '180px',
              backgroundColor:
                getComputedStyle(document.body)
                    .getPropertyValue('--prmry'),
              fontSize:
                getComputedStyle(document.body)
                    .getPropertyValue('--text-xxlarge')
              ,
            }}
            src={props.img ? getImageSrcFromBuffer(props.img) : props.img}
          />
          <div className={classes.InfoHeader}>
            <h1 data-testid="name-element">
              {props.name}
            </h1>
            <h2 data-testid="first-met-element">
              First met {getFirstMetTimeString(props.firstMet)}
            </h2>
          </div>
          <div
            className={props.staticDrawer ?
          classes.InfoContent :
          classNames(classes.InfoContent, classes.InfoContentPadding)}
          >
            <p data-testid="age-element">
              {'Age: '}
              {props.birthday?
              <span className={classes.KnownText}>
                {calculateAge(props.birthday)}
              </span> :
              <UnknownDetail/>}
            </p>
            <p data-testid="gender-element">
              {'Gender: '}
              {props.gender ?
              <span className={classes.KnownText}>
                {capitalise(props.gender)}
              </span> :
              <UnknownDetail/>}
            </p>
            <p data-testid="birthday-element">
              {'Birthday: '}
              {props.birthday ?
              <span className={classes.KnownText}>
                {getLongDateStringWithSpaces(props.birthday)}
              </span> :
              <UnknownDetail/>}
            </p>
            <p data-testid="organisation-element">
              {'Organisation: '}
              {props.organisation ?
              <span className={classes.KnownText}>
                {capitalise(props.organisation)}
              </span> :
              <UnknownDetail/>}
            </p>
            <p data-testid="location-element">
              {' Location: '}
              {props.location ?
              <span className={classes.KnownText}>
                {capitalise(props.location)}
              </span> :
              <UnknownDetail/>}
            </p>
            <p data-testid="date-first-met-element">
              {'First met: '}
              {props.firstMet ?
                <span className={classes.KnownText}>
                  {getLongDateStringWithSlashes(props.firstMet)}
                </span> :
                 <UnknownDetail/>}
            </p>
            <p data-testid="interests-element">
              {'Interests: '}
              {props.interests && props.interests.length > 0 ?
               <span className={classes.KnownText}>
                 {props.interests.join(', ')}
               </span> :
               <UnknownDetail/>}
            </p>
            <p data-testid="social-medias-element">
              {'Social media: '}
              {props.socialMedia?.length ?
               <span className={classes.SocialMediaContainer}>
                 {props.socialMedia.map((sm) => {
                   const icon = convertSocialMediaToIcon(sm.name);

                   return (icon ?
                    <IconButton
                      key={sm.name}
                      data-testid={`social-media-element-${sm.name}`}
                      onClick={() => window.open(sm.link, '_blank')}
                    >
                      <img src={icon} alt={sm.name} />
                    </IconButton> :
                    null
                   );
                 })}
               </span> :<UnknownDetail/>}
            </p>
            <p>
              {'Labels: '}
              {props.labels && props.labels.length > 0 ?
               <span className={classes.KnownText}>
                 {props.labels.join(', ')}
               </span> :
               <UnknownDetail/>}
            </p>
            {props.staticDrawer &&
            <CustomButton
              btnText="Edit"
              className={classes.EditButton}
              textStyle={classes.ButtonText}
              onClick={props.onEdit}
            />}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

PersonDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  img: PropTypes.string,
  socialMedia: PropTypes.arrayOf(Object), // See below for an example
  // [{name: 'facebook', link: 'https://www.google.com/'}, {name: 'instagram', link: 'https://www.google.com/'}]
  firstMet: PropTypes.instanceOf(Date),
  birthday: PropTypes.instanceOf(Date),
  location: PropTypes.string,
  interests: PropTypes.arrayOf(PropTypes.string),
  organisation: PropTypes.string,
  staticDrawer: PropTypes.bool,
  onEdit: PropTypes.func,
};

export default PersonDrawer;
