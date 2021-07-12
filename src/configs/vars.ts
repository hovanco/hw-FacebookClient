export const API_URI = <string>process.env.REACT_APP_API_URI;
export const NOTIFICATION_SERVER_URI = <string>process.env.REACT_APP_NOTIFICATION_SERVER_URI;
export const FACEBOOK_APP_ID = <string>process.env.REACT_APP_FACEBOOK_APP_ID;
export const FACEBOOK_SCOPE =
    'pages_manage_metadata,pages_read_engagement,pages_read_user_content,pages_messaging,pages_manage_engagement,pages_manage_posts,pages_show_list';

export const GOOGLE_APP_ID = <string>process.env.REACT_APP_GOOGLE_APP_ID;
export const SOCIAL_NETWORK_PATH = '/social-network';
export const SOCIAL_NETWORK_VER = 'v1';

export const IMG_URL = <string>process.env.REACT_APP_IMG_URL;

if (!API_URI || !NOTIFICATION_SERVER_URI || !FACEBOOK_SCOPE || !IMG_URL)
    throw new Error('Missing required env');
