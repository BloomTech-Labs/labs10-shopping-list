import {
  TEST_START,
  TEST_SUCCESS,
  TEST_FAILURE,
  CHECKING_EMAIL,
  EMAIL_CHECKED,
} from "../actions";

const initialState = {
  
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case TEST_START:
      return state;
    case TEST_SUCCESS:
      return state;
    case TEST_FAILURE:
      return state;

    default:
      return state;
  }
};
