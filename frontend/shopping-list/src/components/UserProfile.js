import React, {Components} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class UserProfile extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            input: null,
            profile: null,
        }
    }

    async componentDidMount(){
        const profile = (await axios.get('http://localhost:9000/api/user/2')).data;

        this.setState({
            profile,
        })

    }

    render(){
        console.log(this.state.profile);
        return (
            <div className = 'user-profile-container'>
            
            
            </div>
        )
    }
}

export default UserProfile;