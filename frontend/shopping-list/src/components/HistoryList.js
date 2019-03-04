import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {getGroupHistoryList ,} from '../store/actions/rootActions';
import History from './History';

class HistoryList extends React.Component{
    componentWillMount(){
        if(!this.props.groupHistoryList){
            this.props.getGroupHistoryList(this.props.match.params.id);
        }
    }

    componentWillReceiveProps = newProps => {
        // if(newProps.needsNewHistory === true){
        //     this.props.getGroupHistoryList(this.props.match.params.id);
        // }
    }

    constructor(props){
        super(props);

        this.state = {
            item: '',
        }
    }


    render(){
        // console.log("GRP => ", this.props.groupHistoryList)
        return(
            <div className = 'item-list-container'>
                <h1>Shopping List History</h1>
                <div className = 'item-list'>

                    {this.props.groupHistoryList !== null ?
                        (
                            this.props.groupHistoryList.map(hist =>
                                (
                                    <History grpHistory = {hist} key = {hist.id} />
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
        groupHistoryList: state.groupHistoryList,
        needsNewHistory: state.needsNewHistory
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    getGroupHistoryList,

})(HistoryList));