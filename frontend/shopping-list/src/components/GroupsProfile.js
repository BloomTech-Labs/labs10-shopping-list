import React, { Component } from "react";
import {
  getGroupHistoryList,
  checkEmail,
  clearItems,
  clearGroupUsers,
  getUserProfile,
  getGroupUsers,
  getGroupHistory,
  getGroupItems,
  addItem,
  updateItemPurchased,
  submitPaidItems,
  generateGroupInviteUrl,
  getUserGroups,
  clearError,
  clearGroupHistory,
  updateGroupNotification,
} from "../store/actions/rootActions";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { connect } from "react-redux";
import "./Styles/Scrollbar.css";
import "./Styles/GroupProfile.css";
import {
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter
} from "mdbreact";
import ItemList from "./ItemList";
import GroupUserList from "./GroupUserList";
import UserCart from "./UserCart";
import HistoryList from "./HistoryList";
import GroupDataBar from './GroupDataBar';
import GroupDataDoughnut from './GroupDataDoughnut';

class GroupsProfile extends Component {
  state = {
    modal14: false,
    modal15: false,
    modal17: false,
    modal18: false,
    itemName: "",
    itemPrice: 0.0,
    itemQuantity: 1,
    itemMeasure: "",
    itemPurchased: false,
    total: 0.0,
    listToggle: true,
    histToggle: false,
    totalToggle: true,
    inviToggle: false,
    groupHistory: null,
    members: null,
    totals: null,
    invites: {
      [this.props.match.params.id]: ""
    },
    copied: false,
    weekly: false,
    monthly: false,
  };

  /**
   * Triggers before the component mounts.
   * Retrieve a list of items from state
   * @returns {*}
   */
  componentWillMount() {
      // Gather current group items
    if (!this.props.groupItems) {
      this.props.getGroupItems(this.props.match.params.id);
    }

    // Gather current group expenditures
    if (!this.props.groupHistory) {
      this.props.getGroupHistory(this.props.match.params.id);
    }

    this.props.getGroupHistoryList(this.props.match.params.id);

    // Gather current group user's
    if (!this.props.groupUsers) {
      this.props.getGroupUsers(this.props.match.params.id);
    }

    if (!this.props.userGroups) {
      this.props.getUserGroups(localStorage.getItem("userId"));
    }

    if (this.props.userGroups !== null) {
      const group = this.props.userGroups.filter(grp => grp.id === Number(this.props.match.params.id));
      document.title = `${group[0].name} - Group`;
    }
  }

  /**
   * TODO: This is depreciated lifecycle in React, find a way to update this to later versions
   * Triggers when any change happens to props values
   * @returns {*}
   */
  componentWillReceiveProps = newProps => {
      // If we need new items, gather new items
    if (newProps.needsNewItems) {
      this.props.getGroupItems(this.props.match.params.id);
      this.props.getGroupHistory(this.props.match.params.id);
    }

    // If an item has been purchased, gather new totals
    if (newProps.needsNewHistory) {
      this.props.getGroupHistory(this.props.match.params.id);
    }

    // If an item has been purchased, gather new history data
    if (newProps.needsNewHistoryList) {
      this.props.getGroupHistoryList(this.props.match.params.id);
    }

    // if current user has been update, gather new user
    if (!newProps.currentUser) {
      this.props.checkEmail();
    }
  };

  componentDidMount() {
    if (this.props.userGroups !== null) {
      const group = this.props.userGroups.filter(grp => grp.id === Number(this.props.match.params.id));
      document.title = `${group[0].name} - Group`;
    }

  }

  /**
   * Clear any listeners and unnecessary data
   * @returns {*}
   */
  componentWillUnmount() {
    this.props.clearItems();
    this.props.clearGroupUsers();
    this.props.clearGroupHistory();
  }

  /**
   * Retrieve the group history and save to component state
   * @returns {*}
   */
  getGroupHistory = groupId => {
    this.props.getGroupHistory(groupId);
  };

  /**
   * Toggles the models
   * @param nr - The modal number to toggle
   * @returns {*}
   */
  toggle = nr => () => {
    let modalNumber = "modal" + nr;
    this.setState({
      [modalNumber]: !this.state[modalNumber]
    });
  };

  /**
   * Checks the item checkbox on the list
   * @param e - Event
   * @returns {*}
   */
  check = e => {
    // Filter the item so we can check if the item has already been purchased.
    const item = this.props.items.filter(itm => itm.id === e);

    // Only check to box if the item hasn't been purchased
    if (item[0].purchasedBy === null) {
      this.props.updateItemPurchased(e);
    }
  };

  /**
   * Hides the History component and displays the List component
   * @returns {*}
   */
  toggleListClass = () => {
    this.props.getGroupHistory(this.props.match.params.id);
    this.setState({ histToggle: false, listToggle: true });
  };

  /**
   * Hides the List component and displays the History component
   * @returns {*}
   */
  toggleHistClass = () => {
    this.setState({ histToggle: true, listToggle: false });
  };

  /**
   * Generates a group invite link
   * @returns {*}
   */
  toggleInviClass = () => {
    this.props.generateGroupInviteUrl(
        localStorage.getItem("userId"),
        this.props.match.params.id
    );
    if (this.props.currentUser.subscriptionType === 1 && this.props.groupUsers.length >= 2) {
      this.setState({modal17: true})
    } else {
      this.setState({ modal15: true });

    }

  };

  /**
   * TODO: This may be depreciated depending on if we follow the Basalmiq or not
   * Toggles between total and net view
   * @returns {*}
   */
  toggleTotal = () => {
    this.setState({ totalToggle: !this.state.totalToggle });
  };

  handleClearError = () => {
    this.props.clearError();
  };

  handleUpdateNotif = (e, bol, id, type) => {
    e.preventDefault();

    const bl = bol;

    let changes = null;

    if (type === "week") {
      changes = {
        weeklyNotification: bl
      }
    } else {
      changes = {
        monthlyNotification: bl
      }
    }

    this.props.updateGroupNotification(id, changes);
    this.props.getGroupUsers(this.props.match.params.id);
  }

    /**
     * TODO Create a loading component that can render during data queries
     * @returns {*}
     */
  render() {
      const user = localStorage.getItem("userId");
    return (
      <div className={"group-profile-container"}>
        {
          user === null ? <div className="user-notlogged user-notlogged-groups-pf">
            <h1>You must be logged in to view this page</h1>
          </div> :
              <div>
                <div className={"group-profile-header"}>
                  {
                    /*
                     * Buttons to display List, History, Invite Members and toggle Total/Net
                     */
                  }
                  <MDBBtn
                      className={this.state.listToggle ? "btn-outline-dark-green" : "btn-dark-green"}
                      onClick={() => {
                        this.toggleListClass();
                      }}
                  >
                    List
                  </MDBBtn>
                  <MDBBtn
                      className={this.state.histToggle ? "btn-outline-dark-green" : "btn-dark-green"}
                      onClick={() => {
                        this.toggleHistClass();
                      }}
                  >
                    History
                  </MDBBtn>
                  <MDBBtn
                      className="btn-dark-green"
                      onClick={() => {
                        this.toggleInviClass();
                      }}
                  >
                    Invite Member
                  </MDBBtn>
                  <MDBBtn
                      className={"btn-dark-green"}
                      onClick={this.toggle(18)}
                  >
                    Notification Settings
                  </MDBBtn>
                </div>

                <div className="group-profile-columns">
                {
                  /*
                   * Left column that displays List and History Components
                   */
                }
                <div className="group-profile-left">
                  {this.state.listToggle ? (
                      <ItemList items={this.props.groupItems} group={this.props.userGroups} />
                  ) : null}

                  {this.state.histToggle ? (
                      <HistoryList history={this.props.groupHistoryList} />
                  ) : null}
                </div>

                {
                  /*
                   * Right column that displays members and the user's cart components
                   */
                }
                <div className="group-profile-right">
                  {this.state.listToggle ? (
                      <div>
                        <GroupUserList users={this.props.groupUsers} />
                        <UserCart />
                      </div>
                  ) : null}

                  {this.state.histToggle ? (
                      <div>
                        <GroupDataBar/>
                        <GroupDataDoughnut/>
                      </div>
                  ) : null}
                  </div>
                </div>
              </div>
        }

        {
         /*
          * Modals - Keep modals at end to avoid "blank space" in regular components
          */
        }
        <MDBContainer>
          {/* Invite modal */}
          <MDBModal
            isOpen={this.state.modal15}
            toggle={this.toggle(15)}
            centered
          >
            <MDBModalHeader toggle={this.toggle(15)}>
              Group Invitation
            </MDBModalHeader>
            <MDBModalBody>
              <p className="text-left">
                {this.props.invites !== null
                  ? this.props.invites[this.props.match.params.id]
                  : ""}
              </p>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={this.toggle(15)}>
                Close
              </MDBBtn>
              <CopyToClipboard text={this.props.invites !== null
                  ? this.props.invites[this.props.match.params.id]
                  : ""}
                               onCopy={() => this.setState({copied: true})}>
                <MDBBtn
                    className="btn-dark-green"
                >
                  Copy to clipboard
                </MDBBtn>
              </CopyToClipboard>

            </MDBModalFooter>
          </MDBModal>
          <MDBModal
              isOpen={this.state.modal18}
              toggle={this.toggle(18)}
              centered
          >
            <MDBModalHeader toggle={this.toggle(18)}>Notification Settings</MDBModalHeader>
            <MDBModalBody>
              Update your group notification settings
              {
                this.props.groupUsers !== null ? this.props.groupUsers.map((grp, i) => (
                    <div key={i}>
                      {
                        grp.userID === Number(localStorage.getItem("userId")) ?
                            <div className={"label-check"}>
                              <div>
                                <input type="checkbox" name="checkGrp1" id="check1_Opt1" onChange={(e) => this.handleUpdateNotif(e, !grp.weeklyNotification, grp.id, "week")} checked={grp.weeklyNotification} />
                                <label htmlFor="check1_Opt1">Weekly Notifications</label>
                                <br></br>
                                <input type="checkbox" name="checkGrp2" id="check1_Opt2" onChange={(e) => this.handleUpdateNotif(e, !grp.monthlyNotification, grp.id, "month")} checked={grp.monthlyNotification} />
                                <label htmlFor="check1_Opt2">Monthly Notifications</label>

                              </div>
                            </div>
                              : null
                      }
                    </div>
                )) : null
              }
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={this.toggle(18)}>
                Ok
              </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
          {this.props.errorMessage !== null ? (
              <MDBModal
                  isOpen={this.state.modal17}
                  toggle={this.toggle(17)}
                  centered
              >
                <MDBModalHeader toggle={this.toggle(17)}>Warning</MDBModalHeader>
                <MDBModalBody>
                  <h6>{this.props.errorMessage}</h6>
                </MDBModalBody>
                <MDBModalFooter>
                  <MDBBtn color="secondary" onClick={this.handleClearError}>
                    Ok
                  </MDBBtn>
                </MDBModalFooter>
              </MDBModal>
          ) : null}
        </MDBContainer>
      </div>
    );
  }
}

/**
 * Connects state to props
 * @param state
 * @returns {{needsNewHistoryList: boolean, currentUser: null, needsNewItems: boolean, groupHistoryList: null, groupHistory: null, invites: (GroupsProfile.state.invites|{}|null|invites), groupUsers: null, groupItems: (null|*), groupUserProfiles: (null|Array)}}
 */
const mapStateToProps = state => {
  state = state.rootReducer; // pull values from state root reducer
  return {
    // group state
    groupUserProfiles: state.groupUserProfiles,
    groupUsers: state.groupUsers,
    groupHistory: state.groupHistory,
    groupHistoryList: state.groupHistoryList,
    needsNewHistoryList: state.needsNewHistoryList,

    // all group invites
    invites: state.invites,

    // item state
    needsNewItems: state.needsNewItems,
    groupItems: state.groupItems,

    // current user state
    currentUser: state.currentUser,
    userGroups: state.userGroups,
    errorMessage: state.errorMessage
  };
};

export default connect(
  mapStateToProps,
  {
    getGroupHistoryList,
    clearItems,
    clearGroupUsers,
    addItem,
    checkEmail,
    updateItemPurchased,
    submitPaidItems,
    getGroupItems,
    getGroupHistory,
    getGroupUsers,
    getUserProfile,
    generateGroupInviteUrl,
    getUserGroups,
    clearError,
    clearGroupHistory,
    updateGroupNotification
  }
)(GroupsProfile);
