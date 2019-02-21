import React, { Component } from 'react';
import {gettingGroups } from '../store/actions/rootActions';
import {connect} from 'react-redux';
import Navigation from "./Navigation";
import "./Styles/Group.css";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn, MDBContainer, MDBListGroup, MDBListGroupItem, MDBCardHeader, MDBCardFooter,
    MDBRow } from "mdbreact";

class GroupsProfile extends Component{
    constructor(props){
        super(props);

        this.state = {
            groups: null,
        }
    }

    async componentDidMount(){
        this.props.gettingGroups();
        this.setState({ groups: this.props.groups}, () => {
            console.log("STATE => ", this.props.groups);
        })
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
                        {this.props.groups !== null ? this.props.groups.map((grp, ind) => (
                            <MDBCard border="primary" className="m-3" style={{ maxWidth: "18rem" }}>
                                <MDBCardHeader>{grp.name}</MDBCardHeader>
                                <MDBCardBody className="text-primary">
                                    <MDBCardTitle tag="h5">X Members</MDBCardTitle>
                                    <div className="chip">
                                        <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-6.jpg" alt="Person" width="96" height="96" />
                                        John Doe
                                    </div>
                                    <div className="chip">
                                        <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-6.jpg" alt="Person" width="96" height="96" />
                                        John Doe
                                    </div>

                                </MDBCardBody>
                            </MDBCard>
                        )) : null}

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
        groups: state.groups,
    }
}

export default connect(mapStateToProps, {
    gettingGroups,
})(GroupsProfile);