import {Avatar, imageListClasses, Input, SvgIcon} from '@mui/material';
import React, {useEffect} from 'react';
import {useState, useRef} from 'react';
import CustomButton from '../../components/CustomButton/CustomButton';
import classes from './EditPerson.module.css';
import {convertSocialMediaToIcon} from '../../functions/socialMediaIconConverter';
import {useNavigate, useLocation} from 'react-router-dom';
import imageToBase64 from 'image-to-base64/browser';

const MAX_IMAGE_SIZE = 16000000;


export default function EditPerson() {
  // to check if it is create person or edit person
  const location = useLocation();

  // do a better check than this?
  const create = location.pathname.includes('/people/create') ? true : false;

  // GET persons/:id if create == false
  // const personData = {};
  const personData = {
    full_name: 'Name Last',
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
  };

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
  const [profilePic, setProfilePic] = useState(initialProfilePic); // leave blank or use ''?

  const [socialMedias, setSocialMedias] = useState(new Map([
    ['twitter', 'https://twitter.com/Twitter'],
    ['github', 'github.com'],
  ])); // should be map https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

  const navigate = useNavigate();

  function handleAddSocialMedia(newSocialMedia) {
    const newStateSocailMedias = [...socialMedias, ['facebook', 'fdsa']]; // temp
    setSocialMedias(newStateSocailMedias);
  }

  function handleDisplaySocialMedia() {
    const socialMediaElements = [];
    for (const [key, value] of socialMedias) {
      socialMediaElements.push(<Avatar
        src={convertSocialMediaToIcon(key)}
        alt={socialMedias[key]}
        key={key}
        onClick={() => alert('clicked')} // replace with custom modal and perhaps function
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
            // console.log(response);
            setProfilePic(response);
          },
      );
      setProfilePicPreview(imageURL);
    } else {
      // add the custom alert here
      console.log('Image too big, must be less than 16mb');
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append('image', profilePic);
    formData.append('encounters', create ? [] : personData.encounters);
    // check which format for date
    formData.append('time_updated', (Date.now()));

    console.log(Object.fromEntries(formData));
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
            <p>Full Name</p>
            <Input name='full_name' autoFocus required defaultValue={personData.full_name}></Input>
            <p>Gender</p>
            <Input name='gender' defaultValue={personData.gender}></Input>
            <p>Date First Met</p>
            <Input name='first_met' type='date' defaultValue={personData.first_met}></Input>
            <p>Interests</p>
            <Input name='interests' defaultValue={personData.interests}></Input>
            <p>Social Media</p>
          </div>
          <div className={classes.column}>
            <p>Birthday</p>
            <Input name='birthday' type='date' defaultValue={personData.birthday}></Input>
            <p>Their Current Location</p>
            <Input name='location' defaultValue={personData.location}></Input>
            <p>How We Met</p>
            <Input name='how_we_met' defaultValue={personData.how_we_met}></Input>
            <p>Organisation</p>
            <Input name='organisation' defaultValue={personData.organisation}></Input>
          </div>
        </div>
        <div className={classes.socialMediaDiv}>
          {handleDisplaySocialMedia()}
          <button
            className={classes.addSocialMediaIcon}
            onClick={handleAddSocialMedia}>
              +
          </button>
        </div>

        <div className={classes.formButtonsDiv}>
          {/* navigate(-1) returns to previous page (like a back button) */}
          <CustomButton
            btnText="Cancel"
            onClick={() => navigate(-1, {'replace': true})}
            className={classes.cancelButton}
          />
          <label htmlFor='submit'>
            <CustomButton btnText="Save"/>
          </label>
          <input id='submit' type="submit" className={classes.hiddenSubmit}/>
        </div>
      </form>

    </div>
  );
}
