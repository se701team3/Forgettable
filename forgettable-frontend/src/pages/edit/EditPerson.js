import {Avatar, Input} from '@mui/material';
import React, {useEffect} from 'react';
import {useState, useRef} from 'react';
import CustomButton from '../../components/CustomButton/CustomButton';
import classes from './EditPerson.module.css';
import {convertSocialMediaToIcon} from '../../functions/socialMediaIconConverter';
import {useNavigate, useLocation, useParams} from 'react-router-dom';
import imageToBase64 from 'image-to-base64/browser';
import CustomModal from '../../components/CustomModal/CustomModal';
import * as apiCalls from '../../services/index';
import InputField from '../../components/InputField/InputField';

const MAX_IMAGE_SIZE = 16000000;

export default function EditPerson() {
  // to check if it is create person or edit person route
  const location = useLocation();

  const navigate = useNavigate();

  const create = location.pathname.includes('/people/create') ? true : false;

  const {id} = (!create) && useParams();

  const [personData, setPersonData] = useState({
    first_name: 'Name',
    last_name: 'Last',
    birthday: '2012-03-04',
    gender: 'male',
    location: 'here',
    first_met: '2001-01-01',
    how_we_met: 'idk',
    interests: 'a',
    organisation: 'job co.',
    social_media: new Map([['twitter', 'fdfd']]),
    image: 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAI2SURBVHhe7dpBcgFBFIdxspqlJTtu4hhuwC0cgx23MMexdAPLyavqri6FZOYfyWuv8v0WySBJma9aT6cZd103wjAf+TsGIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCf5LrLZtF4vF+IHdeTwe8w/16iI7nU7L5fJwOOTbN+yh+XyeT/JbTdPk3+kTO9Z0OrWztQGSTvtnNptN/nN9gsUaPl6eGt7lqQCxXgn0Yp077xtLavS7Ub7yprGs1GQyySUelDT5ttdl6k1jPY6pp2MnP+YV603XWev1Oh2URrvdLt1TUexP/pVFg89Z8O+OgFgCYgmIJQgcq23bfOQl8NVwNptdLpd0zNWwRylla7F08NcCjyznRZZhghdEjeU/u5uoL0P/2d1EHVn+s7uJOrL8Z3fDBC8IGWu/3+cjZzaMw0nvgJnVapXvchFyzioT1vV6bZomHTuIHcv5ycebszyXo/efkAg3sjyXo1bqfD7nGxFHludytLzJlMQbWfZqSAf+z5xFqSBYrCqbDUWwl2GVzYYi2MiqstlQBBtZFWd3wwQvIJaAWAJiCSLFqrbnV9hlJYpae35FpKVDWTc47/kVIWPVes5M8AJiCYgliBSryqR+K1Ks7XZrX6vsNyTxtpUrYs4SEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBhuNPgHlJKV46HCjogAAAABJRU5ErkJggg==',
    encounters: [],
    time_updated: '0002-02-02',
  });

  // const [personData, setPersonData] = useState({
  //   first_name: '',
  //   last_name: '',
  //   birthday: null,
  //   gender: '',
  //   location: '',
  //   first_met: null,
  //   how_we_met: '',
  //   interests: '',
  //   organisation: '',
  //   social_media: new Map(),
  //   image: '',
  //   encounters: [],
  //   time_updated: '',
  // });

  function handleUpdateData(newData) {
    setPersonData(newData);
  }

  (!create) && (
    useEffect(async () => {
      try {
        receivedData = await apiCalls.getPerson(id);
        handleUpdateData(receivedData);
      } catch (err) {
        console.log(err);
      }
    }, [id]));

  let initialProfilePic = '';
  let initialProfilePicPreview = '';

  if (!create) {
    personData.hasOwnProperty('image') && (
      initialProfilePic = personData.image,
      initialProfilePicPreview = 'data:image/*;base64,' + personData.image);
  }


  const [profilePicPreview, setProfilePicPreview] = useState(initialProfilePicPreview);
  const [profilePic, setProfilePic] = useState(initialProfilePic);

  // use data from object from API
  const [socialMedias, setSocialMedias] = useState((create) ? (new Map()) : personData.social_media);

  const [socialMediaModalOpen, setSocialMediaModalOpen] = useState(false);
  const [currentSocialMedia, setCurrentSocialMedia] = useState();

  const invisSocialMediaSubmitRef = useRef(null);
  const invisDeleteSubmitRef = useRef(null);

  function handleSocialMediaModalOpen(key) {
    key ? setCurrentSocialMedia(key) : setCurrentSocialMedia();
    setSocialMediaModalOpen(true);
  };

  const handleSocialMediaModalClose = () => {
    setSocialMediaModalOpen(false);
  };

  function handleAddSocialMedia(event) {
    event.preventDefault();
    handleSocialMediaModalClose();
    const platform = event.target.elements.platform.value;
    const url = event.target.elements.url_link.value;
    const tempSocialMedias = socialMedias;
    platform && tempSocialMedias.set(platform, url);
    setSocialMedias(tempSocialMedias);
  }

  function handleDisplaySocialMedia() {
    const socialMediaElements = [];
    for (const [key, value] of socialMedias) {
      socialMediaElements.push(<Avatar
        src={convertSocialMediaToIcon(key)}
        alt={key}
        key={key}
        onClick={() => (handleSocialMediaModalOpen(key))}
        className={classes.socialMediaIcon}/>);
    }
    return socialMediaElements;
  }

  // https://medium.com/geekculture/how-to-upload-and-preview-images-in-react-js-4e22a903f3db
  function uploadImagePreview(image) {
    if (image.target.files[0].size < MAX_IMAGE_SIZE) {
      const imageURL = URL.createObjectURL(image.target.files[0]);

      imageToBase64(imageURL).then(
          (response) => {
            setProfilePic(response);
          },
      );
      setProfilePicPreview(imageURL);
    } else {
      // add the custom alert here
      console.log('Image too big, must be less than 16mb');
    }
  }

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  function handleDeleteModalOpen() {
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  function handleDeletePerson() {
    async function deletePersonCall() {
      try {
        personData = await apiCalls.deletePerson(id);
      } catch (err) {
        console.log(err);
      }
    }
    deletePersonCall();
    navigate('/people', {'replace': true});
  }

  function handleSubmit(event) {
    event.preventDefault(); // perhaps remove this later
    const formData = new FormData(event.target);

    // check dates from form are in correct format (Date type)
    formData.append('image', profilePic);
    formData.append('social_media', socialMedias);

    console.log(Object.fromEntries(formData));

    if (create) {
      async function postPersonData() {
        try {
          personData = await apiCalls.createPerson(Object.fromEntries(formData));
        } catch (err) {
          console.log(err);
        }
      }
      postPersonData();
    } else {
      async function putPersonData() {
        try {
          personData = await apiCalls.updatePerson(id, Object.fromEntries(formData));
        } catch (err) {
          console.log(err);
        }
      }
      putPersonData();
    }
  }

  return (
    <div className={classes.editPerson}>
      <div className={classes.title}>{create ? 'Create' : 'Edit'} Person </div>
      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.avatarDiv}>
          <Avatar src={profilePicPreview} className={classes.avatar}></Avatar>
          <label htmlFor='inputProfilePic'>
            <CustomButton
              btnText="Change"
              className={classes.avatarButton}
              onChange={() => inputProfilePic.current.click()} />
          </label>
          <Input
            id='inputProfilePic'
            type="file"
            accept="image/*"
            onChange={uploadImagePreview}
            className={classes.profilePicUpload} />
        </div>

        <div className={classes.row}>
          <div className={classes.column}>
            <InputField inputID='first_name' inputLabel='First Name' inputType='primary' inputStateValue={personData.first_name} autoFocusState={true} requiredState/>
            <InputField inputID='gender' inputLabel='Gender' inputType='primary' inputStateValue={personData.gender}/>
            <InputField inputID='first_met'inputLabel='Date First Met' inputType='primary' dataType='date' inputStateValue={personData.first_met}/>
            <InputField inputID='interests' inputLabel='Interests' inputType='primary' inputStateValue={personData.interests}/>
            <label className={classes.socialMediaDivLabel}>Social Media</label>
            <div className={classes.socialMediaDiv} data-testid='social-media-div'>
              {handleDisplaySocialMedia()}
              <button type='button'
                className={classes.addSocialMediaIcon}
                onClick={() => handleSocialMediaModalOpen('')}>
              +
              </button>
            </div>
          </div>
          <div className={classes.column}>
            <InputField inputID='last_name' inputLabel='Last Name' inputType='primary' inputStateValue={personData.last_name}/>
            <InputField inputID='birthday' inputLabel='Birthday' inputType='primary' dataType='date' inputStateValue={personData.birthday}/>
            <InputField inputID='location' inputLabel='Their Current Location' inputType='primary' inputStateValue={personData.location}/>
            <InputField inputID='how_we_met' inputLabel='How We Met' inputType='primary' inputStateValue={personData.how_we_met}/>
            <InputField inputID='organisation' inputLabel='Organisation' inputType='primary' inputStateValue={personData.organisation}/>
          </div>
        </div>

        <div className={classes.formButtonsDiv}>
          {!create && (
            <CustomButton btnText="Delete"
              onClick={() => handleDeleteModalOpen()}
              className={classes.formsButton}
            />
          )}

          {/* navigate(-1) returns to previous page (like a back button) */}
          <CustomButton
            btnText="Cancel"
            onClick={() => navigate(-1, {'replace': true})}
            className={classes.formsButton}
          />
          <label htmlFor='submit'>
            <CustomButton btnText="Save"
              onClick={() => navigate('/encounters/create', {'replace': true})}
            />
          </label>
          <input ref={invisSocialMediaSubmitRef} id='submit' type="submit" className={classes.hiddenSubmit}/>
        </div>
      </form>

      <CustomModal
        open={socialMediaModalOpen}
        onClose={handleSocialMediaModalClose}
        hasCancel
        hasConfirm
        onConfirm={() => (invisSocialMediaSubmitRef.current.click())} >
        <div className={classes.socialMediaModalDiv}>
          <div className={classes.socialMediaModalTitle}>Social media link</div>
          <form onSubmit={handleAddSocialMedia}>
            <div className={classes.socialMediaModalFieldsDiv}>
              <InputField inputID='platform' inputLabel='Platform: ' inputType='secondary' inputStateValue={currentSocialMedia}/>
              <InputField inputID='url_link' inputLabel='URL Link: ' inputType='secondary' inputStateValue={socialMedias.get(currentSocialMedia)}/>
              <input ref={invisSocialMediaSubmitRef} type='submit' className={classes.hiddenSubmit}></input>
            </div>
          </form>
        </div>
      </CustomModal>

      <CustomModal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        hasCancel
        hasConfirm
        onConfirm={() => (invisDeleteSubmitRef.current.click())} >
        <div className={classes.deleteModalDiv}>
          <div className={classes.delteModalTitle}>Warning</div>
          <form onSubmit={handleDeletePerson}>
            <div className={classes.deleteModalMessageDiv}>
              Are you sure you want to delete this person? You cannot undo this action.
              <input ref={invisDeleteSubmitRef} type='submit' className={classes.hiddenSubmit}></input>
            </div>
          </form>
        </div>
      </CustomModal>

    </div>
  );
}
