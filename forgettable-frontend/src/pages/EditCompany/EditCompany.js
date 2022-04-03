import {Avatar, Input} from '@mui/material';
import React, {useEffect} from 'react';
import {useState, useRef} from 'react';
import CustomButton from '../../components/CustomButton/CustomButton';
import classes from './EditCompany.module.css';
import {convertSocialMediaToIcon} from '../../functions/socialMediaIconConverter';
import {useNavigate, useLocation, useParams} from 'react-router-dom';
import imageToBase64 from 'image-to-base64/browser';
import CustomModal from '../../components/CustomModal/CustomModal';
import * as apiCalls from '../../services/index';
import InputField from '../../components/InputField/InputField';
import {convertSocialMedia} from '../../functions/convertSocialMediaFormat';
import {getInputDateFormatString, getLongDateStringWithSlashes} from '../../functions/dateFormatter';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {toastGenerator} from '../../functions/helper';
import Loading from '../Loading/Loading';

const MAX_IMAGE_SIZE = 16000000;

export default function EditCompany() {
  const location = useLocation();

  const navigate = useNavigate();

  // to check if it is create person or edit person route
  const create = location.pathname.includes('/create');

  const {id} = (!create) && useParams();

  const [companyData, setCompanyData] = useState({
    name: '',
    location: '',
    description: '',
    date_founded: '',
    // persons: '',
  });

  (!create) && (useEffect(async () => {
    const result = await apiCalls.getCompany(id);
    setCompanyData({
      name: result.name || '',
      location: result.location || '',
      description: result.description || '',
      date_founded: result.date_founded || '',
    });
  }, [id]));


  let initialProfilePic = '';
  let initialProfilePicPreview = '';

  if (!create) {
    companyData.hasOwnProperty('image') && (
      initialProfilePic = companyData.image,
      initialProfilePicPreview = 'data:image/*;base64,' + companyData.image);
  }

  const [profilePicPreview, setProfilePicPreview] = useState(initialProfilePicPreview);
  const [profilePic, setProfilePic] = useState(initialProfilePic);

  const invisSocialMediaSubmitRef = useRef(null);

  const [loading, setLoading] = useState(false);


  // https://medium.com/geekculture/how-to-upload-and-preview-images-in-react-js-4e22a903f3db
  function uploadImagePreview(image) {
    // todo: handle image 'too big'
    if (image.target.files[0].size < MAX_IMAGE_SIZE) {
      const imageURL = URL.createObjectURL(image.target.files[0]);

      imageToBase64(imageURL).then(
          (response) => {
            setProfilePic(response);
          },
      );
      setProfilePicPreview(imageURL);
    } else {
      toastGenerator('error', 'Image too big, must be less than 16mb', 2000);
    }
  }

  const handleSubmit = async (event) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000);

    event.preventDefault(); // perhaps remove this later
    const formData = Object.fromEntries(new FormData(event.target));

    const data = {
      ...formData,
      image: profilePic,
    };

    if (create) {
      const result = await apiCalls.createCompany(data);

      if (result) {
        toastGenerator('success', 'Company Created!', 2000);

        setTimeout(()=> {
          navigate('/company', {state: {company: result}});
        }, 1000);
      } else {
        toastGenerator('error', 'Something went wrong... :(', 2000);
        setLoading(false);
      }
    } else {
      const result = await apiCalls.updateCompany(id, data);
      if (result == '') {
        toastGenerator('success', 'Company Saved!', 2000);

        setTimeout(()=> {
          navigate(`/company/${id}`);
        }, 1000);
      } else {
        toastGenerator('error', 'Something went wrong... :(', 2000);
        setLoading(false);
      }
    }
  };


  return ( loading ? <Loading/> :
    <div className={classes.editCompany}>
      <div className={classes.title}>{create ? 'Create' : 'Edit'} Company </div>
      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.avatarDiv}>
          <Avatar src={profilePicPreview} className={classes.avatar}></Avatar>
          <label className={classes.changeImgButtonWrapper}>
            Change
            <Input
              id='inputProfilePic'
              type='file'
              accept='image/*'
              className={classes.changeImgButton}
              onChange={uploadImagePreview}
            />
          </label>
        </div>

        <div className={classes.row}>
          <div className={classes.column}>
            <InputField inputID='name' placeholder={'E.g. Apple'} inputLabel='Company Name' inputType='primary' inputStateValue={companyData.name} autoFocusState={true} requiredState/>
            <InputField inputID='description' placeholder={'E.g. About the company'} inputLabel='Description' inputType='primary' inputStateValue={companyData.description}/>
          </div>
          <div className={classes.column}>
            <InputField inputID='location'
              placeholder={'E.g. California, US'}
              inputLabel='Location'
              inputType='primary'
              inputStateValue={companyData.location}/>
            <InputField inputID='date_founded'
              inputLabel='Date Founded'
              inputType='primary'
              dataType='date'
              inputStateValue={companyData.date_founded}/>
          </div>
        </div>

        <div className={classes.formButtonsDiv}>
          {!create && (
            <CustomButton btnText="Delete" type="button"
              onClick={() => setDeleteModalOpen(true)}
              className={classes.formsButton}
            />
          )}
          <CustomButton
            btnText="Cancel" type="button"
            onClick={() => navigate('/company')}
            className={classes.formsButton}
          />
          <CustomButton btnText="Save"/>
          <input ref={invisSocialMediaSubmitRef} id='submit' type="submit" className={classes.hiddenSubmit}/>
        </div>
      </form>
    </div>
  );
}
