import { types } from "../constants";

export const setUser = (user_name, hash_password) => {
  return {
    type: types.SET_USER,
    payload1: user_name,
    payload2: hash_password
  };
};

// export const getRequestSearch = data => {
//     return{
//         type: types.get.GET_REQUEST_SEARCH,
//         payload: data
//     }
// }
//
// export const getBannerChannels = bannerChannel =>{
//     return{
//         type: types.get.GET_BANNER_CHANNELS,
//         payload: bannerChannel
//     }
// }
//
// export const handleClickVideo = videoSelect => {
//     return{
//         type: types.set.SET_SELECT_VIDEO,
//         payload: videoSelect
//
//     }
// }
//
// export const handleClickChannel = channel =>{
//     return{
//         type: types.SELECT_CHANNEL,
//         payload: channel
//     }
// }
//
// export const setError = error => {
//     return{
//         type: types.set.SET_ERROR,
//         payload: error
//     }
// }
