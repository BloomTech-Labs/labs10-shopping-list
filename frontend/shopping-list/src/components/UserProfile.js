import React from 'react';
import {checkEmail, addUserToState} from '../store/actions/rootActions';
import {connect} from 'react-redux';
import {Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button} from 'reactstrap';
import { timingSafeEqual } from 'crypto';

class UserProfile extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            input: null,
            userId: null,
        }
    }

    async componentDidMount(){
        let email = localStorage.getItem('email');

        if(email && !this.props.userId){
            // if a user is logged in and no userID is found, retrieve their user ID from the database via their email and store in local storage
            await this.props.checkEmail(email, this.props.addUserToState);
            // the second parameter is a callback that will execute once the email check is complete
            // in this case it is populating state with the complete user profile: email, userId, profilePicture, and name
        }
    }

    render(){
        return (
            <div className = 'user-profile-container'>
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