export const converSocialMediaToIcon = (socialMedia) => {
  const iconDirectoryPath = './src/assets/icons/social-media/';
  return iconDirectoryPath + socialMedia + '.svg';
};

const convertSocialMediaNamesToIcons = (socialMedias) => {
  return socialMedias.map((socialMedia) => {
    converSocialMediaToIcon(socialMedia);
  });
};

export default convertSocialMediaNamesToIcons;
