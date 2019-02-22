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