import React, { Component } from 'react';
import {checkEmail, gettingGroups } from '../store/actions/rootActions';
import {connect} from 'react-redux';
import Navigation from "./Navigation";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn, MDBContainer, MDBListGroup, MDBListGroupItem, MDBCardHeader, MDBCardFooter,
    MDBRow } from "mdbreact";

class GroupsProfile extends Component{
    constructor(props){
        super(props);

        this.state = {
            input: null,
            userId: null,
            groups: null,
        }
    }

    async componentDidMount(){
        console.log('cdm');
        let email = localStorage.getItem('email');

        if(email && !this.props.userId){
            // if a user is logged in and no userID is found, retrieve their user ID from the database via their email and store in local storage
            this.props.checkEmail(email, this.props.addUserToState);
            // the second parameter is a callback that will execute once the email check is complete
            // in this case it is populating state with the complete user profile: email, userId, profilePicture, and name
        }

        this.props.gettingGroups();
        this.setState({ groups: this.props.groups})
    }

    render(){
        console.log('render');
        return (
            <div>
                <Navigation />
                <MDBContainer>
                    <MDBRow center>
                    <MDBCard className="text-center" style={{ width: "20rem", marginTop: "1rem" }}>
                        <MDBCardBody>
                            <MDBCardTitle>Create New Group</MDBCardTitle>
                            <MDBCardText>
                                Create a new group and start inviting to help with the shopping!
                            </MDBCardText>
                            <MDBBtn color="primary">Create</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>


                        <MDBCard border="primary" className="m-3" style={{ maxWidth: "18rem" }}>
                            <MDBCardHeader>Header</MDBCardHeader>
                            <MDBCardBody className="text-primary">
                                <MDBCardTitle tag="h5">Primary card title</MDBCardTitle>
                                <MDBCardText>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBRow>

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
    checkEmail, gettingGroups,
})(GroupsProfile);