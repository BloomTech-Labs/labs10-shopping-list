// collect all group users and display them and map over their userIds for profile information

import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getGroupUsers} from '../store/actions/rootActions';


class GroupUserList extends React.Component{
    componentDidMount(){
        if(!this.props.groupUsers){
            this.props.getGroupUsers(this.props.match.params.id);
        }
    }

    render(){
        return(
            <div>
                GROUP USER LIST
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
        groupUsers: state.groupUsers
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    getGroupUsers,
})(GroupUserList));