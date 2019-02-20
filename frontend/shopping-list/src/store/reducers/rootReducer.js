import {
  TEST_START,
  TEST_SUCCESS,
  TEST_FAILURE,
  CHECKING_EMAIL,
  EMAIL_CHECKED,
} from "../actions";
import { ADDING_USER_TO_STATE } from "../actions/rootActions";

const initialState = {
  userId: null,
  name: null,
  email: null,
  profilePicture: null,
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
      console.log('emc payload', action.payload.id);
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

    default:
      return state;
  }
};
