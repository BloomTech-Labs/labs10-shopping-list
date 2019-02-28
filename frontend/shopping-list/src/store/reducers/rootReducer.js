import {
  ADDING_GROUPS_TO_STATE,
  ADDING_GROUPS_TO_STATE_FAILED,
  ADDING_USER_TO_STATE,
  GETTING_ITEMS,
  GETTING_ITEMS_SUCCESS,
  GETTING_ITEMS_FAILED,
  FETCHING_SINGLE_GROUP,
  SINGLE_GROUP_FETCHED,
  CLEARING_CURRENT_GROUP,
  UPDATE_ITEM_PURCHASED_START,
  USER_ADDED_TO_STATE,
  PURCHASING_ITEM,
  ITEM_PURCHASED,
  USER_GROUPS_FETCHED,
  USER_PROFILE_FETCHED,
  ADD_ITEM_START,
  ADD_ITEM_SUCCESS,
  MARK_ITEM,
  UNMARK_ITEM,
  START_MARK,


  GET_CURRENT_USER,
  SAVE_CURRENT_USER,

  GET_USER_GROUPS,
  SAVE_USER_GROUPS,
} from "../actions";

const initialState = {
  currentUser: null,
  userGroups: null,


  
  currentGroup: null,
  groups: null,
  items: null,
  emailChecked: false,
  groupUsers: null,
  groupUserProfiles: null,
  groupTotal: null,
  needsNewItems: false,
  userTotal: null,
  markedItems: null,
  needsRefresh: false,
  itemPurchasedText: null,
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CURRENT_USER:
      return state;

    case SAVE_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload
      }

    case GET_USER_GROUPS:
      return state;

    case SAVE_USER_GROUPS:
      return {
        ...state,
        userGroups: action.payload
      }

    case ADDING_GROUPS_TO_STATE:
      return {
        ...state,
        groups: action.payload
      }
    case ADDING_GROUPS_TO_STATE_FAILED:
      return state;

    case ADD_ITEM_START:
      return {
        ...state,
        needsNewItems: false
      }

    case ADD_ITEM_SUCCESS:
      return{
        ...state,
        needsNewItems: true,
      }

    case GETTING_ITEMS:
      return {
        ...state,
        needsNewItems: false
      }

    case GETTING_ITEMS_SUCCESS:
      console.log('reducer items', action.payload);
      let groupTotal = 0;
      let items = action.payload;
      if(items){
          for(let i = 0; i < items.length; i++){
            groupTotal += items[i].price;
          }
        }
      return { 
        ...state, 
        items: action.payload, 
        groupTotal: groupTotal,
        needsNewItems: false
      }

    case GETTING_ITEMS_FAILED:
      return { ...state, items: null, purchaseDone: false };

      // Purchasing Items
    case UPDATE_ITEM_PURCHASED_START:
      let itms = state.items.map(itm => {
        if (itm.id === action.payload) {
          itm.purchased = !itm.purchased
        }

        return itm;
      })
      return { ...state, items: itms}

    case FETCHING_SINGLE_GROUP:
      return {
        ...state,
      }

    case SINGLE_GROUP_FETCHED:
      return {
        ...state,
        currentGroup: action.payload,
      }

    case CLEARING_CURRENT_GROUP:
      return {
        ...state,
        currentGroup: null,
      }

    case USER_GROUPS_FETCHED:
      return{
        ...state,
        groupUsers: action.payload,
      }

    case USER_PROFILE_FETCHED:
      let profileArray = [];
      profileArray.push(action.payload);
      return {
        ...state,
        groupUserProfiles: profileArray,
      }

    case PURCHASING_ITEM:
      return {
        ...state,
      }

    case ITEM_PURCHASED:
      return {
        ...state,
        needsNewItems: true,
      }

    case START_MARK:
      return {
        ...state,
        needsRefresh: true,
      }

    case MARK_ITEM:
      let itemArray = [];
      if(state.markedItems){
        itemArray = state.markedItems;
      }

      itemArray.push(action.payload);
      console.log(itemArray);
      return {
        ...state,
        markedItems: itemArray,
        needsRefresh: false,
        }

    case UNMARK_ITEM:
        let newArray = [];
        if(state.markedItems){
          newArray = state.markedItems;
          newArray = newArray.filter(item => item.id !== action.payload.id);
        } 
        return {
          ...state,
          markedItems: newArray,
          needsRefresh: false,
        }

    default:
      return state;
  }
};