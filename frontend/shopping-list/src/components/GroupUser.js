// collect user's total and net values
import React from 'react';
import {getUserProfile} from '../store/actions/rootActions';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class GroupUser extends React.Component{

    componentDidMount(){
        if(this.props.profile){
            this.getUserTotal(this.props.profile.userID);
        }
    }

    constructor(props){
        super(props);

        this.state = {
            userTotal: null,
            userNet: null,

        }
    }
    
    getUserTotal = (userId) => {
        let total = 0;
        if(this.props.items){
            this.props.items.map(item => {
                if(item.userID === userId){
                    return total += item.price
                }
            })

            this.setState({
                userTotal: total,
            })

            this.getUserNet(total);
        }
    }

    getUserNet = (userTotal) => {
        let net = 0;
        if(this.props.groupTotal){
            net = (this.props.groupTotal - userTotal);
            console.log('net', net);
            this.setState({
                userNet: net,
            })
        }
    }

    render(){
        return(
            <div>
                USER: {this.props.profile.name}
                USER TOTAL: {this.state.userTotal}
                USER NET: {this.state.userNet}
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
        groupTotal: state.groupTotal
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    getUserProfile,
})(GroupUser));