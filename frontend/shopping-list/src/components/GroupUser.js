// collect user's total and net values
import React  from 'react';
import {getUserProfile, checkEmail} from '../store/actions/rootActions';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import './Styles/GroupUser.css';
import axios from 'axios';
import { MDBContainer, MDBCard, MDBCardBody} from "mdbreact";

class GroupUser extends React.Component{

    componentWillMount(){
        if(this.props.user){
            // console.log('USER', this.props.user);
            this.getLocalUser(this.props.user.userID)        }
    }

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
            // console.log('localuser', response);
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
            // console.log(`net ${userNet}, total ${userTotal.toFixed(2)}, grouptotal: ${this.props.groupTotal.toFixed(2)}`)
        }
        return(
            <div className = 'group-user-container'>
            <MDBContainer>
                <MDBCard>
                    <MDBCardBody>

                        {this.state.targetUser !== null ? (
                    <div className = 'group-user-image'>
                    <h3>{this.state.targetUser.name}</h3>
                    <img src = {this.state.targetUser.profilePicture} alt = 'user profile'></img>
                        </div>) : <h3>No User</h3> }

                        <div className = 'group-user-stats'>
                            <div>Total: ${userTotal.toFixed(2)}</div>
                            <div>Net: ${userNet.toFixed(2)}</div>
                        </div>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
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