import discord from '../assets/icons/social-media/discord.svg';
import facebook from '../assets/icons/social-media/facebook.svg';
import github from '../assets/icons/social-media/github.svg';
import google from '../assets/icons/social-media/google.svg';
import instagram from '../assets/icons/social-media/instagram.svg';
import linkedin from '../assets/icons/social-media/linkedin.svg';
import medium from '../assets/icons/social-media/medium.svg';
import slack from '../assets/icons/social-media/slack.svg';
import telegram from '../assets/icons/social-media/telegram.svg';
import tiktok from '../assets/icons/social-media/tiktok.svg';
import tumblr from '../assets/icons/social-media/tumblr.svg';
import twitch from '../assets/icons/social-media/twitch.svg';
import twitter from '../assets/icons/social-media/twitter.svg';
import whatsapp from '../assets/icons/social-media/whatsapp.svg';
import youtube from '../assets/icons/social-media/youtube.svg';


const icons = {
  'discord': discord,
  'facebook': facebook,
  'github': github,
  'google': google,
  'instagram': instagram,
  'linkedin': linkedin,
  'medium': medium,
  'slack': slack,
  'telegram': telegram,
  'tiktok': tiktok,
  'tumblr': tumblr,
  'twitch': twitch,
  'twitter': twitter,
  'whatsapp': whatsapp,
  'youtube': youtube,
};


export const convertSocialMediaToIcon = (socialMedia) => {
  return icons[socialMedia];
};

export const convertSocialMediaNamesToIcons = (socialMedias) => {
  return socialMedias.map((socialMedia) => {
    convertSocialMediaToIcon(socialMedia);
  }).filter((socialMedia) => !!socialMedia);
};

export default convertSocialMediaNamesToIcons;
