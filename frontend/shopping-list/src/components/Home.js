import React from 'react';
import '../components/Styles/Home.css';
import Auth0Lock from 'auth0-lock';

import groceryBag from '../images/grocery-bag.jpg';
import {MDBIcon, MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardHeader, MDBCardText, MDBCardFooter} from 'mdbreact';


let frontendURL;
if(process.env.NODE_ENV === 'development'){
    frontendURL = 'http://localhost:3000';
} else {
    frontendURL = `https://labs10-shopping-list.netlify.com`
}

var lockOptions = {
    auth: {
        redirectUrl: `${frontendURL}/callback`,
        responseType: 'token id_token',
        params: {
            scope: 'profile openid email'
        }
    },
    theme: {
        primaryColor: '#FF7043'
    },
    languageDictionary: {
        title: 'ShopTrak'
    }
}

var lock = new Auth0Lock(
    process.env.REACT_APP_AUTH0_CLIENT_ID,
    process.env.REACT_APP_AUTH0_DOMAIN,
    lockOptions
)


class Home extends React.Component{
        componentDidMount() {
                document.title = `ShopTrak`;
        }

        
        signIn = (event) => {
            event.preventDefault();
            lock.show();
        }


        render(){
        return(
            <div className = 'home-container'>
                
                <header className = 'home-banner-vid'>
                
                {/* <video playsInline autoPlay muted loop poster="poster.jpg" id = "bg-vid">
                <source src = 'http://adamreid.me/images/time-lapse-cc-blur-low.mp4'  type = "video/mp4" />
                </video> */}
                <img src = {groceryBag} alt = 'bag of groceries'></img>

                <div className = 'home-banner-overlay'>
                <h1>SHOPTRAK</h1>

                <h2>Shared living, made simple.</h2>
                </div>

                </header>

                <main className = 'home-content'>
                <section className = 'about'>
                    <h2>Get your shopping lists on the same page.</h2>
                <div className = 'about-tile-grid'>
                    <div className = 'about-tile'>
                        <div className = 'about-icon'>
                        <MDBIcon icon="users" size = '3x' className = 'light-blue-text'/>
                        </div>
                        <div className = 'about-text'>
                        <h3>Roommates? <br></br>Handled.</h3>
                            <p>Shared living means shared expenses, but keeping a tally can be a hassle. Keep track of everyone's contributions with ShopTrak.</p>
                        </div>
                    </div>

                    <div className = 'about-tile'>
                        <div className = 'about-icon'>
                        <MDBIcon icon="glass-cheers" size = '3x' className = 'purple-text'/>
                        </div>
                        <div className = 'about-text'>
                        <h3>Parties?<br></br>We can dig it.</h3>
                            <p>
                            The more the merrier! Create shopping lists for events, dinner parties, and get-togethers with up to 6 members.
                            </p>
                        </div>
                    </div>

                    <div className = 'about-tile'>
                        <div className = 'about-icon'>
                        <MDBIcon icon="utensils" size = '3x'className = 'amber-text'/>                        </div>
                        <div className = 'about-text'>
                        <h3>Your pantry, <br></br>planned.</h3>
                            <p>
                            Planning meals means getting the right ingredients. But who can keep track of them all? You, that's who.
                            </p>
                        </div>
                    </div>
                </div>
                </section>
                
                <section className = 'value'>
                <h2>Imagine the possibilities.</h2>

                <div className = 'value-tile-grid'>

                    <div className = 'value-tile'>
                        <div className = 'value-icon'>
                        <MDBIcon icon="hand-holding-usd" size = '3x' className = 'green-text' />
                        </div>
                        <div className = 'value-text'>
                            <h3>Reduce waste, save money.</h3>
                            <p>Stay up-to-date on who's bought what. No more wasted food, no more wasted money.</p>
                        </div>
                    </div>

                    <div className = 'value-tile'>
                        <div className = 'value-icon'>
                        <MDBIcon icon="shopping-cart" size = '3x' className = 'deep-orange-text' />
                        </div>
                        <div className = 'value-text'>
                            <h3>Shop with confidence.</h3>
                            <p>
                                Your shopping list stays with you wherever you go, so you never have to worry about forgetting an item.
                            </p>
                        </div>
                    </div>

                    <div className = 'value-tile'>
                        <div className = 'value-icon'>
                        <MDBIcon icon="chart-pie" size = '3x' className = 'indigo-text'/>
                        </div>
                        <div className = 'value-text'>
                            <h3>All your trips, at a glance.</h3>
                            <p>
                            Every shopping trip you complete is logged so you can monitor trends, record expenditures, and stay under budget.
                            </p>
                        </div>
                    </div>

                    </div>

                </section>

                <section className = 'plans'>

                <MDBCard>
                    <MDBCardHeader><h1>Basic Plan</h1></MDBCardHeader>
                    <MDBCardBody>
                        <MDBCardTitle>
                            <h2>$0</h2> <p>Per Month</p>
                        </MDBCardTitle>
                        <MDBCardText>
                                <p><MDBIcon icon="check-square" className = 'green-text' /> 1 Group Shopping List</p>
                                <p><MDBIcon icon="check-square" className = 'green-text' /> Up to 2 Group Members</p>
                                <p><MDBIcon icon="check-square" className = 'green-text' /> Trip Tracking and Data Graphs</p>
                        </MDBCardText>
                    </MDBCardBody>
                    <MDBCardFooter>
                        <MDBBtn onClick = {this.signIn}>Sign Up</MDBBtn>
                    </MDBCardFooter>
                </MDBCard>

                <MDBCard>
                    <MDBCardHeader><h1>Premium Plan</h1></MDBCardHeader>
                    <MDBCardBody>
                        <MDBCardTitle>
                            <h2>$9.99</h2> <p>Per Month</p>
                        </MDBCardTitle>
                        <MDBCardText>
                                <p><MDBIcon icon="check-square" className = 'green-text' /> Unlimited Shopping Lists</p>
                                <p><MDBIcon icon="check-square" className = 'green-text' /> Up to 6 Group Members</p>
                                <p><MDBIcon icon="check-square" className = 'green-text' /> Trip Tracking and Data Graphs</p>
                        </MDBCardText>
                    </MDBCardBody>
                    <MDBCardFooter>
                        <MDBBtn onClick = {this.signIn}>Sign Up</MDBBtn>
                    </MDBCardFooter>
                </MDBCard>
                
                </section>
                </main>

                <footer>
                    Created at Lambda Labs - © ShopTrak 2019
                </footer>
            </div>
        )
    }
}

export default Home;