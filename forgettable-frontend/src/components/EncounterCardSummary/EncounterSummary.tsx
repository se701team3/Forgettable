import * as React from 'react';
import Card from '@mui/material/Card';
import {Avatar} from '@mui/material';
import './EncounterSummary.css';

export default function EncounterSummary(props: { Name: any; Date: any; Description: any; Summary: any; }) {
  const {
    Name, Date, Description, Summary,
  } = props;

  return (
    <div className="container">
      <Card
        className="card"
        sx={{maxWidth: 220, maxHeight: 240, bgcolor: 'var(--lcard)', borderRadius: 6}}
      >
        <div className="header">
          <Avatar
            alt={Name}
            src="Avatar.png"
            sx={{width: 70, height: 70}}
          />
          <div className="nameDesc">
            <div>{Name}</div>
            <div className="description">{Description}</div>
          </div>
        </div>
        <div className="date">
          <div>Date you met:</div>
          {Date}
        </div>
        <div className="descriptionText">
          {Summary}
        </div>
      </Card>
    </div>
  );
}
