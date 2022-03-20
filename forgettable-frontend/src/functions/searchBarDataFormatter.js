
export function searchBarDataFormatter(people, encounters) {
  const result = [];
  people.forEach((person) => {
    result.push({title: person.first_name, type: 'people', id: person._id});
  });
  encounters.forEach((encounter) => {
    result.push({title: encounter.title, type: 'encounters', id: encounter._id});
  });
  return result;
};
