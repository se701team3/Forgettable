export const convertSocialMedia = (socialMedias) => {
  if (!socialMedias) return null;

  const socialMediaArray = [];

  for (const [key, value] of Object.entries(socialMedias)) {
    socialMediaArray.push({
      name: key,
      link: value,
    });
  }

  return socialMediaArray;
};
