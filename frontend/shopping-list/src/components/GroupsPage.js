import React, { Component, Fragment } from 'react';
import {checkEmail, clearError, createGroup, acceptInvite, getCurrentUser, getUserGroups, addGroup, clearCurrentGroup, gettingGroups, updateGroupName, removeGroup } from '../store/actions/rootActions';
import {connect} from 'react-redux';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn, MDBContainer, MDBCol,
    MDBCardHeader, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBRow, MDBInput, MDBNavLink } from "mdbreact";
import GroupCard from './GroupCard';

import './Styles/GroupsPage.css';

function makeid() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

class GroupsPage extends Component{
    state = {
        modal14: false,
        modal15: false,
        modal16: false,
        groupName: "",
        delete: "",
        groupId: null,
        modal17: true,
    }

    componentWillMount(){
        if(localStorage.getItem('email') && !this.props.currentUser){
          this.props.checkEmail();
        }
    }

    componentDidMount(){
        if(!this.props.userGroups && this.props.currentUser){
            this.props.getUserGroups(this.props.currentUser.id);
        }

        // invitation handling on groups redirect
        if(sessionStorage.getItem('pendingInvite') && localStorage.getItem('isLoggedIn')){
            let inviteCode = sessionStorage.getItem('pendingInvite');
            console.log('pending invite', inviteCode);
            this.props.acceptInvite(inviteCode); // tell the server to add the now logged-in user to the invite group
      
            sessionStorage.removeItem('pendingInvite');
        }
    }

    componentWillReceiveProps = newProps => {
        if(newProps.currentUser && !this.props.userGroups && this.props.errorMessage === null){
            this.props.getUserGroups(newProps.currentUser.id);
        }
    }

    toggle = nr => () => {
        let modalNumber = 'modal' + nr
        this.setState({
            [modalNumber]: !this.state[modalNumber]
        });
    }

    saveGroupName = (id, name) => {
        this.setState({groupId: id, groupName: name, modal15: true})
    }

    deleteGroup = (id, name) => {
        this.setState({groupId: id, groupName: name, modal16: true})
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        },)
    }

    handleAddGroup = () => {

        this.props.createGroup(this.state.groupName, this.props.currentUser.id);
        this.toggle(14);
        this.props.getUserGroups(this.props.currentUser.id);
//         this.props.addGroup(this.state.groupName);
        this.setState({modal14: false})
        if(!this.props.userGroups){
            this.props.getUserGroups(this.props.currentUser.id);
        }
    }

    handleUpdateGroupName = () => {
        if (this.state.groupName !== '') {
            const changes = {name: this.state.groupName};
            this.props.updateGroupName(this.state.groupId, changes);

            this.setState({modal15: false})
        }
    }

    handleDeleteGroup = (event) => {
        event.preventDefault();
        if (this.state.groupId !== null) {
            this.props.removeGroup(this.state.groupId, localStorage.getItem("userId"));
            this.setState({modal16: false})
        }
    }

    handleClearError = () => {
        this.props.clearError();
        // this.setState({modal17: })
    }

    render(){
        return (
            <div className = 'groups-container'>

                <div className = 'groups-cards'>
                    <div className = 'add-group-container'>
                        <MDBCard className="text-center" >
                            <MDBCardBody>
                                <MDBCardTitle>Create New Group</MDBCardTitle>
                                <MDBCardText>
                                    Create a new group and start inviting to help with the shopping!
                                </MDBCardText>
                                <MDBBtn color="primary" onClick={this.toggle(14)}>Create</MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                        </div>

                        {this.props.userGroups !== null ? (
                            this.props.userGroups.map(group =>
                                (
                                    <GroupCard group = {group} key = {group.id} updateGroup={this.saveGroupName} removeGroup={this.deleteGroup} />
                                )
                            )
                        ) : null}

                    </div>

                    <MDBModal isOpen={this.state.modal14} toggle={this.toggle(14)} centered>
                        <MDBModalHeader toggle={this.toggle(14)}>Create A New Group</MDBModalHeader>
                        <MDBModalBody>
                            <MDBInput label="Group Name" name={"groupName"} onChange={this.handleInput} defaultValue={this.state.groupName}/>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={this.toggle(14)}>Close</MDBBtn>
                            <MDBBtn color="primary" onClick={this.handleAddGroup}>Create</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>

                    <MDBModal isOpen={this.state.modal15} toggle={this.toggle(15)} centered>
                        <MDBModalHeader toggle={this.toggle(15)}><p>Update Group Name</p></MDBModalHeader>
                        <MDBModalBody>
                            <MDBInput label="Change Group Name" name={"groupName"} onChange={this.handleInput} defaultValue={this.state.groupName}/>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={this.toggle(15)}>Close</MDBBtn>
                            <MDBBtn color="primary" onClick={this.handleUpdateGroupName}>Update</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>

                    <MDBModal isOpen={this.state.modal16} toggle={this.toggle(16)} centered>
                        <MDBModalHeader toggle={this.toggle(16)}>Delete Group</MDBModalHeader>
                        <MDBModalBody>
                            <h6>Type the full name of the group to completely remove it.</h6>
                            <MDBInput label="Group Name" name={"delete"} onChange={this.handleInput} defaultValue={this.state.delete}/>
                            <small className="delete-text" >{this.state.groupName}</small>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={this.toggle(16)}>Close</MDBBtn>
                            <MDBBtn color="primary" onClick={this.handleDeleteGroup} disabled={this.state.groupName !== this.state.delete }>Delete</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                {
                    this.props.errorMessage !== null ?
                        <MDBModal isOpen={this.state.modal17} toggle={this.toggle(17)} centered>
                            <MDBModalHeader toggle={this.toggle(17)}>Warning</MDBModalHeader>
                            <MDBModalBody>
                                <h6>{this.props.errorMessage}</h6>
                            </MDBModalBody>
                            <MDBModalFooter>
                                <MDBBtn color="secondary" onClick={this.handleClearError}>Ok</MDBBtn>
                            </MDBModalFooter>
                        </MDBModal> : null
                }
                </div>
        )
    }
}

const mapStateToProps = state => {
    state = state.rootReducer; // pull values from state root reducer
    return {
        //state items
        currentUser: state.currentUser,
        userGroups: state.userGroups,

        userId: state.userId,
        name: state.name,
        email: state.email,
        profilePicture: state.profilePicture,
        groups: state.groups,
        errorMessage: state.errorMessage,
    }
}

export default connect(mapStateToProps, {
    checkEmail, 
    getUserGroups, 
    addGroup,
    clearError,
    clearCurrentGroup,
    createGroup,
    getCurrentUser,
    gettingGroups,
    updateGroupName,
    removeGroup,
    acceptInvite
})(GroupsPage);