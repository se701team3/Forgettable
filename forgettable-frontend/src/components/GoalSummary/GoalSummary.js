import React, {useEffect, useState} from 'react';
import classes from './GoalSummary.module.css';
import {
  CircularProgress,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
} from '@mui/material';
import CustomModal from '../../components/CustomModal/CustomModal';
import {createGoal, deleteGoal, getUser, updateGoal} from '../../services';
import {toastGenerator} from '../../functions/helper';
import CustomButton from '../../components/CustomButton/CustomButton';
import EditIcon from '@mui/icons-material/Edit';

/*
 * Component for displaying information of goal details.
 * Includes modals for creating and editing goal details.
 * Includes full card for displaying goal details or prompt
 * for creating a new goal if no goal details are found.
 *
 * Author: Bruce Zeng
 */
const GoalSummary = ({goal, update}) => {
  const [goalDetails, setGoalDetails] = useState({
    endDate: new Date(),
    encountered: 0,
    goal: 0,
    recurring: false,
    _id: '',
  });

  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');
  const [goalLabel, setGoalLabel] = useState('');
  const [inputEndDate, setInputEndDate] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [newGoal, setNewGoal] = useState({
    encounter_goal: 0,
    recurring: false,
    duration: '',
  });

  const currentDate = new Date();
  const endDateDate = new Date(goalDetails.endDate);
  const secondsLeft = (currentDate.getTime() - endDateDate.getTime())/1000;
  const daysLeft = (secondsLeft / (60 * 60 * 24));
  const hoursLeft = Math.floor((secondsLeft % (60 * 60 * 24)) / (60 * 60));

  useEffect(() => {
    if (goalDetails.encountered >= goalDetails.goal) {
      setProgress(100);
      setGoalLabel('Well done!');
    } else {
      setProgress((goalDetails.encountered / goalDetails.goal) * 100);
      const difference = goalDetails.goal-goalDetails.encountered;
      setGoalLabel(difference.toString() + ' to go!');
    };

    if (-1*daysLeft < 1) {
      setTimeLeft('Ends in '+ (-1*hoursLeft).toString() + ' hours');
    } else {
      setTimeLeft('Ends in '+ (Math.floor(-1*daysLeft)).toString() + ' days');
    }
  }, [goalDetails]);

  useEffect(() => {
    if (goal) {
      setGoalDetails(goal);
    }
  }, [goal]);

  const handleNewGoalClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleNewEncountersChange = (e) => {
    setNewGoal({...newGoal, encounter_goal: Number(e.target.value)});
  };

  const handleInputDateChange = (event) => {
    handleDateLabelChange(event);
    setNewGoal({...newGoal, duration: event.target.value.toString()});
  };

  const handleDateLabelChange = (e) => {
    setInputEndDate(e.target.value);
  };

  const handleCheckBox = (e) => {
    setRecurring(recurring ? false : true);
    setNewGoal({...newGoal, recurring: e.target.checked});
  };


  const handleCreateGoal = async () => {
    if (newGoal.encounter_goal <= 0 || isNaN(newGoal.encounter_goal)||
          newGoal.duration == '') {
      toastGenerator('error',
          'Please make sure to enter a postive number for "Encounters"' +
            ' and a duration.', 5000);
    } else {
      await saveGoal(newGoal);
      setNewGoal({...newGoal, encounter_goal: '', recurring: false});
      setModalOpen(false);
      setRecurring(false);
    }
  };

  async function saveGoal(goalToPost) {
    const result = await createGoal(goalToPost);
    if (result) {
      setNewGoal({...newGoal, recurring: false});
      update();
    } else {
      toastGenerator('error', 'Something went wrong... :(', 2000);
    }
  }

  const handleEdit = () => {
    if (newGoal.encounter_goal <= 0 || isNaN(newGoal.encounter_goal)||
          newGoal.duration == '') {
      toastGenerator('error',
          'Please make sure to enter a postive number for "Encounters"' +
            ' and a duration.', 5000);
    } else {
      editGoal(newGoal);
    }
  };

  const editGoal = async (goalToPost) => {
    await updateGoal(goalDetails._id, goalToPost);
    setNewGoal({...newGoal, encounter_goal: '', recurring: false});
    setModalOpen(false);
    setRecurring(false);
    update();
  };

  const handleDelete = async () => {
    const result = await deleteGoal(goalDetails._id);
    if (result) {
      update();
    } else {
      toastGenerator('error', 'Something went wrong... :(', 2000);
    }
    setModalOpen(false);
  };

  if (goal) {
    return (
      <>
        <CustomModal open={modalOpen}>
          <div className={classes.goal_modalTitle}>Edit Goal</div>
          <div>
            <div className={classes.inputBlock}>
              <div className={classes.input_card}>
                <label style={{marginRight: '10px'}}>Encounters:</label>
                <TextField
                  id="encounter_goal_input"
                  variant="outlined"
                  size="small"
                  label="E.g. 5"
                  onChange={handleNewEncountersChange}
                />
              </div>

              <div className={classes.input_card}>
                <label style={{marginRight: '34px'}}>Duration:</label>
                <FormControl style={{minWidth: 225}}>
                  <InputLabel id="end-date-select-label">Duration</InputLabel>
                  <Select
                    labelId="end-date-select-label"
                    id="end-date-select"
                    value={inputEndDate}
                    label="End Date"
                    onChange={handleInputDateChange}
                    size="small"
                  >
                    <MenuItem value={1}>1 Day</MenuItem>
                    <MenuItem value={7}>1 Week</MenuItem>
                    <MenuItem value={28}>1 Month</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className={classes.input_card}>
                <label style={{marginRight: '5px'}}>Recurring?</label>
                <Checkbox
                  checked={recurring}
                  onChange={handleCheckBox}
                ></Checkbox>
              </div>
            </div>
            <div className={classes.buttonContainer}>
              <CustomButton
                className={classes.confirmButton}
                onClick={handleEdit}
                btnText="Confirm"
              />
              <CustomButton
                className={classes.cancelButton}
                onClick={handleModalClose}
                btnText="Cancel"
              />
              <CustomButton
                className={classes.deleteButton}
                onClick={handleDelete}
                btnText="Remove"
              />
            </div>
          </div>
        </CustomModal>

        <div className={classes.GoalContainer}>
          <Box sx={{position: 'relative', display: 'inline-flex'}}>
            <CircularProgress
              color="success"
              size={75}
              variant="determinate"
              value={-progress}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="caption"
                component="div"
                color="black"
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {`${goalDetails.encountered}/${goalDetails.goal}`}
              </Typography>
            </Box>
          </Box>
          <div className={classes.goalLabelContainer}>
            <div className={classes.GoalLabel}>{goalLabel}</div>
            <div className={classes.DateLabel}>{timeLeft}</div>
            <EditIcon className={classes.editIcon}
              onClick={handleNewGoalClick}/>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <CustomModal open={modalOpen}>
          <div className={classes.goal_modalTitle}>Add a new goal</div>
          <div className={classes.inputBlock}>
            <div className={classes.input_card}>
              <label style={{marginRight: '10px'}}>Encounters:</label>
              <TextField
                id="encounter_goal_input"
                variant="outlined"
                size="small"
                label="E.g. 5"
                onChange={handleNewEncountersChange}
              />
            </div>

            <div className={classes.input_card}>
              <label style={{marginRight: '34px'}}>Duration:</label>
              <FormControl style={{minWidth: 225}}>
                <InputLabel id="end-date-select-label">Duration</InputLabel>
                <Select
                  labelId="end-date-select-label"
                  id="end-date-select"
                  value={inputEndDate}
                  label="End Date"
                  onChange={handleInputDateChange}
                  size="small"
                >
                  <MenuItem value={1}>1 Day</MenuItem>
                  <MenuItem value={7}>1 Week</MenuItem>
                  <MenuItem value={28}>1 Month</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className={classes.input_card}>
              <label style={{marginRight: '5px'}}>Recurring?</label>
              <Checkbox
                checked={recurring}
                onChange={handleCheckBox}
              ></Checkbox>
            </div>
          </div>

          <div className={classes.buttonContainer}>
            <CustomButton
              className={classes.confirmButton}
              onClick={handleCreateGoal}
              btnText="Confirm"
            />
            <CustomButton
              className={classes.cancelButton}
              onClick={handleModalClose}
              btnText="Cancel"
            />
          </div>
        </CustomModal>

        <div>
          <p className={classes.NewGoalMsg}>
            None set, you can create a new goal
            <button
              className={classes.button_link}
              onClick={handleNewGoalClick}
            >
              here
            </button>
          </p>
        </div>
      </>
    );
  }
};

export default GoalSummary;
