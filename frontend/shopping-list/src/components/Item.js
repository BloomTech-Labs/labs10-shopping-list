import React from 'react';
import {purchaseItem, addToCart, removeFromCart, updateItem, deleteItem, getItems, markItemForPurchase, unMarkItem} from '../store/actions/rootActions';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import moment from 'moment';
import './Styles/Item.css';
import { stat } from 'fs';
import {
    MDBListGroup,
    MDBListGroupItem,
    MDBContainer,
    MDBBtn,
    MDBIcon,
    MDBBadge,
    MDBInput, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter,
    MDBTooltip,
    MDBScrollbar, MDBCardBody, MDBCard,
} from "mdbreact";

class Item extends React.Component {


    constructor(props){
        super(props);
        this.state = {
            item: this.props.item.name,
            isEditing: false,
            inCart: false,
        }
    }

    handleChange = event => {
        event.preventDefault();
        this.setState ({
            [event.target.name]: event.target.value,
        })
    }

    handleClickOutside = event => {
        // event.preventDefault();
        if(event.target.name === 'item'){
            return;
        } else {
        this.setState({
            isEditing: false,
        })

        if(this.state.item !== this.props.item.name){
            // if a new name is entered, update it in the database
            let item = this.props.item;
            item.name = this.state.item;
            console.log('new item', item);
            this.props.updateItem(item);
        }

        document.removeEventListener('mousedown', this.handleClickOutside);
    }
}

    handleEdit = event => {
        event.preventDefault();
        document.addEventListener('mousedown', this.handleClickOutside);
        this.setState({
            isEditing: true
        })
    }

    handleDelete = event => {
        event.preventDefault();
        this.props.deleteItem(this.props.item);
    }

    addToCart = event => {
        event.preventDefault();
        this.setState ({
            inCart: true,
        })
        this.props.addToCart(this.props.item);
    }

    removeFromCart = event => {
        event.preventDefault();
        this.setState({
            inCart: false,
        })
        this.props.removeFromCart(this.props.item);
    }

    render(){
        if(this.props.item.purchased === true){
            return null;
        } else {
            return (
                <div className = 'item-container' onDoubleClick = {this.handleEdit} key = {this.props.key}>
                    {/*<div className="delete-hover"><MDBIcon icon="trash" size="2x" onClick={this.handleDelete} /></div>*/}
                    <MDBCard>
                        <MDBCardBody>
                            <MDBListGroup>
                                {this.state.isEditing === false ?
                                    (
                                        <div className = 'item-row'><span><h2>{this.props.item.name}</h2></span>
                                            <div className="delete-hover">
                                                <MDBIcon icon="trash" size="2x" className="red-text ml-3" onClick={this.handleDelete} />

                                                {/*<MDBBtn floating size="lg" gradient="purple"><MDBIcon icon="bolt" /></MDBBtn>*/}
                                            </div>
                                            <div className="mobile-hover">
                                                <MDBIcon icon="trash" size="lg" className="red-text ml-3" onClick={this.handleDelete} />
                                            </div>
                                            {this.state.inCart !== true ? (
                                                <MDBBtn className="btn-dark-green" onClick = {this.addToCart} >Add to Cart</MDBBtn>

                                            ) : <MDBBtn color="success" onClick = {this.removeFromCart} >Remove to Cart</MDBBtn>}

                                        </div>


                                    ) : (<div>
                                        <form className="form-group" onSubmit = {this.handleClickOutside}>
                                            <MDBInput size="lg"  label="Change Item Name" type = 'text' name = 'item' valueDefault= {this.state.item} onChange = {this.handleChange}></MDBInput>
                                            <MDBBtn className="btn-dark-green" type = 'submit' >Submit Changes</MDBBtn>
                                        </form>
                                    </div>)}
                            </MDBListGroup>
                        </MDBCardBody>
                    </MDBCard>
                </div>
            )
        }
    }
}
const mapStateToProps = state => {
    state = state.rootReducer; // pull values from state root reducer
    return {
        //state items
        currentUser: state.currentUser,
        groupItems: state.groupItems,
        groupUsers: state.groupItems,
        needsNewItems: state.needsNewItems,
        userCart: state.userCart
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    updateItem,
    deleteItem,
    addToCart,
    removeFromCart
})(Item));