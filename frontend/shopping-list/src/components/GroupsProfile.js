import React, { Component } from 'react';
import {checkEmail, gettingGroups, addGroup, getItems, getSingleGroup } from '../store/actions/rootActions';
import {connect} from 'react-redux';
import Navigation from "./Navigation";
import "./Styles/Group.css";
import {
    MDBListGroup,
    MDBListGroupItem,
    MDBContainer,
    MDBBtn,
    MDBIcon,
    MDBBadge,
    MDBInput,
    // MDBNavLink,
    // MDBCard, MDBCardHeader, MDBCardBody, MDBCardTitle, MDBCardText
} from "mdbreact";

class GroupsPage extends Component{
    state = {
        modal14: false,
        group: null,
        items: [
            {
                name: "milk",
                purchased: true,
            },
            {
                name: "eggs",
                purchased: false,
            }
        ]
    }

    async componentWillMount(){
        // see if the desired group is in state
        if(!this.props.currentGroup || this.props.currentGroup === null || this.props.currentGroup.id !== this.props.match.params.id){
            console.log('NO GROUP IN STATE');
            // if not, fetch it from the database
            // this function is necessary to prevent the app crashing on refresh or if a user visits it from a direct link, e.g. a bookmark
            await this.props.getSingleGroup(this.props.match.params.id); // fetches group info from server and adds it to state
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

    check = e => {
        const items = this.state.items.map((item, i) => {
            if (i === e) item.purchased = !item.purchased;
            return item;
        })

        this.setState({ items })
    }

    render(){
        console.log('current group', this.props.currentGroup);
        const purchased = this.props.items.filter(itm => itm.purchased === true);
        
        if(!this.props.currentGroup){ // tell user info is loading...
            /**
             * @TODO Create a loading component that can render during data queries
             */
            return (
                <div>Fetching group information...</div>
            )
        } else {
        
        return (
            <div>
                <Navigation />
                <div className={"group-profile-container"}>
                    {/*<h1>{this.state.group !== null ? this.state.group.name : ""}</h1>*/}
                    
                    <h1>{this.props.currentGroup.name}</h1>
                    <div className={"group-profile-header"}>
                        <MDBBtn color="primary" >List</MDBBtn>
                        <MDBBtn color="primary" >History</MDBBtn>
                        <MDBBtn color="primary" >Invite</MDBBtn>
                        <MDBBtn color="primary" >Total</MDBBtn>
                    </div>
                    <div className={"group-profile-header-title"}><h3>{this.props.currentGroup.name}</h3></div>
                    <div className={"group-profile-columns"}>

                        <div className={"group-profile-list"}>
                            <div className={"group-profile-list-container"}>
                                <MDBContainer>
                                    <MDBContainer>
                                        <MDBListGroup style={{ width: "22rem" }}>
                                            {this.props.items.map((item, i) => (
                                                <MDBListGroupItem onClick={() => this.check(i)} className="d-flex justify-content-between align-items-center">{item.name}<MDBBadge
                                                    color="primary">{item.purchased ? <MDBIcon icon="check" /> : null}</MDBBadge>
                                                </MDBListGroupItem>
                                            ))}
                                        </MDBListGroup>
                                    </MDBContainer>
                                </MDBContainer>
                            </div>
                            <div className={"group-profile-list-button"}>
                                <MDBBtn color="primary" >ADD</MDBBtn>
                            </div>
                        </div>

                        <div className={"group-profile-right-col"}>
                            <div className={"group-profile-gross"}>
                                <p>MEM 1</p>
                                <p>MEM 2</p>
                            </div>
                            <div className={"group-profile-bought"}>
                                <h1>I BOUGHT</h1>
                                <div className={"group-profile-bought-list"}>
                                    {
                                        purchased.map(itm => (
                                            <p>{itm.name}, </p>
                                        ))
                                    }
                                </div>
                                <div className={"group-profile-bought-input"}>
                                    <h1>$</h1><MDBInput label="I Paid" />
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
}

const mapStateToProps = state => {
    state = state.rootReducer; // pull values from state root reducer
    return {
        //state items
        groups: state.groups,
        items: state.items,
        currentGroup: state.currentGroup,
    }
}

export default connect(mapStateToProps, {
    checkEmail, gettingGroups, addGroup, getItems, getSingleGroup
})(GroupsPage);