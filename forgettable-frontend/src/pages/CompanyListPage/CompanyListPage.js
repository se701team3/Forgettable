import React, {useEffect, useState} from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import classes from './CompanyListPage.module.css';
import IconButton from '../../components/IconButton/IconButton';
import InfiniteScroll from 'react-infinite-scroll-component';
import {searchCompany, deleteCompany, getAllCompanies, getAllPersons, getEncounter} from '../../services';
import {useNavigate} from 'react-router-dom';
import CustomModal from '../../components/CustomModal/CustomModal';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {toastGenerator} from '../../functions/helper';
import CompanyCard from '../../components/CompanyCard/CompanyCard';
import {unmarshalCompany} from '../../functions/dataUnmarshaller';

const PAGE_SIZE = 10;

/*
 * This page lists out all the Companies the user created.
 * Results are paginated, the number of items per pull is
 * determined by the PAGE_SIZE constant.
 */
export default function CompanyListPage(props) {
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState();
  const [companyList, setCompanyList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(async () => {
    const result = await getAllCompanies(currentPage, PAGE_SIZE);

    if (result) {
      const unmarshalledCompanyList =
          await Promise.all(
              result.map(async (company) =>{
                return {
                  ...unmarshalCompany(company),
                };
              }));
      setCompanyList(unmarshalledCompanyList);
    }
  }, []);

  const onClickNewEntry = () => {
    navigate(`/company/create`);
  };

  const onClickCompanyCard = (id) => {
    navigate(`/company/${id}`);
  };

  const onDeleteCompanyCardClicked = (event, id) => {
    event.stopPropagation();
    setDeleteModalOpen(true);
    setCompanyToDelete(id);
    console.log(id);
  };

  const onConfirmDeleteCompany = async (id) => {
    const result = deleteCompany(id);

    if (result) {
      const newCompanyList = companyList.filter((p) => p._id !== id);
      setCompanyList(newCompanyList);

      toastGenerator('success', 'Company deleted!', 3000);
    } else {
      toastGenerator('error', 'Something went wrong... :(', 3000);
    }

    setDeleteModalOpen(false);
  };

  const fetchMoreData = () => {
    if (!hasMore) return;

    setTimeout(async () => {
      const newPage = currentPage + 1;

      const additionalData = await getAllCompanies(newPage, PAGE_SIZE);
      if (!additionalData || additionalData.length < PAGE_SIZE) {
        setHasMore(false);
        return;
      }

      setCurrentPage(newPage);
      setCompanyList([...companyList, ...additionalData]);
    });
  };

  const exportSearchString = async (searchString) => {
    const searchResult = await searchCompany(searchString);
    setCompanyList(searchResult);
  };

  const handleOnMouseOver = (index) => {
    setIsHover(true);
    setSelectedInfo(companyList[index]);
  };

  const handleOnMouseOut = () => {
    setIsHover(false);
  };

  return (
    <>
      <CustomModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        hasCancel
        hasConfirm
        onConfirm={() => onConfirmDeleteCompany(companyToDelete)}
      >
        <div className={classes.DeleteModal}>
          <h1 >Warning</h1>
          <p >
          Are you sure you want to delete this company?
          You cannot undo this action.
          </p>
        </div>
      </CustomModal>
      <div className={classes.Container}>
        <div className={classes.Header}>
          Company
        </div>
        <div className={classes.Utilities}>
          <SearchBar
            placeholder={'Search'}
            exportSearchString={exportSearchString}
            hasAutocomplete={false}
          />
          <div className={classes.Button}>
            <IconButton btnText="New Entry" onClick={onClickNewEntry} includeIcon={true} />
          </div>
        </div>
        <div className={classes.List}>
          <InfiniteScroll
            dataLength={companyList.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{textAlign: 'center'}}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {companyList.map((company, index) => {
              return (
                <div
                  className={classes.PersonCard}
                  key={`${index}-container`}
                  onMouseOver={() => handleOnMouseOver(index)}
                  onMouseOut={handleOnMouseOut}
                >
                  <CompanyCard
                    id= {company.id}
                    name= {company.name}
                    location = {company.location}
                    description = {company.description}
                    onClick={() => onClickCompanyCard(company.id)}
                    onDelete={(e) => onDeleteCompanyCardClicked(e, company.id)}
                    dateFounded= {company.date_founded}
                    image={company.image}
                  />
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

