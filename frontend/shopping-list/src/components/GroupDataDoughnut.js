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

    handleViewChange = event => {
        if(event.target.name === 'last-7-days'){
            this.setState({
                startDate: moment().subtract(7, 'days').toDate(),
                endDate: moment().toDate(),
                dateView: event.target.name,
                needsRefresh: true
            })
        }

        if(event.target.name === 'month-to-date'){
            this.setState({
                startDate: moment().subtract(1, 'month').toDate(),
                endDate: moment().toDate(),
                dateView: event.target.name,
                needsRefresh: true,
            })
        }

        if(event.target.name === 'year-to-date'){
            this.setState({
                startDate: moment().subtract(1, 'year').toDate(),
                endDate: moment().toDate(),
                dateView: event.target.name,
                needsRefresh: true,
            })
        }

        if(event.target.name === 'this-month'){
            this.setState({
                startDate: moment().startOf('month').toDate(),
                endDate: moment().toDate(),
                dateView: event.target.name,
                needsRefresh: true,
            })
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
            <h2>{this.state.chartTitle}</h2>
            <h4>{moment(this.state.startDate).format('MMM Do YYYY')} - {moment(this.state.endDate).format('MMM Do YYYY')}</h4>
            <h4>Grand Total: ${this.state.grandTotal}</h4>
            <MDBBtn onClick = {this.handleViewChange} name = 'last-7-days'>Last 7 Days</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'month-to-date'>Month-to-Date</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'this-month'>This Month</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'year-to-date'>Year-to-Date</MDBBtn>
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