import axios from 'axios';
import moment from 'moment';

// USER
export const CHECKING_EMAIL = 'CHECKING_EMAIL';
export const EMAIL_CHECKED = 'EMAIL_CHECKED';
export const GET_CURRENT_USER = 'GET_CURRENT_USER';
export const SAVE_CURRENT_USER = 'SAVE_CURRENT_USER';
export const GET_USER_PROFILE = 'GET_USER_PROFILE';
export const SAVE_USER_PROFILE = 'SAVE_USER_PROFILE';
export const SAVE_USERNAME = 'SAVE_USERNAME';
export const SAVE_PROFILEPIC = 'SAVE_PROFILEPIC';
export const REMOVE_ACCOUNT = 'REMOVE_ACCOUNT';

// GROUP
export const FETCHING_SINGLE_GROUP = 'FETCHING_SINGLE_GROUP';
export const SINGLE_GROUP_FETCHED = 'SINGLE_GROUP_FETCHED';
export const GET_USER_GROUPS = 'GET_USER_GROUPS';
export const SAVE_USER_GROUPS = 'SAVE_USER_GROUPS';
export const CREATING_GROUP = 'CREATING_GROUP';
export const GROUP_CREATED = 'GROUP_CREATED';
export const CHANGE_GROUP_NAME_START = 'CHANGE_GROUP_NAME_START';
export const CHANGE_GROUP_NAME_SUCCESS = 'CHANGE_GROUP_NAME_SUCCESS';
export const REMOVE_GROUP_START = 'REMOVE_GROUP_START';
export const REMOVE_GROUP_SUCCESS = 'REMOVE_GROUP_SUCCESS';
export const CLEARING_CURRENT_GROUP = 'CLEARING_CURRENT_GROUP';

// GROUP PROFILE
export const GET_GROUP_USERS = 'GET_GROUP_USERS';
export const SAVE_GROUP_USERS = 'SAVE_GROUP_USERS';
export const GET_GROUP_HISTORY = 'GET_GROUP_HISTORY';
export const SAVE_GROUP_HISTORY = 'SAVE_GROUP_HISTORY';
export const GET_GROUP_HISTORY_LIST = 'GET_GROUP_HISTORY_LIST';
export const SAVE_GROUP_HISTORY_LIST = 'SAVE_GROUP_HISTORY_LIST';
export const CLEAR_GROUP_USERS = 'CLEAR_GROUP_USERS';
export const CLEAR_GROUP_HISTORY = 'CLEAR_GROUP_HISTORY';

// GROUP INVITE
export const GEN_GROUP_INVITE = 'GEN_GROUP_INVITE';
export const SAVE_GROUP_INVITE = 'SAVE_GROUP_INVITE';
export const GET_INVITE_INFO = 'GET_INVITE_INFO';
export const SAVE_INVITE_INFO = 'SAVE_INVITE_INFO';
export const ACCEPTING_INVITE = 'ACCEPTING_INVITE';
export const INVITE_ACCEPTED = 'INVITE_ACCEPTED';

// ITEM
export const GET_GROUP_ITEMS = 'GET_GROUP_ITEMS';
export const SAVE_GROUP_ITEMS = 'SAVE_GROUP_ITEMS';
export const CREATE_ITEM = 'CREATE_ITEM';
export const ITEM_CREATED = 'ITEM_CREATED';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const ITEM_UPDATED = 'ITEM_UPDATED';
export const DELETE_ITEM = 'DELETE_ITEM';
export const ITEM_DELETED = 'ITEM_DELETED';
export const CLEAR_ITEMS = 'CLEAR_ITEMS';

// PURCHASE ITEM
export const UPDATE_ITEM_PURCHASED_START = 'UPDATE_ITEM_PURCHASED_START';
export const SUBMIT_PAID_ITEMS_START = 'SUBMIT_PAID_ITEMS_START';
export const SUBMIT_PAID_ITEMS_SUCCESS = 'SUBMIT_PAID_ITEMS_SUCCESS';
export const SUBMIT_PAID_ITEMS_FAILED = 'SUBMIT_PAID_ITEMS_FAILED';
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const BEGIN_CHECK_OUT = 'BEGIN_CHECK_OUT';
export const CHECK_OUT_COMPLETE = 'CHECK_OUT_COMPLETE';

// MISC
export const ERROR = 'ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

export const UPDATE_NOTIFICATION = 'UPDATE_NOTIFICATION';
export const UPDATE_NOTIFICATION_SUCCESS = 'UPDATE_NOTIFICATION_SUCCESS';

// Defines URL for development and production/staging environments
let backendURL;
if(process.env.NODE_ENV === 'development'){
  backendURL = `http://localhost:9000`
} else {
  backendURL = `https://shoptrak-backend.herokuapp.com`
}

/*
 * USER ACTIONS
 * --------------------------------------------------------------------------------
 */
/**
 * takes in the user email from auth0 profile
 * sends email to server to obtain user ID
 * if no ID found, creates a new user record and returns the ID
 * once complete, calls the callback function, which in this
 * case is addUserToState in order to populate state completely
 * @returns {Function}
 */
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
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('jwt');
      localStorage.removeItem('img_url');
      localStorage.removeItem('userId');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('lsid');
      localStorage.removeItem('userId');
      dispatch({type: ERROR, payload: "Internal error parsing user. Try refreshing the page."})
    })
  }
}

/**
 * Returns and sets the current user to state
 * @returns {Function}
 */
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

/**
 * Returns the profile of the current user
 * @param userId - ID of the user to get the profile
 * @returns {Function}
 */
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

/**
 * Updates the current user's username/name
 * @param username - New name
 * @returns {Function}
 */
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

/**
 * Updates the current user's profile picture
 * @param profilePic - URL of the picture to update with
 * @returns {Function}
 */
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

/**
 * Removes the current user's account
 * @returns {Function}
 */
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
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('jwt');
      localStorage.removeItem('img_url');
      localStorage.removeItem('userId');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('lsid');
      localStorage.removeItem('userId');
      dispatch({ type: REMOVE_ACCOUNT});
    }).catch(err => {
      console.log("ERR => ", err);
    })
  }
}

/*
 * GROUP ACTIONS
 * --------------------------------------------------------------------------------
 */
/**
 * Get a single group from the group ID
 * @param groupId - ID of the group to be returned
 * @returns {Function}
 */
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

/**
 * Gather all the groups the user belongs to
 * @param userId - ID of the current user
 * @returns {Function}
 */
export const getUserGroups = (userId) => {
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
      dispatch({type: SAVE_USER_GROUPS, payload: res.data.groups})
    }).catch(err => {
      console.log(err);
      dispatch({type: ERROR})
    })

  }
}

/**
 * Creates a new group owned by the user.
 * @param groupName - Name of the group
 * @param userId - ID of the current user
 * @returns {Function}
 */
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
      getUserGroups(Number(localStorage.getItem('userId')))(dispatch)
    }).catch(err => {
      console.log(err);
      dispatch({type: ERROR, payload: err.response.data.warning})
    })
  }
}

/**
 * Updates the selected group's name
 * @param groupID - Group to update
 * @param changes - The changes of the group
 * @returns {Function}
 */
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

/**
 * Removes the selected group
 * @param groupID - Group to be removed
 * @param userID - ID of the user that is removing the group
 * @returns {Function}
 */
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

/**
 * Clears the current group
 * @returns {Function}
 */
export const clearCurrentGroup = () => {
  return dispatch => {
    dispatch({type: CLEARING_CURRENT_GROUP});
  }
}

/*
 * GROUP PROFILE ACTIONS
 * --------------------------------------------------------------------------------
 */
/**
 * Return the current group's members
 * @param groupId - ID of the group to return member's from
 * @returns {Function}
 */
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

/**
 * Return the expenditures of the current group
 * @param groupId - ID of the group to return member's expenditures from
 * @returns {Function}
 */
export const getGroupHistory = groupId => {
  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/grouphistory/total/group/${groupId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return dispatch => {
    dispatch({type: GET_GROUP_HISTORY});

    axios.get(endpoint, options).then(res => {
      dispatch({type: SAVE_GROUP_HISTORY, payload: res.data})
    }).catch(err => {
      console.log(err);
      dispatch({type: ERROR})
    })
  }
}

/**
 * Return the history log of the current group
 * @param groupId - ID of the group to return member's history logs from
 * @returns {Function}
 */
export const getGroupHistoryList = groupId => {
  const token = localStorage.getItem('jwt');
  const endpoint = `${backendURL}/api/grouphistory/group/${groupId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return dispatch => {
    dispatch({type: GET_GROUP_HISTORY_LIST});

    axios.get(endpoint, options).then(res => {
      dispatch({type: SAVE_GROUP_HISTORY_LIST, payload: res.data})
    }).catch(err => {
      console.log(err);
      dispatch({type: ERROR})
    })
  }
}

/**
 * Clears the current group's user
 * @returns {Function}
 */
export const clearGroupUsers = () => {
  return dispatch => {
    dispatch({type: CLEAR_GROUP_USERS});
  }
}

/**
 * Updates the user's notification preferences
 * @param id - ID of the group member to update
 * @param changes - Changes to be replacing the existing options
 * @returns {Function}
 */
export const updateGroupNotification = (id, changes) => {
  let token = localStorage.getItem('jwt');
  let options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const endpoint = axios.put(`${backendURL}/api/groupmember/update/${id}`, changes, options);

  return dispatch => {
    dispatch({type: UPDATE_NOTIFICATION})
    endpoint.then(res => {
      dispatch({type: UPDATE_NOTIFICATION_SUCCESS, payload: res.data.data})
    }).catch(err => {
      // console.log(err);
      dispatch({type: ERROR, payload: err.response.data.error.message})
    })
  }
}

/*
 * GROUP INVITE ACTIONS
 * --------------------------------------------------------------------------------
 */
/**
 * Generates a unique URL for inviting a new member to a group
 * @param userId - ID of the user to send to
 * @param groupId - ID of the group to be invited to
 * @returns {Function}
 */
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
      dispatch({type: ERROR, payload: err.response.data.warning})
    })
  }
}

/**
 * Get the invite information from the URL querie
 * @param inviteCode - Token to validate the invite
 * @returns {Function}
 */
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

/**
 * Accept the invite given by another member of a separate group
 * @param inviteCode - Token to validate the invite
 * @returns {Function}
 */
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

/*
 * ITEM ACTIONS
 * --------------------------------------------------------------------------------
 */
/**
 * Return the current group's items
 * @param groupId - ID of the group to return items from
 * @returns {Function}
 */
export const getGroupItems = (groupId) => {
  let token = localStorage.getItem('jwt');
  let options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const endpoint = axios.get(`${backendURL}/api/item/group/${groupId}`, options);

  return dispatch => {
    dispatch({type: GET_GROUP_ITEMS})
    endpoint.then(res => {
      dispatch({type: SAVE_GROUP_ITEMS, payload: res.data});
    })
  }
}

/**
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

/**
 * Update an existing item in a group
 * @param item - Item changes
 * @returns {Function}
 */
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

/**
 * Remove an existing item from a group
 * @param item - Item to be removed
 * @returns {Function}
 */
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

/**
 * Clear items from state
 * @returns {Function}
 */
export const clearItems = () => {
  return dispatch => {
    dispatch({type: CLEAR_ITEMS});
  }
}

/**
 * Clear group history from state
 * @returns {Function}
 */

 export const clearGroupHistory = () => {
   return dispatch => {
     dispatch({type: CLEAR_GROUP_HISTORY});
   }
 }

/*
 * PURCHASE ITEM ACTIONS
 * --------------------------------------------------------------------------------
 */
/**
 * Update items array with purchased
 * @param id - ID of the item
 */
export const updateItemPurchased = (id) => dispatch => {
  dispatch({ type: UPDATE_ITEM_PURCHASED_START, payload: id });
}

/**
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

/**
 * Add items to the user cart to be purchased
 * @param item - Item to be purchased
 * @returns {Function}
 */
export const addToCart = item => {
  return dispatch => {
    dispatch({type: ADD_TO_CART, payload: item})
  }
}

/**
 * Remove the item from the user cart
 * @param item - Item to be removed from cart
 * @returns {Function}
 */
export const removeFromCart = item => {
  return dispatch => {
    console.log("REMOVE FROM CART ===>", item);
    dispatch({type: REMOVE_FROM_CART, payload: item})
  }
}

/**
 * Purchase the selected items
 * @param info - Selected items
 * @returns {Function}
 */
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

/*
 * MISC ACTIONS
 * --------------------------------------------------------------------------------
 */
/**
 * Clears any errors that were previously set in state
 * @returns {Function}
 */
export const clearError = () => {
  return dispatch => {
    dispatch({ type: CLEAR_ERROR })
  }
}