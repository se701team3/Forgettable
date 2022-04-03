import React, {useState, useEffect} from 'react';
import classes from './CompanyPage.module.css';
import {getCompany} from '../../services';
import {Link, Navigate, useParams} from 'react-router-dom';
import {unmarshalCompany} from '../../functions/dataUnmarshaller';

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

  useEffect(async () => {
    const result = await getCompany(id);

    setCompany(unmarshalCompany(result));
  }, [id]);

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
          <p>{company.date_founded}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;

