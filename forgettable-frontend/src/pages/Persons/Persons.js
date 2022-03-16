import React, {useState} from 'react';
import PersonCard from '../../Components/PersonCard/PersonCard';
import SearchBar from '../../Components/SearchBar/SearchBar';
import classes from './Persons.module.css';
import IconButton from '../../Components/IconButton/IconButton';
import {getDateString} from '../../functions/dateFormatter';
import PersonDrawer from '../../Components/PersonDrawer/PersonDrawer';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Persons() {
  const [isHover, setIsHover] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const [PersonList, setPersonList] = useState(
      [{
        id: '0',
        name: 'john smith',
        numEncounters: 2,
        lastMet: getDateString(new Date()),
        firstMet: getDateString(new Date()),
      },
      ],
  );


  const onClick = (Person) => {
    console.log('card click');
    console.log(Person);
    setSelectedPerson(Person);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const onDelete = () => {
    console.log('delete');
  };

  const onEdit = () => {
    console.log('delete');
  };

  for (let i = 1; i < 20; i++) {
    PersonList[i] = {
      ...PersonList[0],
      id: i.toString(),
    };
  }

  const fetchMoreData = () => {
    // console.log('fetch more');
    if (PersonList.length > 100) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      const newList = [];
      newList[0] = PersonList[0];
      for (let i = 0; i < 20; i++) {
        newList[i] = {
          ...newList[0],
          id: i.toString(),
        };
      }
      setPersonList([...PersonList, ...newList]);
    }, 1000);
  };

  // console.log(PersonList);

  const handleOnMouseOver = (index) => {
    setIsHover(true);
    setSelectedInfo(PersonList[index]);
  };

  const handleOnMouseOut = () => {
    setIsHover(false);
  };

  return (
    <>
      <div className={classes.Container}>
        <div className={classes.Header}>
          People
        </div>
        <div className={classes.Utilities}>
          <SearchBar placeholder={'Search'}/>
          <div className={classes.Button}>
            <IconButton btnText="New Entry" onClick={onClick} includeIcon={true} />
          </div>
        </div>
        <div className={classes.List}>
          <InfiniteScroll
            dataLength={PersonList.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{textAlign: 'center'}}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {PersonList.map((person, index) => {
              return (
                <div className={classes.PersonCard} key={`${index}-container`} onMouseOver={() => handleOnMouseOver(index)} onMouseOut={handleOnMouseOut}>
                  <PersonCard
                    id= {person.id}
                    name= {person.name}
                    numEncounters = {person.numEncounters}
                    lastMet= {person.lastMet}
                    onClick={() => onClick(person)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    firstMet= {person.firstMet}
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

