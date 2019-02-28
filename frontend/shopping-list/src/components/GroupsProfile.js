import React, { Component, Fragment } from 'react';
import {checkEmail, getSingleGroup, addGroup, gettingGroups, addItem, getItems, updateItemPurchesd, submitPaidItems } from '../store/actions/rootActions';
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
import axios from "axios";

class GroupsPage extends Component{
    state = {
        modal14: false,
        itemName: "",
        itemPrice: 0.00,
        itemQuantity: 1,
        itemMeasure: "",
        email: "",
        itemPurchased: false,
        total: 0.00,
        listToggle: true,
        histToggle: false,
        totalToggle: true,
        inviToggle: false,
        groupHistory: null,
        members: null,
        totals: null,
    }

    /*
     * Triggers before the component mounts.
     * Retrieve a list of items from state
    */
    componentWillMount() {
        this.props.gettingGroups();
        this.props.getItems(Number(this.props.match.params.id));
        this.getGroupHistory();


        if (this.props.groups !== null) {
            const group = this.props.groups.filter(grp => grp.id === Number(this.props.match.params.id));
            this.setState({ members: group[0].members})
        }


    }

    /*
     * Retrieve the group history and save to component state
    */
    getGroupHistory = () => {
        let backendURL;
        if(process.env.NODE_ENV === 'development'){
            backendURL = `http://localhost:9000`
        } else {
            backendURL = `https://shoptrak-backend.herokuapp.com`
        }

        const token = localStorage.getItem('jwt');
        const endpoint = `${backendURL}/api/grouphistory/group/${this.props.match.params.id}`;

        const options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        axios.get(endpoint, options).then(res => {
            this.setState({ groupHistory: res.data.data})
        }).catch(err => console.log(err));
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
            this.props.updateItemPurchesd(e);
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
//         console.log('current group', this.props.currentGroup);
//         const purchased = this.props.items.filter(itm => itm.purchased === true);

        // if(!this.props.currentGroup){ // tell user info is loading...
        //     /**
        //      * @TODO Create a loading component that can render during data queries
        //      */
        //     return (
        //         <div>Fetching group information...</div>
        //     )
        // } else {

        // Filter items by which has been purchased - used for the `I Bought` form
        let purchased = [];
        this.props.items !== null ? purchased = this.props.items.filter(itm => itm.purchased === true && itm.purchasedBy === null) : purchased = [];
        // Gather histories
        const histories = this.state.groupHistory;
        let total = this.calculateTotal();
        console.log("TOTAL => ", total);

        return (
            <div>
                <div className={"group-profile-container"}>
                    <div className={"group-profile-header"}>
                        <MDBBtn color="primary" onClick={() => {this.toggleListClass()}} >List</MDBBtn>
                        <MDBBtn color="primary" onClick={() => {this.toggleHistClass()}} >History</MDBBtn>
                        <MDBBtn color="primary" onClick={() => {this.toggleInviClass()}} >Invite</MDBBtn>
                        <MDBBtn color="primary" onClick={() => {this.toggleTotal()}} >Total</MDBBtn>
                    </div>
                    <div className={"group-profile-header-title"}><h3></h3></div>
                    <div className={"group-profile-columns"}>
                        <div className={"group-profile-list"}>
                            <div className={"group-profile-list-container scrollbar"}>
                                <MDBContainer>
                                    <MDBContainer >
                                        {
                                            this.state.listToggle === true ? <MDBListGroup>
                                                {
                                                    this.props.items !== null ? this.props.items.map((item, i) => (
                                                        <MDBListGroupItem key={i} className="d-flex justify-content-evenly align-items-center">
                                                            <button type="button" onClick={() => this.check(item.id)} className={item.purchased ? "close1 item-purchased close" : "close close1"} aria-label="Close">
                                                                <MDBBadge color="primary"><MDBIcon icon="check" /> </MDBBadge>
                                                            </button>
                                                            <p className={"item-name"}>{item.name}</p>
                                                            {/*<button type="button" className="close" aria-label="Close">*/}
                                                                {/*<span aria-hidden="true">×</span>*/}
                                                            {/*</button>*/}
                                                        </MDBListGroupItem>
                                                    )) : null
                                                }
                                            </MDBListGroup> : null
                                        }
                                        {
                                            this.state.histToggle === true ?<div className={"history-list"}>
                                                {
                                                    histories !== null ? histories.map((itm,i) => (
                                                        <div>
                                                            <MDBListGroup>
                                                                <MDBListGroupItem>
                                                                <h3>{histories[i][0].user}</h3>
                                                                {
                                                                    histories[i].map((it, ii) => (
                                                                        <p className={"history-items"}>{it.name}</p>
                                                                    ))
                                                                }
                                                                <h4>{histories[i][0].date} | Total: $ {histories[i][histories[i].length - 1].grandTotal}</h4>
                                                                </MDBListGroupItem>
                                                                <br />
                                                            </MDBListGroup>
                                                        </div>
                                                    )) : <p>NULL</p>
                                                }
                                            </div> : null
                                        }
                                        {
                                            this.state.inviToggle === true ? <div className={"invitation"}>
                                                <MDBListGroup>
                                                    <MDBListGroupItem>
                                                        <form class="text-center border border-light p-5">
                                                            <MDBInput
                                                                label="email"
                                                                type="email"
                                                                name="email"
                                                            />
                                                            <MDBBtn color="primary">
                                                                Submit
                                                            </MDBBtn>
                                                        </form>
                                                    </MDBListGroupItem>
                                                </MDBListGroup>
                                            </div> : null
                                        }

                                    </MDBContainer>
                                </MDBContainer>
                            </div>
                            {
                                this.state.listToggle === true ? <div className={"group-profile-list-button"}>
                                    <MDBBtn color="primary" onClick={this.toggle(14)} >ADD</MDBBtn>
                                </div> : null
                            }
                        </div>

                        <div className={"group-profile-right-col"}>
                            {
                                this.state.totalToggle === true ? <div className={"group-profile-gross"}>
                                {
                                    this.props.groups !== null ? this.props.groups.map((elem, i) => (
                                        <div className={"group-profile-gross-members"}>
                                            {
                                                elem.id === Number(this.props.match.params.id) ? elem.members.map((el, id) => (
                                                    <div className={"group-profile-gross-members-box"}>
                                                        {
                                                            total !== undefined ? total.map((item, j) => (
                                                                <div>
                                                                    {
                                                                        item.user === el.name ? <p>{item.grandTotal}</p> : null
                                                                    }
                                                                </div>
                                                            )) : <p>Calculating</p>
                                                        }
                                                        <img src={el.profilePicture} alt="Avatar" className="avatar" />
                                                        <p>{el.name}</p>
                                                    </div>
                                                )) : null
                                            }
                                        </div>
                                    )) : <p>Loading</p>
                                }
                                </div> : <div className={"group-profile-gross"}> <p>NET</p></div>
                            }
                            {this.state.listToggle === true ? <div className={"group-profile-bought"}>
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
                                    <h1>$</h1><MDBInput label="I Paid" type={"number"} step={0.01} name={"total"}
                                                        onChange={this.handleInput} defaultValue={this.state.total}/>
                                </div>
                                <div className={"group-profile-bought-button"}>
                                    <MDBBtn color="primary" onClick={e => this.handleSubmitItems(e)}>Submit</MDBBtn>
                                </div>
                            </div> : null
                            }
                        </div>
                    </div>

                </div>
                <MDBContainer>
                    <MDBModal isOpen={this.state.modal14} toggle={this.toggle(14)} centered>
                        <MDBModalHeader toggle={this.toggle(14)}>Add New Item</MDBModalHeader>
                        <MDBModalBody>
                            <form className="needs-validation" onSubmit={this.handleAddItem}>
                                <MDBInput className={"form-control"} required label="Item Name *" type={"text"} name={"itemName"} onChange={this.handleInput} defaultValue={this.state.groupName}/>
                                <MDBInput required label="Item Price *" type={"number"} step={0.01} name={"itemPrice"} onChange={this.handleInput} defaultValue={this.state.itemPrice}/>
                                <MDBInput required label="Item Quantity *" type={"number"} name={"itemQuantity"} onChange={this.handleInput} defaultValue={this.state.itemQuantity}/>
                                <MDBInput label="Item Measurement" type={"text"} name={"itemMeasure"} onChange={this.handleInput} defaultValue={this.state.itemMeasure}/>
                                <MDBTooltip
                                    placement="top"
                                    tag="div"
                                    tooltipContent="Item will be added to bought list. Does not save until you submit all purchased items.">
                                    <div style={{ textAlign: "center" }}>
                                        <div className="md-checkbox md-checkbox-inline">
                                            <input id="i2" type="checkbox" defaultChecked={this.state.itemPurchased} onClick={this.itmPurchased} />
                                            <label htmlFor="i2">Purchased</label>
                                        </div>
                                    </div>
                                </MDBTooltip>
                            </form>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={this.toggle(14)}>Close</MDBBtn>
                            <MDBBtn color="primary" onClick={e => this.handleAddItem(e)}>Create</MDBBtn>
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
        currentGroup: state.currentGroup,
    }
}

export default connect(mapStateToProps, {
//     checkEmail, gettingGroups, addGroup, getItems, getSingleGroup
    gettingGroups, addItem, getItems, updateItemPurchesd, submitPaidItems
})(GroupsPage);