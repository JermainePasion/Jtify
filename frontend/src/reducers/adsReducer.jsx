import
{
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



export const adslistReducer = (state = { loading: false, ads: [] }, action) => {
    switch (action.type) {
      case ADS_LIST_REQUEST:
        return { loading: true, ads: [] };
      case ADS_LIST_SUCCESS:
        return { loading: false, ads: action.payload };
      case ADS_LIST_FAILURE:
        return { loading: false, error: action.payload, ads: [] };
      case GET_AD_REQUEST:
      case EDIT_AD_REQUEST:
      case DELETE_AD_REQUEST:
        return { ...state, loading: true };
  
      case GET_AD_SUCCESS:
      case EDIT_AD_SUCCESS:
        return { loading: false, ad: action.payload };
  
      case GET_AD_FAILURE:
      case EDIT_AD_FAILURE:
        return { loading: false, error: action.payload };
  
      case DELETE_AD_SUCCESS:
        return { loading: false, ads: state.ads.filter((ad) => ad.id !== action.payload) };
  
      case DELETE_AD_FAILURE:
        return { loading: false, error: action.payload };
  
      default:
        return state;
    }
  };

export const adsUploadReducer = (state = {}, action) => {
    switch (action.type) {
        case UPLOAD_AD_REQUEST:
            return { loading: true, ads: [] };
        case UPLOAD_AD_SUCCESS:
            return { loading: false, ads: action.payload };
        case UPLOAD_AD_FAILURE:
            return { loading: false, error: action.payload, ads: [] };
        default:
            return state;
        }
    };
    