import React from 'react';
import {Doughnut} from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {getGroupHistoryList, getUserGroups} from '../store/actions/rootActions';

import './Styles/GroupData.css';

import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import {MDBBtn} from 'mdbreact';

class GroupDataDoughnut extends React.Component {
    async componentWillMount(){
        await this.props.getUserGroups(localStorage.getItem('userId'));
    }

    componentWillReceiveProps = newProps => {
        if(newProps.userGroups !== this.props.userGroups){
            for(let i = 0; i < newProps.userGroups.length; i++){
                if(newProps.userGroups[i].id === Number(this.props.match.params.id)){
                    this.setState({
                        members: newProps.userGroups[i].members
                    })
                }
            }
        }
    }

    showDoughnutChart = () => {

    }


    constructor(props){
        super(props);

        this.state = {
            total: 0,
            members: null,
            startDate: moment().subtract(1, 'month').toDate(),
            endDate: moment().toDate(),
            data: [],
            dateView: 'month-to-date',
            grandTotal: 0,
        }
    }

    render(){

        const data = {
            labels: [
                'Red',
                'Green',
                'Yellow'
            ],
            datasets: [{
                data: [300, 50, 100],
                backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
                ],
                hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
                ]
            }]
        };

        console.log(this.state,'newstate')
        return(
            <div className = 'doughnut-container'>
            DOUGHNUT
            <Doughnut data = {data} />
            </div>
        )
    }
}

const mapStateToProps = state => {
    state = state.rootReducer;
    return {
        // state items
        currentUser: state.currentUser,
        groupHistoryList: state.groupHistoryList,
        groupUsers: state.groupUsers,
        userGroups: state.userGroups
        
    }
}


export default withRouter(connect(mapStateToProps, {
    //actions
    getGroupHistoryList,
    getUserGroups,

})(GroupDataDoughnut));