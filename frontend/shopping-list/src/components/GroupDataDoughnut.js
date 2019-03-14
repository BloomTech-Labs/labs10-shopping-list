import React from 'react';
import {Doughnut} from 'react-chartjs-2';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {getGroupHistoryList, getUserGroups, clearGroupHistory} from '../store/actions/rootActions';

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
                        members: newProps.userGroups[i].members,
                        needsRefresh: true
                    })

                }
            }
        }
    }

    componentWillUnmount(){
        this.props.clearGroupHistory();
    }


    constructor(props){
        super(props);

        this.state = {
            total: 0,
            members: null,
            startDate: moment().subtract(1, 'month').toDate(),
            endDate: moment().toDate(),
            data: null,
            dateView: 'month-to-date',
            grandTotal: 0,
            labels: [],
            chartTitle: 'Expenditures By User',
            needsRefresh: false,
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

   async getPurchaseData(userLabels){
       let purchaseData = [];
       for(let i = 0; i < this.props.groupHistoryList.length; i++){
        for(let j = 0; j < userLabels.length; j++){
            if(!purchaseData[j]){
                purchaseData[j] = 0;
            }
            if(this.props.groupHistoryList[i].userID === userLabels[j].id){
                if(moment(this.state.startDate).format() < moment(this.props.groupHistoryList[i].purchasedOn).format() && moment(this.state.endDate).format() > moment(this.props.groupHistoryList[i].purchasedOn).format()){
                        purchaseData[j] += this.props.groupHistoryList[i].total;
                }
            }
        }
       }

       let finalData = purchaseData.map(cost => {
           return cost.toFixed(2);
       });


       let grandTotal = purchaseData.reduce(function(accumulator, currentValue){
        return accumulator + currentValue;
    }, 0);

    grandTotal = grandTotal.toFixed(2);

       this.setState({
           data: finalData,
           grandTotal: grandTotal,
           needsRefresh: false,
       })
   }

   async generateDoughnut() {
       if(!this.props.groupHistoryList){
           return -1;
       }
       await this.getPurchaseData(this.state.members);

       let memberLabels = this.state.members.map(member => {
           return member.name;
       });

       let doughnutData = {
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


       this.setState({
           data: doughnutData,
           needsRefresh: false,
       })
   }

    render(){
        if(this.state.needsRefresh === true){
            this.generateDoughnut();
        }

        return(
            <div className = 'doughnut-container'>
            <h1>{this.state.chartTitle}</h1>
            <h4>{moment(this.state.startDate).format('MMM Do YYYY')} - {moment(this.state.endDate).format('MMM Do YYYY')}</h4>
            <h4>Grand Total: ${this.state.grandTotal}</h4>
            {this.state.data ? (
            <Doughnut data = {this.state.data} />
            ): null}
            
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
    clearGroupHistory

})(GroupDataDoughnut));