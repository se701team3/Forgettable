import React, {useEffect, useState} from 'react';
import EncounterCard from '../../components/EncounterCard/EncounterCard';
import IconButton from '../../components/IconButton/IconButton';
import PersonDrawer from '../../components/PersonDrawer/PersonDrawer';
import {createPerson, deleteEncounter, getPerson} from '../../services';
import classes from './PersonPage.module.css';
import {Link, Navigate, useParams} from 'react-router-dom';
// import {useHistory} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import EncounterDetailsModal from '../../components/EncounterDetailsModal/EncounterDetailsModal';
import CustomModal from '../../components/CustomModal/CustomModal';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {convertSocialMedia} from '../../functions/convertSocialMediaFormat';
import {getImageSrcFromBuffer} from '../../functions/getImageSrcFromBuffer';
import {toastGenerator} from '../../functions/helper';
import {unmarshalPerson} from '../../functions/dataUnmarshaller';


/*
 * This is the detailed person profile page. Displays the information
 * of a single person. Includes all of their details, and encounters.
 *
 * Author: Mercury Lin (lin8231)
 */
const PersonPage = (props) => {
  const {id} = useParams();
  const navigate = useNavigate();

  const [selectedEncounter, setSelectedEncounter] = useState();
  const [encounterModalOpen, setEncounterModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [person, setPerson] = useState({
    firstName: '',
    lastName: '',
    birthday: null,
    gender: '',
    location: '',
    howWeMet: '',
    firstMet: null,
    interests: [],
    organisation: '',
    socialMedia: [],
    image: '',
    encounters: [],
    timeUpdated: null,
  });

  useEffect(async () => {
    const result = await getPerson(id);

    setPerson(unmarshalPerson(result));
  }, [id]);

  const createEncounterComponent = (encounter, i) => {
    return (
      <div className={classes.CardWrapper} key={encounter._id || i}>
        <EncounterCard
          title={encounter.title}
          description={encounter.description}
          persons={encounter.persons}
          location={encounter.location}
          onDelete={() => onDeleteClicked(encounter)}
          date={encounter.date}
          isInitialEncounter={false}
          onClick={() => onClick(encounter)}
        />
      </div>
    );
  };

  const onClick = (encounter) => {
    setSelectedEncounter(encounter);
    setEncounterModalOpen(true);
  };

  const handleModalClose = () => {
    setEncounterModalOpen(false);
  };

  const onDeleteClicked = (encounter) => {
    setSelectedEncounter(encounter);
    setDeleteModalOpen(true);
  };

  const onDeleteConfirmed = async (encounter) => {
    const result = await deleteEncounter(encounter._id);

    if (result) {
      setPerson({
        ...person,
        encounters: person.encounters.filter((e) => e._id !== encounter._id),
      });

      toastGenerator('success', 'Encounter deleted!', 3000);
    } else {
      toastGenerator('error', 'Something went wrong... :(', 3000);
    }

    setDeleteModalOpen(false);
    setEncounterModalOpen(false);
  };

  return (
    <div className={classes.PersonPage}>

      {selectedEncounter && <EncounterDetailsModal
        open={encounterModalOpen}
        onClose={handleModalClose}
        encounter={selectedEncounter}
        onDelete={() => onDeleteClicked(selectedEncounter)}
      />}
      <CustomModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        hasCancel
        hasConfirm
        onConfirm={() => onDeleteConfirmed(selectedEncounter)}
      >
        <div className={classes.DeleteModal}>
          <h1 >Warning</h1>
          <p >
          Are you sure you want to delete this encounter?
          You cannot undo this action.
          </p>
        </div>
      </CustomModal>

      <PersonDrawer
        id={id}
        open={true}
        img={person.image}
        staticDrawer={true}
        name={`${person.firstName} ${person.lastName || ''}`}
        firstMet={person.firstMet}
        interests={person.interests}
        organisation={person.organisation}
        location={person.location}
        gender={person.gender}
        birthday={person.birthday}
        socialMedia={person.socialMedia}
        data-testid="drawer-component"
        onEdit={() => navigate(`/person/${id}/edit`)}
        labels={person.labels}
      />
      <div className={classes.ContentContainer}>
        <div className={classes.TitleContainer} >
          <h1 className={classes.Title}>
            You encountered
            <br/>
            {person.firstName} {person.encounters.length} times
          </h1>
          <div className={classes.ButtonContainer}>
            <Link to={{
              pathname: `/encounters/create`,
              state: {
                person: person,
              },
            }}
            style={{textDecoration: 'none'}}
            >
              <IconButton
                btnText="New Encounter"
                onClick={() => {}}
                includeIcon={true}
                height="66px"
              />
            </Link>
          </div>
        </div>
        <div className={classes.EncountersContainer}>
          {
            person.encounters.map((encounter, i) => {
              return createEncounterComponent(encounter, i);
            })
          }
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
    </div>
  );
};

export default PersonPage;
