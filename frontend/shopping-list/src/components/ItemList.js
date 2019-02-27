import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Item from './Item';
import {getItems, addItem} from '../store/actions/rootActions';
import './Styles/ItemList.css';

class ItemList extends React.Component{
    async componentDidMount(){
        if(this.state.groupId){
            this.props.getItems(this.state.groupId);
        }
        // this.props.getItems();
    }
    
    constructor(props){
        super(props);

        this.state = {
            ...this.state,
            item: '',
            quantity: 0,
            measurement: '(none)',
            groupID: this.props.match.params.id,
        }
    }

    fetchItems = id => {
        this.props.getItems(id);
    }

    increase = event => {
        event.preventDefault();
        let newQuantity = this.state.quantity += 1;
        this.setState({
            quantity: newQuantity,
        })
    }

    decrease = event => {
        event.preventDefault();
        if((this.state.quantity - 1) > 0 ){
            let newQuantity = this.state.quantity -= 1;
            this.setState({
                quantity: newQuantity,
            })
        }
        
    }

    handleInput = event => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value,
        });
    }
    
    handleSubmit = event => {
        event.preventDefault();
        if(this.state.item && this.state.quantity > 0){
            let item = {
                purchasedBy: null,
                groupID: Number(this.state.groupID),
                name: this.state.item,
                quantity: this.state.quantity,
                purchased: false,
                price: parseFloat('0.00'),
                measurement: this.state.measurement,
            }

            console.log('item', item);
            
            // send item to db
            this.props.addItem(item);

        } else {

        }
    }


    render(){
        let itemList = [];
        if(this.props.items){
            itemList = this.props.items.map(item => {
                return <Item item = {item} key = {item.id}/>
            })
        } else {
            return <h2>No Items on the List</h2>
        }

        return(
            <div className = 'item-list-container'>
            <h1>Shopping List</h1>
            <div className = 'item-list'>
            {itemList}
            </div>
            
            <div className = 'item-form'>

            <form onSubmit = {this.handleSubmit}>
                <input type = 'text' name = 'item' placeholder = 'Add an item' value = {this.state.item} onChange = {this.handleInput}/>
                <div className = 'item-quantity'>
                <button onClick = {this.decrease}>-</button>
                <input type = 'number' name = 'quantity' placeholder = 'Quantity' onChange = {this.handleInput} value = {this.state.quantity} /> 
                <button onClick = {this.increase}>+</button>
                </div>

                <div className = 'item-measurement'>
                <h4>measurement</h4>
                <select name = 'measurement' onChange = {this.handleInput}>
                    <option>(none)</option>
                    <option>oz</option>
                    <option>lb</option>
                    <option>L</option>
                    <option>gal</option>
                    <option>dozen</option>
                    <option>piece</option>
                </select>
                </div>
                <button type = 'submit'>Add Item</button>
            </form>

            </div>

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
    getItems,
    addItem,

})(ItemList));