import {Avatar, Input} from '@mui/material';
import React from 'react';
import {useState, useRef} from 'react';
import CustomButton from '../../components/CustomButton/CustomButton';
import classes from './EditPerson.module.css';
import {convertSocialMediaToIcon} from '../../functions/socialMediaIconConverter';
import {useNavigate, useLocation, useParams} from 'react-router-dom';
import imageToBase64 from 'image-to-base64/browser';
import CustomModal from '../../components/CustomModal/CustomModal';
import * as apiCalls from '../../services/index';

const MAX_IMAGE_SIZE = 16000000;


export default function EditPerson() {
  // to check if it is create person or edit person
  const location = useLocation();

  const navigate = useNavigate();

  // do a better check than this?
  const create = location.pathname.includes('/people/create') ? true : false;

  let personData = {};

  (!create) && (
    personData = {
      first_name: 'Name',
      last_name: 'Last',
      birthday: '2012-03-04',
      gender: 'male',
      location: 'here',
      first_met: '2001-01-01',
      how_we_met: 'idk',
      interests: 'a',
      organisation: 'job co.',
      social_media: [],
      image: 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAI2SURBVHhe7dpBcgFBFIdxspqlJTtu4hhuwC0cgx23MMexdAPLyavqri6FZOYfyWuv8v0WySBJma9aT6cZd103wjAf+TsGIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCf5LrLZtF4vF+IHdeTwe8w/16iI7nU7L5fJwOOTbN+yh+XyeT/JbTdPk3+kTO9Z0OrWztQGSTvtnNptN/nN9gsUaPl6eGt7lqQCxXgn0Yp077xtLavS7Ub7yprGs1GQyySUelDT5ttdl6k1jPY6pp2MnP+YV603XWev1Oh2URrvdLt1TUexP/pVFg89Z8O+OgFgCYgmIJQgcq23bfOQl8NVwNptdLpd0zNWwRylla7F08NcCjyznRZZhghdEjeU/u5uoL0P/2d1EHVn+s7uJOrL8Z3fDBC8IGWu/3+cjZzaMw0nvgJnVapXvchFyzioT1vV6bZomHTuIHcv5ycebszyXo/efkAg3sjyXo1bqfD7nGxFHludytLzJlMQbWfZqSAf+z5xFqSBYrCqbDUWwl2GVzYYi2MiqstlQBBtZFWd3wwQvIJaAWAJiCSLFqrbnV9hlJYpae35FpKVDWTc47/kVIWPVes5M8AJiCYgliBSryqR+K1Ks7XZrX6vsNyTxtpUrYs4SEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBhuNPgHlJKV46HCjogAAAABJRU5ErkJggg==',
      encounters: [],
      time_updated: '0002-02-02',
    });

  async function getPersonData() {
    try {
      personData = await apiCalls.getPerson(id);
    } catch (err) {
      // console.log(err);
    }
  }

  let id = null;
  if (!create) {
    id = useParams();
    getPersonData();
  }

  const mapTest = new Map([
    ['twitter', 'https://twitter.com/Twitter'],
    ['github', 'github.com'],
  ]);

  let initialProfilePic = '';
  let initialProfilePicPreview = '';

  // might not need to check create
  (!create && personData.hasOwnProperty('image')) && (
    initialProfilePic = personData.image,
    initialProfilePicPreview = 'data:image/*;base64,' + personData.image
  );

  const [profilePicPreview, setProfilePicPreview] = useState(initialProfilePicPreview);
  const [profilePic, setProfilePic] = useState(initialProfilePic);

  // use data from object from API
  const [socialMedias, setSocialMedias] = useState(new Map([
    ['twitter', 'https://twitter.com/Twitter'],
    ['github', 'github.com'],
  ]));

  const [socialMediaModalOpen, setSocialMediaModalOpen] = useState(false);
  const [currentSocialMedia, setCurrentSocialMedia] = useState();

  const invisSocialMediaSubmitRef = useRef(null);

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

  function handleDeletePerson() {
    console.log('deleting');
    async function deletePersonCall() {
      try {
        personData = await apiCalls.deletePerson(id);
      } catch (err) {
        console.log(err);
      }
    }
    deletePersonCall();
  }

  function handleSubmit(event) {
    event.preventDefault(); // perhaps remove this later
    const formData = new FormData(event.target);

    // check dates from form are in correct format (Date type)
    formData.append('image', profilePic);
    formData.append('social_media', socialMedias);

    console.log(Object.fromEntries(formData));

    async function postPersonData() {
      try {
        personData = await apiCalls.createPerson(Object.fromEntries(formData));
      } catch (err) {
        console.log(err);
      }
    }

    postPersonData();
  }


  return (
    <div className={classes.EditPerson}>
      <h1 className={classes.heading}>{create ? 'Create' : 'Edit'} Person </h1>

      <form onSubmit={handleSubmit}>
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
            <p>First Name</p>
            <Input name='first_name' autoFocus required value={personData.first_name} data-testid='first-name'></Input>
            <p>Gender</p>
            <Input name='gender' value={personData.gender}></Input>
            <p>Date First Met</p>
            <Input name='first_met' type='date' value={personData.first_met}></Input>
            <p>Interests</p>
            <Input name='interests' value={personData.interests}></Input>
            <p>Social Media</p>
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
            <p>Last Name</p>
            <Input name='last_name' value={personData.last_name}></Input>
            <p>Birthday</p>
            <Input name='birthday' type='date' value={personData.birthday}></Input>
            <p>Their Current Location</p>
            <Input name='location' value={personData.location}></Input>
            <p>How We Met</p>
            <Input name='how_we_met' value={personData.how_we_met}></Input>
            <p>Organisation</p>
            <Input name='organisation' value={personData.organisation}></Input>
          </div>
        </div>

        <div className={classes.formButtonsDiv}>
          {!create && (
            <CustomButton btnText="Delete"
              onClick={() => handleDeletePerson()}
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
              // onClick={() => navigate('/encounter/create', {'replace': true})} // when create encounter is implemented
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
          <h2>Social media link</h2>
          <form onSubmit={handleAddSocialMedia}>
            <div className={classes.socialMediaModalFieldsDiv}>
              <div>
                <label>Platform: </label>
                <Input name='platform' value={currentSocialMedia}></Input>
              </div>
              <div>
                <label>URL Link: </label>
                <Input name='url_link' value={socialMedias.get(currentSocialMedia)}></Input>
              </div>
              <input ref={invisSocialMediaSubmitRef} type='submit' className={classes.hiddenSubmit}></input>
            </div>
          </form>
        </div>
      </CustomModal>

    </div>
  );
}
