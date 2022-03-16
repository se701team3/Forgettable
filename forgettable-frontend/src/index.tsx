import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import './index.css';
import App from './pages/home/App';
import reportWebVitals from './reportWebVitals';
import NavBar from './Components/NavBar/NavBar';
import Settings from './pages/settings/settings';
import People from './pages/Persons/Persons';
import Encounters from './pages/encounters/encounters';
import PersonPage from './pages/PersonPage/PersonPage';
import SignInPage from './pages/SignInPage/SignInPage';

function LoggedIn(props: any) {
  const isLoggedIn = props.loggedIn;
  if (isLoggedIn) {
    return <NavBar />;
  }
  return <SignInPage />;
}

ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <LoggedIn loggedIn={true}/>
        <div className="page-wrapper">
          <Routes>
            <Route path="/" element={<App/>} />
            <Route path="settings" element={<Settings/>} />
            <Route path="people" element={<People/>} />
            <Route path="encounters" element={<Encounters/>} />
            <Route path="person/:id" element={<PersonPage/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
