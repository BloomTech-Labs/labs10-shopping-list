import React, { Component } from 'react'
import Navigation from './Navigation';
import './Styles/Billing.css';

import BillingForm from './BillingForm';


class BillingPage extends Component {
  
    render() {
      return(
        <div>
          <Navigation />
          <div className="billing-container">
            <div className="billing">
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