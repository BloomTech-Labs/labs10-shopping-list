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
        console.log('q', this.state.quantity);
        let newQuantity = this.state.quantity += 1;
        this.setState({
            quantity: newQuantity,
        })
    }

    decrease = event => {
        event.preventDefault();
        if((this.state.quantity - 1) >= 0 ){
            console.log('quant', this.state.quantity);
            let newQuantity = this.state.quantity -= 1;
            this.setState({
                quantity: newQuantity,
            })
        }
        
    }

    clearInput = event => {
        event.preventDefault();
        document.addEventListener('mousedown', this.handleClickOutside);
        if(event.target.name === 'quantity'){
            let oldQuantity = this.state.quantity;
            this.setState({
                [event.target.name]: '',
                oldQuantity: oldQuantity
            })
        }
    }

    handleInput = event => {
        event.preventDefault();
        if(event.target.name === 'quantity'){
            if(event.target.value){
                if(!isNaN(event.target.value)){
                    this.setState({
                        [event.target.name]: Number(event.target.value)
                    })
                }
            }
        } else {

            this.setState({
                [event.target.name]: event.target.value,
            });
        }
    }

    handleClickOutside = event => {
        if(!this.state.quantity){
            if(this.state.oldQuantity){
                this.setState({
                    quantity: this.state.oldQuantity,
                })
            } else {
                this.setState({
                    quantity: 0,
                })
            }
            
        }
        document.removeEventListener('mousedown', this.handleClickOutside);
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

            this.setState({
                item: '',
                quantity: 0,
                measurement: '(none)',
                groupID: this.props.match.params.id,
            })

        } else {
            window.alert('Must include name and quantity.');
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

            <div className = 'item-form-top'>
            <span id = 'name'>
            Name
            </span>

            <span id = 'quantity'>
            Quantity
            </span>

            <span id = 'measurement'>
            Measurement
            </span>

            <span id = 'submit'>
            Submit
            </span>

            </div>

            <form onSubmit = {this.handleSubmit}>
                <input type = 'text' name = 'item' placeholder = 'Add an item' value = {this.state.item} onChange = {this.handleInput}/>
                
                <div className = 'item-quantity'>
                <button onClick = {this.decrease}>-</button>
                <input type = 'text' name = 'quantity' placeholder = 'Quantity' onClick = {this.clearInput} onChange = {this.handleInput} value = {this.state.quantity} /> 
                <button onClick = {this.increase}>+</button>
                </div>
                
                <select name = 'measurement' onChange = {this.handleInput}>
                    <option>(none)</option>
                    <option>oz</option>
                    <option>lb</option>
                    <option>L</option>
                    <option>gal</option>
                    <option>dozen</option>
                    <option>piece</option>
                </select>

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