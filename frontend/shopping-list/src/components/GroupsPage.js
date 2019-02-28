import React, { Component } from 'react';
import {checkEmail, createGroup, getCurrentUser, getUserGroups, addGroup, clearCurrentGroup } from '../store/actions/rootActions';
import {connect} from 'react-redux';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn, MDBContainer, MDBCol,
    MDBCardHeader, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBRow, MDBInput, MDBNavLink } from "mdbreact";
import GroupCard from './GroupCard';

// import {checkEmail, gettingGroups, addGroup, clearCurrentGroup,updateGroupName,removeGroup } from '../store/actions/rootActions';
// import {connect} from 'react-redux';
// import Navigation from "./Navigation";
// import {
//     MDBCard,
//     MDBCardBody,
//     MDBCardTitle,
//     MDBCardText,
//     MDBBtn,
//     MDBContainer,
//     MDBCardHeader,
//     MDBModal,
//     MDBModalBody,
//     MDBModalHeader,
//     MDBModalFooter,
//     MDBRow,
//     MDBInput,
//     MDBNavLink,
//     MDBIcon,
//     MDBBadge,
// } from "mdbreact";


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
    }

    componentWillMount(){
        this.props.getCurrentUser(localStorage.getItem('email'));
      }

    componentWillReceiveProps = newProps => {
        if(newProps.currentUser && !this.props.userGroups){
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
    }

    handleUpdateGroupName = () => {
        if (this.state.groupName !== '') {
            const changes = {name: this.state.groupName};
            this.props.updateGroupName(this.state.groupId, changes);

            this.setState({modal15: false})
        }


    }

    handleDeleteGroup = () => {
        if (this.state.groupId !== null) {
            this.props.removeGroup(this.state.groupId, localStorage.getItem("userId"));
            this.setState({modal16: false})
        }
    }

    render(){
        return (
            <div className = 'groups-container'>
                <MDBContainer>
                    <MDBRow center>
                        <MDBCard className="text-center" style={{ width: "20rem", marginTop: "1.5rem", height: '15rem' }}>
                            <MDBCardBody>
                                <MDBCardTitle>Create New Group</MDBCardTitle>
                                <MDBCardText>
                                    Create a new group and start inviting to help with the shopping!
                                </MDBCardText>
                                <MDBBtn color="primary" onClick={this.toggle(14)}>Create</MDBBtn>
                            </MDBCardBody>
                        </MDBCard>

                        {this.props.userGroups !== null ? (
                            this.props.userGroups.map(group => 
                                (
                                    <GroupCard group = {group} key = {group.id}/>
                                )
                            )
                          ) : null}
                      
                        </MDBRow>
                </MDBContainer>
{/* 
                         {this.props.groups !== null ? ( 

//                             this.props.groups.map((g, i) => (

//                                     <MDBCard key={makeid()} border="primary" className="m-3" style={{ minWidth: "14rem", maxWidth: "18rem"}}>
//                                         <MDBCardHeader key={makeid()}>{g.name} <MDBIcon icon="edit" style={{cursor: "pointer"}} onClick={() => this.saveGroupName(g.id, g.name)} /> <MDBIcon icon="trash" onClick={() => this.deleteGroup(g.id, g.name)} style={{cursor: "pointer"}} /></MDBCardHeader>
//                                         <MDBCardBody key={makeid()} className="text-primary">
//                                             <MDBCardTitle key={makeid()} tag="h5" className={"align-center"}>{g.memberAmount === 1 ? `${g.memberAmount} Member` : `${g.memberAmount} Members`}</MDBCardTitle>
//                                             <MDBCardText key={makeid()}>
//                                                 {
//                                                     g.members.map((h, j) => (
//                                                         <img src={h.profilePicture} alt="Avatar" className="avatar-group" />
//                                                     ))
//                                                 }
//                                             </MDBCardText>
//                                             <MDBNavLink key={makeid()} to={`/groups/${g.id}`}><MDBBtn>ENTER</MDBBtn></MDBNavLink>

//                                         </MDBCardBody>
//                                     </MDBCard>
//                             ))
                         */}


                <MDBContainer>
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
                        <MDBModalHeader toggle={this.toggle(15)}>Update Group Name</MDBModalHeader>
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
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={this.toggle(16)}>Close</MDBBtn>
                            <MDBBtn color="primary" onClick={this.handleDeleteGroup} disabled={this.state.groupName !== this.state.delete }>Delete</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
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
    }
}

export default connect(mapStateToProps, {
    checkEmail, 
    getUserGroups, 
    addGroup, 
    clearCurrentGroup,
    createGroup,
    getCurrentUser,
    gettingGroups,
    updateGroupName,
    removeGroup
})(GroupsPage);