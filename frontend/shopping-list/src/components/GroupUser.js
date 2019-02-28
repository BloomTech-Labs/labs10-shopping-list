// collect user's total and net values
import React, { useReducer } from 'react';
import {getUserProfile} from '../store/actions/rootActions';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class GroupUser extends React.Component{
    componentWillMount(){
        this.props.getUserProfile(this.props.match.params.id);
    }

    render(){
        
        let userTotal = 0;
        let userNet = 0;


        if(this.props.groupItems){
            for(let i = 0; i < this.props.items.length; i++){
                if(this.props.items[i].purchasedBy === Number(this.props.currentUser.id)){
                    userTotal = userTotal + Number(this.props.items[i].price);
                }
            }
            userNet = this.props.groupTotal - userTotal;
        }
        return(
            <div>
                USER: {this.props.profile.name}
                USER TOTAL: {userTotal}
                USER NET: {userNet}
            </div>
        )
    }

}

const mapStateToProps = state => {
    state = state.rootReducer; // pull values from state root reducer
    return {
        //state items
        userId: state.userId,
        groupUsers: state.groupUsers,
        items: state.items,
        groupTotal: state.groupTotal,
        needsNewItems: state.needsNewItems,


        currentUser: state.currentUser,
        groupUserProfiles: state.groupUserProfiles
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    getUserProfile,
})(GroupUser));