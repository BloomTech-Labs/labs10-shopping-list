import React from 'react';
import {Doughnut, Bar} from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {getGroupHistoryList} from '../store/actions/rootActions';
import './Styles/GroupData.css';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

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
            startDate: moment().toDate(),
            endDate: moment().toDate(),
            data: {},
            chartTitle: 'Expenditures Over Time',
        }
    }

    showExpendituresOverTime = (start, end) => {
        console.log('start, end', start, end);

        let EOTdata = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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