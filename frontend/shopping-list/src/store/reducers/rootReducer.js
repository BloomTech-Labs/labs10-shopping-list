import {
  TEST_START,
  TEST_SUCCESS,
  TEST_FAILURE,
  // CHECKING_EMAIL,
  EMAIL_CHECKED,
} from "../actions";

const initialState = {
  userId: null,
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case TEST_START:
      return state;
    case TEST_SUCCESS:
      return state;
    case TEST_FAILURE:
      return state;

    case EMAIL_CHECKED:
      console.log('emc payload', action.payload.id);
      localStorage.setItem('userId', action.payload.id);
      return {
        ...state,
        userId: action.payload.id
      }


    default:
      return state;
  }
};
