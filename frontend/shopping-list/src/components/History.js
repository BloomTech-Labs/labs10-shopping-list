import React from 'react';
import {purchaseItem, addToCart, removeFromCart, updateItem, deleteItem, getItems, markItemForPurchase, unMarkItem} from '../store/actions/rootActions';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import moment from 'moment';
import { stat } from 'fs';
import {
    MDBListGroup,
    MDBListGroupItem,
} from "mdbreact";

class History extends React.Component {


    constructor(props){
        super(props);
        this.state = {
            item: "name",
            isEditing: false,
            inCart: false,
        }
    }

    render(){
        console.log("HISTORY => ", this.props.grpHistory)
        return (
            <div className = 'item-container' key = {this.props.key}>
                <h1>{this.props.grpHistory[0].user}</h1>
                <MDBListGroup>
                    {
                        this.props.grpHistory.map((current, index, arr) => (
                            <MDBListGroupItem>
                                {index === arr.length - 1 ? null : current.name}
                            </MDBListGroupItem>
                        ))
                    }

                </MDBListGroup>
                <h1>{this.props.grpHistory[0].date} | {this.props.grpHistory[this.props.grpHistory.length - 1].grandTotal}</h1>
            </div>
        )
    }
}
const mapStateToProps = state => {
    state = state.rootReducer; // pull values from state root reducer
    return {
        //state items
        groupHistoryList: state.groupHistoryList,
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    updateItem,
    deleteItem,
    addToCart,
    removeFromCart
})(History));