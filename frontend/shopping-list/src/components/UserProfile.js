import React from 'react';
import {getCurrentUser, checkEmail} from '../store/actions/rootActions';
import {connect} from 'react-redux';
import {MDBContainer, MDBCardHeader, MDBCardGroup, MDBBtn, MDBBadge, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol, MDBInput} from 'mdbreact';
import './Styles/UserProfile.css';

class UserProfile extends React.Component{
    state = {
        generalToggle: true,
        notifToggle: false,
        subToggle: false,
        username: "",
    }
   componentWillMount(){
        if(!this.props.currentUser && localStorage.getItem('isLoggedIn')){
            // find a user if none in state
            // console.log('profile mount');
            this.props.checkEmail();
            this.setState({ username: localStorage.getItem("name")})
        }
    }

    generalToggle = () => {
        this.setState({generalToggle: !this.state.generalToggle, notifToggle: false, subToggle: false})
    }

    notifToggle = () => {
        this.setState({notifToggle: !this.state.notifToggle, generalToggle: false, subToggle: false})
    }

    subToggle = () => {
        this.setState({subToggle: !this.state.subToggle, generalToggle: false, notifToggle: false})
    }

    render(){
        let name, email, profilePicture = '';

        if(this.props.currentUser){
            name = this.props.currentUser.name;
            email = this.props.currentUser.email;
            profilePicture = this.props.currentUser.profilePicture;
        }
        return (
            <div className = 'user-profile-container'>
                <div className='user-profile-header'>
                    <MDBBtn
                        className={this.state.generalToggle ? "btn-outline-dark-green" : "btn-dark-green"}
                        onClick={() => {
                            this.generalToggle();
                        }}
                    >
                        General
                    </MDBBtn>
                    <MDBBtn
                        className={this.state.notifToggle ? "btn-outline-dark-green" : "btn-dark-green"}
                        onClick={() => {
                            this.notifToggle();
                        }}
                    >
                        Notification
                    </MDBBtn>
                    <MDBBtn
                        className={this.state.subToggle ? "btn-outline-dark-green" : "btn-dark-green"}
                        onClick={() => {
                            this.subToggle();
                        }}
                    >
                        Subscription
                    </MDBBtn>
                </div>
                <div className = 'user-profile-col'>
                    <div className = 'user-profile-left'>
                        <div className='user-profile-pic'>
                        <MDBCol>
                            <MDBCard style = {{width: "22rem"}}>
                            <MDBCardImage className = "img-fluid" src = {profilePicture} waves />
                            <MDBCardBody>
                                <MDBCardTitle>{name}</MDBCardTitle>
                                <MDBCardText>{email}</MDBCardText>
                            </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        </div>
                        {/*<div classname="user-profile-info">*/}


                        {/*</div>*/}

                    </div>

                    <div className = 'user-profile-right'>
                        {
                            this.state.generalToggle ?
                            <div>
                                <MDBInput label="Username" valueDefault={this.state.username} icon="user" />
                                <MDBInput label="Email" disabled="true" valueDefault={localStorage.getItem("email")} icon="envelope" />
                                <MDBBtn
                                    className={this.state.listToggle ? "btn-outline-dark-green" : "btn-dark-green"}
                                    onClick={() => {
                                        this.toggleListClass();
                                    }}
                                >
                                    Save
                                </MDBBtn>
                            </div> : null
                        }
                        {
                            this.state.notifToggle ?
                                <div>
                                    <MDBInput label="Username" valueDefault={this.state.username} icon="user" />
                                    <MDBBtn
                                        className={this.state.listToggle ? "btn-outline-dark-green" : "btn-dark-green"}
                                        onClick={() => {
                                            this.toggleListClass();
                                        }}
                                    >
                                        Save
                                    </MDBBtn>
                                </div> : null
                        }
                        {
                            this.state.subToggle ?
                                <div>
                                    <MDBContainer fluid='true'>
                                        <MDBCardGroup deck className='user-profile-subs'>
                                            <MDBCard style={{ width: "22rem", marginTop: "1rem" }} className="text-center">
                                                <MDBCardHeader color="success-color">Free</MDBCardHeader>
                                                <MDBCardBody>
                                                    <MDBCardTitle><MDBBadge color="default">$0.00</MDBBadge></MDBCardTitle>
                                                    <MDBCardText>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                    </MDBCardText>
                                                    <MDBBtn color="success" size="sm">
                                                        Subscribe
                                                    </MDBBtn>
                                                </MDBCardBody>
                                            </MDBCard>

                                            <MDBCard style={{ width: "22rem", marginTop: "1rem" }} className="text-center">
                                                <MDBCardHeader color="success-color">Monthly Subscription</MDBCardHeader>
                                                <MDBCardBody>
                                                    <MDBCardTitle><MDBBadge color="default">$0.99</MDBBadge></MDBCardTitle>
                                                    <MDBCardText>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                    </MDBCardText>
                                                    <MDBBtn color="success" size="sm">
                                                        Subscribe Monthly
                                                    </MDBBtn>
                                                </MDBCardBody>
                                            </MDBCard>

                                        <MDBCard style={{ width: "22rem", marginTop: "1rem" }} className="text-center">
                                            <MDBCardHeader color="success-color">Yearly Subscription</MDBCardHeader>
                                            <MDBCardBody>
                                                <MDBCardTitle><MDBBadge color="default">$9.99</MDBBadge></MDBCardTitle>
                                                <MDBCardText>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                </MDBCardText>
                                                <MDBBtn color="success" size="sm">
                                                    Subscribe Yearly
                                                </MDBBtn>
                                            </MDBCardBody>
                                        </MDBCard>

                                        </MDBCardGroup>
                                    </MDBContainer>
                                </div> : null
                        }

                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    state = state.rootReducer; // pull values from state root reducer
    return {
        //state items
        currentUser: state.currentUser,
    }
}

export default connect(mapStateToProps, {
    getCurrentUser,
    checkEmail,
})(UserProfile);