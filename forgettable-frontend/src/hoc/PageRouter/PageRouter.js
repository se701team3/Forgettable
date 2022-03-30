import React, {useContext} from 'react';
import {Route, Switch, Routes, Navigate} from 'react-router-dom';
import classes from './PageRouter.module.css';

import {AuthContext} from '../../context/AuthContext';
import PersonPage from '../../pages/PersonPage/PersonPage';
import EditPerson from '../../pages/edit/EditPerson';
import SettingsPage from '../../pages/SettingsPage/SettingsPage';
import EncountersListPage from '../../pages/EncountersListPage/EncountersListPage';
import PersonsListPage from '../../pages/PersonsListPage/PersonsListPage';
import Home from '../../pages/home/Home';
import LogInPage from '../../pages/LogInPage/LogInPage';
import CreateEncounterPage from '../../pages/CreateEncounterPage/CreateEncounterPage';
import Loading from '../../pages/Loading/Loading';
import NotFound from '../../pages/NotFound/NotFound';

/*
 * Component for all routing logic. Conditionally renders
 * different setes of routes depending on what the state of the
 * user logIn is. (Not logged in, logged in, or loggin in)
 *
 * Author: Mercury Lin (lin8231)
 */
const PageRouter = (props) => {
  const authContext = useContext(AuthContext);

  if (authContext.isLoggingIn) {
    return <Loading text="Signing you in..." />;
  }

  if (!authContext.isLoggedIn) {
    return (
      <Routes>
        <Route path="/signin" element={<LogInPage />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    );
  }

  return (
    <div className="page-wrapper">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="people" element={<PersonsListPage />} />
        <Route path="person/create" element={<EditPerson />} />
        <Route path="person/:id/edit" element={<EditPerson />} />
        <Route path="encounters" element={<EncountersListPage />} />
        <Route path="encounters/:id" element={<EncountersListPage />} />
        <Route path="person/:id" element={<PersonPage />} />
        <Route path="encounters/create" element={<CreateEncounterPage />} />
        <Route path="/signin" element={<Navigate replace to="/" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default PageRouter;
