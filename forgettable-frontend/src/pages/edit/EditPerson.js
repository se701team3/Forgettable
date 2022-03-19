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
  const location = useLocation();

  const navigate = useNavigate();

  // to check if it is create person or edit person route
  const create = location.pathname.includes('/people/create') ? true : false;

  const {id} = (!create) && useParams();

  const [personData, setPersonData] = useState({
    first_name: '',
    last_name: '',
    birthday: '',
    gender: '',
    location: '',
    first_met: '',
    how_we_met: '',
    interests: [],
    organisation: '',
    social_media: new Map(),
    image: '',
    encounters: [],
    time_updated: '',
  });


  function handleUpdateData(newData) {
    setPersonData(newData);
  }

  (!create) && (useEffect(async () => {
    const result = await apiCalls.getPerson(id);
    setPersonData({
      first_name: result.first_name,
      last_name: result.last_name || '',
      birthday: getInputDateFormatString(result.birthday),
      first_met: getInputDateFormatString(result.first_met),
      gender: result.gender || '',
      location: result.location || '',
      how_we_met: result.how_we_met || '',
      interests: result.interests || '',
      organisation: result.organisation || '',
      social_media: new Map(convertSocialMedia(result.socialMedia)),
      img: result.image,
      encounters: result.encounters || [],
      time_updated: result.time_updated,
    });
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
