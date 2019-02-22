import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import PropTypes from 'prop-types';
import './Styles/BillingForm.css';

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
            <div className="billing-form">  
            <h1>Billing</h1>
                 <p>Choose your subscription</p>
                 <form>
                 <input 
                    type="radio" 
                    name="subscription"
                    onClick={this.yearlySub}
                />1 Year Subscription - $9.99 <br/>
                <input 
                    type="radio" 
                    name="subscription" 
                    onClick={this.premiumSub}
                />1 Year Premium Subscription - $29.99
                </form>
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
            </div>
        )
    }
}

export default BillingForm; 