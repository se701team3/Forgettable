import React, {useContext} from 'react';
import {Route, Switch, Routes, Navigate} from 'react-router-dom';
// import ReactLoading from "react-loading";
import classes from './PageRouter.module.css';

import {AuthContext} from '../../context/AuthContext';
import PersonPage from '../../pages/PersonPage/PersonPage';
import EditPerson from '../../pages/edit/EditPerson';
import SettingsPage from '../../pages/SettingsPage/SettingsPage';
import EncountersListPage from '../../pages/encounters/encounters';
import PersonsListPage from '../../pages/PersonsListPage/PersonsListPage';
import Home from '../../pages/home/Home';
import SignInPage from '../../pages/SignInPage/SignInPage';

// import LandingPage from "../../containers/LandingPage/LandingPage";
// import SelectCompetition from "../../containers/SelectCompetition/SelectCompetition";
// import Dashboard from "../../containers/Dashboard/Dashboard";
// import MySGonks from "../../containers/MySGonks/MySGonks";
// import Marketplace from "../../containers/Marketplace/Marketplace";
// import Competition from "../../containers/Competition/Competition";
// import CreateCompetition from "../../containers/CreateCompetition/CreateCompetition";
// import Explanation from "../../containers/Explanation/Explanation";

// import { NO_COMPETITION } from "../../App";

const PageRouter = (props) => {
  const authContext = useContext(AuthContext);

  if (authContext.isLoggingIn) {
    return (
      <div className={classes.Loading}>
        {/* <ReactLoading type="spokes" color="#2f7de7" /> */}
        <p>Signing in...</p>
      </div>
    );
  }

  if (!authContext.isLoggedIn) {
    return (
      <Routes>
        <Route path="/signin" component={<SignInPage setIsLoggedIn={false} />} />
        {/* <Route path="/explanation" component={Explanation} /> */}
        <Route
          path="*"
          element={<Navigate to="/signin" replace />}/>
      </Routes>
    );
  }

  //   if (props.compId === NO_COMPETITION) {
  //     return (
  //       <Switch>
  //         <Route
  //           path="/compselect"
  //           render={() => <SelectCompetition updateCompId={props.updateCompId} />}
  //         />
  //         <Route
  //           path="/createcomp"
  //           render={() => <CreateCompetition updateCompId={props.updateCompId} />}
  //         />
  //         <Redirect to="/compselect" />
  //       </Switch>
  //     );
  //   }

  //   if (props.loading || Object.keys(props.competitionInfo).length === 0) {
  //     return (
  //       <div className={classes.Loading}>
  //         <ReactLoading type="bars" color="#2f7de7" width={80} />
  //         <p>Crunching data...</p>
  //       </div>
  //     );
  //   }

  return (
    <Routes>

      <Route path="/" element={<Home/>} />
      <Route path="settings" element={<SettingsPage setIsLoggedIn={setIsLoggedIn}/>} />
      <Route path="people" element={<PersonsListPage/>} />
      <Route path="people/create" element={<EditPerson/>} />
      <Route path="people/:id/edit" element={<EditPerson/>} />
      <Route path="encounters" element={<EncountersListPage/>} />
      <Route path="person/:id" element={<PersonPage/>} />

      <Route
        path="*"
        element={<Navigate to="/" replace />}/>
    </Routes>
  );
};

export default PageRouter;
