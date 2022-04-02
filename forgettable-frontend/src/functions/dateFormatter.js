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

/**
 * Formats a date string into the day of the week
 * @param {Date} date  a date object to be formatted
 * @return {String} formatted long date string
 */
export const getDayOfWeek = (date) => {
  return date ?
    moment(date).format('dddd') :
    'Unknown';
};


/**
 * Formats a date string into the day (in a number) and the month (name)
 * @param {Date} date  a date object to be formatted
 * @return {String} formatted long date string
 */
export const getMonthAndDay = (date) => {
  return date ?
    moment(date).format('D MMMM') :
    'Unknown';
};


export const getInputDateFormatString = (date) => {
  return date ?
    moment(date).format('yyyy-MM-DD') :
    '';
};

/**
 * Formats a date string into the day (in a number) and the month (name)
 * or the day of the week if the date is this week
 * Logic for checking if date is in current week retrieve from:
 * https://stackoverflow.com/questions/36787908/how-to-check-if-date-is-in-this-week-in-javascript
 * @param {Date} date  a date object to be formatted
 * @return {String} formatted long date string
 */
export const getBirthdayDate = (date) => {
  const today = moment();
  const inputDate = moment(date);
  const isThisWeek = (today.isoWeek() == inputDate.isoWeek());
  if (isThisWeek) {
    return getDayOfWeek(date);
  } else {
    return getMonthAndDay(date);
  }
};
