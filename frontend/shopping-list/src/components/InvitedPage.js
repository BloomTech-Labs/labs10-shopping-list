import React from 'react';
import axios from 'axios';

class InvitedPage extends React.Component{
    addUserToGroup = () => {
        let backendURL;
        if(process.env.NODE_ENV === 'development'){
            backendURL = `http://localhost:9000`
        } else {
            backendURL = `https://shoptrak-backend.herokuapp.com`
        }
        const userID = this.props.match.params.userID;
        const groupID = this.props.match.params.groupID;
        console.log(`userID: ${userID} and groupID:${groupID}`);
        let token = localStorage.getItem('jwt');
        // console.log('token', token);
        let options = {
            headers: {
               Authorization: `Bearer ${token}`
            }
        }
        axios.get(`${backendURL}/api/group/invite/${userID}:${groupID}`, options).then(res => {
            console.log(`SUCCESS`, res.data);
        }).catch(err => {
            console.log(`ERROR ${err.message}`);
        });
    }

    componentDidMount(){
        this.addUserToGroup();
    }

    render(){
        return (
            <div>
                Something happened.
            </div>
        )
    }
}

export default InvitedPage;