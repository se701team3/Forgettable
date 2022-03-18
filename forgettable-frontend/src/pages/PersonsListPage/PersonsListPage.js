import React, {useEffect, useState} from 'react';
import PersonCard from '../../components/PersonCard/PersonCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import classes from './Persons.module.css';
import IconButton from '../../components/IconButton/IconButton';
import {getDateString} from '../../functions/dateFormatter';
import PersonDrawer from '../../components/PersonDrawer/PersonDrawer';
import InfiniteScroll from 'react-infinite-scroll-component';
import {withRouter} from 'react-router-dom';
import {getAllPersons} from '../../services';
import {useNavigate} from 'react-router-dom';

export default function Persons(props) {
  const navigate = useNavigate();

  const [isHover, setIsHover] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [personList, setPersonList] = useState( [] );

  useEffect(async () => {
    const result = await getAllPersons();
    console.log(result);

    if (result) {
      setPersonList(result);
    }
  }, []);

  const onClickNewEntry = () => {
    console.log('hi');
    navigate(`/persons/create`);
  };

  const onClickPersonCard = (id) => {
    console.log('cardclicked');
    navigate(`/person/${id}`);
  };

  const onDeletePersonCardClicked = (event, id) => {
    console.log('delete');
    event.stopPropagation();
    // Delete card
  };

  const onEditPersonCardClicked = (event, id) => {
    console.log('edit');
    event.stopPropagation();
    navigate(`/person/${id}/edit`);
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
      <div className={classes.Container}>
        <div className={classes.Header}>
          People
        </div>
        <div className={classes.Utilities}>
          <SearchBar placeholder={'Search'}/>
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
                    firstMet= {person.first}
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

