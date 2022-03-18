import React from 'react';
import classes from './PersonDrawer.module.css';
import {Avatar, Drawer} from '@mui/material';
import PropTypes from 'prop-types';
import {
  calculateAge,
  getDateLastMetString,
  getFirstMetTimeString,
} from '../../functions/dateFormatter';
import {capitalise} from '../../functions/stringFormatter';
import convertSocialMediaNamesToIcons,
{convertSocialMediaToIcon} from '../../functions/socialMediaIconConverter';
import {IconButton} from '@mui/material';
import {getBirthdayString} from '../../functions/dateFormatter';
import CustomButton from '../CustomButton/CustomButton';
import classNames from 'classnames';
import UnknownDetail from '../UnknownDetail/UnknownDetail';

const PersonDrawer = (props) => {
  return (
    <Drawer
      sx={{
        'width': props.staticDrawer ? '375px' : '460px',
        'flexShrink': 0,
        '& .MuiDrawer-paper': {
          width: props.staticDrawer ? '375px' : '460px',
          boxSizing: 'border-box',
          marginLeft: '128px',
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
              height: '200px',
              width: '200px',
              backgroundColor:
                getComputedStyle(document.body)
                    .getPropertyValue('--prmry'),
              fontSize:
                getComputedStyle(document.body)
                    .getPropertyValue('--text-xxlarge')
              ,
            }}
            src={props.img}
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
                {getBirthdayString(props.birthday)}
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
                  {getDateLastMetString(props.firstMet)}
                </span> :
                 <UnknownDetail/>}
            </p>
            <p data-testid="interests-element">
              {'Interests: '}
              {props.interests ?
               <span className={classes.KnownText}>
                 {props.interests.join(', ')}
               </span> :
               <UnknownDetail/>}
            </p>
            <p data-testid="social-medias-element">
              {'Social media: '}
              {props.socialMedias?.length ?
               <span className={classes.SocialMediaContainer}>
                 {props.socialMedias.map((socialMedia) => {
                   const icon = convertSocialMediaToIcon(socialMedia.name);

                   return (icon ?
                    <IconButton
                      key={socialMedia.name}
                      data-testid={`social-media-element-${socialMedia.name}`}
                      onClick={() => window.open(socialMedia.link, '_blank')}
                    >
                      <img src={icon} alt={socialMedia.name} />
                    </IconButton> :
                    null
                   );
                 })}
               </span> :<UnknownDetail/>}
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
  socialMedias: PropTypes.arrayOf(Object), // See below for an example
  // [{name: 'facebook', link: 'https://www.google.com/'}, {name: 'instagram', link: 'https://www.google.com/'}]
  firstMet: PropTypes.instanceOf(Date),
  location: PropTypes.string,
  interests: PropTypes.arrayOf(PropTypes.string),
  staticDrawer: PropTypes.bool,
  onEdit: PropTypes.bool,
};

export default PersonDrawer;
