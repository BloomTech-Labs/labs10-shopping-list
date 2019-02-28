import React, { Component } from 'react';
import {checkEmail, getSingleGroup, addGroup, getGroupHistory, getGroupItems, gettingGroups, addItem, getItems, updateItemPurchased, submitPaidItems } from '../store/actions/rootActions';
import {connect} from 'react-redux';
import "./Styles/Group.css";
import "./Styles/Scrollbar.css";
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

class GroupsProfile extends Component{
    state = {
        modal14: false,
        group: null,
        items: [
            {
                name: "milk",
                purchased: true,
            }
        ],
        itemName: "",
        itemPrice: 0.00,
        itemQuantity: 1,
        itemMeasure: "",
        itemPurchased: false,
        total: 0.00,
        listToggle: true,
        histToggle: false,
        groupHistory: null,
    }

//     async componentWillMount(){ // this version of CWM queries the single group, rather than collecting all groups.
//         // see if the desired group is in state
//         if(!this.props.currentGroup || this.props.currentGroup === null || this.props.currentGroup.id !== this.props.match.params.id){
//             console.log('NO GROUP IN STATE');
//             // if not, fetch it from the database
//             // this function is necessary to prevent the app crashing on refresh or if a user visits it from a direct link, e.g. a bookmark
//             await this.props.getSingleGroup(this.props.match.params.id); // fetches group info from server and adds it to state

    /*
     * Triggers before the component mounts.
     * Retrieve a list of items from state
    */
    componentWillMount() {
        if(!this.props.groupItems){
            this.props.getGroupItems(this.props.match.params.id);
        }

        if(!this.props.groupHistory){
            this.props.getGroupHistory(this.props.match.params.id);
        }
    }

    componentWillReceiveProps = newProps => {
        if(newProps.needsNewItems){
            this.props.getGroupItems(this.props.match.params.id);
        }

        if(newProps.needsNewHistory){
            this.props.getGroupHistory(this.props.match.params.id);
        }
    }

    /*
     * Retrieve the group history and save to component state
    */
    getGroupHistory = (groupId) => {

        this.props.getGroupHistory(groupId);

    }

    // Toggles the modals
    toggle = nr => () => {
        let modalNumber = 'modal' + nr
        this.setState({
            [modalNumber]: !this.state[modalNumber]
        });
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

        this.setState({ histToggle: false, listToggle: true})
    }

    toggleHistClass = () => {
        this.setState({ histToggle: true, listToggle: false})
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


    render(){
        return (
                <div className={"group-profile-container"}>
                    <div className={"group-profile-header"}>
                        <MDBBtn color="primary" onClick={() => {this.toggleListClass()}}>List</MDBBtn>
                        <MDBBtn color="primary" onClick={() => {this.toggleHistClass()}} >History</MDBBtn>
                        <MDBBtn color="primary" >Invite</MDBBtn>
                        <MDBBtn color="primary" >Total</MDBBtn>
                    </div>
                    
                    <ItemList items = {this.props.groupItems} />
                    
                    <GroupUserList users = {this.props.groupUsers} />

                    <UserCart />

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
        currentGroup: state.currentGroup,



        needsNewItems: state.needsNewItems,
        groupItems: state.groupItems,
        currentUser: state.currentUser,
        groupUsers: state.groupUsers,
        groupHistory: state.groupHistory,
    }
}

export default connect(mapStateToProps, {
    gettingGroups, addItem, getItems, updateItemPurchased, submitPaidItems, getGroupItems, getGroupHistory
})(GroupsProfile);