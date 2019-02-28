import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Item from './Item';
import {getItems, getGroupItems, addItem,} from '../store/actions/rootActions';
import './Styles/ItemList.css';

class ItemList extends React.Component{
    componentWillMount(){
        if(!this.props.groupItems){
            this.props.getGroupItems(this.props.match.params.id);
        }
    }

    componentWillReceiveProps = newProps => {
        if(newProps.needsNewItems === true){
            this.props.getGroupItems(this.props.match.params.id);
        }
    }

    constructor(props){
        super(props);

        this.state = {
            item: '',
        }
    }

    
    handleChange = event => {
        event.preventDefault();
        this.setState ({
            [event.target.name]: event.target.value,
        })
    }


    handleClickOutside = event => {
        console.log('outside', this.state.oldItem);
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
        if(this.state.item){
            let item = {
                purchasedBy: null,
                groupID: Number(this.props.match.params.id),
                name: this.state.item,
                purchased: false,
                price: 0.00,
                quantity: 1,
            }

            console.log('item', item);
            
            // send item to db
            this.props.addItem(item);

            this.setState({
                item: '',
            })

        } else {
            window.alert('Must include name.');
        }
    }


    render(){
        return(
            <div className = 'item-list-container'>
            <h1>Shopping List</h1>
            <div className = 'item-list'>
            
            {this.props.groupItems !== null ? 
                (
                this.props.groupItems.map(item => 
                    (
                        <Item item = {item} key = {item.id} />
                    )
                )
            ) : (<h2>No Items on the List</h2>)}

            </div>
            
            <div className = 'item-form'>
            <form onSubmit = {this.handleSubmit}>
                <input type = 'text' name = 'item' placeholder = 'Add an item' value = {this.state.item} onChange = {this.handleChange}/>
                <button type = 'submit'>Add To List</button>
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
        groupItems: state.groupItems,
        needsNewItems: state.needsNewItems
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    getGroupItems,
    addItem,

})(ItemList));