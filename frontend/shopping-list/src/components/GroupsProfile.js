import React, { Component } from 'react';
import {addItem, getItems, updateItemPurchesd, submitPaidItems } from '../store/actions/rootActions';
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
    MDBInput, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter,
    MDBPopover, MDBPopoverBody, MDBPopoverHeader,
} from "mdbreact";

class GroupsPage extends Component{
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
        total: 0.00
    }

    componentWillMount() {
        this.props.getItems(Number(this.props.match.params.id));
    }

    componentDidMount(){

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
        })
    }

    check = e => {
        // Filter the item so we can check if the item has already been purchased.
        const item = this.props.items.filter(itm => itm.id === e);

        // Only check to box if the item hasn't been purchased
        if (item[0].purchasedBy === null) {
            this.props.updateItemPurchesd(e);
        }
    }

    handleSubmitItems = e => {
        e.preventDefault();
        const purchased = this.props.items.filter(itm => itm.purchased === true && itm.purchasedBy === null);
        this.props.submitPaidItems(purchased, Number(localStorage.getItem("userId")), Number(this.state.total));
    }

    /*
     * Creates an item object and send it to the action to add to the database
    */
    handleAddItem = () => {
        const item = {
            name: this.state.itemName,
            groupID: Number(this.props.match.params.id),
            price: Number(this.state.itemPrice),
            quantity: Number(this.state.itemQuantity),
            measurement: this.state.itemMeasure,
            purchased: this.state.itemPurchased
        };
        this.props.addItem(item);
        this.setState({modal14: false});

    }



    render(){
        let purchased = [];
        this.props.items !== null ? purchased = this.props.items.filter(itm => itm.purchased === true && itm.purchasedBy === null) : purchased = [];
        return (
            <div>
                <Navigation />
                <div className={"group-profile-container"}>
                    <div className={"group-profile-header"}>
                        <MDBBtn color="primary" >List</MDBBtn>
                        <MDBBtn color="primary" >History</MDBBtn>
                        <MDBBtn color="primary" >Invite</MDBBtn>
                        <MDBBtn color="primary" >Total</MDBBtn>
                    </div>
                    <div className={"group-profile-header-title"}><h3>{this.state.group !== null ? this.state.group.name : ""}</h3></div>
                    <div className={"group-profile-columns"}>

                        <div className={"group-profile-list"}>
                            <div className={"group-profile-list-container"}>
                                <MDBContainer>
                                    <MDBContainer>
                                        <MDBListGroup style={{ width: "22rem" }}>
                                            {
                                                this.props.items !== null ? this.props.items.map((item, i) => (
                                                        <MDBListGroupItem key={i} className="d-flex justify-content-between align-items-center">
                                                            <button type="button" onClick={() => this.check(item.id)} className={item.purchased ? "close1 item-purchased close" : "close close1"} aria-label="Close">
                                                                <MDBBadge color="primary"><MDBIcon icon="check" /> </MDBBadge>
                                                            </button>
                                                            <p className={"item-name"}>{item.name}</p>
                                                            <button type="button" className="close" aria-label="Close">
                                                                <span aria-hidden="true">×</span>
                                                            </button>
                                                        </MDBListGroupItem>
                                                    )) : null
                                            }

                                        </MDBListGroup>
                                    </MDBContainer>
                                </MDBContainer>
                            </div>
                            <div className={"group-profile-list-button"}>
                                <MDBBtn color="primary" onClick={this.toggle(14)} >ADD</MDBBtn>
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
                                        purchased !== null ?
                                        purchased.map(itm => (
                                            <p>{itm.name}, </p>
                                        )) : null
                                    }
                                </div>
                                <div className={"group-profile-bought-input"}>
                                    <h1>$</h1><MDBInput label="I Paid" type={"number"} step={0.01} name={"total"} onChange={this.handleInput} defaultValue={this.state.total} />
                                </div>
                                <div className={"group-profile-bought-button"}>
                                    <MDBBtn color="primary" onClick={e => this.handleSubmitItems(e)} >Submit</MDBBtn>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <MDBContainer>
                    <MDBModal isOpen={this.state.modal14} toggle={this.toggle(14)} centered>
                        <MDBModalHeader toggle={this.toggle(14)}>Add New Item</MDBModalHeader>
                        <MDBModalBody>
                            <MDBInput required label="Item Name *" type={"text"} name={"itemName"} onChange={this.handleInput} defaultValue={this.state.groupName}/>
                            <MDBInput required label="Item Price *" type={"number"} step={0.01} name={"itemPrice"} onChange={this.handleInput} defaultValue={this.state.itemPrice}/>
                            <MDBInput required label="Item Quantity *" type={"number"} name={"itemQuantity"} onChange={this.handleInput} defaultValue={this.state.itemQuantity}/>
                            <MDBInput label="Item Measurement" type={"text"} name={"itemMeasure"} onChange={this.handleInput} defaultValue={this.state.itemMeasure}/>
                            <MDBInput label="Item Purchased" type={"checkbox"} name={"itemPurchased"} onChange={this.handleInput} defaultValue={this.state.itemPurchased}/>

                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={this.toggle(14)}>Close</MDBBtn>
                            <MDBBtn color="primary" onClick={this.handleAddItem}>Create</MDBBtn>
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
        groups: state.groups,
        items: state.items,
    }
}

export default connect(mapStateToProps, {
    addItem, getItems, updateItemPurchesd, submitPaidItems
})(GroupsPage);