import {
  CHECKING_EMAIL,
  EMAIL_CHECKED,
  ERROR,
  ADDING_USER_TO_STATE,
  GET_GROUPS_START,
  GET_GROUPS_SUCCESS,
  GET_GROUPS_FAILED,
  ADD_GROUP_START,
  ADD_GROUP_SUCCESS,
  ADD_GROUP_FAILED,
  GET_ITEMS_START,
  GET_ITEMS_SUCCESS,
  GET_ITEMS_FAILED,
  ADD_ITEM_START,
  ADD_ITEM_SUCCESS,
  ADD_ITEM_FAILED,
  UPDATE_ITEM_PURCHASED_START,
  SUBMIT_PAID_ITEMS_START,
  SUBMIT_PAID_ITEMS_SUCCESS,
  SUBMIT_PAID_ITEMS_FAILED,
} from "../actions";

const initialState = {
  userId: null,
  name: null,
  email: null,
  profilePicture: null,
  groups: null,
  items: null
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    // User
    case CHECKING_EMAIL:
      return state;

    case EMAIL_CHECKED:
      localStorage.setItem('userId', action.payload.id);
      return {
        ...state,
        userId: action.payload.id
      }
      
    case ADDING_USER_TO_STATE:
      return {
        ...state,
        name: action.payload.name,
        email: action.payload.email,
        profilePicture: action.payload.profilePicture,
      }

    // Getting Groups
    case GET_GROUPS_START:
      return state;

    case GET_GROUPS_SUCCESS:
      return {
        ...state,
        groups: action.payload
      }
    case GET_GROUPS_FAILED:
      return state;

    // Adding Group
    case ADD_GROUP_START:
      return state;

    case ADD_GROUP_SUCCESS:
      return state;

    case ADD_GROUP_FAILED:
      return state;

    // Getting Items
    case GET_ITEMS_START:
      return state;

    case GET_ITEMS_SUCCESS:
      return { ...state, items: action.payload}

    case GET_ITEMS_FAILED:
      return { ...state, items: null };

    // Adding Item
    case ADD_ITEM_START:
      return state;

    case ADD_ITEM_SUCCESS:
      return state;

    case ADD_ITEM_FAILED:
      return state;

    // Purchasing Items
    case UPDATE_ITEM_PURCHASED_START:
      let itms = state.items.map(itm => {
        if (itm.id === action.payload) {
          itm.purchased = !itm.purchased
        }

        return itm;
      })
      return { ...state, items: itms}

    // Submitting Paid Items
    case SUBMIT_PAID_ITEMS_START:
      return state;

    case SUBMIT_PAID_ITEMS_SUCCESS:
      return state;

    case SUBMIT_PAID_ITEMS_FAILED:
      return state;

    default:
      return state;
  }
};
