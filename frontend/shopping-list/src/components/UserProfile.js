import React from 'react';
import {checkEmail, addUserToState} from '../store/actions/rootActions';
import {connect} from 'react-redux';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from 'mdbreact';
import './Styles/UserProfile.css';

class UserProfile extends React.Component{
   async componentDidMount(){
        if(localStorage.getItem('email') && this.props.userId === null){
            // if a user is logged in and no userID is found, call the checkemail function
            await this.props.checkEmail();
        }
    }

    componentWillReceiveProps = newProps => {
        console.log('this vs new', this.props, newProps)
        if(newProps.emailChecked !== this.props.emailChecked && newProps.userId){
            this.handleProfileFetch(newProps.userId);
        }
    }

    handleProfileFetch = id => {
        this.props.addUserToState(id);
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
            <div className = 'user-profile-col'>
            <div className = 'user-profile-left'>
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

            <div className = 'user-profile-right'>
            
            Notification Settings

            Subscription Settings

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
        userId: state.userId,
        currentUser: state.currentUser,
        emailChecked: state.emailChecked,
    }
}

export default connect(mapStateToProps, {
    checkEmail,
    addUserToState,
})(UserProfile);