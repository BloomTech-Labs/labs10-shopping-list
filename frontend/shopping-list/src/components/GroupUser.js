// collect user's total and net values
import React, { useReducer } from 'react';
import {getUserProfile, checkEmail, FETCHING_USER_PROFILE} from '../store/actions/rootActions';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import './Styles/GroupUser.css';
import axios from 'axios';

class GroupUser extends React.Component{

    componentWillMount(){
        if(this.props.user){
            console.log('USER', this.props.user);
            this.getLocalUser(this.props.user.userID)

            // this.props.getUserProfile(this.props.user.userID); // add user profiles to state
        }
    }
    
    // componentWillReceiveProps = newProps => {
    //     if(newProps.groupUserProfiles !== null){
    //         if(newProps.groupUserProfiles.length === this.props.groupUsers.length){
    //         console.log('NEW PROFILES ===>');
    //         console.log(newProps.groupUserProfiles);

    //         let targetUser;
    //         for(let i = 0; i < newProps.groupUserProfiles.length; i++){
    //             console.log('LENGTH', newProps.groupUserProfiles.length);
    //             if(newProps.groupUserProfiles[i].id === this.props.user.userID){
    //                 console.log("MATCH FOUND")
    //                 targetUser = newProps.groupUserProfiles[i];
                    
    //                 this.setState({
    //                     targetUser: targetUser,
    //                 })
    //             }
    //         }
    //     }
    //     }
    // }

    constructor(props){
        super(props);
        this.state = {
            targetUser: null
        }
    }

    getLocalUser = id => {
        let backendURL;
        if(process.env.NODE_ENV === 'development'){
        backendURL = `http://localhost:9000`
        } else {
        backendURL = `https://shoptrak-backend.herokuapp.com`
        }
        
        let token = localStorage.getItem('jwt');
        let options = {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }

        axios.get(`${backendURL}/api/user/${id}`, options).then(response => {
            console.log('localuser', response);
            this.setState({
                targetUser: response.data
            })
        })
    }


    render(){
        
        let userTotal = 0;
        let userNet = 0;

        if(this.props.groupHistory){
            for(let i = 0; i < this.props.groupHistory.length; i++){
                if(this.props.groupHistory[i].groupID === Number(this.props.match.params.id)){
                    if(this.props.groupHistory[i].userID === Number(this.props.user.userID)){
                        userTotal += this.props.groupHistory[i].total
                    }
                }
            }
            userNet = this.props.groupTotal - userTotal;
            console.log(`net ${userNet}, total ${userTotal}, grouptotal: ${this.props.groupTotal}`)

        }
        return(
            <div className = 'group-user-container'>
                
                <div className = 'group-user-stats'>

                {this.state.targetUser !== null ? (
                    <div className = 'group-user-image'>
                    <h3>{this.state.targetUser.name}</h3>
                    <img src = {this.state.targetUser.profilePicture} alt = 'user profile image'></img>
                    </div>
                ): (<h3>No users</h3>)}
                
                <div>Total: ${userTotal}</div>

                <div>Net: -${userNet}</div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    state = state.rootReducer; // pull values from state root reducer
    return {
        //state items
        needsNewItems: state.needsNewItems,
        groupHistory: state.groupHistory,
        currentUser: state.currentUser,
        groupUserProfiles: state.groupUserProfiles,
        groupUsers: state.groupUsers,
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    getUserProfile,
    checkEmail,
})(GroupUser));