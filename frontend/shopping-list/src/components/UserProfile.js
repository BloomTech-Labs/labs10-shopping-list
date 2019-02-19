import React, {Components} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {checkEmail} from '../store/actions/rootActions';
import {connect} from 'react-redux';


class UserProfile extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            input: null,
            profile: null,
        }
    }

    async componentDidMount(){
        let email = localStorage.getItem('email');

        if(email){
            console.log('cdm email', email);
            this.props.checkEmail(email);
        }

    }

    render(){
        console.log(this.state.profile);
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
    }
}

export default connect(mapStateToProps, {
    checkEmail,
})(UserProfile);