import React, {useEffect, useState} from 'react';
import PersonCard from '../../components/PersonCard/PersonCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import classes from './PersonsListPage.module.css';
import IconButton from '../../components/IconButton/IconButton';
import {getLongDateStringWithSlashes} from '../../functions/dateFormatter';
import PersonDrawer from '../../components/PersonDrawer/PersonDrawer';
import InfiniteScroll from 'react-infinite-scroll-component';
import {withRouter} from 'react-router-dom';
import {searchPersons, deletePerson, getAllPersons} from '../../services';
import {useNavigate} from 'react-router-dom';
import CustomModal from '../../components/CustomModal/CustomModal';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PAGE_SIZE = 10;

export default function PersonsListPage(props) {
  const navigate = useNavigate();

  const [isHover, setIsHover] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState();
  const [personList, setPersonList] = useState( [] );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(async () => {
    const result = await getAllPersons(currentPage, PAGE_SIZE);
    console.log(result);
    if (result) {
      setPersonList(result);
    }
  }, []);

  const onClickNewEntry = () => {
    navigate(`/persons/create`);
  };

  const onClickPersonCard = (id) => {
    navigate(`/person/${id}`);
  };

  const onDeletePersonCardClicked = (event, id) => {
    event.stopPropagation();
    setDeleteModalOpen(true);
    setPersonToDelete(id);
  };

  const onEditPersonCardClicked = (event, id) => {
    event.stopPropagation();
    navigate(`/person/${id}/edit`);
  };

  const onConfirmDeletePerson = async (id) => {
    const result = await deletePerson(id);

    if (result) {
      const newPersonsList = personList.filter((p) => p._id !== id);
      setPersonList(newPersonsList);

      toast.success('Person deleted!', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error('Something went wrong... :(', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    setDeleteModalOpen(false);
  };

  const fetchMoreData = () => {
    if (!hasMore) return;

    setTimeout(async () => {
      const newPage = currentPage + 1;

      const additionalData = await getAllPersons(newPage, PAGE_SIZE);
      if (!additionalData || additionalData.length < PAGE_SIZE) {
        setHasMore(false);
        return;
      }

      setCurrentPage(newPage);
      setPersonList([...personList, ...additionalData]);
    });
  };

  const exportSearchString = async (searchString) => {
    const searchResult = await searchPersons(searchString);
    setPersonList(searchResult);
  };

  const handleOnMouseOver = (index) => {
    setIsHover(true);
    setSelectedInfo(personList[index]);
  };

  const handleOnMouseOut = () => {
    setIsHover(false);
  };

  return (
    <>
      {isHover &&
        <PersonDrawer
          open={true}
          name={`${selectedInfo.first_name} ${selectedInfo.last_name || ''}`}
          id={selectedInfo._id}
          birthday={selectedInfo.birthday}
          img={selectedInfo.img}
          gender={selectedInfo.gender}
          organisation={selectedInfo.organisation}
          socialMedia={selectedInfo.socialMedia}
          firstMet={selectedInfo.firstMet}
          location={selectedInfo.location}
          interests={selectedInfo.interests}
        />
      }
      <CustomModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        hasCancel
        hasConfirm
        onConfirm={() => onConfirmDeletePerson(personToDelete)}
      >
        <div className={classes.DeleteModal}>
          <h1 >Warning</h1>
          <p >
          Are you sure you want to delete this encounter?
          You cannot undo this action.
          </p>
        </div>
      </CustomModal>
      <div className={classes.Container}>
        <div className={classes.Header}>
          People
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
            dataLength={personList.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{textAlign: 'center'}}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {personList.map((person, index) => {
              return (
                <div
                  className={classes.PersonCard}
                  key={`${index}-container`}
                  onMouseOver={() => handleOnMouseOver(index)}
                  onMouseOut={handleOnMouseOut}
                >
                  <PersonCard
                    id= {person.id}
                    name= {`${person.first_name} ${person.last_name || ''}`}
                    numEncounters = {person.encounters?.length}
                    lastMet= {person.lastMet}
                    onClick={() => onClickPersonCard(person._id)}
                    onEdit={(e) => onEditPersonCardClicked(e, person._id)}
                    onDelete={(e) => onDeletePersonCardClicked(e, person._id)}
                    firstMet= {person.first_met}
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

