import React, {useState} from 'react';
import PersonCard from '../../Components/PersonCard/PersonCard';
import SearchBar from '../../Components/SearchBar/SearchBar';
import classes from './Persons.module.css';
import IconButton from '../../Components/IconButton/IconButton';
import {getDateString} from '../../functions/dateFormatter';
import PersonDrawer from '../../Components/PersonDrawer/PersonDrawer';
import InfiniteScroll from 'react-infinite-scroll-component';
import {withRouter} from 'react-router-dom';

export default function Persons(props) {
  const [isHover, setIsHover] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const [personList, setPersonList] = useState(
      [{
        id: '0',
        name: 'cameron smith',
        img: 'https://avatars.githubusercontent.com/u/28725774?v=4',
        socialMedias: [{name: 'facebook', link: 'link'}],
        birthday: new Date(),
        firstMet: new Date(),
        location: 'London',
        interests: ['films', 'pictures', 'bad code comments'],
      },
      {
        id: '1',
        name: 'john smith',
        img: 'https://avatars.githubusercontent.com/u/28725774?v=4',
        socialMedias: [{name: 'facebook', link: 'link'}],
        firstMet: new Date(),
        location: 'Australia',
        interests: ['cameron', 'ducks', 'soup'],
      },
      {
        id: '2',
        name: 'archibald smith',
        img: 'https://avatars.githubusercontent.com/u/28725774?v=4',
        socialMedias: [{name: 'facebook', link: 'link'}],
        firstMet: new Date(),
        location: 'Germany',
        interests: ['fans', 'beakers', 'clocks'],
      },
      ],
  );


  const onClick = (id) => {
    console.log('hi');
    props.history.push('/person/1');
  };

  const handleNavi = () => {
    console.log('hfhdajkh faljfki');
    props.history.push('/person/1');
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const onDelete = () => {
    console.log('delete');
  };

  const onEdit = () => {
    console.log('edit');
  };

  for (let i = 1; i < 20; i++) {
    personList[i] = {
      ...personList[0],
      id: i.toString(),
    };
  }

  const fetchMoreData = () => {
    // console.log('fetch more');
    if (personList.length > 100) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      const newList = [];
      newList[0] = personList[0];
      for (let i = 0; i < 20; i++) {
        newList[i] = {
          ...newList[0],
          id: i.toString(),
        };
      }
      setPersonList([...personList, ...newList]);
    }, 1000);
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
          name={selectedInfo.name}
          id={selectedInfo.id}
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
                <div className={classes.PersonCard} key={`${index}-container`} onMouseOver={() => handleOnMouseOver(index)} onMouseOut={handleOnMouseOut}>
                  <PersonCard
                    id= {person.id}
                    name= {person.name}
                    numEncounters = {person.numEncounters}
                    lastMet= {person.lastMet}
                    onClick={handleNavi}
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

