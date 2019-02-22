import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import PropTypes from 'prop-types';

class BillingForm extends React.Component {
    constructor() {
        super();
        this.state = {
          amount: 999,
        };
    }

    yearlylSub = () => {
        this.setState({ amount: 999 });
        console.log("Amount", this.state.amount);
    };
    
    premiumSub = () => {
        this.setState({ amount: 2999 });
        console.log("Amount", this.state.amount);
    };


    onToken = (res) => {
        console.log('On Token Called!');
        console.log(res);
        console.log(res.id);
    }
        
    render(){
        return(
            <StripeCheckout
                amount={this.state.amount}
                name="Shoptrak"
                description="Purchase Subscription"
                stripeKey="pk_test_YRDXagNKMjZOXlX2ULVNUWbT"
                currency="USD"
                token={res => this.onToken(res)}
            >
                {this.props.children}
            </StripeCheckout> 
        )
    }
}

export default BillingForm; 