
import React, {useState, useEffect} from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';
import classes from './Streaks.module.css';
import './react-calendar-heatmap/dist/styles.css';
import {getLongDateStringWithSlashes} from '../../functions/dateFormatter';
import {getAllEncounters} from '../../services';
import {unmarshalEncounters} from '../../functions/dataUnmarshaller';
import {Avatar, Card} from '@mui/material';

const today = new Date();

function Streaks(encounter) {
  const [dates, setDates]=useState([]);
  async function getDate() {
    const encountersResult = await getAllEncounters();

    const unmarshalledEncounters = encountersResult.map((encounter) =>
      unmarshalEncounters(encounter),
    );
    setDates(unmarshalledEncounters.map((a) =>a.date));
  }
  useEffect(()=>{
    try {
      getDate();
    } catch (err) {
      console.log(err);
    }
  }, [encounter]);
  // count the occurrences of the date
  const occurrences = dates.reduce(function(acc, curr) {
    return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc;
  }, {});
  // set useful Array
  const resultDate = Object.keys(occurrences);
  const resultCount = Object.values(occurrences);
  // use for the values props of the CalendarHeatmap
  const data = getRange(resultCount.length).map((d) => (
    {
      date: resultDate[d],
      count: resultCount[d],
    }));
  return (
    <div>
      <header>
        <h2>Streaks</h2>
        <div className={classes.description}>
          <div>Encounter for last 5 months</div>
          <div className={classes.descriptionScales}>
            <div className={classes.scales}>
              <div>Low  </div>
              <div className={classes.streaks0} />
              <div className={classes.streaks1} />
              <div className={classes.streaks2} />
              <div className={classes.streaks3} />
              <div className={classes.streaks4} />
              <div className={classes.streaks5} />
              <div>  High</div>
            </div>
          </div>
        </div>
      </header>
      <div>
        <ReactTooltip/>
        <CalendarHeatmap
          startDate={shiftDate(today, -150)}
          endDate={today}
          values={data}
          classForValue={(value) => {
            if (!value) {
              return 'color-streaks-0';
            }
            return `${value.count}` <= 10 ?
              `color-streaks-${value.count}` :
              `color-streaks-10`;
          }}
          tooltipDataAttrs={(value) => {
            if (!value.date) {
              return {'data-tip':
              `None encounter at this date`};
            }
            return {
              'data-tip': `${getLongDateStringWithSlashes(value.date)} 
              has count: 
              ${value.count }`,
            };
          }
          }
          showWeekdayLabels={true}
        />
      </div>
    </div>
  );
}
// use for the startDate props of the CalendarHeatmap
function shiftDate(date, numDays) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}
function getRange(count) {
  return Array.from({length: count}, (_, i) => i);
}
export default Streaks;
