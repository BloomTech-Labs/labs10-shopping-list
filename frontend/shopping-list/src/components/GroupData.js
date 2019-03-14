import React from 'react';
import {Doughnut, Bar} from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {getGroupHistoryList} from '../store/actions/rootActions';
import './Styles/GroupData.css';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import {MDBBtn} from 'mdbreact';

class GroupData extends React.Component {
    async componentWillMount(){
        await this.props.getGroupHistoryList(this.props.match.params.id);
    }

    componentWillReceiveProps = (newProps) => {
        if(newProps.groupHistoryList !== this.props.groupHistoryList){
            this.showExpendituresOverTime(this.state.startDate, this.state.endDate);
        }
    }


    constructor(props){
        super(props);

        this.state = {
            startDate: moment().subtract(1, 'month').toDate(),
            endDate: moment().toDate(),
            data: [],
            chartTitle: 'Expenditures Over Time',
            dateView: 'month-to-date'
        }
    }

    async getMonthToDateLabels(){
        let start = this.state.startDate;
        let end = this.state.endDate;
        let labels = [];
        let dateLabels = [];
        
        /**
         * This loop will give us labels for the previous month
         */

        let count = 0; // sanity count in case of infinite loop
        while(start < end){
            labels.push(moment(start).format('MMM Do'));
            dateLabels.push(moment(start).format());
            let newStart = moment(start).add(1, 'days').toDate();
            // console.log(newStart, 'newStart');
            start = newStart;
            // console.log(startCount)
            count++;
            if(count === 32){
                break;
            }
        }

        this.setState({
            labels: labels,
            dateLabels: dateLabels,
            needsRefresh: false
        });

        return dateLabels;
    }

    async getPurchaseData(dateLabels){
        let data = [];

        for(let i = 0; i < this.props.groupHistoryList.length; i++){
            for(let j = 0; j < dateLabels.length; j++){
                if(moment(this.props.groupHistoryList[i].purchasedOn).format('MMM Do YYYY') === moment(dateLabels[j]).format('MMM Do YYYY')){
                    data[j] = this.props.groupHistoryList[i].total;
                } else {
                    data[j] = 0;
                }
            }

        }

        this.setState({
            data: data
        })
    }

       

    async showExpendituresOverTime() {
        if(this.state.dateView === 'month-to-date'){
            await this.getMonthToDateLabels().then(dateLabels => {
                this.getPurchaseData(dateLabels);
            });
        }

        let EOTdata = {
                labels: this.state.labels,
                datasets: [
                    {
                        label: `Expenditure Per Day`,
                        backgroundColor: 'rgba(42,146,45,0.2)',
                        borderColor: 'rgba(42,146,45,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(42,146,45,0.4)',
                        hoverBorderColor: 'rgba(42,146,45,1)',
                        data: this.state.data
                    }
                ]
            }

            this.setState({
                chartTitle: 'Expenditures Over Time',
                data: EOTdata,
            })
    }

    // handleChangeEnd = date => {
    //     console.log(date);
    //     this.setState({
    //         endDate: date,
    //     })

    //     this.refreshChart(this.state.startDate, date);
    // }

    // handleChangeStart = date => {
    //     console.log(date);
    //     this.setState({
    //         startDate: date,
    //     })

    //     this.refreshChart(date, this.state.endDate);
    // }

    handleViewChange = event => {
        if(event.target.name === 'last-7-days'){
            this.setState({
                startDate: moment().subtract(7, 'days').toDate(),
                endDate: moment().toDate(),
                dateView: event.target.name,
            })
        }

        if(event.target.name === 'month-to-date'){
            this.setState({
                startDate: moment().subtract(1, 'month').toDate(),
                endDate: moment().toDate(),
                dateView: event.target.name
            })
        }

        if(event.target.name === 'year-to-date'){
            this.setState({
                startDate: moment().subtract(1, 'year').toDate(),
                endDate: moment().toDate(),
                dateView: event.target.name
            })
        }
   }

    render(){

        return(
            <div className = 'data-container'>

            {/* A datepicker for custom time ranges */}
            {/* <div className = 'date-picker-container'>
            <DatePicker
                selected={this.state.startDate}
                selectsStart
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                onChange={this.handleChangeStart}
            />

            <DatePicker
                selected={this.state.endDate}
                selectsEnd
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                onChange={this.handleChangeEnd}
            />            
            </div> */}

            <div className = 'chart-container'>
            <h1>{this.state.chartTitle}</h1>
            <h2>{moment(this.state.startDate).format('MMM Do YYYY')} - {moment(this.state.endDate).format('MMM Do YYYY')}</h2>
            <Bar data = {this.state.data} width = {600} height = {200}/>

            <MDBBtn onClick = {this.handleViewChange} name = 'last-7-days'>Last 7 Days</MDBBtn>
            {/* <MDBBtn onClick = {this.handleViewChange} name = 'last-14-days'>Last 14 Days</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'this-month'>This Month</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'last-month'>Last Month</MDBBtn> */}
            <MDBBtn onClick = {this.handleViewChange} name = 'month-to-date'>Month-to-Date</MDBBtn>
            {/* <MDBBtn onClick = {this.handleViewChange} name = 'last-3-months'>Last 3 Months</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'last-6-months'>Last 6 Months</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'last-12-months'>Last 12 Months</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'this-year'>This Year</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'last-year'>Last Year</MDBBtn> */}
            
            {/* <MDBBtn onClick = {this.handleViewChange} name = 'all-time'>All Time</MDBBtn> */}

            <MDBBtn onClick = {this.handleViewChange} name = 'year-to-date'>Year-to-Date</MDBBtn>


            </div>

            {/* <div className = 'chart-container'>
            <Doughnut data = {this.state.data} width = {600} height = {200} />
            </div> */}
            

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
        groupUsers: state.groupUsers
        
    }
}


export default withRouter(connect(mapStateToProps, {
    //actions
    getGroupHistoryList,

})(GroupData));