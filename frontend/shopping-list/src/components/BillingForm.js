import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import './Styles/BillingForm.css';
import axios from 'axios';


class BillingForm extends React.Component {
    constructor() {
        super();
        this.state = {
          amount: null
        };
    }

    yearlySub = () => {
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

        if(this.state.amount === 999) {
            axios
              .post(`http:localhost:9000/api/billing/yearly?token=${res.id}`)
              .then(response => console.log(response))
              .catch(err => console.log(err))
        } 
        else if(this.state.amount === 2999) {
            axios
              .post(`http:localhost:9000/api/billing/premium?token=${res.id}`)
              .then(response => console.log(response))
              .catch(err => console.log(err))
        } 
        else return null
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