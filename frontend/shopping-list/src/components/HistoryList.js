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
        if(newProps.needsNewHistoryList === true){
            this.props.getGroupHistoryList(this.props.match.params.id);
        }
    }

    constructor(props){
        super(props);

        this.state = {
            item: '',
        }
    }


    render(){
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
                        ) : (<div>Loading History....</div>)}

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
        needsNewHistory: state.needsNewHistory,
        needsNewHistoryList: state.needsNewHistoryList
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    getGroupHistoryList,

})(HistoryList));