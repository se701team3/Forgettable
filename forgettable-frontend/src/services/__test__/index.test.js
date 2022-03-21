import axios from 'axios';
import * as apiCalls from '../index';
import {getHeaders} from '../functions/helpers';
import firebase from 'firebase/compat/app';

jest.mock('axios');

const SERVER_URL = 'http://localhost:3001/api/';

describe('person api calls', () => {
  it('returns a person with id', async () => {
    const id = '1';
    const person = {
      _id: '1',
      first_name: 'Adam',
      interests: [],
      encounters: [],
      time_updated: '2022-03-15T11:36:00.107Z',
    };

    axios.get.mockResolvedValue({data: person});

    expect(axios.get).not.toHaveBeenCalled();
    firebase.auth().onAuthStateChanged(async (u) => {
      if (u) {
        const result = await apiCalls.getPerson(id);
        expect(axios.get).toHaveBeenCalled();
        expect(result).toEqual(person);
      }
    });
  });

  it('returns a list of persons', async () => {
    const persons = [
      {
        _id: '1',
        first_name: 'Adam',
        interests: [],
        encounters: [],
        time_updated: '2022-03-15T11:36:00.107Z',
      },
      {
        _id: '2',
        first_name: 'Jiaru',
        interests: [],
        encounters: [],
        time_updated: '2022-03-15T11:39:02.797Z',
      },
      {
        _id: '3',
        first_name: 'Raina',
        interests: [],
        encounters: [],
        time_updated: '2022-03-15T11:39:02.797Z',
      },
    ];

    axios.get.mockResolvedValue({data: persons});

    expect(axios.get).not.toHaveBeenCalled();
    firebase.auth().onAuthStateChanged(async (u) => {
      if (u) {
        const result = await apiCalls.getAllPersons();
        expect(axios.get).toHaveBeenCalledWith(`${SERVER_URL}persons`, {'headers': getHeaders()});
        expect(result).toEqual(persons);
      }
    });
  });

  it('returns a person created', async () => {
    const person = {
      first_name: 'Adam',
      interests: [],
      encounters: [],
    };

    axios.post.mockResolvedValue({data: person});

    expect(axios.post).not.toHaveBeenCalled();
    firebase.auth().onAuthStateChanged(async (u) => {
      if (u) {
        const result = await apiCalls.createPerson(person);
        expect(axios.post).toHaveBeenCalled();
        expect(result).toEqual(person);
      }
    });
  });

  it('returns a person updated', async () => {
    const id = '1';
    const person = {
      _id: '1',
      first_name: 'Adam',
      interests: [],
      encounters: [],
    };

    axios.put.mockResolvedValue({data: person});

    expect(axios.put).not.toHaveBeenCalled();
    firebase.auth().onAuthStateChanged(async (u) => {
      if (u) {
        const result = await apiCalls.updatePerson(id, person);
        expect(axios.put).toHaveBeenCalled();
        expect(result).toEqual(person);
      }
    });
  });

  it('a person is deleted', async () => {
    const id = '1';

    axios.delete.mockResolvedValue({data: id});

    expect(axios.delete).not.toHaveBeenCalled();
    firebase.auth().onAuthStateChanged(async (u) => {
      if (u) {
        await apiCalls.deletePerson(id);
        expect(axios.delete).toHaveBeenCalled();
      }
    });
  });
});

describe('encounter api calls', () => {
  it('returns an encounter with id', async () => {
    const id = '1';
    const encounter = {
      _id: '1',
      title: 'example title',
      date: '2022-03-15T11:39:02.797Z',
      location: 'auckland',
      description: 'example description',
      persons: ['1', '2', '3'],
    };

    axios.get.mockResolvedValue({data: encounter});

    expect(axios.get).not.toHaveBeenCalled();
    firebase.auth().onAuthStateChanged(async (u) => {
      if (u) {
        const result = await apiCalls.getEncounter(id);
        expect(axios.get).toHaveBeenCalledWith(`${SERVER_URL}encounters/${id}`, {'headers': getHeaders()});
        expect(result).toEqual(encounter);
      }
    });
  });

  it('returns a list of encounters', async () => {
    const encounters = [
      {
        _id: '1',
        title: 'example title',
        date: '2022-03-15T11:39:02.797Z',
        location: 'auckland',
        description: 'example description',
        persons: ['1', '2', '3'],
      },
      {
        _id: '2',
        title: 'example title 2',
        date: '2022-03-15T11:39:02.797Z',
        location: 'auckland',
        description: 'example description',
        persons: ['1', '2', '3'],
      },
      {
        _id: '3',
        title: 'example title 3',
        date: '2022-03-15T11:39:02.797Z',
        location: 'auckland',
        description: 'example description',
        persons: ['1', '2', '3'],
      },
    ];

    axios.get.mockResolvedValue({data: encounters});

    expect(axios.get).not.toHaveBeenCalled();
    firebase.auth().onAuthStateChanged(async (u) => {
      if (u) {
        const result = await apiCalls.getAllEncounters();
        expect(axios.get).toHaveBeenCalledWith(`${SERVER_URL}encounters`, {'headers': getHeaders()});
        expect(result).toEqual(encounters);
      }
    });
  });

  it('returns an encounter created', async () => {
    const encounter = {
      _id: '1',
      title: 'example title',
      date: '2022-03-15T11:39:02.797Z',
      location: 'auckland',
      description: 'example description',
      persons: ['1', '2', '3'],
    };

    axios.post.mockResolvedValue({data: encounter});

    expect(axios.post).not.toHaveBeenCalled();
    firebase.auth().onAuthStateChanged(async (u) => {
      if (u) {
        const result = await apiCalls.createEncounter(encounter);
        expect(axios.post).toHaveBeenCalled();
        expect(result).toEqual(encounter);
      }
    });
  });

  it('returns an encounter updated', async () => {
    const id = '1';
    const encounter = {
      _id: '1',
      title: 'example title',
      date: '2022-03-15T11:39:02.797Z',
      location: 'auckland',
      description: 'example description',
      persons: ['1', '2', '3'],
    };

    axios.put.mockResolvedValue({data: encounter});

    expect(axios.put).not.toHaveBeenCalled();
    firebase.auth().onAuthStateChanged(async (u) => {
      if (u) {
        const result = await apiCalls.updateEncounter(id, encounter);
        expect(axios.put).toHaveBeenCalled();
        expect(result).toEqual(encounter);
      }
    });
  });

  it('an encounter is deleted', async () => {
    const id = '1';

    axios.delete.mockResolvedValue({data: id});

    expect(axios.delete).not.toHaveBeenCalled();
    firebase.auth().onAuthStateChanged(async (u) => {
      if (u) {
        await apiCalls.deleteEncounter(id);
        expect(axios.delete).toHaveBeenCalled();
      }
    });
  });
});

it('returns a user', async () => {
  const user = {
    _id: '0',
    first_name: 'John',
    last_name: 'Smith',
    persons: [
      '1', '2', '3',
    ],
    encounters: [
      '4', '5',
    ],
  };

  axios.get.mockResolvedValue({data: user});

  expect(axios.get).not.toHaveBeenCalled();
  firebase.auth().onAuthStateChanged(async (u) => {
    if (u) {
      const result = await apiCalls.getUser();
      expect(axios.get).toHaveBeenCalledWith(`${SERVER_URL}users`, {'headers': getHeaders()});
      expect(result).toEqual(user);
    }
  });
});
