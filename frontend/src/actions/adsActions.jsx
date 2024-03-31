// ACTIONS

import axios from 'axios';
import {
  ADS_LIST_REQUEST,
  ADS_LIST_SUCCESS,
  ADS_LIST_FAILURE,
  UPLOAD_AD_REQUEST,
  UPLOAD_AD_SUCCESS,
  UPLOAD_AD_FAILURE,
  GET_AD_REQUEST,
  GET_AD_SUCCESS,
  GET_AD_FAILURE,
  EDIT_AD_REQUEST,
  EDIT_AD_SUCCESS,
  EDIT_AD_FAILURE,
  DELETE_AD_REQUEST,
  DELETE_AD_SUCCESS,
  DELETE_AD_FAILURE,
} from '../constants/adsConstants';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

export const listAds = () => async (dispatch) => {
  try {
    dispatch({ type: ADS_LIST_REQUEST });

    const { data } = await instance.get('/api/ads/list/');

    dispatch({
      type: ADS_LIST_SUCCESS,
      payload: data,
    });  

    return data
  } catch (error) {
    dispatch({
      type: ADS_LIST_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const adsUpload = (ad) => async (dispatch) => {
  try {
    dispatch({ type: UPLOAD_AD_REQUEST });

    const { data } = await instance.post('/api/ads/upload_ads/', ad, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch({
      type: UPLOAD_AD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPLOAD_AD_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getAd = (id) => async (dispatch) => {
    try {
        dispatch({ type: GET_AD_REQUEST });

        const { data } = await instance.get(`/api/ads/${id}/`);

        dispatch({
            type: GET_AD_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: GET_AD_FAILURE,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};



export const editAd = (id, updatedAd) => async (dispatch) => {
  try {
      dispatch({ type: EDIT_AD_REQUEST });
      console.log(`EDIT_AD_REQUEST dispatched for ad with id ${id}`);

      const { data } = await instance.put(`/api/ads/${id}/`, updatedAd);
      console.log(`EDIT_AD_SUCCESS received for ad with id ${id}`, data);

      dispatch({
          type: EDIT_AD_SUCCESS,
          payload: data,
      });
  } catch (error) {
      console.error(`EDIT_AD_FAILURE: ${error.message}`);
      dispatch({
          type: EDIT_AD_FAILURE,
          payload: error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
      });
  }
};

export const deleteAd = (id) => async (dispatch) => {
  try {
      dispatch({ type: DELETE_AD_REQUEST });
      console.log(`DELETE_AD_REQUEST dispatched for ad with id ${id}`);

      await instance.delete(`/api/ads/${id}/`);
      console.log(`DELETE_AD_SUCCESS for ad with id ${id}`);

      dispatch({
          type: DELETE_AD_SUCCESS,
          payload: id,
      });
  } catch (error) {
      console.error(`DELETE_AD_FAILURE: ${error.message}`);
      dispatch({
          type: DELETE_AD_FAILURE,
          payload: error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
      });
  }
};
