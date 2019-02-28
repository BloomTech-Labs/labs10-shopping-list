import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
class PurchaseBox extends React.Component{
    // componentWillReceiveProps(newProps) {
    //     console.log('change');
    //     console.log('this', this.props.markedItems);
    //     console.log('next', newProps.markedItems);
    //     let newItems = newProps.markedItems;
    //         this.setState({
    //             marked: newItems,
    //         })
    // }
    // constructor(props){
    //     super(props);
        // this.state = {
        //     marked: this.props.markedItems
        // }

    render(){
        if(this.props.needsRefresh === true){
            this.forceUpdate();
        }
        let itemList = [];
        if(this.props.markedItems){
                itemList = this.props.markedItems.map(item => {
                console.log(item);
                return <div key = {item.id}>{item.name}</div>
            })
        } else {
            itemList = '(Empty)';
        }

        return(
            <div>
                purchase box
                {itemList}
            </div>
        )
    }
}

const mapStateToProps = state => {
    state = state.rootReducer; // pull values from state root reducer
    return {
        //state items
        userId: state.userId,
        groups: state.groups,
        items: state.items,
        markedItems: state.markedItems,
        groupUsers: state.groupUsers,
        groupUserProfiles: state.groupUserProfiles,
        groupTotal: state.groupTotal,
        needsRefresh: state.needsRefresh
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    
})(PurchaseBox));