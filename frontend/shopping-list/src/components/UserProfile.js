import React from "react";
import {
  getCurrentUser,
  checkEmail,
  saveUsername,
  saveProfilePic,
  removeAccount
} from "../store/actions/rootActions";
import { connect } from "react-redux";
import {
  MDBContainer,
  MDBCardHeader,
  MDBCardGroup,
  MDBBtn,
  MDBIcon,
  MDBBadge,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText,
  MDBCol,
  MDBInput,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
    MDBAlert
} from "mdbreact";
import "./Styles/UserProfile.css";

class UserProfile extends React.Component {
  state = {
    generalToggle: true,
    notifToggle: false,
    subToggle: false,
    username: "",
    profilePic: "",
    modal14: false,
    modal16: false,
    hasSaved: false,
    hasPSaved: false,
    delete: "",
  };
  componentWillMount() {
    // this.props.getCurrentUser();
    if (!this.props.currentUser && localStorage.getItem("isLoggedIn")) {
      // find a user if none in state
      // console.log('profile mount');
      this.props.checkEmail();
    }

    if (this.props.currentUser) {
      this.setState({ username: this.props.currentUser.name });
    } else {
        this.setState({username: localStorage.getItem("name")})
    }
  }

  componentDidMount(){
        if(!this.props.currentUser){
            this.props.checkEmail();
        }

        if (this.props.currentUser) {
          document.title = `${this.props.currentUser.name}'s Profile`;
          this.setState({ username: this.props.currentUser.name });
        }
    }

  componentWillReceiveProps = newProps => {
    if (!newProps.currentUser) {
      this.props.checkEmail();
    }
  };

  generalToggle = () => {
    this.setState({
      generalToggle: true,
      notifToggle: false,
      subToggle: false
    });
  };

  notifToggle = () => {
    this.setState({
      notifToggle: true,
      generalToggle: false,
      subToggle: false
    });
  };

  subToggle = () => {
    this.setState({
      subToggle: true,
      generalToggle: false,
      notifToggle: false
    });
  };

  handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  saveCurrentUsername = () => {
    // Save username
      localStorage.setItem("name", this.state.username);
    this.props.saveUsername(this.state.username);
      this.setState({ hasSaved: true, hasPSaved: false })
      setInterval(() => {
          this.setState({ hasSaved: false});
      }, 2000)
  };

  saveProfilePicture = () => {
    this.props.saveProfilePic(this.state.profilePic);
    this.setState({ modal14: false, hasPSaved: true, hasSaved: false });
      setInterval(() => {
          this.setState({ hasPSaved: false});
      }, 2000)
  };

  toggle = nr => () => {
    let modalNumber = "modal" + nr;
    this.setState({
      [modalNumber]: !this.state[modalNumber]
    });
  };

  handleDeleteAccount = (event) => {
        event.preventDefault();
        if (localStorage.getItem("userId")) {
            this.props.removeAccount();
            this.setState({modal16: false})
          this.props.history.push("/");
        }
  }



  render() {
    let name,
      email,
      profilePicture = "";
    let subscriptionType = 1;

    if (this.props.currentUser) {
      name = this.props.currentUser.name;
      email = this.props.currentUser.email;
      profilePicture = this.props.currentUser.profilePicture;
      subscriptionType = this.props.currentUser.subscriptionType;
    }

    const user = localStorage.getItem("userId");
    return (

      <div className="user-profile-container">
        {
          user === null ? <div className="user-notlogged">
            <h1>You must be logged in to view this page</h1>
          </div> : <div>
                <div className="user-profile-header">
                  <MDBBtn
                      className={
                        this.state.generalToggle
                            ? "btn-outline-dark-green"
                            : "btn-dark-green"
                      }
                      onClick={() => {
                        this.generalToggle();
                      }}
                  >
                    General
                  </MDBBtn>
                  <MDBBtn
                      className={
                        this.state.subToggle ? "btn-outline-dark-green" : "btn-dark-green"
                      }
                      onClick={() => {
                        this.subToggle();
                      }}
                  >
                    Subscription
                  </MDBBtn>
                </div>
                <div className="user-profile-col">
                  <div className="user-profile-left">
                    <div className="user-profile-pic">
                      <MDBCol>
                        <MDBCard style={{ width: "22rem" }}>
                          <MDBCardImage
                              className="img-fluid"
                              src={profilePicture}
                              waves
                          />
                          <MDBBtn className="btn-dark-green" onClick={this.toggle(14)}>
                            <MDBIcon className="mr-1" icon="edit" />Change
                          </MDBBtn>
                          <MDBCardBody>
                            <MDBCardTitle>{name} <MDBBadge color="primary">{subscriptionType === 1 ? "FREE" : "PREMIUM"}</MDBBadge></MDBCardTitle>
                            <MDBCardText>{email}</MDBCardText>
                            {/*<div className='user-profile-header'>*/}
                            {/*<MDBBtn color="danger" onClick={this.toggle(14)}>*/}
                            {/*Remove Account*/}
                            {/*</MDBBtn>*/}
                            {/*</div>*/}
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                    </div>
                    {/*<div classname="user-profile-info">*/}

                    {/*</div>*/}
                  </div>

                  <div className="user-profile-right">
                    {this.state.generalToggle ? (
                        <div className="user-profile-settings">
                          <MDBInput
                              label="Username"
                              name="username"
                              onChange={e => this.handleInput(e)}
                              valueDefault={this.state.username}
                              icon="user"
                          />
                          <MDBInput
                              label="Email"
                              disabled={true}
                              value={email}
                              icon="envelope"
                          />

                          <div className="user-profile-settings-header">
                            <MDBBtn color="danger" onClick={this.toggle(16)}>
                              Remove Account
                            </MDBBtn>
                            <MDBBtn
                                disabled={this.state.username === localStorage.getItem("name") ? true : false}
                                className={
                                  this.state.listToggle
                                      ? "btn-outline-dark-green"
                                      : "btn-dark-green"
                                }
                                onClick={() => {
                                  this.saveCurrentUsername();
                                }}
                            >
                              Save
                            </MDBBtn>
                          </div>
                          {
                            this.state.hasSaved ? <MDBAlert color="success">
                              Username saved!
                            </MDBAlert> : null
                          }
                          {
                            this.state.hasPSaved ? <MDBAlert color="success">
                              Profile picture Saved!
                            </MDBAlert> : null
                          }
                        </div>
                    ) : null}
                    {this.state.subToggle ? (
                        <div>
                          <MDBContainer >
                            <MDBCardGroup deck className="user-profile-subs-container">
                              <MDBCard
                                  style={{
                                    width: "22rem",
                                    height: "245px",
                                    marginTop: "1rem"
                                  }}
                                  className="text-center"
                              >
                                <MDBCardHeader color="success-color">Free</MDBCardHeader>
                                <MDBCardBody>
                                  <MDBCardTitle>
                                    <MDBBadge color="default">$0.00</MDBBadge>
                                  </MDBCardTitle>
                                  <MDBCardText>
                                    Ability to have one group with up to 2 members.
                                  </MDBCardText>
                                  <MDBBtn
                                      className="btn btn-dark-green"
                                      disabled={subscriptionType === 1 ? true : false}
                                      size="lg"
                                  >
                                    {subscriptionType === 1 ? "Subscribed" : "Subscribe"}
                                  </MDBBtn>
                                </MDBCardBody>
                              </MDBCard>

                              <MDBCard
                                  style={{
                                    width: "22rem",
                                    height: "245px",
                                    marginTop: "1rem"
                                  }}
                                  className="text-center"
                              >
                                <MDBCardHeader color="success-color">
                                  Yearly Premium Subscription
                                </MDBCardHeader>
                                <MDBCardBody>
                                  <MDBCardTitle>
                                    <MDBBadge color="default">$9.99</MDBBadge>
                                  </MDBCardTitle>
                                  <MDBCardText>
                                    Ability to have unlimited groups with up to 6 members.
                                  </MDBCardText>
                                  <MDBBtn
                                      className="btn btn-dark-green"
                                      disabled={subscriptionType === 2 ? true : false}
                                      size="lg"
                                  >
                                    {subscriptionType === 1 ? "Subscribe" : "Subscribed"}
                                  </MDBBtn>
                                </MDBCardBody>
                              </MDBCard>
                            </MDBCardGroup>
                          </MDBContainer>
                        </div>
                    ) : null}
                  </div>
              </div>
            </div>
        }


        <MDBContainer>
          <MDBModal
            isOpen={this.state.modal14}
            toggle={this.toggle(14)}
            centered
          >
            <MDBModalHeader toggle={this.toggle(14)}>
              Update Profile Picture
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                label="Picture URL"
                name="profilePic"
                onChange={this.handleInput}
                defaultValue={this.state.profilePic}
              />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={this.toggle(14)}>
                Close
              </MDBBtn>
              <MDBBtn color="primary" onClick={this.saveProfilePicture}>
                Save
              </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
            <MDBModal isOpen={this.state.modal16} toggle={this.toggle(16)} centered>
                <MDBModalHeader toggle={this.toggle(16)}>Remove Account</MDBModalHeader>
                <MDBModalBody>
                    <h6>Type the full name of your username to completely remove it.</h6>
                    <MDBInput label="Account Name" name={"delete"} onChange={this.handleInput} defaultValue={this.state.delete}/>
                    <small className="delete-text" >{this.state.username}</small>
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color="secondary" onClick={this.toggle(16)}>Close</MDBBtn>
                    <MDBBtn color="primary" onClick={this.handleDeleteAccount} disabled={this.state.username !== this.state.delete }>Delete</MDBBtn>
                </MDBModalFooter>
            </MDBModal>
        </MDBContainer>

      </div>
    );
  }
}

const mapStateToProps = state => {
  state = state.rootReducer; // pull values from state root reducer
  return {
    //state items
    currentUser: state.currentUser,

  };
};

export default connect(
  mapStateToProps,
  {
    getCurrentUser,
    checkEmail,
    saveUsername,
    saveProfilePic,
    removeAccount
  }
)(UserProfile);
