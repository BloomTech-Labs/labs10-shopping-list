// collect user's total and net values
import React from 'react';
import {getUserProfile} from '../store/actions/rootActions';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class GroupUser extends React.Component{

    render(){
        return(
            <div>
                USER: {this.props.profile.name}
            </div>
        )
    }

}

const mapStateToProps = state => {
    state = state.rootReducer; // pull values from state root reducer
    return {
        //state items
        userId: state.userId,
        groupUsers: state.groupUsers
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    getUserProfile,
})(GroupUser));