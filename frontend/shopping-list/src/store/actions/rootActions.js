import axios from 'axios';
import auth0Client from '../../components/Auth';


export const TEST_START = "TEST_START";
export const TEST_SUCCESS = "TEST_SUCCESS";
export const TEST_FAILURE = "TEST_FAILURE";
export const CHECKING_EMAIL = 'CHECKING_EMAIL';
export const EMAIL_CHECKED = 'EMAIL_CHECKED';

/**
 * Test function
 * @param  {} dispatch
 */
export const testFunction = () => dispatch => {
  dispatch({ type: TEST_START });

  const result = true;

  if (result) return dispatch({ type: TEST_SUCCESS });

  dispatch({ type: TEST_FAILURE });
};

// takes in the user email from auth0 profile
// sends email to server to obtain user ID
// if no ID found, creates a new user record and returns the ID
export const checkEmail = (email) => {
  console.log('checkemail function', email);

  let user = {
    email: email,
    name: localStorage.getItem('name'),
    img_url: localStorage.getItem('img_url'),
  }

  const fetchUserId = axios.post(`http://localhost:9000/api/user/getid`, user);

  return dispatch => {
    dispatch({type: CHECKING_EMAIL});

    fetchUserId.then(res => {
      console.log('check email', res.data);
      dispatch({type: EMAIL_CHECKED, payload: res.data});
    })
  }
}