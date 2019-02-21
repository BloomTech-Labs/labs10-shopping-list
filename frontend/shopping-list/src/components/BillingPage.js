import React, { Component } from 'react'
import Navigation from './Navigation';
import './Styles/Billing.css';

import BillingForm from './BillingForm';


class BillingPage extends Component {
    constructor() {
        super();
    }

    render() {
      return(
        <div>
          <Navigation />
          <div className="billing-container">
            <div className="billing">
              <h1>Billing</h1>
              <h4>Payment Info</h4>
              <form className="payment-form">
                <div className="input-div">
                  <p>CC#</p>
                  <input placeholder="####-####-####-####" />
                </div>
                <div className="input-div">
                  <p>EXP</p>
                  <input placeholder="MM/YY" />
                </div>
                <div className="input-div">
                  <p>CVV</p>
                  <input placeholder="###" />
                </div>
              </form>
              <form>
                <input 
                  type="radio" 
                  name="subscription" 
                />1 Year Subscription - $9.99 <br/>
                <input 
                  type="radio" 
                  name="subscription" 
                />1 Year Premium Subscription - $29.99
              </form>
              <BillingForm>
                <button>Buy Now</button>
              </BillingForm>
            </div>
          </div>
        </div>
      )
    }
}

export default BillingPage; 