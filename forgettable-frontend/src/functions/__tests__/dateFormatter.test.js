import {
  getFirstMetTimeString,
  getLongDateStringWithSpaces,
  calculateAge,
  getLongDateStringWithSlashes,
  getMonthAndDay,
  getDayOfWeek,
} from '../dateFormatter';

test(
    'getFirstMetTimeString: should format a first met Date object into an appropraite string',
    () => {
      const twoYearsAgo =
      new Date(Date.now() - (365 * 24 * 60 * 60 * 1000 * 2));

      const formattedString = getFirstMetTimeString(twoYearsAgo);

      expect(formattedString).toBe('2 years ago');
    });

test(
    'getFirstMetTimeString: should return an appropriate null-representing string given a first met Date object',
    () => {
      const formattedString = getFirstMetTimeString(null);

      expect(formattedString).toBe('once upon a time');
    });

test('getLongDateStringWithSpaces: should format a Date string into a date string with spaces',
    () => {
      () => {
        const date = new Date('01-01-2000');

        const formattedString = getLongDateStringWithSpaces(date);

        expect(formattedString).toBe('01/01/2000');
      };
    });

test('getLongDateStringWithSpaces: should return a string representing "Unknown" given a null Date object',
    () => {
      () => {
        const formattedString = getLongDateStringWithSpaces(null);

        expect(formattedString).toBe('Unknown');
      };
    });

test(
    'calculateAge: should format a Date object into a Number reprensenting the number of years from that date',
    () => {
      const twoYearsAgo =
          new Date(Date.now() - (365 * 24 * 60 * 60 * 1000 * 2));

      const formattedString = calculateAge(twoYearsAgo);

      expect(formattedString).toBe(2);
    });

test(
    'calculateAge: should return a string representing "Unknown" given a null Date object',
    () => {
      const formattedString = calculateAge(null);

      expect(formattedString).toBe('Unknown');
    });


test('getLongDateStringWithSlashes: should format a Date string into a date string with slashes',
    () => {
      () => {
        const date = new Date('01-01-2000');

        const formattedString = getLongDateStringWithSpaces(date);

        expect(formattedString).toBe('01/01/2000');
      };
    });

test('getLongDateStringWithSlashes: should return a string representing "Unknown" given a null Date object',
    () => {
      () => {
        const formattedString = getLongDateStringWithSpaces(null);

        expect(formattedString).toBe('Unknown');
      };
    });

test('getDayOfWeek: should return a string representing "Unknown" given a null Date object',
    () => {
      () => {
        const formattedString = getDayOfWeek(null);

        expect(formattedString).toBe('Unknown');
      };
    });

test('getDayOfWeek: should format date into day of the week',
    () => {
      () => {
        const date = new Date('30-03-2022');
        const formattedString = getDayOfWeek(date);

        expect(formattedString).toBe('Wednesday');
      };
    });

test('getMonthAndDay: should return a string representing "Unknown" given a null Date object',
    () => {
      () => {
        const formattedString = getMonthAndDay(null);

        expect(formattedString).toBe('Unknown');
      };
    });

test('getMonthAndDay: should format date into day of the week',
    () => {
      () => {
        const date = new Date('30-03-2022');
        const formattedString = getMonthAndDay(date);

        expect(formattedString).toBe('30 March');
      };
    });
