# Forgettable - Backend

This is the backend of Forgettable repository.

## How to set up backend
1. Make sure your current directory is `Forgettable/backend`
2. Create .env under repo's `backend` folder
    - `MONGODB_URI` should be set to a running mongodb instance url (should start with `mongodb+src://`)
    - `PORT` should be set to 3001 (*that is, if proxy on `forgettable-frontend` is set to `http://localhost:3001/`)   
    - `NODE_ENV` should be set to `test` if you are running `npm run test`
    

## To run application
1. Run `npm i` to install all the dependencies of backend.
2. Run `npm start` to run the server

## Testing

### Integration Testing
Integration testing tests API endpoints through mock in-memory mongodb instance. We use `supertest` for wrapping express app, `mongodb-memory-server` for mock mongodb instance, `jest` for running the tests.
1. Make sure `NODE_ENV` is set to `test` in `Forgettable/backend/.env`
2. Run `npm run test` to run all the tests. 

### Static Testing (Lint)
`ESLint` is set up to enforce coding standard. Our lint setup extends AirBnB's lint settings, with some overridden rules.
1. Run `npm run lint` to check what lint issues there are
2. Run `npm run lint-fix` to fix all the errors that can be automatically resolved by lint.

# For Developers

Here are some useful information to help future contributors to understand the codebase.

## Languages / Framework / Tool
- Typescript 
- Node & Express & MongoDB
- Jest for test
- Npm for dependency management. **Do not use `yarn`**

## Architecture Description
We follow a standard backend architecture.

- src
    - **routes** configures endpoints and attaches controller as an action to each route's REST methods
    - **controllers** contains high-level operations using services, consumed by routes
    - **services** contains database operations
    - **models** describes mongodb database schema (`person.model.ts`) and exports interfaces (`PersonModel`)

### Creating an integration test
Integration test wraps express app and connects to a mock, in-memory mongodb instance.

Here's an example of integration test. Make sure to create integration tests under `src/routes/__test__` for easier navigation.

Example of an integration test (`src/routes/__test__/person.route.test.ts`)
```js
import httpStatus from 'http-status';
import databaseOperations from '../../utils/test/db-handler';
import { PersonModel } from '../../models/person.model';
import app from '../../index';

const supertest = require('supertest');

beforeAll(async () => databaseOperations.connectDatabase());
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

const requestPersonData:PersonModel = {
  first_name: 'new person',
  last_name: 'hellob',
  interests: ['a', 'b'],
  organisation: 'helloc',
  time_added: new Date('2022-01-01'),
  how_we_met: 'helloe',
  birthday: new Date('2002-12-12'),
  encounters: [] as any,
};

describe('person ', () => {
  it('can be created correctly', async () => {
    await supertest(app).post('/api/persons/create')
      .set('Accept', 'application/json')
      .send(requestPersonData)
      .expect(httpStatus.CREATED);

    const { body } = await supertest(app).get('/api/persons');
    expect(body).toHaveLength(1);
    const result:PersonModel = body[0];
    expect(result.first_name).toEqual(requestPersonData.first_name);
    expect(result.last_name).toEqual(requestPersonData.last_name);
  });
});
```

We can run these tests through `npm run test`