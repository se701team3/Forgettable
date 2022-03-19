import moment from 'moment';

/**
 * Formats a date string to a human readable format,
 * shows "once upon a time" if the date is not available
 * @param {Date} date a date object to be formatted
 * @return {String} formatted human readable date string
 */
export const getFirstMetTimeString = (date) => {
  return date ?
                  moment(date).fromNow() :
                  'once upon a time';
};

/**
 * Formats a date string into long form with spaces
 * Typically used for birthdays.
 * @param {Date} date  a date object to be formatted
 * @return {String} formatted long date string
 */
export const getLongDateStringWithSpaces = (date) => {
  return date ?
                  moment(date).format('DD MMM YYYY') :
                  'Unknown';
};

/**
 * Formats a date string into a single number representing
 * the number of years from that date.
 * @param {Date} date a date object to be formatted
 * @return {Number} a number representing the number of years
 */
export const calculateAge = (date) => {
  return date ?
                  moment().diff(moment(date), 'years') :
                  'Unknown';
};

/**
 * Formats a date string into long form with slashes
 * @param {Date} date  a date object to be formatted
 * @return {String} formatted long date string
 */
export const getLongDateStringWithSlashes = (date) => {
  return date ?
          moment(date).format('DD/MM/YYYY') :
          'Unknown';
};
