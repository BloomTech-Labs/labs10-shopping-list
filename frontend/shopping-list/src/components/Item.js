import React from 'react';
import {purchaseItem} from '../store/actions/rootActions';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import moment from 'moment';
import './Styles/Item.css';

class Item extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            purchased: props.item.purchased,
            price: props.item.price,
            oldprice: null,
        }
    }

    handleChange = event => {
        event.preventDefault();
        this.setState({
            price: event.target.value
        })
    }

    clearField = event => {
        // event.preventDefault();
        document.addEventListener('mousedown', this.handleClickOutside);
        let oldprice = this.state.price;
        this.setState({
            oldprice: oldprice,
            price: '',
        })
    }

    makeFloat = () => {
        if(this.state.price && this.state.price.indexOf('.') === -1){
            
            let floatPrice = Number(this.state.price);
            floatPrice = floatPrice.toFixed(2);
            this.setState({
                price: floatPrice,
            })
        }

        if(this.state.price && this.state.price.indexOf('.')){
            let length = this.state.price.length;
            if(this.state.price.indexOf('.') - length < 2){
                let floatPrice = Number(this.state.price);
                floatPrice = floatPrice.toFixed(2);
                this.setState({
                    price: floatPrice,
                })
            }
        }
    }

    handleClickOutside = event => {
        // event.preventDefault();
        if(this.state.price === ''){
            this.setState({
                price: this.state.oldprice
            })
        }

        this.makeFloat();

        document.removeEventListener('mousedown', this.handleClickOutside);
    }


    handlePurchase = event => {
        event.preventDefault();
        this.makeFloat();

        let time = moment().format(); //ISO standard

        let item = {
            price: this.state.price,
            purchasedBy: this.props.userId,
            purchased: true,
            purchasedOn: time,
        }

        this.props.purchaseItem(item, this.props.item.id);

    }

    render(){
    
        return (
            <div className = 'item-container' key = {this.props.key}>
            

            <form>
            <div className = 'item-list-name'>{this.props.item.name}</div>
                <div className = 'item-list-quantity'>Quantity: {this.props.item.quantity}</div>
                
                {this.props.item.purchasedBy ? 
                <div className = 'item-purchased-by'>Purchased By: {this.props.item.purchasedBy}</div>
                : <div className = 'item-purchased-by'>Not purchased</div>}

                <div>
                $<input type = 'number' onMouseDown = {this.clearField} onChange = {this.handleChange} value = {this.state.price} placeholder = 'Enter price ($0.00)' min = '0' step = 'any' >
                </input>
                </div>
                <button type = 'submit' onClick = {this.handlePurchase}>Purchase</button>
            </form>
            </div>
        )
        }
}
const mapStateToProps = state => {
    state = state.rootReducer; // pull values from state root reducer
    return {
        //state items
        userId: state.userId,
        name: state.name,
        email: state.email,
        profilePicture: state.profilePicture,
        groups: state.groups,
        items: state.items,
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    purchaseItem,

})(Item));