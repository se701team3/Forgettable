/* eslint-disable no-underscore-dangle */
/* eslint-disable dot-notation */
/**
 * Controller contains high-level operations using services, consumed by routes
 */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginateableResponse } from 'src/utils/paginateable.response';
import companyService from '../services/company.service';
import logger from '../utils/logger';
import { CompanyModel } from '../models/company.model';
import userService, { getUserByAuthId } from '../services/user.service';
import personService from '../services/person.service';
import getPersonDetails from './utils/controller-utils';
 
// Util function that won't be needed regularly
const getCompanyFromReqBody = (body: any) => {
  const company: CompanyModel = {
    name: body.name,
    date_founded: body.date_founded,
    time_updated: body.time_updated,
    location: body.location,
    description: body.description,
    image: body.image,
    persons: body.persons,
  };
 
  return company;
};
 
/**
  * searches for company in user by company id
  * @param user user which company should be found from
  * @param companyId id of the company to be searched from the user
  */
const isCompanyExistsInUser = (user, companyId: string): boolean => {
  const findCompany = user.companies.filter(
    (e) => e.toString() === companyId,
  );
  return findCompany.length !== 0;
};
 
export const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('POST /companies request from frontend');
 
  const authId = req.headers.authorization?.['user_id'];
 
  try {
    const user = await getUserByAuthId(authId);
 
    if (!user) {
      res.status(httpStatus.FORBIDDEN).send('No such User exists').end();
      return;
    }
 
    const createdCompany = await companyService.createCompany(req.body);
    logger.info(`${createdCompany._id}`);
    if (createdCompany.persons) {
      createdCompany.persons.forEach((personInCompany) => {
        if (!user.persons.includes(personInCompany)) {
          companyService.deleteCompany(`${createdCompany._id}`);
          res.status(httpStatus.FORBIDDEN).send('Person does not exist for this User').end();
        }
      });
    }
 
    const updateUser = await userService.addCompanyToUser(user.auth_id, createdCompany._id);
 
    if (!updateUser) {
      companyService.deleteCompany(`${createdCompany._id}`);
      res.status(httpStatus.CONFLICT).send('Failed to add company').end();
    }
 
    res.status(httpStatus.CREATED).json(createdCompany).end();
  } catch (e) {
    next(e);
  }
};
 
export const updateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  logger.info('PUT /companies/:id request from frontend');
 
  try {
    // check authorization is not a null object (this is necessary check for lint)
    if (req.headers.authorization == null) { return res.status(httpStatus.NOT_FOUND).end(); }
 
    const companyIdToUpdate = req.params.id;
    const firebaseAuthId = req.headers.authorization['user_id'];
 
    // check user exists with the firebase auth_id, and the user specified company actually exists
    const userByAuthId = await getUserByAuthId(firebaseAuthId);
    if (!userByAuthId || !isCompanyExistsInUser(userByAuthId, companyIdToUpdate)) {
      return res.status(httpStatus.NOT_FOUND).end();
    }
 
    // update company
    const newCompanyData = getCompanyFromReqBody(req.body);
    newCompanyData.time_updated = new Date(Date.now());
    const updatedCompany = await companyService.updateCompany(
      companyIdToUpdate,
      newCompanyData,
    );
    // updating persons list
    if (updatedCompany && updatedCompany.persons) {
      const updatePerson = await personService
        .addCompanyToPersons(updatedCompany.persons, updatedCompany._id);
    }

    return res
      .sendStatus(
        updatedCompany ? httpStatus.NO_CONTENT : httpStatus.NOT_FOUND,
      )
      .end();
  } catch (e) {
    next(e);
  }
};
 
export const getCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('GET /companies/:id request from frontend');
  try {
    const authId = req.headers.authorization?.['user_id'];
 
    const userCurrent = await userService.getUserByAuthId(authId);
    const companyId = req.params.id.toString();
    const usercompanies = userCurrent?.companies;
    const stringcompanies = usercompanies?.map((x) => x.toString());
 
    if (stringcompanies?.includes(companyId)) {
      // Find company from database
      const company = await companyService.getCompany(companyId);
      // Notify frontend that the operation was successful
      let companyDto = JSON.parse(JSON.stringify(company));
      companyDto.persons = await Promise.all(companyDto.persons.map(async (personId: any) => (await getPersonDetails(personId))));
      res.status(httpStatus.OK).json(companyDto).end();
    } else {
      res.sendStatus(httpStatus.NOT_FOUND).end();
    }
  } catch (e) {
    next(e);
  }
};
 
export const deleteCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('DELETE /companies/:companyID request from frontend');
  const authId = req.headers.authorization?.['user_id'];
  const user = await userService.getUserByAuthId(authId);
 
  if (!user) {
    // User cannot be found in db so must be unauthorized
    res.status(httpStatus.UNAUTHORIZED).end();
  }
 
  const { id } = req.params;
  const usercompanys = user?.companies;
  const stringcompanys = usercompanys?.map((x) => x.toString());
 
  if (stringcompanys?.includes(id.toString())) {
    try {
      // Delete company from company and Person collection
      const deletecompanyResult = await companyService.deleteCompany(id);
      const deletePersoncompanysResult = await personService.deletePersonCompanies(id);
      const deleteUsercompanyResult = await userService.deleteUserCompany(id);
 
      // Notify frontend that the operation was successful
      if (deletecompanyResult && deletePersoncompanysResult && deleteUsercompanyResult) {
        res.sendStatus(httpStatus.OK).end();
      } else {
        res.sendStatus(httpStatus.CONFLICT).end();
      }
    } catch (e) {
      next(e);
    }
  } else {
    res.sendStatus(httpStatus.NOT_FOUND).end();
  }
};
 
export const getAllCompanies = async (
  req: Request,
  expressRes: Response,
  next: NextFunction,
): Promise<void> => {
  const res = expressRes as PaginateableResponse;
  logger.info('GET /companys request from frontend');
 
  const authId = req.headers.authorization?.['user_id'];
  const user = await userService.getUserByAuthId(authId);
 
  try {
    if (!user) {
      res.status(httpStatus.NOT_FOUND).end();
    } else {
      // The stringify-parse combo removes typing allowing alteration of the persons field in each company
      const foundUserCompanies = JSON.parse(JSON.stringify(await companyService.getAllCompanies(req.query, user.companies)));
 
      // Adds embedded person details to the returned companies
      for (let i = 0; i < foundUserCompanies.length; i++) {
        foundUserCompanies[i].persons = await Promise.all(foundUserCompanies[i].persons.map(
          async (personsId: any) => (await getPersonDetails(personsId)),
        ));
      }
 
      res.status(httpStatus.OK).paginate(foundUserCompanies);
    }
  } catch (e) {
    next(e);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
  }
};
 