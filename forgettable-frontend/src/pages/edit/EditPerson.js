import {Avatar, imageListClasses, Input, SvgIcon} from '@mui/material';
import React from 'react';
import {useState, useRef} from 'react';
import CustomButton from '../../components/CustomButton/CustomButton';
import classes from './EditPerson.module.css';
import {convertSocialMediaToIcon} from '../../functions/socialMediaIconConverter';
import {useNavigate} from 'react-router-dom';


export default function EditPerson() {
  const socialMedia = 'twitter';

  // let socialMedias = [];

  const [profilePicPreview, setProfilePicPreview] = useState();
  const [profilePic, setProfilePic] = useState();

  const [socialMedias, setSocialMedias] = useState([]); // should be map https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

  // const [formData, setFormData] = useState(new FormData());

  const navigate = useNavigate();

  // const handleAddSocialMedia = () => {
  //   console.log('new social media added');
  // };
  const inputProfilePic = useRef(null);

  function handleAddSocialMedia(newSocialMedia) {
    // open modal - returns map?
    // newSocialMedia.preventDefault();
    // socialMedias = [...socialMedias, newSocialMedia];
    setSocialMedias([...socialMedias, newSocialMedia]);
    console.log(socialMedias);
  }

  // https://medium.com/geekculture/how-to-upload-and-preview-images-in-react-js-4e22a903f3db
  function uploadImagePreview(image) {
    const fileReader = new FileReader();
    setProfilePic(fileReader.readAsDataURL(image.target.files[0]));
    console.log(profilePic);
    setProfilePicPreview(URL.createObjectURL(image.target.files[0]));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    // setFormData({...formData, formData.})
    // formData.append(event.target);
    formData.append('image', profilePic);
    console.log(Object.fromEntries(formData));
  }


  return (
    <div className={classes.EditPerson}>
      <h1 className={classes.heading}>Create Person</h1>

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
            <Input name='full_name'></Input>
            <p>Gender</p>
            <Input name='gender'></Input>
            <p>Date First Met</p>
            <Input name='first_met' type='date'></Input>
            <p>Interests</p>
            <Input name='interests'></Input>
            <p>Social Media</p>
          </div>
          <div className={classes.column}>
            <p>Birthday</p>
            <Input name='birthday' type='date'></Input>
            <p>Their Current Location</p>
            <Input name='location'></Input>
            <p>How We Met</p>
            <Input name='how_we_met'></Input>
            <p>Organisation</p>
            <Input name='organisation'></Input>
          </div>
        </div>
        <div className={classes.socialMediaDiv}>
          {/* <label>Social Media</label> */}
          {socialMedias.map((socialMedia, index) => (
            <Avatar
              src={convertSocialMediaToIcon(socialMedia)}
              alt={socialMedia}
              key={index}
              className={classes.socialMediaIcon}/>
          ))}
          {/* <Avatar
                src={convertSocialMediaToIcon(socialMedia)}
                alt={socialMedia}
              /> */}
          <button
            className={classes.addSocialMediaIcon}
            onClick={handleAddSocialMedia}>
              +
          </button>
          {/* <SvgIcon {...StarIcon}></SvgIcon> */}
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
