import React from 'react';
import {purchaseItem, addToCart, removeFromCart, updateItem, deleteItem, getItems, markItemForPurchase, unMarkItem} from '../store/actions/rootActions';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import moment from 'moment';
import { stat } from 'fs';
import {
    MDBListGroup,
    MDBListGroupItem,
    MDBCard,
    MDBCardTitle,
    MDBCardText,
    MDBContainer,
    MDBCardBody,
} from "mdbreact";
import "./Styles/History.css";

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
        return (
            <div className="history-items" key = {this.props.key}>
                <MDBCard>
                    <MDBCardBody>
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{this.props.grpHistory[0].user}</h5>
                            <small className="text-muted">{this.props.grpHistory[0].date}</small>
                        </div>
                        <MDBListGroup>
                            {
                                this.props.grpHistory.map((current, index, arr) => (
                                    <p className="mb-1 history-item">{current.name}</p>
                                ))
                            }
                            <h5 className="mb-1">Total: ${this.props.grpHistory[this.props.grpHistory.length - 1].grandTotal.toFixed(2)}</h5>
                        </MDBListGroup>
                    </MDBCardBody>
                </MDBCard>
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