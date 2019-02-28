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
export const FETCHING_SINGLE_GROUP = 'FETCHING_SINGLE_GROUP';
export const SINGLE_GROUP_FETCHED = 'SINGLE_GROUP_FETCHED';
export const CLEARING_CURRENT_GROUP = 'CLEARING_CURRENT_GROUP';
export const ADD_ITEM_START = 'ADD_ITEM_START';
export const ADD_ITEM_SUCCESS = 'ADD_ITEM_SUCCESS';
export const ADD_ITEM_FAILED = 'ADD_ITEM_FAILED';
export const UPDATE_ITEM_PURCHASED_START = 'UPDATE_ITEM_PURCHASED_START';
export const SUBMIT_PAID_ITEMS_START = 'SUBMIT_PAID_ITEMS_START';
export const SUBMIT_PAID_ITEMS_SUCCESS = 'SUBMIT_PAID_ITEMS_SUCCESS';
export const SUBMIT_PAID_ITEMS_FAILED = 'SUBMIT_PAID_ITEMS_FAILED';
export const USER_ADDED_TO_STATE = 'USER_ADDED_TO_STATE';
export const PURCHASING_ITEM = 'PURCHASING_ITEM';
export const ITEM_PURCHASED = 'ITEM_PURCHASED';
export const FETCHING_GROUP_USERS = 'FETCHING_GROUP_USERS';
export const USER_GROUPS_FETCHED = 'USER_GROUPS_FETCHED';
export const FETCHING_USER_PROFILE = 'FETCHING_USER_PROFILE';
export const USER_PROFILE_FETCHED = 'USER_PROFILE_FETCHED';
export const GROUP_TOTAL_SUMMED = 'GROUP_TOTAL_SUMMED';
export const MARK_ITEM = 'MARK_ITEM';
export const UNMARK_ITEM = 'UNMARK_ITEM';

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
export const checkEmail = () => {
  let token = localStorage.getItem('jwt');
  // console.log('token', token);
  let options = {
    headers: {
      Authorization: `Bearer ${token}`, // we can extract the email from the token instead of explicitly sending it in req.body
    }
  }

  const fetchUserId = axios.get(`${backendURL}/api/user/check/getid`, options);

    return (dispatch) => {
      dispatch({type: CHECKING_EMAIL});

    fetchUserId.then(res => {
      dispatch({type: EMAIL_CHECKED, payload: res.data});

    }).catch(err => {
      console.log(err);
      dispatch({type: ERROR})
    })
  }
}

export const addUserToState = (userID) => {

  const token = localStorage.getItem('jwt');
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }

  const fetchUserProfile = axios.get(`${backendURL}/api/user/${userID}`, options);

  return dispatch => {
    dispatch({type: ADDING_USER_TO_STATE})
    fetchUserProfile.then(res => {
      dispatch({type: USER_ADDED_TO_STATE, payload: res.data})
    }).catch(err => {
      console.log(err);
      dispatch({type: ERROR})
    })
  }
  
}

export const addGroup = (groupName) => dispatch => {
  const userID = localStorage.getItem('userId');
  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/group`;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  let group = {
    userID: Number(userID),
    name: groupName,
  }

  console.log('\n GROUP\n', group);

  axios.post(endpoint, group, options)
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
      Authorization: `Bearer ${token}`,
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
      Authorization: `Bearer ${token}`,
    }
  };

  axios.get(endpoint, options)
      .then(response => {
        dispatch({ type: GETTING_ITEMS_SUCCESS, payload: response.data.data });
      })
      .catch(err => {
        console.log("GETTING ITEMS ERR => ", err);
        dispatch({ type: GETTING_ITEMS_FAILED, payload: err });
      });
}

export const getSingleGroup = (groupId) => {
  let token = localStorage.getItem('jwt');

  let options = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }

  const fetchGroup = axios.get(`${backendURL}/api/group/${groupId}`, options)

  return dispatch => {
    dispatch({type: FETCHING_SINGLE_GROUP});

    fetchGroup.then(res => {
      dispatch({type: SINGLE_GROUP_FETCHED, payload: res.data});
    }).catch(err => {
      console.log(err);
      dispatch({type: ERROR})
    })
  }
}

export const clearCurrentGroup = () => {
  return dispatch => {
    dispatch({type: CLEARING_CURRENT_GROUP});
  }
}

/*
 * Add an item to the database for a specified group.
 * @param id - Group ID
 */
export const addItem = (item) => dispatch => {
  dispatch({ type: ADD_ITEM_START });

  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/item`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };
  // Add items to the server and then get the items to update state
  axios.post(endpoint, item, options)
      .then(response => {
        dispatch({ type: ADD_ITEM_SUCCESS});
      })
      .catch(err => {
        console.log("ADDING ITEM ERR => ", err);
        dispatch({ type: ADD_ITEM_FAILED, payload: err });
      });
}

/*
 * Update items array with purchased
 * @param id - ID of the item
 */
export const updateItemPurchased = (id) => dispatch => {
  dispatch({ type: UPDATE_ITEM_PURCHASED_START, payload: id });
}

/*
 * Add paid items to the database and update items purchase/purchasedBy params
 * @param items - Array of items to submit
 * @param userID - ID of the user who purchased the items
 * @param total - Total amount the user paid for all items
 */
export const submitPaidItems = (items, userID, total) => dispatch => {
  dispatch({ type: SUBMIT_PAID_ITEMS_START });

  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/grouphistory/`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // Loop through each item and send it to groupHistory DB and update the item in the items DB
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

    // Add a new item history
    axios.post(endpoint, history, options)
        .then(res => {
          // Update the item
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

export const purchaseItem = (item, itemId) => {
  // update the item as purchased with the value and who purchased it
  let token = localStorage.getItem('jwt');
  let options = {
    headers: {
    Authorization: `Bearer ${token}`
  }
}

  const updateItem = axios.put(`${backendURL}/api/item/${itemId}`, item, options);

  return dispatch => {
    dispatch({type: PURCHASING_ITEM})

  updateItem.then((res) => {
    console.log('item id', res.data);
    dispatch({type: ITEM_PURCHASED})
  }).catch(err => {
    console.log(err);
    dispatch({type: ERROR});
  })
  }
}

export const getGroupUsers = (groupId) => {
    let token = localStorage.getItem('jwt');
    let options = {
      headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const fetchGroupUsers = axios.get(`${backendURL}/api/groupmember/group/${groupId}`, options);

  return dispatch => {
    dispatch({type: FETCHING_GROUP_USERS});

    fetchGroupUsers.then(res => {
      dispatch({type: USER_GROUPS_FETCHED, payload: res.data})
    })
  }
}

export const getUserProfile = userId => {
  let token = localStorage.getItem('jwt');
    let options = {
      headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const fetchGroupProfile = axios.get(`${backendURL}/api/user/${userId}`, options);

  return dispatch => {
    dispatch({type: FETCHING_USER_PROFILE});

    fetchGroupProfile.then(res => {
      dispatch({type: USER_PROFILE_FETCHED, payload: res.data});
    })
  }
}

export const markItemForPurchase = item => {
  console.log(item);
  item.purchased = true;
  item.purchasedBy = Number(localStorage.getItem('userId'));
return dispatch => {
  dispatch({type: MARK_ITEM, payload: item})
}
}

export const unMarkItem = item => {
  item.purchased = false;
  item.purchasedBy = null;

  return dispatch => {
    dispatch({type: UNMARK_ITEM, payload: item})
  }
}