import * as React from 'react';
import Card from '@mui/material/Card';
import {Avatar} from '@mui/material';
import classes from './EncounterSummary.module.css';
import {getLongDateStringWithSlashes} from '../../functions/dateFormatter';
import UnknownDetail from '../UnknownDetail/UnknownDetail';

export default function EncounterSummary(props: { name: any; date: any; description: any; summary: any; src: string}) {
  const {
    name, date, description, summary, src,
  } = props;

  return (
    <div className={classes.Container}>
      <Card
        className={classes.Card}
        sx={{maxWidth: 220, maxHeight: 240, bgcolor: 'var(--lcard)', borderRadius: 6, boxShadow: 0}}
      >
        <div className={classes.Header}>
          <Avatar
            alt={name}
            src={src}
            sx={{width: 70, height: 70}}
          />
          <div className={classes.NameDesc}>
            <div>{name}</div>
            <div className={classes.Description}>{summary}</div>
          </div>
        </div>
        <div className={classes.Date}>
          <div>Date you met:&nbsp;</div>
          {date ? getLongDateStringWithSlashes(date) : <UnknownDetail/>}
        </div>
        <div className={classes.DescriptionText}>
          {description}
        </div>
      </Card>
    </div>
  );
}
