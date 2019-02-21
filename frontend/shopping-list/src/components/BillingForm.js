import React from 'react';
import StripeCheckout from 'react-stripe-checkout';

class BillingForm extends React.Component {
    render() {
        return(
           <StripeCheckout
                name="Shoptrak"
                description="Purchase Subscription"
           >
               {this.props.children}
           </StripeCheckout> 
        )
    }
}

export default BillingForm; 