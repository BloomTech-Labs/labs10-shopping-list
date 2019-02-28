import React from 'react';
import {getCurrentUser, checkEmail} from '../store/actions/rootActions';
import {connect} from 'react-redux';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from 'mdbreact';
import './Styles/UserProfile.css';

class UserProfile extends React.Component{
   componentDidMount(){
        if(!this.props.currentUser && localStorage.getItem('isLoggedIn')){
            // find a user if none in state
            console.log('profile mount');
            this.props.checkEmail();
        }
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
        currentUser: state.currentUser,
    }
}

export default connect(mapStateToProps, {
    getCurrentUser,
    checkEmail,
})(UserProfile);