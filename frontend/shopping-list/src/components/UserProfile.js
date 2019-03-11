import React from 'react';
import {getCurrentUser, checkEmail, saveUsername, saveProfilePic} from '../store/actions/rootActions';
import {connect} from 'react-redux';
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
    MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter
} from 'mdbreact';
import './Styles/UserProfile.css';

class UserProfile extends React.Component{
    state = {
        generalToggle: true,
        notifToggle: false,
        subToggle: false,
        username: "",
        profilePic: "",
        modal14: false,
    }
   componentWillMount(){
       // this.props.getCurrentUser();
        if(!this.props.currentUser && localStorage.getItem('isLoggedIn')){
            // find a user if none in state
            // console.log('profile mount');
            this.props.checkEmail();

        }

        if(this.props.currentUser) {
            this.setState({ username: this.props.currentUser.name})
        }

   }

    componentWillReceiveProps = newProps => {
        if (!newProps.currentUser) {
            this.props.checkEmail();
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

    handleInput = (e) => {
        this.setState({
        [e.target.name]: e.target.value,
                      })
    }

    saveCurrentUsername = () => {
        // Save username
        this.props.saveUsername(this.state.username);
    }

    saveProfilePicture = () => {
        this.props.saveProfilePic(this.state.profilePic);
        this.setState({ modal14: false})
    }

    toggle = nr => () => {
        let modalNumber = 'modal' + nr
        this.setState({
            [modalNumber]: !this.state[modalNumber]
        });
    }


    render(){
        let name, email, profilePicture = '';
        let subscriptionType = 1;

        if(this.props.currentUser){
            name = this.props.currentUser.name;
            email = this.props.currentUser.email;
            profilePicture = this.props.currentUser.profilePicture;
            subscriptionType = this.props.currentUser.subscriptionType;
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
                    {/*<MDBBtn*/}
                        {/*className={this.state.notifToggle ? "btn-outline-dark-green" : "btn-dark-green"}*/}
                        {/*onClick={() => {*/}
                            {/*this.notifToggle();*/}
                        {/*}}*/}
                    {/*>*/}
                        {/*Notification*/}
                    {/*</MDBBtn>*/}
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
                                <MDBBtn className="btn-dark-green" onClick={this.toggle(14)}><MDBIcon className="mr-1" icon="edit"></MDBIcon>Change</MDBBtn>
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
                            <div className='user-profile-settings'>
                                <MDBInput label="Username" name='username' onChange={e => this.handleInput(e)} valueDefault={this.state.username} icon="user" />
                                <MDBInput label="Email" disabled="true" valueDefault={email} icon="envelope" />
                                <MDBBtn
                                    className={this.state.listToggle ? "btn-outline-dark-green" : "btn-dark-green"}
                                    onClick={() => {
                                        this.saveCurrentUsername();
                                    }}
                                >
                                    Save
                                </MDBBtn>
                            </div> : null
                        }
                        {
                            this.state.notifToggle ?
                                <div>
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
                                <div >
                                    <MDBContainer fluid='true'>
                                        <MDBCardGroup deck>
                                            <MDBCard style={{ width: "22rem", height: "245px", marginTop: "1rem" }} className="text-center">
                                                <MDBCardHeader color="success-color">Free</MDBCardHeader>
                                                <MDBCardBody>
                                                    <MDBCardTitle><MDBBadge color="default">$0.00</MDBBadge></MDBCardTitle>
                                                    <MDBCardText>
                                                        Ability to have 1 group with up to 2 members.
                                                    </MDBCardText>
                                                    <MDBBtn color="success" disabled={subscriptionType === 1 ? true : false} size="sm">
                                                        Subscribe
                                                    </MDBBtn>
                                                </MDBCardBody>
                                            </MDBCard>

                                            <MDBCard style={{ width: "22rem", height: "245px", marginTop: "1rem" }} className="text-center">
                                                <MDBCardHeader color="success-color">Yearly Premium Subscription</MDBCardHeader>
                                                <MDBCardBody>
                                                    <MDBCardTitle><MDBBadge color="default">$9.99</MDBBadge></MDBCardTitle>
                                                    <MDBCardText>
                                                        Ability to have unlimited groups with up to 6 members.
                                                    </MDBCardText>
                                                    <MDBBtn color="success" disabled={subscriptionType === 2 ? true : false} size="sm">
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

                <MDBContainer>
                    <MDBModal isOpen={this.state.modal14} toggle={this.toggle(14)} centered>
                        <MDBModalHeader toggle={this.toggle(14)}>Update Profile Picture</MDBModalHeader>
                        <MDBModalBody>
                            <MDBInput label="Picture URL" name="profilePic" onChange={this.handleInput} defaultValue={this.state.profilePic}/>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={this.toggle(14)}>Close</MDBBtn>
                            <MDBBtn color="primary" onClick={this.saveProfilePicture}>Save</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
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
    saveUsername,
    saveProfilePic
})(UserProfile);