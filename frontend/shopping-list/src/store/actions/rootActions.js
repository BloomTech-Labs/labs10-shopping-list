import axios from 'axios';
// import auth0Client from '../../components/Auth';


export const TEST_START = "TEST_START";
export const TEST_SUCCESS = "TEST_SUCCESS";
export const TEST_FAILURE = "TEST_FAILURE";
export const CHECKING_EMAIL = 'CHECKING_EMAIL';
export const EMAIL_CHECKED = 'EMAIL_CHECKED';
export const ERROR = 'ERROR';
export const ADDING_USER_TO_STATE = 'ADDING_USER_TO_STATE';
export const ADDING_GROUPS_TO_STATE = 'ADDING_GROUPS_TO_STATE';
export const ADDING_GROUPS_TO_STATE_FAILED = 'ADDING_GROUPS_TO_STATE_FAILED';


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
// once complete, calls the callback function, which in this case is addUserToState in order to populate state completely
export const checkEmail = (email, callback) => {
  console.log('checkemail function', email);

  let user = {
    email: email,
    name: localStorage.getItem('name'),
    img_url: localStorage.getItem('img_url'),
  }

  let token = localStorage.getItem('jwt');
  // console.log('token', token);
  let options = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }

  const fetchUserId = axios.post(`http://localhost:9000/api/user/getid`, user, options);

  return dispatch => {
    dispatch({type: CHECKING_EMAIL});

    fetchUserId.then(res => {
      console.log('check email', res.data);
      dispatch({type: EMAIL_CHECKED, payload: res.data});

      callback();
    }).catch(err => {
      console.log(err);
      dispatch({type: ERROR})
    })
  }
}

export const addUserToState = () => {

  let userState = {
    email: localStorage.getItem('email'),
    name: localStorage.getItem('name'),
    profilePicture: localStorage.getItem('img_url'),
  }

  if(userState.email && userState.name && userState.profilePicture){
    return dispatch => {
      dispatch({type: ADDING_USER_TO_STATE, payload: userState});

    }
  } else {
    return dispatch => {
      dispatch({type: ERROR})
    }
  }
}

export const gettingGroups = () => dispatch => {
  const userID = localStorage.getItem('userId');
  const token = localStorage.getItem('jwt');
  // const endpoint = `http://localhost:8000//api/group/user/${userID}`;
  const endpoint = `https://shoptrak-backend.herokuapp.com/api/groupMember/user/${userID}`;
  const options = {
    headers: {
      Authorization: token
    }
  };

  axios.get(endpoint, options)
      .then(response => {
        console.log("GETTING GROUPS => ", response);
        dispatch({ type: ADDING_GROUPS_TO_STATE, payload: response.data.data });
      })
      .catch(err => {
        console.log("GETTING GROUPS ERR => ", err);
        dispatch({ type: ADDING_GROUPS_TO_STATE_FAILED, payload: err });
      });
}