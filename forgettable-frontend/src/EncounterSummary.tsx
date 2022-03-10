import * as React from 'react';
import Card from '@mui/material/Card';
import { Avatar } from '@mui/material';
import './EncounterSummary.css';

export default function EncounterSummary() {
  return (
    <div className="container">
      <Card
        className="card"
        sx={{ maxWidth: 220, maxHeight: 240 }}
      >
        <div className="header">
          <Avatar
            alt="Remy Sharp"
            src="Avatar.png"
            sx={{ width: 70, height: 70 }}
          />
          <div className="nameDesc">
            <div>Marley</div>
            <div className="description">Brief Summary:</div>
          </div>
        </div>
        <div className="date">
          Date you met: 06/03/2022
        </div>
        <div className="descriptionText">
          Sample description: scelerisque
          sit ultricies euismod proin
          ullamcorper proin don ...
        </div>
      </Card>
    </div>
  );
}
