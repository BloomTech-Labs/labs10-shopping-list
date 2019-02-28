import React from 'react';
import {purchaseItem, addToCart, removeFromCart, updateItem, deleteItem, getItems, markItemForPurchase, unMarkItem} from '../store/actions/rootActions';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import moment from 'moment';
import './Styles/Item.css';
import { stat } from 'fs';

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
        if(this.props.item.purchased === 1){
            return null;
        } else {
            return (
                <div className = 'item-container' onDoubleClick = {this.handleEdit} key = {this.props.key}>
                {this.state.isEditing === false ? 
                (
                    <div className = 'item-row'><span><h2>{this.props.item.name}</h2></span><button onClick = {this.handleDelete}>Delete</button>

                    {this.state.inCart !== true ? (
                        <button onClick = {this.addToCart}>Add to Cart</button>

                    ) : <button onClick = {this.removeFromCart}>Remove from Cart</button>}

                    </div>


                ) : (<div>
                    <form className = 'edit-form' onSubmit = {this.handleClickOutside}><input type = 'text' name = 'item' value = {this.state.item} onChange = {this.handleChange}></input>
                    <button type = 'submit'>Submit Changes</button></form>
                    </div>)}
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