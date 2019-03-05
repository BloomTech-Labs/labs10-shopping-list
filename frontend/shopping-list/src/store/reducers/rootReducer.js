import {
  PURCHASING_ITEM,
  ITEM_PURCHASED,
  USER_GROUPS_FETCHED,
  USER_PROFILE_FETCHED,
  CHECKING_EMAIL,
  EMAIL_CHECKED,


  GET_CURRENT_USER,
  SAVE_CURRENT_USER,

  GET_USER_GROUPS,
  SAVE_USER_GROUPS,

  GET_GROUP_ITEMS,
  SAVE_GROUP_ITEMS,

  CREATE_ITEM,
  ITEM_CREATED,

  UPDATE_ITEM,
  ITEM_UPDATED,

  DELETE_ITEM,
  ITEM_DELETED,

  ADD_TO_CART,
  REMOVE_FROM_CART,

  BEGIN_CHECK_OUT,
  CHECK_OUT_COMPLETE,

  GET_GROUP_HISTORY,
  SAVE_GROUP_HISTORY,

  GET_GROUP_USERS,
  SAVE_GROUP_USERS,
  SAVE_USER_PROFILE,
  GET_USER_PROFILE,

  CLEAR_ITEMS,
  CLEAR_GROUP_USERS


} from "../actions";

const initialState = {
  currentUser: null,
  userGroups: null,
  groupItems: null,
  needsNewItems: false,
  needsNewHistory: false,
  userCart: null,
  groupHistory: null,
  groupUsers: null,
  groupUserProfiles: null,



  currentGroup: null,
  groups: null,
  items: null,
  emailChecked: false,
  
  groupTotal: null,
  
  userTotal: null,
  markedItems: null,
  needsRefresh: false,
  itemPurchasedText: null,
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECKING_EMAIL:
      return state;

    case EMAIL_CHECKED:
      return {
        ...state,
        currentUser: action.payload,
      }


    case GET_CURRENT_USER:
      return state;
    case SAVE_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload
      }

    case GET_USER_GROUPS:
      return state;
    case SAVE_USER_GROUPS:
      return {
        ...state,
        userGroups: action.payload
      }

    case GET_GROUP_ITEMS:
      return state;
    case SAVE_GROUP_ITEMS:
      return {
        ...state,
        groupItems: action.payload.data,
        needsNewItems: false,
      }


    case CREATE_ITEM:
      return state;
    case ITEM_CREATED:
      return {
        ...state,
        needsNewItems: true
      }

    case UPDATE_ITEM:
      return state;
    case ITEM_UPDATED:
      return {
        ...state,
        needsNewItems: true
      }

    case DELETE_ITEM:
      return state;
    case ITEM_DELETED:
      return {
        ...state,
        needsNewItems: true
      }

    case ADD_TO_CART:
    let newCart = [];
    if(state.userCart){
      if(state.userCart.length > 0){
        newCart = state.userCart;
      }
    }
      newCart.push(action.payload);
      return {
        ...state,
        userCart: newCart,
        needsNewItems: true,
      }
    case REMOVE_FROM_CART:
      let filterCart = state.userCart;
      filterCart = filterCart.filter(item => item.id !== action.payload.id);
      return {
        ...state,
        userCart: filterCart,
        needsNewItems: true,
      }

    case BEGIN_CHECK_OUT:
      return state;
    case CHECK_OUT_COMPLETE:
      return {
        ...state,
        userCart: null,
        needsNewItems: true,
        needsNewHistory: true,
      }

    case GET_GROUP_HISTORY:
      return state;
    case SAVE_GROUP_HISTORY:
      return {
        ...state,
        groupHistory: action.payload.data,
        needsNewHistory: false
      }

    case GET_GROUP_USERS:
      return state;


    case SAVE_GROUP_USERS:
      return{
        ...state,
        groupUsers: action.payload,
      }

    case GET_USER_PROFILE:
      return state;

    case SAVE_USER_PROFILE:
      let profileArray = [];
      // if an array of profiles exists, ensure we don't add duplicates
      if(state.groupUserProfiles){
        if(state.groupUserProfiles.length > 0){
          profileArray = state.groupUserProfiles;
          for(let i = 0; i < profileArray.length; i++){
            if(profileArray[i].id !== action.payload.id){
              profileArray.push(action.payload);
          }
        }
      }
    } else if (!state.groupUserProfiles){
      profileArray.push(action.payload);
    }
      return {
        ...state,
        groupUserProfiles: profileArray,
      }

    case CLEAR_ITEMS:
      return {
        ...state,
        groupItems: null
      }

    case CLEAR_GROUP_USERS:
      return {
        ...state,
        groupUsers: null,
        groupUserProfiles: null,
      }


    default:
      return state;
  }
};