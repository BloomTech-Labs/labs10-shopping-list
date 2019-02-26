import React from 'react';
import {checkEmail, addUserToState} from '../store/actions/rootActions';
import {connect} from 'react-redux';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from 'mdbreact';
import Navigation from './Navigation.js';
import './Styles/UserProfile.css';

class UserProfile extends React.Component{
   async componentDidMount(){
        if(localStorage.getItem('isLoggedIn') && this.props.userId === null){
            // if a user is logged in and no userID is found, call the checkemail function
            await this.props.checkEmail();

            await this.props.addUserToState();
        }
    }

    render(){
        return (
            <div className = 'user-profile-container'>
            <div className = 'user-profile-col'>
            <div className = 'user-profile-left'>
            <MDBCol>
                <MDBCard style = {{width: "22rem"}}>
                <MDBCardImage className = "img-fluid" src = {this.props.profilePicture} waves />
                <MDBCardBody>
                    <MDBCardTitle>{this.props.name}</MDBCardTitle>
                    <MDBCardText>{this.props.email}</MDBCardText>
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
        name: state.name,
        email: state.email,
        profilePicture: state.profilePicture,
    }
}

export default connect(mapStateToProps, {
    checkEmail,
    addUserToState,
})(UserProfile);