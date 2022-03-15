import * as React from 'react';
import Card from '@mui/material/Card';
import {Avatar} from '@mui/material';
import classes from './EncounterSummary.module.css';

export default function EncounterSummary(props: { Name: any; Date: any; Description: any; Summary: any; Src: string}) {
  const {
    Name, Date, Description, Summary, Src,
  } = props;

  return (
    <div className={classes.Container}>
      <Card
        className={classes.Card}
        sx={{maxWidth: 220, maxHeight: 240, bgcolor: 'var(--lcard)', borderRadius: 6, boxShadow: 0}}
      >
        <div className={classes.Header}>
          <Avatar
            alt={Name}
            src={Src}
            sx={{width: 70, height: 70}}
          />
          <div className={classes.NameDesc}>
            <div>{Name}</div>
            <div className={classes.Description}>{Description}</div>
          </div>
        </div>
        <div className={classes.Date}>
          <div>Date you met:&nbsp;</div>
          {Date}
        </div>
        <div className={classes.DescriptionText}>
          {Summary}
        </div>
      </Card>
    </div>
  );
}
