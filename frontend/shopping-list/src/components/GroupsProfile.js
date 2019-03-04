import React, { Component } from 'react';
import {checkEmail, getSingleGroup, addGroup, getUserProfile, getGroupUsers, getGroupHistory, getGroupItems, gettingGroups, addItem, getItems, updateItemPurchased, submitPaidItems, generateGroupInviteUrl } from '../store/actions/rootActions';
// import React, { Component, Fragment } from 'react';
// import {checkEmail, getSingleGroup, addGroup, gettingGroups, addItem, getItems, updateItemPurchesd, submitPaidItems } from '../store/actions/rootActions';

import {connect} from 'react-redux';
import "./Styles/Group.css";
import "./Styles/Scrollbar.css";
import "./Styles/GroupProfile.css";
import {
    MDBListGroup,
    MDBListGroupItem,
    MDBContainer,
    MDBBtn,
    MDBIcon,
    MDBBadge,
    MDBInput, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter,
    MDBTooltip,
    MDBScrollbar,
} from "mdbreact";
import ItemList from './ItemList';
import GroupUserList from './GroupUserList';
import UserCart from './UserCart';
import axios from "axios";
import HistoryList from "./HistoryList";

class GroupsProfile extends Component{
    state = {
        modal14: false,
        itemName: "",
        itemPrice: 0.00,
        itemQuantity: 1,
        itemMeasure: "",
        itemPurchased: false,
        total: 0.00,
        listToggle: true,
        histToggle: false,
        totalToggle: true,
        inviToggle: false,
        groupHistory: null,
        members: null,
        totals: null,
        invites:{
            [this.props.match.params.id]: 'https://shoptrak.com/i/cUsToM_InViTe_LiNk'
        }
    }

    /*
     * Triggers before the component mounts.
     * Retrieve a list of items from state
    */
    componentWillMount() {
        if(!this.props.groupItems){
            this.props.getGroupItems(this.props.match.params.id);
        } 
        
        if(!this.props.groupHistory){
            console.log('\n GROUP HISTORY FETCH ==>')
            this.props.getGroupHistory(this.props.match.params.id);
        }

        if(!this.props.groupUsers){
            console.log('GET GROUP USERS ===>')
            this.props.getGroupUsers(this.props.match.params.id);

        if(!this.props.currentUser){
            this.props.checkEmail();
        }

//         if (this.props.groups !== null) {
//             const group = this.props.groups.filter(grp => grp.id === Number(this.props.match.params.id));
//             this.setState({ members: group[0].members})
        }


    }

    componentWillReceiveProps = newProps => {
        if(newProps.needsNewItems){
            this.props.getGroupItems(this.props.match.params.id);
            this.props.getGroupHistory(this.props.match.params.id);
        }

        if(newProps.needsNewHistory){
            this.props.getGroupHistory(this.props.match.params.id);
        }

        if(!newProps.currentUser){
            this.props.checkEmail();
        }

        if(newProps.groupUsers && !this.props.groupUserProfiles){
            console.log('groupusers',  newProps.groupUsers)
            for(let i = 0; i < newProps.groupUsers.length; i++){
                this.props.getUserProfile(newProps.groupUsers[i].userID);
            }
        }
    }

    /*
     * Retrieve the group history and save to component state
    */
    getGroupHistory = (groupId) => {

        this.props.getGroupHistory(groupId);

    }

    // Toggles the modals
    toggle = viewToToggle => () => {
        this.setState({
            [viewToToggle]: !this.state[viewToToggle]
        });
    }

    copyInviteToClipboard = () => {
        console.log('add code to copy url to users clipboard');
    }

    /*
     * Handles all text/number inputs
     * @param e - Event
     */
    handleInput = e => {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    /*
     * Ticks the item checkbox in adding an item
     */
    itmPurchased = () => {
        this.setState({itemPurchased: true})
    }

    /*
     * Checks the item checkbox on the list
     * @param e - Event
     */
    check = e => {
        // Filter the item so we can check if the item has already been purchased.
        const item = this.props.items.filter(itm => itm.id === e);

        // Only check to box if the item hasn't been purchased
        if (item[0].purchasedBy === null) {
            this.props.updateItemPurchased(e);
        }
    }

    // Submits a one or more items to be purchased
    handleSubmitItems = e => {
        e.preventDefault();
        // Filter to make sure we are not sending in previous bought items
        const purchased = this.props.items.filter(itm => itm.purchased === true && itm.purchasedBy === null);
        this.props.submitPaidItems(purchased, Number(localStorage.getItem("userId")), Number(this.state.total));
        this.props.getItems(Number(this.props.match.params.id));
    }

    // Change between List and History views
    toggleListClass = () => {
        this.setState({ histToggle: false, listToggle: true, inviToggle: false})
    }

    toggleHistClass = () => {
        this.setState({ histToggle: true, listToggle: false, inviToggle: false})
    }

    toggleInviClass = () => {
        this.setState({ inviToggle: true, histToggle: false, listToggle: false})
        this.setState({ inviteUrl: this.props.generateGroupInviteUrl(localStorage.getItem("userId"), this.props.match.params.id)})
    }

    toggleTotal = () => {
        console.log("TOGGLE")
        this.setState({ totalToggle: !this.state.totalToggle })
    }

    /*
     * Creates an item object and send it to the action to add to the database
    */
    handleAddItem = (e) => {
        e.preventDefault();

        let item = null;

        // Check if purchased checkbox was ticked
        if (this.state.itemPurchased) {
            item = {
                name: this.state.itemName,
                groupID: Number(this.props.match.params.id),
                price: Number(this.state.itemPrice),
                quantity: Number(this.state.itemQuantity),
                measurement: this.state.itemMeasure,
                purchased: this.state.itemPurchased
            };

            this.props.addItem(item);
            this.setState({modal14: false});
        } else {
            item = {
                name: this.state.itemName,
                groupID: Number(this.props.match.params.id),
                price: Number(this.state.itemPrice),
                quantity: Number(this.state.itemQuantity),
                measurement: this.state.itemMeasure
            };
            this.props.addItem(item);
            this.setState({modal14: false});
        }

    }

    /*
     * Calculate the total amount the member has spent
     * @params items - Array of items to tally
     */
    totalItems = (items) => {
        const total = items.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.total;
        }, 0);

        return total;
    }

    groupBy = ( array , f ) => {
        // Set a new group object
        var groups = {};

        // Loop through the array and start sorting based on the f inputs
        array.forEach( function( o )
        {
            var group = JSON.stringify( f(o) );
            groups[group] = groups[group] || [];
            groups[group].push( o );
        });

        // Return a new array of groups
        return Object.keys(groups).map( function( group )
        {
            return groups[group];
        })
    }

    calculateTotal = () => {
        // console.log("HISTORY => ", this.state.groupHistory);
        const hists = this.state.groupHistory;
        const members = this.state.members;

        let newSorted = [];

        let arr = [];

        if (hists !== null) {

            hists.forEach((itm, i) => {
                // console.log("ITM => ", itm);

                itm.forEach((x, j) => {
                    if (x.grandTotal) {
                        // console.log(x);
                        arr.push({user: itm[0].user, total: x.grandTotal});
                    }
                })
            })

            // console.log(arr);

            const ress = this.groupBy(arr, function(itm) {
                return [itm.user]
            })

            // console.log("RESS => ", ress);
            //
            // let newSorted = [];

            // Calculate the total and send to te newSorted array
            ress.forEach((rs, i) => {
                let total = this.totalItems(ress[i]);
                const grandTotal = {
                    grandTotal: total,
                    user: rs[0].user,
                }
                newSorted.push(grandTotal);
            })

            // console.log("NEW SORTED => ", newSorted);
            return newSorted;

            // this.setState({totals: newSorted});


        }

        // this.setState({totals: newSorted});


    }

    render(){

        // if(!this.props.currentGroup){ // tell user info is loading...
        //     /**
        //      * @TODO Create a loading component that can render during data queries
        //      */
        //     return (
        //         <div>Fetching group information...</div>
        //     )
        // } else {

        return (
                <div className={"group-profile-container"}>
                    <div className={"group-profile-header"}>
                        <MDBBtn color="primary" onClick={() => {this.toggleListClass()}} >List</MDBBtn>
                        <MDBBtn color="primary" onClick={() => {this.toggleHistClass()}} >History</MDBBtn>
                        <MDBBtn color="primary" onClick={() => {this.toggleInviClass()}} >Invite</MDBBtn>
                        <MDBBtn color="primary" onClick={() => {this.toggleTotal()}} >Total</MDBBtn>
                    </div>

                <div className = 'group-profile-columns'>

                    <div className = 'group-profile-left'>

                    {this.state.listToggle ? <ItemList items = {this.props.groupItems} /> : null}

                    {this.state.histToggle ? <HistoryList history = {this.props.groupHistoryList}/> : null}
                    </div>

                    <div className = 'group-profile-right'>

                        <GroupUserList users = {this.props.groupUsers} />
                        <UserCart />
                    </div>

                    <MDBContainer>
                    <MDBModal isOpen={this.state.inviToggle} toggle={this.toggle('inviToggle')} centered>
                        <MDBModalHeader toggle={this.toggle('inviToggle')}>Group Invitation</MDBModalHeader>
                        <MDBModalBody>
                            <p className="text-left">{this.state.invites[this.props.match.params.id]}</p>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={this.toggle('inviToggle')}>Close</MDBBtn>
                            <MDBBtn color="primary" onClick={this.copyInviteToClipboard()} >Copy to clipboard</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
                </div>

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
        // group state
        groupUserProfiles: state.groupUserProfiles,
        groupUsers: state.groupUsers,
        groupHistory: state.groupHistory,
        groupHistoryList: state.groupHistoryList,

        // item state
        needsNewItems: state.needsNewItems,
        groupItems: state.groupItems,

        // current user state
        currentUser: state.currentUser,
        
        
    }
}

export default connect(mapStateToProps, {
    gettingGroups, addItem, getItems, checkEmail, updateItemPurchased, submitPaidItems, getGroupItems, getGroupHistory, getGroupUsers, getUserProfile, generateGroupInviteUrl
})(GroupsProfile);
