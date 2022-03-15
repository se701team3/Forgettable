import moment from 'moment';

export const getFirstMetTimeString = (timeInMs) => {
  return timeInMs ?
                  moment(timeInMs).fromNow() :
                  'once upon a time';
};

export const getDateLastMetString = (timeInMs) => {
  return timeInMs ?
                  moment(timeInMs).format('DD/MM/YYYY') :
                  'never :(';
};

export const getBirthdayString = (timeInMs) => {
  return timeInMs ?
                  moment(timeInMs).format('DD MMM YYYY') :
                  '';
};

export const getDateString = (timeInMs) => {
  return timeInMs ?
                  moment(timeInMs).format('DD/MMM/YYYY') :
                  'once upon a time';
};

export const calculateAge = (timeInMs) => {
  return timeInMs ?
                  moment().diff(moment(timeInMs), 'years') :
                  '';
};

export const getDateString = (timeInMs) => {
  return timeInMs ?
          moment(timeInMs).format('DD/MM/YYYY') :
          'Unknown :(';
};
