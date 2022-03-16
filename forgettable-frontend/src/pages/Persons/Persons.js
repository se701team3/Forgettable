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

  const [personList, setPersonList] = useState(
      [{
        id: '0',
        name: 'cameron smith',
        img: 'https://avatars.githubusercontent.com/u/28725774?v=4',
        socialMedias: [{name: 'facebook', link: 'link'}],
        birthday: new Date(),
        firstMet: new Date(),
        location: 'London',
        interests: ['muscly men', 'men', 'men muscles'],
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

  // console.log(PersonList);

  const handleOnMouseOver = (index) => {
    setIsHover(true);
    setSelectedInfo(personList[index]);

    console.log(personList[index]);
  };
  console.log('selected info', selectedInfo);

  const handleOnMouseOut = () => {
    setIsHover(false);
  };

  // PersonDrawer.propTypes = {
  //   open: PropTypes.bool.isRequired,
  //   id: PropTypes.string,
  //   name: PropTypes.string.isRequired,
  //   img: PropTypes.string,
  //   socialMedias: PropTypes.arrayOf(Object), // See below for an example
  //   // [{name: 'facebook', link: 'https://www.google.com/'}, {name: 'instagram', link: 'https://www.google.com/'}]
  //   firstMet: PropTypes.instanceOf(Date),
  //   location: PropTypes.string,
  //   interests: PropTypes.arrayOf(PropTypes.string),
  //   staticDrawer: PropTypes.bool,
  //   onEdit: PropTypes.bool,
  // };

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
              console.log('mapping', index, person);
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

