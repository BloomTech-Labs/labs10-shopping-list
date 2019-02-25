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

export const ADDING_ITEM_START = 'ADDING_ITEM_START';
export const ADDING_ITEM_SUCCESS = 'ADDING_ITEM_SUCCESS';
export const ADDING_ITEM_FAILED = 'ADDING_ITEM_FAILED';

export const UPDATE_ITEM_PURCHASED_START = "UPDATE_ITEM_PURCHASED_START";

export const SUBMIT_PAID_ITEMS_START = "SUBMIT_PAID_ITEMS_START";
export const SUBMIT_PAID_ITEMS_SUCCESS = "SUBMIT_PAID_ITEMS_SUCCESS";
export const SUBMIT_PAID_ITEMS_FAILED = "SUBMIT_PAID_ITEMS_FAILED";


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

/*
 * Adds a new group to the database that the user has created
 * @param group - The newly created group `name`
 */
export const addGroup = (group) => dispatch => {
  const userID = localStorage.getItem('userId');
  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/group/`;
  const options = {
    headers: {
      Authorization: token
    }
  };

  // The group object to be sent to the server
  const grp = {
    userID: userID,
    name: group,
  }

  // Add's the new group to the server and dispatches success or failure
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

/*
 * Retrieves a list of groups that the user owns.
 */
// TODO - Change this to groupMembers to get ALL the groups the user is IN - not just owned
export const gettingGroups = () => async dispatch => {
  const userID = localStorage.getItem('userId');
  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/group/user/${userID}`;

  const options = {
    headers: {
      Authorization: token
    }
  };

  // Retrieve all the groups the user owns
  axios.get(endpoint, options)
      .then(response => {
        console.log("RES => ", response.data.data);
        dispatch({ type: ADDING_GROUPS_TO_STATE, payload: response.data.data });
      })
      .catch(err => {
        console.log("GETTING GROUPS ERR => ", err);
        dispatch({ type: ADDING_GROUPS_TO_STATE_FAILED, payload: err });
      });
};

/*
 * Retrieves a list of items for a specified group with a group ID.
 * @param id - Group ID
 */
export const getItems = (id) => dispatch => {
  dispatch({ type: GETTING_ITEMS });
  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/item/group/${id}`;

  const options = {
    headers: {
      Authorization: token
    }
  };

  // Retrieve items from endpoint and dispatch them to state
  axios.get(endpoint, options)
      .then(response => {
        dispatch({ type: GETTING_ITEMS_SUCCESS, payload: response.data.data });
      })
      .catch(err => {
        console.log("GETTING GROUPS ERR => ", err);
        dispatch({ type: GETTING_ITEMS_FAILED, payload: err });
      });
}

/*
 * Add an item to the database for a specified group.
 * @param id - Group ID
 */
export const addItem = (item) => dispatch => {
  dispatch({ type: ADDING_ITEM_START });

  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/item`;

  const options = {
    headers: {
      Authorization: token
    }
  };

  // Add items to the server and then get the items to update state
  axios.post(endpoint, item, options)
      .then(() => {
        getItems(item.groupID)(dispatch)
      })
      .then(response => {
        dispatch({ type: ADDING_ITEM_SUCCESS, payload: response.data.data });
      })
      .catch(err => {
        console.log("ADDING ITEM ERR => ", err);
        dispatch({ type: ADDING_ITEM_FAILED, payload: err });
      });
}

/*
 * Update items array with purchased
 */
export const updateItemPurchesd = (id) => dispatch => {
  dispatch({ type: UPDATE_ITEM_PURCHASED_START, payload: id });
}

export const submitPaidItems = (items, userID, total) => dispatch => {
  dispatch({ type: SUBMIT_PAID_ITEMS_START });

  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/grouphistory/`;

  const options = {
    headers: {
      Authorization: token
    }
  };

  items.forEach(itm => {
    const itemEndpoint = `${backendURL}/api/item/${itm.id}`
    const history = {
      "userID": userID,
      "groupID": itm.groupID,
      "itemID": itm.id,
      "total": total,
      "purchasedOn": new Date()
    }

    const item = {
      purchased: true,
      purchasedBy: userID,
      purchasedOn: new Date()
  }

    axios.post(endpoint, history, options)
        .then(res => {
          axios.put(itemEndpoint, item, options)
              .then(res1 => {
                dispatch({ type: SUBMIT_PAID_ITEMS_SUCCESS });
              })
              .catch(errr => {
                console.log("ADDING ITEM ERR => ", errr);
                dispatch({ type: SUBMIT_PAID_ITEMS_FAILED, payload: errr });
              })

        })
        .catch( err => {
          console.log("ADDING HISTORY ERR => ", err);
          dispatch({ type: SUBMIT_PAID_ITEMS_FAILED, payload: err });
        })
  })

}