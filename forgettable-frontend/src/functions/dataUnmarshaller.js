export const unmarshalPerson = (person) => {
  return (
    {
      ...person,
      firstMet: person.first_met,
      howWeMet: person.how_we_met,
      lastName: person.last_name,
      socialMedia: person.social_media,
      timeUpdated: person.time_updated,
      id: person._id,
    }
  );
};

export const unmarshalEncounters = (encounter) => {
  return (
    {
      ...encounter,
      id: encounter._id,
      timeUpdated: encounter.time_updated,
    }
  );
};
