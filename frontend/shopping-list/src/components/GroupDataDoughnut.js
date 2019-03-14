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
        await this.props.getGroupHistoryList(this.props.match.params.id);
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
            labels: [],
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

   async getUserLabels(){
       if(this.state.members){
            return this.state.members;
       }
   }

   async getPurchaseData(userLabels){
       let purchaseData = [];
       for(let i = 0; i < this.props.groupHistoryList.length; i++){
        for(let j = 0; j < userLabels.length; j++){
            if(!purchaseData[j]){
                purchaseData[j] = 0;
            }
            if(this.props.groupHistoryList[i].userID === userLabels[j].id){
                if(this.state.startDate < this.props.groupHistoryList[i].purchasedOn && this.state.endDate > this.props.groupHistoryList[i].purchasedOn)
                purchaseData[j] += this.props.groupHistoryList[i].total;
            }
        }
       }

       this.setState({
        data: purchaseData
    })

   }

   async generateDoughnut() {
       console.log('generating donut')
       await this.getUserLabels().then(userLabels => {
           this.getPurchaseData(userLabels);
       });

       let memberLabels = this.state.members.map(member => {
           return member.name;
       });

       let DoughnutData = {
           labels: memberLabels,
           datasets: [{
            data: this.state.data,
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
       }
   }

    render(){
        if(this.props.groupHistoryList && this.state.members){
            this.generateDoughnut();
        }

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