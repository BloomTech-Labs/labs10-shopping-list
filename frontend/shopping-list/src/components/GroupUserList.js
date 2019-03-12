// collect all group users and display them and map over their userIds for profile information

import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getGroupUsers, getUserProfile} from '../store/actions/rootActions';
import GroupUser from './GroupUser';
import './Styles/GroupUserList.css';

class GroupUserList extends React.Component{

    render(){
        let groupTotal = 0;
        if(this.props.groupHistory){
            for(let i = 0; i < this.props.groupHistory.length; i++){
                if(this.props.groupHistory[i].groupID === Number(this.props.match.params.id)){
                    groupTotal += this.props.groupHistory[i].total;
                }
            }
        }

        return(
            <div className = 'group-user-list-container'>
                <h2>Total Expenditures: ${groupTotal.toFixed(2)}</h2>
                <div className = 'group-user-list-profiles'>
                {this.props.groupUsers ? (
                    this.props.groupUsers.map(user => {
                       return <GroupUser user = {user} key={user.id} groupTotal = {groupTotal} />
                    })
                ) : (<h2>No Group Members</h2>)}
                
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
        groups: state.groups,
        items: state.items,
        groupUsers: state.groupUsers,
        groupUserProfiles: state.groupUserProfiles,
        groupTotal: state.groupTotal,
        groupHistory: state.groupHistory,
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    getGroupUsers,
    getUserProfile,
})(GroupUserList));