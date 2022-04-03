import {convertSocialMedia} from './convertSocialMediaFormat';

export const unmarshalPerson = (person) => {
  return (
    {
      ...person,
      firstMet: person.first_met ? new Date(person.first_met) : null,
      howWeMet: person.how_we_met,
      firstName: person.first_name,
      lastName: person.last_name,
      socialMedia: convertSocialMedia(person.social_media) || [],
      timeUpdated: person.time_updated ? new Date(person.time_updated) : null,
      id: person._id,
      encounters: person.encounters || [],
      birthday: person.birthday ? new Date(person.birthday) : null,
    }
  );
};

export const unmarshalCompany = (company) => {
  return (
    {
      ...company,
      name: company.name,
      location: company.location,
      description: company.description,
      date_founded: company.date_founded,
      id: company._id,
    }
  );
};


export const unmarshalEncounters = (encounter) => {
  return (
    {
      ...encounter,
      id: encounter._id,
      timeUpdated: encounter.time_updated ?
      new Date(encounter.time_updated) : null,
      date: encounter.date ? new Date(encounter.date) : null,
    }
  );
};

export const unmarshalGoal = (goal) => {
  return (
    {
      ...goal,
      endDate: goal.date_end,
      goal: goal.encounter_goal,
      encountered: goal.progress,
    }
  );
};
