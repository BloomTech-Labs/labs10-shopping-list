import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import PropTypes from 'prop-types';

class BillingForm extends React.Component {
    onToken = (res) => {
        console.log('On Token Called!');
        console.log(res);
        console.log(res.id);
    }
        
    render(){
        return(
            <StripeCheckout
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