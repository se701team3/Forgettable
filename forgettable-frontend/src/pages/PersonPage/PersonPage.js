import React, {useEffect, useState} from 'react';
import EncounterCard from '../../components/EncounterCard/EncounterCard';
import IconButton from '../../components/IconButton/IconButton';
import PersonDrawer from '../../components/PersonDrawer/PersonDrawer';
import {createPerson, deleteEncounter, getPerson} from '../../services';
import classes from './PersonPage.module.css';
import {ENCOUNTERS} from './PlaceholderData';
import {Link, Navigate, useParams} from 'react-router-dom';
// import {useHistory} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import EncounterDetailsModal from '../../components/EncounterDetailsModal/EncounterDetailsModal';
import CustomModal from '../../components/CustomModal/CustomModal';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {convertSocialMedia} from '../../functions/convertSocialMediaFormat';

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
    img: '',
    encounters: [],
    timeUpdated: null,
  });

  useEffect(async () => {
    const result = await getPerson(id);

    setPerson({
      firstName: result.first_name,
      lastName: result.last_name,
      birthday: result.birthday,
      gender: result.gender,
      location: result.location,
      howWeMet: result.how_we_met,
      interests: result.interests,
      organisation: result.organisation,
      socialMedia: convertSocialMedia(result.socialMedia),
      img: result.image,
      encounters: result.encounters || [],
      timeUpdated: result.timeUpdated,
    });
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

      toast.success('Encounter deleted!', {
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
        open={true}
        img={person.img}
        staticDrawer={true}
        name={`${person.firstName} ${person.lastName || ''}`}
        firstMet={person.firstMet}
        interests={person.interests}
        organisation={person.organisation}
        location={person.location}
        gender={person.gender}
        birthday={person.birthday}
        socialMedias={person.socialMedia}
        data-testid="drawer-component"
        onEdit={() => navigate(`edit`)}
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
