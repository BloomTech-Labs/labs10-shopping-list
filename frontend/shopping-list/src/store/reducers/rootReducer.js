import {
  PURCHASING_ITEM,
  ITEM_PURCHASED,
  USER_GROUPS_FETCHED,
  USER_PROFILE_FETCHED,


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


} from "../actions";

const initialState = {
  currentUser: null,
  userGroups: null,
  groupItems: null,
  needsNewItems: false,
  needsNewHistory: false,
  userCart: [],
  groupHistory: [],



  currentGroup: null,
  groups: null,
  items: null,
  emailChecked: false,
  groupUsers: null,
  groupUserProfiles: null,
  groupTotal: null,
  
  userTotal: null,
  markedItems: null,
  needsRefresh: false,
  itemPurchasedText: null,
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
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
      let newCart = state.userCart;
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
        needsNewItems: true,
        needsNewHistory: true,
      }

    case GET_GROUP_HISTORY:
      return state;
    case SAVE_GROUP_HISTORY:
      return {
        ...state,
        groupHistory: action.payload,
        needsNewHistory: false
      }


      case USER_GROUPS_FETCHED:
      return{
        ...state,
        groupUsers: action.payload,
      }

    case USER_PROFILE_FETCHED:
      let profileArray = [];
      profileArray.push(action.payload);
      return {
        ...state,
        groupUserProfiles: profileArray,
      }

    default:
      return state;
  }
};