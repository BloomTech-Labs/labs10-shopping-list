import {
  TEST_START,
  TEST_SUCCESS,
  TEST_FAILURE,
  CHECKING_EMAIL,
  EMAIL_CHECKED,
  ADDING_GROUPS_TO_STATE,
  ADDING_GROUPS_TO_STATE_FAILED,
  ADDING_USER_TO_STATE,
  GETTING_ITEMS,
  GETTING_ITEMS_SUCCESS,
  GETTING_ITEMS_FAILED,
  FETCHING_SINGLE_GROUP,
  SINGLE_GROUP_FETCHED,
  CLEARING_CURRENT_GROUP,
  UPDATE_ITEM_PURCHASED_START
} from "../actions";

const initialState = {
  userId: null,
  name: null,
  email: null,
  profilePicture: null,
  currentGroup: null,
  groups: null,
  items: null,
  itemPurchasedText: null,
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case TEST_START:
      return state;
    case TEST_SUCCESS:
      return state;
    case TEST_FAILURE:
      return state;

    case CHECKING_EMAIL:
      return state;

    case EMAIL_CHECKED:
      // console.log('emc payload', action.payload.id);
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
    case ADDING_GROUPS_TO_STATE:
      return {
        ...state,
        groups: action.payload
      }
    case ADDING_GROUPS_TO_STATE_FAILED:
      return state;

    case GETTING_ITEMS:
      return state;

    case GETTING_ITEMS_SUCCESS:
      return { ...state, items: action.payload}

    case GETTING_ITEMS_FAILED:
      return { ...state, items: null };

      // Purchasing Items
    case UPDATE_ITEM_PURCHASED_START:
      let itms = state.items.map(itm => {
        if (itm.id === action.payload) {
          itm.purchased = !itm.purchased
        }

        return itm;
      })
      return { ...state, items: itms}

    case FETCHING_SINGLE_GROUP:
      return {
        ...state,
      }

    case SINGLE_GROUP_FETCHED:
      return {
        ...state,
        currentGroup: action.payload,
      }

    case CLEARING_CURRENT_GROUP:
      return {
        ...state,
        currentGroup: null,
      }

    default:
      return state;
  }
};