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
    componentWillMount(){
        this.props.getGroupHistoryList(this.props.match.params.id);
    }

    componentDidMount(){
        this.showExpendituresOverTime(this.state.startDate, this.state.endDate);
    }


    constructor(props){
        super(props);

        this.state = {
            startDate: moment().subtract(1, 'month').toDate(),
            endDate: moment().toDate(),
            data: {},
            chartTitle: 'Expenditures Over Time',
            dateView: 'month-to-date'
        }
    }

    showExpendituresOverTime = (start, end) => {
        console.log('start, end', start, end);
        let labels = [];
        /**
         * This loop will give us labels for the previous month
         */
        if(this.state.dateView === 'month-to-date'){
            let count = 0; // sanity count in case of infinite loop
            // assign to vars so as not to mutate
            let startCount = start;
            let endCount = end;
            while(startCount < endCount){
                labels.push(moment(startCount).format('MMM Do'));
                let newStart = moment(startCount).add(1, 'days').toDate();
                // console.log(newStart, 'newStart');
                startCount = newStart;
                // console.log(startCount)
                count++;
                if(count === 32){
                    break;
                }
            }
            console.log("LABELS", labels);
        }


        let EOTdata = {
                labels: labels,
                datasets: [
                    {
                        label: `${this.state.chartTitle}: ${moment(start).format('MMM Do YYYY')} - ${moment(end).format('MMM Do YYYY')}`,
                        backgroundColor: 'rgba(42,146,45,0.2)',
                        borderColor: 'rgba(42,146,45,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(42,146,45,0.4)',
                        hoverBorderColor: 'rgba(42,146,45,1)',
                        data: [65, 59, 80, 81, 56, 55, 40]
                    }
                ]
            }

            this.setState({
                chartTitle: 'Expenditures Over Time',
                data: EOTdata,
            })
    }

    refreshChart = (start, end) => {
        console.log('new chart');
        if(this.state.chartTitle === 'Expenditures Over Time'){
            this.showExpendituresOverTime(start, end);
        }
    }

    handleChangeEnd = date => {
        console.log(date);
        this.setState({
            endDate: date,
        })

        this.refreshChart(this.state.startDate, date);
    }

    handleChangeStart = date => {
        console.log(date);
        this.setState({
            startDate: date,
        })

        this.refreshChart(date, this.state.endDate);
    }

    handleViewChange = event => {
        console.log(event.target.name);
        this.setState({
            dateView: event.target.name
        })
    }

    render(){

        return(
            <div className = 'data-container'>

            {/* A datepicker for custom time ranges */}
            <div className = 'date-picker-container'>
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
            </div>

            <div className = 'chart-container'>
            <Bar data = {this.state.data} width = {600} height = {200} />

            Date View:
            <MDBBtn onClick = {this.handleViewChange} name = 'last-7-days'>Last 7 Days</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'last-14-days'>Last 14 Days</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'this-month'>This Month</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'last-month'>Last Month</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'month-to-date'>Month-to-Date</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'last-3-months'>Last 3 Months</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'last-6-months'>Last 6 Months</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'last-12-months'>Last 12 Months</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'this-year'>This Year</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'last-year'>Last Year</MDBBtn>
            <MDBBtn onClick = {this.handleViewChange} name = 'all-time'>All Time</MDBBtn>

            </div>

            <div className = 'chart-container'>
            <Doughnut data = {this.state.data} width = {600} height = {200} />
            </div>
            

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