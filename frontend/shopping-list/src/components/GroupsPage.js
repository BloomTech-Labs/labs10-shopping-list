import React, { Component } from 'react';
import {checkEmail, createGroup, getCurrentUser, getUserGroups, addGroup, clearCurrentGroup } from '../store/actions/rootActions';
import {connect} from 'react-redux';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn, MDBContainer,
    MDBCardHeader, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBRow, MDBInput, MDBNavLink } from "mdbreact";

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
        groupName: "",
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

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        },)
    }

    handleAddGroup = () => {
        this.props.createGroup(this.state.groupName, this.props.currentUser.id);
        this.toggle(14);
        this.props.getUserGroups(this.props.currentUser.id);
    }

    render(){
        return (
            <div className = 'groups-container'>
                <MDBContainer>
                    <MDBRow center>
                        <MDBCard className="text-center" style={{ width: "20rem", marginTop: "1rem" }}>
                            <MDBCardBody>
                                <MDBCardTitle>Create New Group</MDBCardTitle>
                                <MDBCardText>
                                    Create a new group and start inviting to help with the shopping!
                                </MDBCardText>
                                <MDBBtn color="primary" onClick={this.toggle(14)}>Create</MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                        {this.props.userGroups !== null ? (
                            this.props.userGroups.map((g, i) => (
                                <MDBNavLink key={makeid()} to={`/groups/${g.id}`}>
                                    <MDBCard key={makeid()} border="primary" className="m-3" style={{ maxWidth: "18rem"}}>
                                        <MDBCardHeader key={makeid()}>{g.name}</MDBCardHeader>
                                        <MDBCardBody key={makeid()} className="text-primary">
                                            <MDBCardTitle key={makeid()} tag="h5">{g.memberAmount === 1 ? `${g.memberAmount} Member` : `${g.memberAmount} Members`}</MDBCardTitle>
                                            <MDBCardText key={makeid()}>
                                                Group members go here
                                            </MDBCardText>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBNavLink>
                            ))
                        ) : null}
                    </MDBRow>
                </MDBContainer>


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
    checkEmail, getUserGroups, addGroup, clearCurrentGroup,
    createGroup,
    getCurrentUser
})(GroupsPage);