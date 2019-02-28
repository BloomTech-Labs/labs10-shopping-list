// collect all group users and display them and map over their userIds for profile information

import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getGroupUsers, getUserProfile} from '../store/actions/rootActions';
import GroupUser from './GroupUser';

class GroupUserList extends React.Component{
    componentDidMount(){
        if(!this.props.groupUsers){
            this.props.getGroupUsers(this.props.match.params.id);
        }
    }

    componentWillReceiveProps = newProps => {
        if(newProps.groupUsers !== this.props.groupUsers){
            if(newProps.groupUsers){
                this.fetchUserProfiles(newProps.groupUsers);
            }
        }
    }

    fetchUserProfiles(groupUsers){
        // collect all group user profiles into state
        for(let i = 0; i < groupUsers.length; i++){
            this.props.getUserProfile(groupUsers[i].userID);
        }
    }

    render(){
        let groupUserProfiles = [];
        if(this.props.groupUserProfiles){
            let profiles = this.props.groupUserProfiles;

            groupUserProfiles = profiles.map(profile => {
                return <GroupUser profile = {profile} />
            })
        }

        return(
            <div>
                GROUP USER LIST
                {groupUserProfiles}
                TOTAL EXPENDITURE: {this.props.groupTotal}
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
        groupTotal: state.groupTotal
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    getGroupUsers,
    getUserProfile,
})(GroupUserList));