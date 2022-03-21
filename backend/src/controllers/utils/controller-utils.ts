import personService from '../../services/person.service';

export default async function getPersonDetails(personId: any) {
  let person = await personService.getPersonWithId(personId);
  return {
    _id: person?._id,
    first_name: person?.first_name,
    last_name: person?.last_name,
    image: person?.image,
  };
}
