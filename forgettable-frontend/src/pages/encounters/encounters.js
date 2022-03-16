import React, {useState} from 'react';
import EncounterCard from '../../Components/EncounterCard/EncounterCard';
import SearchBar from '../../Components/SearchBar/SearchBar';
import classes from './encounters.module.css';
import IconButton from '../../Components/IconButton/IconButton';
import {getDateString} from '../../functions/dateFormatter';
import PersonDrawer from '../../Components/PersonDrawer/PersonDrawer';
import EncounterDrawer from '../../Components/EncounterDrawer/EncounterDrawer';
import InfiniteScroll from 'react-infinite-scroll-component';
import EncounterDetailsModal from '../../Components/EncounterDetailsModal/EncounterDetailsModal';

export default function Encounters() {
  const [isHover, setIsHover] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(undefined);

  const [hasMore, setHasMore] = useState(true);

  const [selectedEncounter, setSelectedEncounter] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const persons = [
    {
      first_name: 'Kent',
      last_name: 'Dodds',
      img: 'https://images.unsplash.com/photo-1646936218155-caedb4ed9bf7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    },
    {
      first_name: 'Jed',
      last_name: 'Watson',
      img: 'https://images.unsplash.com/photo-1600010437709-10176a56ea45?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80',
    },
    {
      first_name: 'Marley',
      last_name: 'George',
      img: 'https://images.unsplash.com/photo-1646936218590-91d949706cb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
      first_name: 'Jack',
      last_name: 'Winston',
    },
    {
      first_name: 'John',
      last_name: 'Doe',
    },
  ];

  const [encounterList, setEncounterList] = useState(
      [{
        id: '0',
        date: getDateString(new Date()),
        location: 'Auckland',
        title: 'Fermentum pellentesque',
        description: 'Diam dictum vestibulum mi nulla vestibulum, id nibh. Nunc consequat amet commodo turpis tellus. Scelerisque a pellentesque vel accumsan sed mauris, ac turpis pharetra. Sem tristique nulla cursus praesent tincidunt integer',
        persons: persons,
      },
      ],
  );

  const onClick = (encounter) => {
    console.log('card click');
    console.log(encounter);
    setSelectedEncounter(encounter);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const onDelete = () => {
    console.log('delete');
  };

  for (let i = 1; i < 20; i++) {
    encounterList[i] = {
      ...encounterList[0],
      id: i.toString(),
    };
  }

  const fetchMoreData = () => {
    // console.log('fetch more');
    if (encounterList.length > 100) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      const newList = [];
      newList[0] = encounterList[0];
      for (let i = 0; i < 20; i++) {
        newList[i] = {
          ...newList[0],
          id: i.toString(),
        };
      }
      setEncounterList([...encounterList, ...newList]);
    }, 1000);
  };

  // console.log(encounterList);


  const handleOnMouseOver = (index) => {
    setIsHover(true);
    setSelectedInfo(encounterList[index]);
  };

  const handleOnMouseOut = () => {
    setIsHover(false);
  };

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
        onDelete={onDelete}
      />}
      <div className={classes.Container}>
        <div className={classes.Header}>
          Encounters
        </div>
        <div className={classes.Utilities}>
          <SearchBar placeholder={'Search'}/>
          <div className={classes.Button}>
            <IconButton btnText="New Entry" onClick={onClick} includeIcon={true} />
          </div>
        </div>
        <div className={classes.List}>
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
                <div key={`${index}-container`} onMouseOver={() => handleOnMouseOver(index)} onMouseOut={handleOnMouseOut}>
                  <EncounterCard
                    key={encounter.id}
                    title={encounter.title}
                    description={encounter.description}
                    location={encounter.location}
                    persons={encounter.persons}
                    date={encounter.date}
                    className={classes.EncounterCard}
                    onClick={() => onClick(encounter)}
                    onDelete={onDelete}
                    isInitialEncounter={false}
                  />
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
}

