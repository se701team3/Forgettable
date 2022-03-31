import React, {useState, useEffect} from 'react';
import classes from './CompanyPage.module.css';
import {getCompany} from '../../services';
import {Link, Navigate, useParams} from 'react-router-dom';

const CompanyPage = (props) => {
  const {id} = useParams();
  const [company, setCompany] = useState({
    id: '',
    name: '',
    location: '',
    description: '',
    dateFounded: null,
    image: '',
  });

  return (
    <div className={classes.SettingsPage}>
      <h1>{company.name}</h1>
      <div className={classes.ContentContainer}>
        <h2>
          Company Information
        </h2>
        <div className={classes.DetailSet}>
          <h4>Location</h4>
          <p>{company.location}</p>
        </div>
        <div className={classes.DetailSet}>
          <h4>Description</h4>
          <p>{company.description}</p>
        </div>
        <div className={classes.DetailSet}>
          <h4>Date Founded</h4>
          <p>{company.dateFounded}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;

