import httpStatus from "http-status";
import databaseOperations from "../../utils/test/db-handler";

import { PersonModel } from "../../models/person.model";
import app from "../../server";
import testUtils from "../../utils/test/test-utils";
import "dotenv/config";
import {Importance} from "../../enums/importance";

const supertest = require("supertest");

let token;

beforeAll(async () => {
  
  token = await testUtils.generateTestAuthToken();

  await databaseOperations.connectDatabase();
});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => await databaseOperations.closeDatabase());

const user1Data = {
  first_name: "Bing",
  last_name: "Bong",
  encounters: [] as any,
  persons: [] as any,
  companies: [] as any
};

const user2Data = {
  last_name: "Mong",
  encounters: [] as any,
  persons: [] as any,
  companies: [] as any
};

const user3Data = {
  first_name: "Tingy",
  encounters: [] as any,
  persons: [] as any,
  companies: [] as any
};

const user4Data = {
  first_name: "Tingy",
  last_name: "Tangy",
  encounters: [] as any,
  companies: [] as any
};

const user5Data = {
  first_name: "Tingy",
  last_name: "Tangy",
  persons: [] as any,
  companies: [] as any
};

const person1Data: PersonModel = {
  first_name: "Ray",
  last_name: "Ping",
  interests: ["video games", "hockey"],
  labels: ['Devop'],
  organisation: "helloc",
  time_updated: new Date("2022-01-01"),
  importance_level: null as any,
  how_we_met: "Hockey club",
  birthday: new Date("2002-12-12"),
  encounters: [] as any,
  companies: [] as any,
  first_met: new Date("2022-01-01"),
  gender: "male",
  image: null as any,
  location: null as any,
  social_media: null as any,
};

const person2Data: PersonModel = {
  first_name: "Adam",
  last_name: "Bong",
  interests: ["badminton", "golf"],
  labels: ['Devop'],
  organisation: "helloc",
  time_updated: new Date("2022-02-23"),
  importance_level: Importance.Should_Remember,
  how_we_met: "Skype",
  birthday: new Date("2001-07-16"),
  encounters: [] as any,
  companies: [] as any,
  first_met: new Date("2022-02-23"),
  gender: "other",
  image: null as any,
  location: null as any,
  social_media: null as any,
};

describe("POST /users", () => {
  it("Successfully creates a new user with all user info given", async () => {
    await supertest(app)
      .post("/api/users")
      .set("Accept", "application/json")
      .send(user1Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);
  });

  it("User without persons field can be created and defaults to empty array", async () => {
    const { body: user } = await supertest(app)
      .post("/api/users")
      .set("Accept", "application/json")
      .send(user4Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

    expect(user.persons).toEqual([]);
  });

  it("User without encounters field can be created and defaults to empty array", async () => {
    const { body: user } = await supertest(app)
      .post("/api/users")
      .set("Accept", "application/json")
      .send(user5Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

    expect(user.encounters).toEqual([]);
  });

  it("Successful user creation returns correct user info without auth_id", async () => {
    const { body: user } = await supertest(app)
      .post("/api/users")
      .set("Accept", "application/json")
      .send(user1Data)
      .set("Authorization", token);

    expect(user.auth_id).toBeUndefined();
    expect(user.first_name).toEqual(user1Data.first_name);
    expect(user.last_name).toEqual(user1Data.last_name);
    expect(user.encounters).toEqual(user1Data.encounters);
    expect(user.persons).toEqual(user1Data.persons);
  });

  it("Failed to create new user without auth token", async () => {
    await supertest(app)
      .post("/api/users")
      .set("Accept", "application/json")
      .send(user1Data)
      .expect(httpStatus.UNAUTHORIZED);
  });

  it("Failed to create new user without first name", async () => {
    await supertest(app)
      .post("/api/users")
      .set("Accept", "application/json")
      .send(user2Data)
      .set("Authorization", token)
      .expect(httpStatus.BAD_REQUEST);
  });

  it("Failed to create new user without last name", async () => {
    await supertest(app)
      .post("/api/users")
      .set("Accept", "application/json")
      .send(user3Data)
      .set("Authorization", token)
      .expect(httpStatus.BAD_REQUEST);
  });

  it("User not stored in database when request is unsuccessful", async () => {
    await supertest(app)
      .post("/api/users")
      .set("Accept", "application/json")
      .send(user1Data);

    await supertest(app)
      .get("/api/users")
      .set("Authorization", token)
      .expect(httpStatus.NOT_FOUND);
  });

  it("User with same UID and info cannot be created twice", async () => {
    await supertest(app)
      .post("/api/users")
      .set("Accept", "application/json")
      .send(user1Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

    await supertest(app)
      .post("/api/users")
      .set("Accept", "application/json")
      .send(user1Data)
      .set("Authorization", token)
      .expect(httpStatus.CONFLICT);

    await supertest(app)
      .get("/api/users")
      .set("Authorization", token)
      .expect(httpStatus.OK);
  });

  it("User with same UID but different info cannot be created twice", async () => {
    await supertest(app)
      .post("/api/users")
      .set("Accept", "application/json")
      .send(user1Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

    await supertest(app)
      .post("/api/users")
      .set("Accept", "application/json")
      .send(user2Data)
      .set("Authorization", token)
      .expect(httpStatus.CONFLICT);

    await supertest(app)
      .get("/api/users")
      .set("Authorization", token)
      .expect(httpStatus.OK);
  });
});

describe("GET /users", () => {
  it("Fetches user with auth_id present in token", async () => {
    await supertest(app)
    .post("/api/users")
    .set("Accept", "application/json")
    .send(user1Data)
    .set("Authorization", token)
    .expect(httpStatus.CREATED);

    const { body: user } = await supertest(app)
    .get("/api/users")
    .set("Accept", "application/json")
    .set("Authorization", token)
    .expect(httpStatus.OK);

    expect(user.auth_id).toBeUndefined();
    expect(user.first_name).toEqual(user1Data.first_name);
    expect(user.last_name).toEqual(user1Data.last_name);
    expect(user.encounters).toEqual(user1Data.encounters);
    expect(user.persons).toEqual(user1Data.persons);
  })

  it("Returns no user when none with auth_id found", async () => {
    await supertest(app)
    .get("/api/users")
    .set("Accept", "application/json")
    .set("Authorization", token)
    .expect(httpStatus.NOT_FOUND)
  })
})