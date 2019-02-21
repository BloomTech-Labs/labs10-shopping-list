import React, { Component } from 'react'
import Navigation from './Navigation';

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
                <div className="checkbox">
                  <input type="checkbox" />
                  <p>1 Year Subscription - $9.99</p>
                </div>
                <div className="checkbox">
                  <input type="checkbox" />
                  <p>1 Year Premium Subscription - $29.99</p>
                </div>
              </form>
              <button>Buy Now</button>
            </div>
          </div>
        </div>
      )
    }
}

export default BillingPage; 