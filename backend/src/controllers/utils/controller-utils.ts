import personService from '../../services/person.service';

export default async function getPersonDetails(personId: any) {
  let person = await personService.getPersonWithId(personId);
  return {
    _id: person?._id,
    name: person?.name,
    image: person?.image,
  };
}
