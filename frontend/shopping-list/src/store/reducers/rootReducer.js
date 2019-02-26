import {
  TEST_START,
  TEST_SUCCESS,
  TEST_FAILURE,
  CHECKING_EMAIL,
  EMAIL_CHECKED,
  ADDING_GROUPS_TO_STATE,
  ADDING_GROUPS_TO_STATE_FAILED,
  GETTING_ITEMS,
  GETTING_ITEMS_SUCCESS,
  GETTING_ITEMS_FAILED,
  FETCHING_SINGLE_GROUP,
  SINGLE_GROUP_FETCHED,
  CLEARING_CURRENT_GROUP,
} from "../actions";
import { ADDING_USER_TO_STATE } from "../actions/rootActions";

const initialState = {
  userId: null,
  name: null,
  email: null,
  profilePicture: null,
  groups: [{name: "Lament House", memberAmount: 1}],
  items: [{groupId: 0, name: "Milk"}],
  currentGroup: null,
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
    // console.log('auts payload', action.payload);
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
      return { ...state, items: [{groupId: 0}] };

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
