/* eslint-disable react/jsx-filename-extension */
/* eslint-disable max-len */
import React from 'react';
import Drawer from '@mui/material/Drawer';
import { List, ListItem } from '@mui/material';
import EncountersLogo from '../../assets/icons/navbar/encounters.svg';
import HomePageLogo from '../../assets/icons/navbar/homepage.svg';
import PersonsLogo from '../../assets/icons/navbar/persons.svg';
import SettingsLogo from '../../assets/icons/navbar/settings.svg';
import LightThemeLogo from '../../assets/logos/logo-short-black.svg';
import DarkThemeLogo from '../../assets/logos/logo-short-white.svg';
import classes from './NavBar.module.css';

const DRAWER_WIDTH = 128;
const ICON_SIZE = '26px';
const LOGO_SIZE = '50px';

export default function NavBar() {
  const [selectedIndex, setSelectedIndex] = React.useState(0); // @TODO: State stuff so that we can select the page
  const isLightTheme = true; // @TODO: When a state for dark theme is made, use this state so we can set the logo appropriately.
  const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bkgd');

  const linkProperties = [{
    src: HomePageLogo,
    alt: 'Home Page',
  }, {
    src: PersonsLogo,
    alt: 'Persons Page',
  }, {
    src: EncountersLogo,
    alt: 'Encounters Page',
  }, {
    src: SettingsLogo,
    alt: 'Settings Page',
  }];

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor,
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <div className={classes.navBar_container}>
        <img
          src={isLightTheme ? LightThemeLogo : DarkThemeLogo}
          alt="Forgettable Logo"
          height={LOGO_SIZE}
          width={LOGO_SIZE}
          className={classes.navBar_logo}
        />
        <List>
          {linkProperties.map((linkItem, index) => (
            <ListItem
              button
              key={linkItem}
              onClick={(event) => handleListItemClick(event, index)}
              selected={selectedIndex === index}
              classes={{ selected: classes.navBar_listItem }}
            >
              <div className={classes.navBar_selectMarker} />
              <div className={classes.navBar_innerListItem}>
                <img
                  src={linkItem.src}
                  alt={linkItem.alt}
                  height={ICON_SIZE}
                  width={ICON_SIZE}
                  className={classes.navBar_linkIcon}
                />
              </div>
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
}
