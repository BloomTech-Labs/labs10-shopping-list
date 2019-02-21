import React, { Component } from 'react';
import {checkEmail, gettingGroups, addGroup } from '../store/actions/rootActions';
import {connect} from 'react-redux';
import Navigation from "./Navigation";
import "./Styles/Group.css";
import { MDBListGroup, MDBListGroupItem, MDBContainer, MDBBtn, MDBIcon, MDBBadge, MDBInput } from "mdbreact";

class GroupsPage extends Component{
    state = {
        modal14: false,
        group: null,
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

        this.props.gettingGroups();
        const group = this.props.groups.filter(g => g.id === Number(this.props.match.params.id));
        console.log("GROUP => ", group);
        this.setState({ group: group[0] })
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

    render(){
        return (
            <div>
                <Navigation />
                <div className={"group-profile-container"}>
                    {/*<h1>{this.state.group !== null ? this.state.group.name : ""}</h1>*/}
                        <div className={"group-profile-header"}>
                            <MDBBtn color="primary" >List</MDBBtn>
                            <MDBBtn color="primary" >History</MDBBtn>
                            <MDBBtn color="primary" >Invite</MDBBtn>
                            <MDBBtn color="primary" >Total</MDBBtn>
                    </div>
                    <div className={"group-profile-header-title"}><h3>NAME</h3></div>
                    <div className={"group-profile-columns"}>

                    <div className={"group-profile-list"}>
                        <MDBContainer>
                            <MDBContainer>
                                <MDBListGroup style={{ width: "22rem" }}>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center">Eggs<MDBBadge
                                        color="primary"><MDBIcon icon="check" /></MDBBadge>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center">Milk<MDBBadge
                                        color="primary"><MDBIcon icon="check" /></MDBBadge>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center">Lemons<MDBBadge
                                        color="primary"><MDBIcon icon="check" /></MDBBadge>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center">Lemons<MDBBadge
                                        color="primary"><MDBIcon icon="check" /></MDBBadge>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center">Lemons<MDBBadge
                                        color="primary"><MDBIcon icon="check" /></MDBBadge>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center">Lemons<MDBBadge
                                        color="primary"><MDBIcon icon="check" /></MDBBadge>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center">Lemons<MDBBadge
                                        color="primary"><MDBIcon icon="check" /></MDBBadge>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center">Lemons<MDBBadge
                                        color="primary"><MDBIcon icon="check" /></MDBBadge>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center">Lemons<MDBBadge
                                        color="primary"><MDBIcon icon="check" /></MDBBadge>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center">Lemons<MDBBadge
                                        color="primary"><MDBIcon icon="check" /></MDBBadge>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center">Lemons<MDBBadge
                                        color="primary"><MDBIcon icon="check" /></MDBBadge>
                                    </MDBListGroupItem>
                                </MDBListGroup>
                            </MDBContainer>
                        </MDBContainer>
                    </div>

                    <div className={"group-profile-right-col"}>
                        <div className={"group-profile-gross"}>
                            <p>MEM 1</p>
                            <p>MEM 2</p>
                        </div>
                        <div className={"group-profile-bought"}>
                            <h1>I BOUGHT</h1>
                            <div className={"group-profile-bought-list"}>
                                <MDBListGroupItem className="d-flex justify-content-between align-items-center">Lemons
                                </MDBListGroupItem>
                                <MDBListGroupItem className="d-flex justify-content-between align-items-center">Milk
                                </MDBListGroupItem>
                            </div>
                            <div className={"group-profile-bought-input"}>
                                <MDBInput label="I Paid" />
                            </div>
                            <div className={"group-profile-bought-button"}>
                                <MDBBtn color="primary" >Submit</MDBBtn>
                            </div>
                        </div>
                    </div>
                    </div>

                </div>
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
    checkEmail, gettingGroups, addGroup
})(GroupsPage);