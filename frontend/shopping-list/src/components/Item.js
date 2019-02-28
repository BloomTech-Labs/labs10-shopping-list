import React from 'react';
import {purchaseItem, getItems, markItemForPurchase, unMarkItem} from '../store/actions/rootActions';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import moment from 'moment';
import './Styles/Item.css';
import { stat } from 'fs';

class Item extends React.Component {


    constructor(props){
        super(props);
        this.state = {
            item: this.props.item.name
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
        if(this.state.price === ''){
            this.setState({
                price: this.state.oldprice
            })
        }
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    render(){
    console.log('ITEM PROPS', this.props);
        return (
            <div className = 'item-container' key = {this.props.key}>
            
            </div>
        )
        }
}
const mapStateToProps = state => {
    state = state.rootReducer; // pull values from state root reducer
    return {
        //state items
        currentUser: state.currentUser,
        groupItems: state.groupItems,
        groupUsers: state.groupItems,
        needsNewItems: state.needsNewItems
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    
})(Item));