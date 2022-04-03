/* eslint-disable react/jsx-filename-extension */
/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import Drawer from '@mui/material/Drawer';
import {List, ListItem} from '@mui/material';
import {Link, useLocation} from 'react-router-dom';
import EncountersLogo from '../../assets/icons/navbar/encounters.svg';
import HomePageLogo from '../../assets/icons/navbar/homepage.svg';
import PeopleLogo from '../../assets/icons/navbar/persons.svg';
import CompanyLogo from '../../assets/icons/navbar/company.svg';
import SettingsLogo from '../../assets/icons/navbar/settings.svg';
import LightThemeLogo from '../../assets/logos/logo-short-black.svg';
import DarkThemeLogo from '../../assets/logos/logo-short-white.svg';
import classes from './NavBar.module.css';

const DRAWER_WIDTH = 128;
const ICON_SIZE = '26px';
const LOGO_SIZE = '50px';

export default function NavBar() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const theme = localStorage.getItem('theme');
  const [isDarkTheme, setIsDarkTheme] = useState(theme == 'dark');
  const location = useLocation();

  const linkProperties = [{
    src: HomePageLogo,
    alt: 'Home Page',
    path: '/',
  }, {
    src: PeopleLogo,
    alt: 'People Page',
    path: '/people',
  }, {
    src: EncountersLogo,
    alt: 'Encounters Page',
    path: '/encounters',
  }, {
    src: CompanyLogo,
    alt: 'Company Page',
    path: '/company',
  }, {
    src: SettingsLogo,
    alt: 'Settings Page',
    path: '/settings',
  }];

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

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
        'width': DRAWER_WIDTH,
        'flexShrink': 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: 'none',
          borderRight: 1,
          borderColor: isDarkTheme ? '#5A5A5A' : '#E5E5E5',
        },
      }}
      variant="permanent"
      anchor="left"
      className={classes.drawer}
    >
      <div className={classes.backgroundContainer}>
        <div className={classes.navBar_container}>
          <img
            src={isDarkTheme ? DarkThemeLogo : LightThemeLogo}
            alt="Forgettable Logo"
            height={LOGO_SIZE}
            width={LOGO_SIZE}
            className={classes.navBar_logo}
          />
          <List>
            {linkProperties.map((linkItem, index) => (
              <Link to={linkItem.path} key={index}>
                <ListItem
                  button
                  onClick={(event) => handleListItemClick(event, index)}
                  selected={linkItem.path === location.pathname}
                  classes={{selected: classes.navBar_listItem}}
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
              </Link>
            ))}
          </List>
        </div>
      </div>
    </Drawer>
  );
}
