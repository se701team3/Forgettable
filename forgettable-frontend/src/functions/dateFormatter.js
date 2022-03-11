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
