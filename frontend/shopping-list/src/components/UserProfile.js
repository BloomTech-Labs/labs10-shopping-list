import React from 'react';
import {checkEmail, addUserToState} from '../store/actions/rootActions';
import {connect} from 'react-redux';
import {Card, CardImg, CardTitle, CardSubtitle} from 'reactstrap';
import Navigation from './Navigation.js';

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
            <Navigation />
            User profile page

            <div className = 'user-profile-left'>
            
            
            <Card>
                <CardImg top width = "100%" src = {this.props.profilePicture} alt = 'user profile image'></CardImg>
                <CardTitle>{this.props.name}</CardTitle>
                <CardSubtitle>{this.props.email}</CardSubtitle>
            </Card>

            </div>

            <div className = 'user-profile-right'>
            Right side
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