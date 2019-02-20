import React from 'react';
import {checkEmail, addUserToState} from '../store/actions/rootActions';
import {connect} from 'react-redux';


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

        if(email){
            // if a user is logged in, retrieve their user ID from the database and store in local storage
            this.props.checkEmail(email, this.props.addUserToState);
            // the second parameter is a callback that will execute once the email check is complete
            // in this case it is populating state with the complete user profile: email, userId, profilePicture, and name
        }
    }

    render(){
        return (
            <div className = 'user-profile-container'>
            User profile page
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        //state items
        userId: state.userId 
    }
}

export default connect(mapStateToProps, {
    checkEmail,
    addUserToState,
})(UserProfile);