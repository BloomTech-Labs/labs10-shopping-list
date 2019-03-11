import axios from 'axios';
import moment from 'moment';

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
export const START_MARK = 'START_MARK';
export const GET_GROUPMEMBERS_START = 'GET_GROUPMEMBERS_START';
export const CHANGE_GROUP_NAME_START = 'CHANGE_GROUP_NAME_START';
export const CHANGE_GROUP_NAME_SUCCESS = 'CHANGE_GROUP_NAME_SUCCESS';
export const REMOVE_GROUP_START = 'REMOVE_GROUP_START';
export const REMOVE_GROUP_SUCCESS = 'REMOVE_GROUP_SUCCESS';


export const GEN_GROUP_INVITE = 'GEN_GROUP_INVITE';
export const SAVE_GROUP_INVITE = 'SAVE_GROUP_INVITE';

export const GET_CURRENT_USER = 'GET_CURRENT_USER';
export const SAVE_CURRENT_USER = 'SAVE_CURRENT_USER';

export const GET_USER_GROUPS = 'GET_USER_GROUPS';
export const SAVE_USER_GROUPS = 'SAVE_USER_GROUPS';

export const CREATING_GROUP = 'CREATING_GROUP';
export const GROUP_CREATED = 'GROUP_CREATED';

export const GET_GROUP_ITEMS = 'GET_GROUP_ITEMS';
export const SAVE_GROUP_ITEMS = 'SAVE_GROUP_ITEMS';

export const CREATE_ITEM = 'CREATE_ITEM';
export const ITEM_CREATED = 'ITEM_CREATED';

export const UPDATE_ITEM = 'UPDATE_ITEM';
export const ITEM_UPDATED = 'ITEM_UPDATED';

export const DELETE_ITEM = 'DELETE_ITEM';
export const ITEM_DELETED = 'ITEM_DELETED';

export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

export const BEGIN_CHECK_OUT = 'BEGIN_CHECK_OUT';
export const CHECK_OUT_COMPLETE = 'CHECK_OUT_COMPLETE';

export const GET_GROUP_HISTORY = 'GET_GROUP_HISTORY';
export const SAVE_GROUP_HISTORY = 'SAVE_GROUP_HISTORY';

export const GET_GROUP_USERS = 'GET_GROUP_USERS';
export const SAVE_GROUP_USERS = 'SAVE_GROUP_USERS';

export const GET_USER_PROFILE = 'GET_USER_PROFILE';
export const SAVE_USER_PROFILE = 'SAVE_USER_PROFILE';

export const CLEAR_ITEMS = 'CLEAR_ITEMS';
export const CLEAR_GROUP_USERS = 'CLEAR_GROUP_USERS';

export const GET_GROUP_HISTORY_LIST = 'GET_GROUP_HISTORY_LIST';
export const SAVE_GROUP_HISTORY_LIST = 'SAVE_GROUP_HISTORY_LIST';

export const GET_INVITE_INFO = 'GET_INVITE_INFO';
export const SAVE_INVITE_INFO = 'SAVE_INVITE_INFO';

export const ACCEPTING_INVITE = 'ACCEPTING_INVITE';
export const INVITE_ACCEPTED = 'INVITE_ACCEPTED';

export const SAVE_USERNAME = 'SAVE_USERNAME';
export const SAVE_PROFILEPIC = 'SAVE_PROFILEPIC';
export const REMOVE_ACCOUNT = 'REMOVE_ACCOUNT';

let backendURL;
if(process.env.NODE_ENV === 'development'){
  backendURL = `http://localhost:9000`
} else {
  backendURL = `https://shoptrak-backend.herokuapp.com`
}

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
      dispatch({type: EMAIL_CHECKED, payload: res.data.profile});
      localStorage.setItem('userId', res.data.id);

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
        console.log(response.data.data);
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
export const addItem = (item) => {
  const token = localStorage.getItem('jwt');
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  console.log("ITEM => ", item);

  const endpoint = axios.post(`${backendURL}/api/item`, item, options);

  return dispatch => {
    dispatch({type: CREATE_ITEM})

    endpoint.then(res => {
      console.log(res.data, 'new item');

      dispatch({type: ITEM_CREATED})
    })
        .catch(err => {
      console.log(err);
      dispatch({type: ERROR})
    })
  }
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
  dispatch({type: SUBMIT_PAID_ITEMS_START});

  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/grouphistory/`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
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
                dispatch({type: SUBMIT_PAID_ITEMS_SUCCESS});
              })
              .catch(errr => {
                console.log("ADDING ITEM ERR => ", errr);
                dispatch({type: SUBMIT_PAID_ITEMS_FAILED, payload: errr});
              })

        })
        .catch(err => {
          console.log("ADDING HISTORY ERR => ", err);
          dispatch({type: SUBMIT_PAID_ITEMS_FAILED, payload: err});
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
    dispatch({type: GET_GROUP_USERS});

    fetchGroupUsers.then(res => {
      dispatch({type: SAVE_GROUP_USERS, payload: res.data})
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
    dispatch({type: GET_USER_PROFILE});

    fetchGroupProfile.then(res => {
      dispatch({type: SAVE_USER_PROFILE, payload: res.data});
    })
  }
}

export const getCurrentUser = () => {
  let token = localStorage.getItem('jwt');
    let options = {
      headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const endpoint = axios.get(`${backendURL}/api/user/check/email`, options);

  return dispatch => {
    dispatch({type: GET_CURRENT_USER});

    endpoint.then(res => {
      console.log(res.data, 'RES')
      dispatch({type: SAVE_CURRENT_USER, payload: res.data.profile});
    }).catch(err => {
      console.log(err);
      dispatch({type: ERROR})
    })
  }
}


export const generateGroupInviteUrl = (userId, groupId) => {
  let token = localStorage.getItem('jwt');
  let options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  let data = {
    userID: userId,
    groupID: groupId,
    invitee: 'default@dummy.com'
  }
  const endpoint = axios.post(`${backendURL}/api/invite/create`, data, options);
  let frontendURL;

  if(process.env.NODE_ENV === 'development'){
    frontendURL = 'localhost:3000'
  } else {
    frontendURL = 'https://labs10-shopping-list.netlify.com'
  }
  return dispatch => {
    dispatch({type: GEN_GROUP_INVITE})
    endpoint.then(res => {
      dispatch({type: SAVE_GROUP_INVITE, payload: {groupId: data.groupID, inviteUrl: `${frontendURL}/invite?${res.data.inviteCode}`} })
    }).catch(err => {
      console.log(err);
      dispatch({type: ERROR})
    })
  }
}

export const getUserGroups = (userId) => {
  console.log('backendURL', backendURL);
  let token = localStorage.getItem('jwt');
    let options = {
      headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const endpoint = axios.get(`${backendURL}/api/group/user/${userId}`, options);
  
  return dispatch => {
    dispatch({type: GET_USER_GROUPS})

    endpoint.then(res => {
      console.log('get groups', res.data);
      dispatch({type: SAVE_USER_GROUPS, payload: res.data.groups})
    }).catch(err => {
      console.log(err);
      dispatch({type: ERROR})
    })

  }
}

export const createGroup = (groupName, userId) => {
  let token = localStorage.getItem('jwt');
  let options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  let group = {
    name: groupName,
    userID: userId
  }

  const endpoint = axios.post(`${backendURL}/api/group`, group, options);
  return dispatch => {
    dispatch({type: CREATING_GROUP})

    endpoint.then(res => {
      dispatch({type: GROUP_CREATED})
      console.log(res.data);
  }).then(() => {
      getUserGroups(Number(localStorage.getItem('userId')))(dispatch)
    }).catch(err => {
    console.log(err);
    dispatch({type: ERROR})
  })
}
}

export const getGroupItems = (groupId) => {
  let token = localStorage.getItem('jwt');
  let options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  console.log("GETTING GROUP ITEMS => ", groupId);

  const endpoint = axios.get(`${backendURL}/api/item/group/${groupId}`, options);

  return dispatch => {
    dispatch({type: GET_GROUP_ITEMS})
    endpoint.then(res => {
      console.log("GETTING GROUP ITEMS DATA => ", res.data);
      dispatch({type: SAVE_GROUP_ITEMS, payload: res.data});
    })
  }
}

export const updateItem = item => {
  let token = localStorage.getItem('jwt');
  let options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const endpoint = axios.put(`${backendURL}/api/item/${item.id}`, item, options);

  return dispatch => {
    dispatch({type: UPDATE_ITEM});

    endpoint.then(res => {
      dispatch({type: ITEM_UPDATED});
    }).catch(err => {
      console.log(err);
      dispatch({type: ERROR})
    })
  }
}

export const deleteItem = item => {
  let token = localStorage.getItem('jwt');
  let options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  let itemId = item.id;

  const endpoint = axios.delete(`${backendURL}/api/item/${itemId}`, options);

  return dispatch => {
    dispatch({type: DELETE_ITEM})
    endpoint.then(res => {
      dispatch({type: ITEM_DELETED})
    }).catch(err => {
      console.log(err);
      dispatch({type: ERROR})
    })
  }
}

export const addToCart = item => {
  return dispatch => {
    dispatch({type: ADD_TO_CART, payload: item})
  }
}

export const removeFromCart = item => {
  return dispatch => {
    dispatch({type: REMOVE_FROM_CART, payload: item})
  }
}

export const checkOut = info => {
  let token = localStorage.getItem('jwt');
  let options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  let itemIds = [];
  for(let i = 0; i < info.cartItems.length; i++){
    itemIds.push(info.cartItems[i].id);
  }

  // itemIds = itemIds.toString(',');
  console.log(itemIds, 'itemIds');

  let trip = {
    userID: Number(info.userId),
    groupID: Number(info.groupId),
    itemID: Number(itemIds[0]),
    total: Number(info.amount),
    purchasedOn: moment().format(),
  }


  let items = info.cartItems;
  for(let i = 0; i < items.length; i++){
    items[i].purchased = 1;
    items[i].purchasedBy = Number(info.userId);
    items[i].purchasedOn = moment().format();
    
    // console.log('items[i]', items[i]);
    axios.put(`${backendURL}/api/item/${items[i].id}`, items[i], options).then(res => {
      console.log('res update item loop', res.data);
    })
  }

  console.log(trip, 'trip');
  // const updateItems = axiot.put(`${backendURL}/api/item/${itemId}`, changes, options);
  
  const endpoint = axios.post(`${backendURL}/api/grouphistory`, trip, options);
  
  return dispatch => {
    dispatch({type: BEGIN_CHECK_OUT, payload: info.cartItems});
    endpoint.then(res => {
      console.log(res);
      dispatch({type: CHECK_OUT_COMPLETE});
    })
  }
}

export const getGroupHistory = groupId => {
  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/grouphistory/total/group/${groupId}`;
  console.log('GET HISTORY')
  const options = {
      headers: {
          Authorization: `Bearer ${token}`
      }
  };
  return dispatch => {
    dispatch({type: GET_GROUP_HISTORY});
  
    axios.get(endpoint, options).then(res => {
        console.log('history', res.data);
        dispatch({type: SAVE_GROUP_HISTORY, payload: res.data})
    }).catch(err => {
      console.log(err);
      dispatch({type: ERROR})
    })
  }
}

export const getGroupHistoryList = groupId => {
  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/grouphistory/group/${groupId}`;
  console.log('GET HISTORY')
  const options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return dispatch => {
    dispatch({type: GET_GROUP_HISTORY_LIST});

    axios.get(endpoint, options).then(res => {
      console.log('history', res.data);
      dispatch({type: SAVE_GROUP_HISTORY_LIST, payload: res.data})
    }).catch(err => {
      console.log(err);
      dispatch({type: ERROR})
    })
  }
}

export const getGroupMembers = (groupID) => dispatch => {
  dispatch({type: GET_GROUPMEMBERS_START});
}

export const updateGroupName = (groupID, changes) => dispatch => {
  dispatch({type: CHANGE_GROUP_NAME_START});

  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/group/${groupID}`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  axios.put(endpoint, changes, options).then(res => {
    console.log("RES => ", res);
    dispatch({ type: CHANGE_GROUP_NAME_SUCCESS});
  }).then(() => {
    getUserGroups(Number(localStorage.getItem('userId')))(dispatch)
  }).catch(err => {
    console.log("ERR => ", err);
  })
}

export const removeGroup = (groupID, userID) => dispatch => {
  dispatch({type: REMOVE_GROUP_START});

  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/group/remove/${groupID}/${userID}`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  axios.delete(endpoint, options).then(res => {
    console.log("RES => ", res);
    dispatch({ type: REMOVE_GROUP_SUCCESS});
  }).then(() => {
    getUserGroups(Number(localStorage.getItem('userId')))(dispatch)
  }).catch(err => {
    console.log("ERR => ", err);
  })
}

export const clearItems = () => {
  return dispatch => {
    dispatch({type: CLEAR_ITEMS});
  }
}

export const clearGroupUsers = () => {
  return dispatch => {
    dispatch({type: CLEAR_GROUP_USERS});
  }
}

export const getInviteInfo = inviteCode => {
  let token = localStorage.getItem('jwt');
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };


  const endpoint = axios.get(`${backendURL}/api/invite/${inviteCode}`, options);

  return dispatch => {
    dispatch({type: GET_INVITE_INFO});

    endpoint.then(response => {
      dispatch({type: SAVE_INVITE_INFO, payload: response.data});
    })
  }
}

export const acceptInvite = inviteCode => {
  let token = localStorage.getItem('jwt');
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  let body = {
    inviteCode: inviteCode,
  }

  const endpoint = axios.post(`${backendURL}/api/invite/join`, body, options);

  return dispatch => {
    dispatch({type: ACCEPTING_INVITE});

    endpoint.then(response => {
      console.log('invite response', response);
      dispatch({type: INVITE_ACCEPTED});
    })
  }
}

export const saveUsername = (username) => {

  const token = localStorage.getItem('jwt');
  const userID = localStorage.getItem("userId");
  const endpoint = `${backendURL}/api/user/${userID}`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  const changes = {
    name: username
  }

  return dispatch => {
    axios.put(endpoint, changes, options).then(res => {
      console.log("RES => ", res);
      dispatch({ type: SAVE_USERNAME, payload: username});
    }).then(() => {
      checkEmail()(dispatch)
    }).catch(err => {
      console.log("ERR => ", err);
    })
  }
}

export const saveProfilePic = (profilePic) => {

  const token = localStorage.getItem('jwt');
  const userID = localStorage.getItem("userId");
  const endpoint = `${backendURL}/api/user/${userID}`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  const changes = {
    profilePicture: profilePic
  }

  return dispatch => {
    axios.put(endpoint, changes, options).then(res => {
      console.log("RES => ", res);
      dispatch({ type: SAVE_PROFILEPIC, payload: profilePic});
    }).then(() => {
      checkEmail()(dispatch)
    }).catch(err => {
      console.log("ERR => ", err);
    })
  }
}

export const removeAccount = () => {

  const token = localStorage.getItem('jwt');
  const userID = localStorage.getItem("userId");
  const endpoint = `${backendURL}/api/user/${userID}`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  return dispatch => {
    axios.delete(endpoint, options).then(res => {
      console.log("RES => ", res);
      localStorage.removeItem('jwt');
      localStorage.removeItem('email');
      localStorage.removeItem('name');
      localStorage.removeItem('img_url');
      localStorage.setItem('isLoggedIn', false);
      dispatch({ type: REMOVE_ACCOUNT});
    }).catch(err => {
      console.log("ERR => ", err);
    })
  }
}