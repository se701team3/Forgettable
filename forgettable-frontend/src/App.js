import React from 'react';
import './index.css';
import {
  Routes,
  Route,
} from 'react-router-dom';
import Home from './pages/home/Home';
import Settings from './pages/settings/settings';
import People from './pages/Persons/Persons';
import Encounters from './pages/encounters/encounters';
import PersonPage from './pages/PersonPage/PersonPage';
import SignInPage from './pages/SignInPage/SignInPage';
import NavBar from './components/NavBar/NavBar';
import {authentication} from './firebase.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(authentication.currentUser);

  return (
    <>
      {isLoggedIn ? (
      <>
        <NavBar />
        <div className="page-wrapper">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="settings" element={<Settings/>} />
            <Route path="people" element={<People/>} />
            <Route path="encounters" element={<Encounters/>} />
            <Route path="person/:id" element={<PersonPage/>} />
          </Routes>
        </div>
      </>
      ) : <SignInPage setIsLoggedIn={setIsLoggedIn} />
      }
    </>
  );
}

export default App;
