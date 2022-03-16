import React, {useState, useEffect} from 'react';
import EncounterCard from '../../components/EncounterCard/EncounterCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import classes from './encounters.module.css';
import IconButton from '../../components/IconButton/IconButton';
import {getDateString} from '../../functions/dateFormatter';
import EncounterDrawer from '../../components/EncounterDrawer/EncounterDrawer';
import InfiniteScroll from 'react-infinite-scroll-component';
import EncounterDetailsModal from '../../components/EncounterDetailsModal/EncounterDetailsModal';
import {deleteEncounter, getAllEncounters, getPerson} from '../../services';

export default function Encounters() {
  const [isHover, setIsHover] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(undefined);

  const [hasMore, setHasMore] = useState(true);

  const [selectedEncounter, setSelectedEncounter] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const [encounterList, setEncounterList] = useState([]);

  const handleCardClick = (encounter) => {
    console.log('card click');
    console.log(encounter);
    setSelectedEncounter(encounter);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleNewEntryClick = () => {
    console.log('new entry');
    // todo: to be implemented after create encounter page is created
  };

  const onDelete = (encounterId) => {
    console.log('delete encounter id: ', encounterId);
    // todo: to be implemented after backend delete encounters endpoint is merged
    // const removeEncounter = async () => {
    //   await deleteEncounter(encounterId).then((res) => {
    //     console.log(res);
    //   });
    // };
    // removeEncounter();
  };

  const fetchMoreData = () => {
    console.log('fetch more');
    // todo: to be implemented after backend paging feature is implemented
    // if () {
    //   setHasMore(false);
    //   return;
    // }

    // setTimeout(() => {
    // }, 1000);
  };


  const handleOnMouseOver = (index) => {
    setIsHover(true);
    setSelectedInfo(encounterList[index]);
  };

  const handleOnMouseOut = () => {
    setIsHover(false);
  };

  const exportSearchString = (wordEntered) => {
    // todo: to be implemented after backend search filter is implemented
    // console.log(wordEntered);
  };

  useEffect(() => {
    const getEncounterList = async () => {
      await Promise.all(getAllEncounters().then((res) => {
        res.length > 0 && res.map((r) => {
          const persons = [];
          r.persons.map(async (personId, index) => {
            await getPerson(personId).then((person) => {
              persons[index] = person;
            });
          });
          r.persons = persons;
        });
        setEncounterList(res);
      }));
    };
    getEncounterList();
  }, []);

  return (
    <>
      {isHover && <EncounterDrawer
        open={true}
        id={1}
        encounterTitle={selectedInfo.title}
        encounterDetail={selectedInfo.description}
        location={selectedInfo.location}
        persons={selectedInfo.persons}
        dateMet={selectedInfo.date}
      />}
      {selectedEncounter && <EncounterDetailsModal
        open={modalOpen}
        onClose={handleModalClose}
        encounter={selectedEncounter}
        onDelete={() => onDelete(selectedEncounter._id)}
      />}
      <div className={classes.Container}>
        <div className={classes.Header}>
          Encounters
        </div>
        <div className={classes.Utilities}>
          <SearchBar hasAutocomplete={false} exportSearchString={exportSearchString} placeholder={'Search'}/>
          <div className={classes.Button}>
            <IconButton btnText="New Entry" onClick={handleNewEntryClick} includeIcon={true} />
          </div>
        </div>
        <div className={classes.List}>
          {encounterList.length > 0 ? <InfiniteScroll
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
                <div key={`${index}-container`} onMouseOver={() => handleOnMouseOver(index)} onMouseOut={handleOnMouseOut}>
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
          </InfiniteScroll> : <div><h3>No Encounters Found :(</h3></div>}
        </div>
      </div>
    </>
  );
}

