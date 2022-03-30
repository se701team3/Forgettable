import React, {useState, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import EncounterCard from '../../components/EncounterCard/EncounterCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import classes from './EncountersListPage.module.css';
import IconButton from '../../components/IconButton/IconButton';
import EncounterDrawer from '../../components/EncounterDrawer/EncounterDrawer';
import InfiniteScroll from 'react-infinite-scroll-component';
import EncounterDetailsModal from '../../components/EncounterDetailsModal/EncounterDetailsModal';
import {
  deleteEncounter,
  getAllEncounters,
  searchEncounter,
  getEncountersByPage,
  getEncounter,
} from '../../services';
import CustomModal from '../../components/CustomModal/CustomModal';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {toastGenerator} from '../../functions/helper';
import {unmarshalEncounters} from '../../functions/dataUnmarshaller';
import SearchFilterModal from '../../components/SearchFilterModal/SearchFilterModal';
import EncountersMap from '../../components/EncountersMap/EncountersMap';


/*
 * This page lists out all the Encounters the user created.
 *
 * Author: Raina Song (rainasong)
 */
export default function EncountersListPage() {
  const PAGE_SIZE = 10;

  const location = useLocation();

  const [pageNum, setPageNum] = useState(1);

  const [isHover, setIsHover] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(undefined);

  const [isLoading, setIsLoading] = useState(true);

  const [hasMore, setHasMore] = useState(true);

  const [selectedEncounter, setSelectedEncounter] = useState(undefined);
  const [selectedEncounterId, setSelectedEncounterId] = useState('');
  const [encounterModalOpen, setEncounterModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [searchFilterModalOpen, setSearchFilterModalOpen] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState('');

  const [encounterList, setEncounterList] = useState([
    {
      _id: '',
      title: '',
      date: null,
      location: '',
      description: '',
      persons: [
        {
          _id: '',
          first_name: '',
          img: '',
        },
      ],
    },
  ]);

  // This is a list of latitude and longitude coordinates for the map markers
  const [markers, setMarkers] = useState([]);

  useEffect(async () => {
    const result = await getEncountersByPage(pageNum, PAGE_SIZE);
    setEncounterList(result.map((encounter) => unmarshalEncounters(encounter)));
    setMarkers(result.map((encounter) => {
      return {
        lat: encounter.latLong[0],
        lng: encounter.latLong[1],
        name: encounter.title,
        id: encounter._id,
      };
    }));
    setIsLoading(false);
  }, []);

  useEffect(async () => {
    if (location.state) {
      if (location.state.hasOwnProperty('id')) {
        const encounter = await getEncounter(location.state.id);
        setSelectedEncounter(unmarshalEncounters(encounter));
      } else {
        setSelectedEncounter(location.state.encounter);
      }
      setEncounterModalOpen(true);
    }
  }, []);

  const handleCardClick = (encounter) => {
    setSelectedEncounter(encounter);
    setEncounterModalOpen(true);
  };

  const handleModalClose = () => {
    setEncounterModalOpen(false);
  };

  const toggleFilters = () => {
    setSearchFilterModalOpen(!searchFilterModalOpen);
  };

  const onDelete = (encounterId) => {
    setSelectedEncounterId(encounterId);
    setDeleteModalOpen(true);
  };

  const onDeleteConfirmed = async (encounterId) => {
    const result = await deleteEncounter(encounterId);
    if (result) {
      const updatedEncountersList = await getAllEncounters();
      setEncounterList(updatedEncountersList);
      toastGenerator('success', 'Encounter deleted!', 3000);
    } else {
      toastGenerator('error', 'Something went wrong... :(', 3000);
    }
    setDeleteModalOpen(false);
    setEncounterModalOpen(false);
  };

  const fetchMoreData = () => {
    if (!hasMore) {
      return;
    }

    setTimeout(async () => {
      const newPageNum = pageNum + 1;
      const newResult = await getEncountersByPage(newPageNum, PAGE_SIZE);
      setEncounterList([...encounterList, ...newResult]);
      if (newResult.length < PAGE_SIZE || !newResult) {
        setHasMore(false);
      }
      setPageNum(newPageNum);
    }, 1000);
  };

  const handleOnMouseOver = (index) => {
    setIsHover(true);
    setSelectedInfo(encounterList[index]);
  };

  const handleOnMouseOut = () => {
    setIsHover(false);
  };

  const exportSearchString = async (searchString) => {
    const searchResult = await searchEncounter(searchString, selectedFilter);
    setEncounterList(searchResult);
  };

  return (
    <div>
      {isHover && (
        <EncounterDrawer
          open={true}
          id={selectedInfo._id}
          encounterTitle={selectedInfo.title}
          encounterDetails={selectedInfo.description}
          location={selectedInfo.location}
          persons={selectedInfo.persons}
          dateMet={selectedInfo.date}
        />
      )}
      {selectedEncounter && (
        <EncounterDetailsModal
          open={encounterModalOpen}
          onClose={handleModalClose}
          encounter={{...selectedEncounter, date: selectedEncounter.date}}
          onDelete={() => onDelete(selectedEncounter._id)}
        />
      )}
      <CustomModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        hasCancel
        hasConfirm
        onConfirm={() => onDeleteConfirmed(selectedEncounterId)}
      >
        <div className={classes.DeleteModal}>
          <h1>Warning</h1>
          <p>
            Are you sure you want to delete this encounter? You cannot undo this
            action.
          </p>
        </div>
      </CustomModal>
      <div className={classes.Container}>
        <div className={classes.Header}>Encounters</div>
        <div className={classes.Utilities}>
          <SearchBar hasAutocomplete={false}
            exportSearchString={exportSearchString}
            placeholder={'Search'}
            filterEnabled={searchFilterModalOpen}
            toggleFilters={toggleFilters} />
          <div className={classes.Button}>
            <Link
              to={{
                pathname: `/encounters/create`,
              }}
              style={{textDecoration: 'none'}}
            >
              <IconButton
                btnText="New Encounter"
                onClick={() => {}}
                includeIcon={true}
              />
            </Link>
          </div>
        </div>
        <SearchFilterModal open={searchFilterModalOpen}
          filterType="encounter" selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter} />
        {isLoading ? (
          <h4>Loading...</h4>
        ) : (
          <div className={classes.List}>
            {encounterList.length > 0 ? (
              <InfiniteScroll
                dataLength={encounterList.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p style={{textAlign: 'center'}}>
                    <b>Yay! You have seen it all</b>
                  </p>
                }
              >
                {encounterList.map((encounter, index) => {
                  return (
                    <div
                      key={`${index}-container`}
                      onMouseOver={() => {
                        handleOnMouseOver(index);
                      }}
                      onMouseOut={handleOnMouseOut}
                    >
                      <EncounterCard
                        key={encounter._id}
                        title={encounter.title}
                        description={encounter.description}
                        location={encounter.location}
                        persons={encounter.persons}
                        date={encounter.date}
                        className={classes.EncounterCard}
                        onClick={() => handleCardClick(encounter)}
                        onDelete={() => onDelete(encounter._id)}
                        isInitialEncounter={false}
                      />
                    </div>
                  );
                })}
              </InfiniteScroll>
            ) : (
              <div>
                <h3>No Encounters Found :(</h3>
              </div>
            )}
          </div>
        )}
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
      <div className={classes.Container}>
        <div className={classes.Header}>Map of Encounters</div>
        <div className={classes.Map}>
          <EncountersMap markers={markers}/></div>
      </div>
    </div>
  );
}
