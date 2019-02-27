import React, { Component } from 'react';
import {checkEmail, gettingGroups, addGroup, clearCurrentGroup } from '../store/actions/rootActions';
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

    componentDidMount(){
        console.log('cdm');
        let email = localStorage.getItem('email');

        if(email && !this.props.userId){
            // if a user is logged in and no userID is found, retrieve their user ID from the database via their email and store in local storage
            this.props.checkEmail(email, this.props.addUserToState);
            // the second parameter is a callback that will execute once the email check is complete
            // in this case it is populating state with the complete user profile: email, userId, profilePicture, and name
        }
        console.log("GROUPS => ", this.props.groups);
        this.props.gettingGroups();

        this.setState({ groups: this.props.groups})

        this.props.clearCurrentGroup();
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
        this.props.addGroup(this.state.groupName);
        this.toggle(14);
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
                        {this.props.groups !== null ? (
                            this.props.groups.map((g, i) => (
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
        userId: state.userId,
        name: state.name,
        email: state.email,
        profilePicture: state.profilePicture,
        groups: state.groups,
    }
}

export default connect(mapStateToProps, {
    checkEmail, gettingGroups, addGroup, clearCurrentGroup,
})(GroupsPage);