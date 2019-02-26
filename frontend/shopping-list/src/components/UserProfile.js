import React from 'react';
import {checkEmail, addUserToState} from '../store/actions/rootActions';
import {connect} from 'react-redux';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from 'mdbreact';
import Navigation from './Navigation.js';
import './Styles/UserProfile.css';

class UserProfile extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            input: null,
            userId: null,
        }
    }

    async componentDidMount(){
        console.log('cdm');
        let email = localStorage.getItem('email');

        if(email && !this.props.userId){
            // if a user is logged in and no userID is found, retrieve their user ID from the database via their email and store in local storage
            this.props.checkEmail(email, this.props.addUserToState);
            // the second parameter is a callback that will execute once the email check is complete
            // in this case it is populating state with the complete user profile: email, userId, profilePicture, and name
        }
    }

    render(){
        console.log('render');
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