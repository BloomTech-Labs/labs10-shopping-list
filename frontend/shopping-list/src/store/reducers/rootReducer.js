import {
  CHECKING_EMAIL,
  EMAIL_CHECKED,
  GEN_GROUP_INVITE,
  SAVE_GROUP_INVITE,
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
  CLEAR_GROUP_USERS,
  GET_GROUP_HISTORY_LIST,
  SAVE_GROUP_HISTORY_LIST,
  GET_INVITE_INFO,
  SAVE_INVITE_INFO,
  ACCEPTING_INVITE,
  INVITE_ACCEPTED,
  SAVE_USERNAME,
  SAVE_PROFILEPIC,
  REMOVE_ACCOUNT,
  ERROR,
  CLEAR_ERROR,
  CLEAR_GROUP_HISTORY,
} from "../actions";

const initialState = {
  currentUser: null,
  userGroups: null,
  groupItems: null,
  needsNewItems: false,
  needsNewHistory: false,
  needsNewGroups: false,
  needsNewHistoryList: false,
  userCart: null,
  groupHistory: null,
  groupHistoryList: null,
  groupUsers: null,
  groupUserProfiles: null,

  invites: null,

  currentGroup: null,
  groups: null,
  items: null,
  emailChecked: false,

  groupTotal: null,

  userTotal: null,
  markedItems: null,
  needsRefresh: false,
  itemPurchasedText: null,

  inviteInfo: null,

  errorMessage: null,
  groupMembers: null,
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECKING_EMAIL:
      return state;

    case EMAIL_CHECKED:
      return {
        ...state,
        currentUser: action.payload,
        errorMessage: null
      };

    case GEN_GROUP_INVITE:
      return state;
    case SAVE_GROUP_INVITE:
      return {
        ...state,
        invites: {
          [action.payload.groupId]: action.payload.inviteUrl
        },
        errorMessage: null
      };

    case GET_CURRENT_USER:
      return state;
    case SAVE_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
        errorMessage: null
      };

    case GET_USER_GROUPS:
      return state;
    case SAVE_USER_GROUPS:
      return {
        ...state,
        needsNewGroups: false,
        userGroups: action.payload
      };

    case GET_GROUP_ITEMS:
      return state;
    case SAVE_GROUP_ITEMS:
      let unpurchased = action.payload.data;
      unpurchased = unpurchased.filter(
        item => item.purchased === 0 || item.purchased === false
      );
      if (unpurchased && unpurchased.length === 0) {
        unpurchased = null;
      }
      return {
        ...state,
        groupItems: unpurchased,
        needsNewItems: false,
        errorMessage: null
      };

    case CREATE_ITEM:
      return state;
    case ITEM_CREATED:
      return {
        ...state,
        needsNewItems: true,
        errorMessage: null
      };

    case UPDATE_ITEM:
      return state;
    case ITEM_UPDATED:
      return {
        ...state,
        needsNewItems: true,
        errorMessage: null
      };

    case DELETE_ITEM:
      return state;
    case ITEM_DELETED:
      return {
        ...state,
        needsNewItems: true,
        errorMessage: null
      };

    case ADD_TO_CART:
      let newCart = [];
      if (state.userCart) {
        if (state.userCart.length > 0) {
          newCart = state.userCart;
        }
      }
      newCart.push(action.payload);
      return {
        ...state,
        userCart: newCart,
        needsNewItems: true,
        errorMessage: null
      };
    case REMOVE_FROM_CART:
      let filterCart = state.userCart;
      filterCart = filterCart.filter(item => item.id !== action.payload.id);
      return {
        ...state,
        userCart: filterCart,
        needsNewItems: true,
        errorMessage: null
      };

    case BEGIN_CHECK_OUT:
      return state;
    case CHECK_OUT_COMPLETE:
      return {
        ...state,
        userCart: null,
        needsNewItems: true,
        needsNewHistory: true,
        needsNewHistoryList: true,
        errorMessage: null
      };

    case GET_GROUP_HISTORY:
      return state;
    case SAVE_GROUP_HISTORY:
      return {
        ...state,
        groupHistory: action.payload.data,
        needsNewHistory: false,
        errorMessage: null
      };

    case GET_GROUP_HISTORY_LIST:
      return state;

    case SAVE_GROUP_HISTORY_LIST:
      return {
        ...state,
        groupHistoryList: action.payload.data,
        needsNewHistoryList: false,
        errorMessage: null
      };

    case GET_GROUP_USERS:
      return state;

    case SAVE_GROUP_USERS:
      return {
        ...state,
        groupUsers: action.payload,
        errorMessage: null
      };

    case GET_USER_PROFILE:
      return state;

    case SAVE_USER_PROFILE:
      let profileArray = [];
      // if an array of profiles exists, ensure we don't add duplicates
      if (state.groupUserProfiles) {
        if (state.groupUserProfiles.length > 0) {
          profileArray = state.groupUserProfiles;
          for (let i = 0; i < profileArray.length; i++) {
            if (profileArray[i].id !== action.payload.id) {
              profileArray.push(action.payload);
            }
          }
        }
      } else if (!state.groupUserProfiles) {
        profileArray.push(action.payload);
      }
      return {
        ...state,
        groupUserProfiles: profileArray,
        errorMessage: null
      };

    case CLEAR_ITEMS:
      return {
        ...state,
        groupItems: null,
        errorMessage: null
      };

    case CLEAR_GROUP_USERS:
      return {
        ...state,
        groupUsers: null,
        groupUserProfiles: null,
        errorMessage: null
      };

    case CLEAR_GROUP_HISTORY:
      return {
        ...state,
        groupHistory: null,
        groupHistoryList: null,
      }

    case GET_INVITE_INFO:
      return state;

    case SAVE_INVITE_INFO:
      return {
        ...state,
        inviteInfo: action.payload,
        errorMessage: null
      };

    case ACCEPTING_INVITE:
      return state;

    case INVITE_ACCEPTED:
      return {
        ...state,
        needsNewGroups: true,
        errorMessage: null
      };

    case SAVE_USERNAME:
      const user = {
        createdAt: state.currentUser.createdAt,
        email: state.currentUser.email,
        id: state.currentUser.id,
        name: action.payload,
        profilePicture: state.currentUser.profilePic,
        subscriptionType: state.currentUser.subscriptionType,
        updatedAt: state.currentUser.updatedAt
      };
      return {
        ...state,
        currentUser: user,
        errorMessage: null
      };

    case SAVE_PROFILEPIC:
      const user1 = {
        createdAt: state.currentUser.createdAt,
        email: state.currentUser.email,
        id: state.currentUser.id,
        name: state.currentUser.name,
        profilePicture: action.payload,
        subscriptionType: state.currentUser.subscriptionType,
        updatedAt: state.currentUser.updatedAt
      };
      return {
        ...state,
        currentUser: user1,
        errorMessage: null
      };

    case REMOVE_ACCOUNT:
      return (state = initialState);

    case ERROR:
      return {
        ...state,
        errorMessage: action.payload
      };

    case CLEAR_ERROR:
      return {
        ...state,
        errorMessage: null
      };

    default:
      return state;
  }
};
