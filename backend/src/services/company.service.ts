/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import Company, { CompanyModel } from '../models/company.model';
import logger from '../utils/logger';

const queryKeys = ['name', 'location', 'description'];

const createCompany = async (companyDetails: CompanyModel) => {
  const company = new Company(companyDetails);

  await company.save();

  return company;
};

const getCompany = async (companyId) => Company.findOne({ _id: companyId });

const getAllCompanies = async (queryParams: any, userCompanies: mongoose.Types.ObjectId[]) => {
  // Get all companies from the db which belongs to the user
  let foundUserCompanies = await Company.find({ _id: { $in: userCompanies } });

  // Filter the found companies by query params
  if (queryParams.term) {
    logger.info('Query params received:');
    logger.info(queryParams);
    const termValue = queryParams.term.toLowerCase();

    // If no relevant fields in an company match 'termValue', remove them from the array
    foundUserCompanies = foundUserCompanies.filter((company) => {
      for (let i = 0; i < queryKeys.length; i++) {
        // Make sure person has a value for current queryKey
        if (company[queryKeys[i]]) {
          const companyValue = (company[queryKeys[i]] as string).toLowerCase();
          if (companyValue.includes(termValue)) {
            return true;
          }
        }
      }
      return false;
    });
  }

  return foundUserCompanies;
};

const updateCompany = async (objectID: string, companyDetails: CompanyModel) => {
  console.log(objectID);
  const updatedCompany = await Company
    .findByIdAndUpdate(objectID, companyDetails, { new: true });

  return updatedCompany;
};

// Service is used for deletePersons endpoint
const deleteCompanyPerson = async (personID: string) => {
  // Remove the person with the supplied ID from all existing companies
  const result = await Company.updateMany({ }, { $pullAll: { persons: [{ _id: personID }] } });
  // Store references to the companys that no longer contain persons so they can be removed from Users later
  const empty_companies = await Company.find({ persons: { $exists: true, $size: 0 } });
  // Delete all the empty companies
  const deleted_companies = await Company.deleteMany({ persons: { $exists: true, $size: 0 } });

  // Check that all deleted companies are returned and companies have been updated
  if (empty_companies.length == deleted_companies.deletedCount) {
    return { array: empty_companies, bool: true };
  }
  return { array: empty_companies, bool: false };
};

const deleteCompany = async (companyID: String) => {
  const result = await Company.deleteOne({ _id: companyID }).exec();

  // Check that company has been deleted
  if (result.deletedCount == 1) {
    return true;
  }
  return false;
};

const companyService = {
  createCompany,
  updateCompany,
  getCompany,
  getAllCompanies,
  deleteCompany,
  deleteCompanyPerson,
};

export default companyService;
