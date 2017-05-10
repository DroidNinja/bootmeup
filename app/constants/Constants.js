/**
 * Created by droidNinja on 19/06/16.
 */

module.exports = Object.freeze({
    DEFAULT_FEED_COUNT:50,
    PROVIDER: {
        EMAIL: 'EMAIL',
        FACEBOOK: 'FACEBOOK',
        GOOGLE: 'GOOGLE'
    },
    REQUEST_TYPE:{
      GET: 'GET',
        POST: 'POST'
    },
    USER_TYPE:{
      USER: 'USER'
    },
    ENTITY_TYPE:{
        USER: 1
    },
    METRIC_TYPE:{
    CELSIUS: 1,
    FAHRENHEIT: 2
    },
    PLACE_TYPE: {
        LOCATION: "LOCATION",
        RESTAURANT: "RESTAURANT",
        ATTRACTION: "ATTRACTION"
    },
    QUERY_TYPE: {
        LATEST: 1,
        OLDER: 2
    },
    MEDIA_TYPE:{
        IMAGE: 'IMAGE'
    },
    TOKEN_TYPE: {
        AUTH_TOKEN: 'AUTH_TOKEN',
        USER_TOKEN: 'USER_TOKEN'
    },
    USER_ROLE:{
      ADMIN: 'ADMIN',
      MODERATOR: 'MODERATOR',
      USER: 'USER'
    },
    DB_DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    ERROR_TYPE: {
        INVALID_PARAMETERS: {
            message: 'Invalid parameters!',
            code: 799
        },
        UNABLE_TO_ADD_USER: {
            message: 'Unable to add user.',
            code: 798
        },
        NO_USERS_FOUND: {
            message: 'No users found.',
            code: 798
        },
        INVALID_REQUEST:{
            message: "Invalid request",
            code:796
        },
        UNREGISTERED_USER:{
            message: "User do not exists.",
            code: 794
        },
        INVALID_LOGIN: {
            message: "Invalid Login",
            code: 793
        },
        INVALID_USER:{
            message: "Invalid user",
            code:792
        },
        USER_ALREADY_EXISTS:{
            message: "User already exists!",
            code:791
        },
        UPLOAD_FAILED:{
            message: "Upload failed!",
            code: 778
        },
        MEDIA_NOT_EXISTS:{
            message: "Media not exists.",
            code: 778
        },
        FETCH_FAILURE:{
            message: "Unable to fetch.",
            code: 778
        },
        COULD_NOT_ADD:{
            message: "Could not add",
            code: 780
        },
        INVALID_MEDIA: {
            message: "Invalid media!",
            code: 778
        },
        UNAUTHORIZED_USER:{
            message: "Unauthorized user!",
            code: 999
        },
        UNKNOWN_ERROR:{
            message: "Unknown error!",
            code: 1001
        },
        INVALID_TOKEN: {
            message: "Token is invalid!",
            code: 1002
        },
        EXPIRED_TOKEN: {
            message: "Token is expired!",
            code: 1003
        }
    },
    MESSAGES:{
        SUCCESS_MESSAGE : "Successfully done",
        FAILURE_MESSAGE : "Something failed"
    },
    FILE_TYPES: {
        IMAGE_TYPES: [
            "image/jpeg",
            "image/pjpeg",
            "image/png"
        ],
        IMAGE: 'images'
    },
    ACL_TYPES:{
        PUBLIC: 'public-read',
        PRIVATE: 'private'
    },
    AWS:{
        BUCKET_NAME: "",
        SECRET_ACCESS_KEY: "",
        ACCESS_KEY_ID: "",
        REGION: ""
    },
    ACCESS_TOKEN_HEADER: 'x-access-token',
    FACEBOOK_ACCESS_TOKEN_URL: 'https://graph.facebook.com/me?access_token=',
    GOOGLE_ACCESS_TOKEN_URL: 'https://www.googleapis.com/oauth2/v1/tokeninfo?id_token=',
    GOOGLE_GEO_LOCATION_KEY: ''
});