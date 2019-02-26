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
export const ADDING_GROUPS_TO_SERVER = 'ADDING_GROUPS_TO_SERVER';
export const ADDING_GROUPS_TO_SERVER_FAILED = 'ADDING_GROUPS_TO_SERVER_FAILED';
export const GETTING_ITEMS = 'GETTING_ITEMS';
export const GETTING_ITEMS_SUCCESS = 'GETTING_ITEMS_SUCCESS';
export const GETTING_ITEMS_FAILED = 'GETTING_ITEMS_FAILED';


let backendURL;
if(process.env.NODE_ENV === 'development'){
  backendURL = `http://localhost:9000`
} else {
  backendURL = `https://shoptrak-backend.herokuapp.com`
}

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

  const fetchUserId = axios.post(`${backendURL}/api/user/getid`, user, options);

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

export const addGroup = (group) => dispatch => {
  const userID = localStorage.getItem('userId');
  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/group/`;
  const options = {
    headers: {
      Authorization: token
    }
  };

  const grp = {
    userID: userID,
    name: group,
  }

  axios.post(endpoint, grp, options)
      .then(() => {
        gettingGroups()(dispatch)
            .then(() => {
              dispatch({ type: ADDING_GROUPS_TO_SERVER });
            })
      })
      .catch(err => {
        console.log("ADDING GROUP ERR => ", err);
        dispatch({ type: ADDING_GROUPS_TO_SERVER_FAILED, payload: err });
      });

}

export const gettingGroups = () => async dispatch => {
  const userID = localStorage.getItem('userId');
  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/group/user/${userID}`;

  const options = {
    headers: {
      Authorization: token
    }
  };

  axios.get(endpoint, options)
      .then(response => {
        dispatch({ type: ADDING_GROUPS_TO_STATE, payload: response.data.data });
      })
      .catch(err => {
        console.log("GETTING GROUPS ERR => ", err);
        dispatch({ type: ADDING_GROUPS_TO_STATE_FAILED, payload: err });
      });
};

export const getItems = (id) => dispatch => {
  dispatch({ type: GETTING_ITEMS });
  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/item/group/${id}`;

  const options = {
    headers: {
      Authorization: token
    }
  };

  axios.get(endpoint, options)
      .then(response => {
        dispatch({ type: GETTING_ITEMS_SUCCESS, payload: response.data.data });
      })
      .catch(err => {
        console.log("GETTING GROUPS ERR => ", err);
        dispatch({ type: GETTING_ITEMS_FAILED, payload: err });
      });

  // dispatch({ type: GETTING_ITEMS payload: items});
}