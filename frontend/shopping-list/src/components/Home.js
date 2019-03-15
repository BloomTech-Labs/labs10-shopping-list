import React from 'react';
import '../components/Styles/Home.css';

import groceryBag from '../images/grocery-bag.jpg';
import bicycleBags from '../images/bicycle-bags.jpg';
import tomatoShare from '../images/tomato-share.jpg';
import laptopWoman from '../images/laptop-woman.jpg';
import {MDBIcon} from 'mdbreact';

class Home extends React.Component{
        componentDidMount() {
                document.title = `ShopTrak`;
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

                <section className = 'features'>
                <h2>Features</h2>
                
                <div className = 'content-tiles'>
                
                <div className = 'tile-img' style = {{backgroundImage: `url(${laptopWoman})`}}>

                </div>
                
                <div className = 'tile-text'>
                <h3>Create a Group</h3>
                <p>Once you login, you can create a group any time you need to keep your shared shopping list in one place. Select your group name, then start inviting members!</p>
                </div>

                <div className = 'tile-text'>
                <h3>Invite Your Household</h3>
                <p>Our generated invitation URLs make it easy to add members, just send the URL to the group member you wish to invite, and we'll add them automatically once they log in or sign up.</p>
                </div>

                <div className = 'tile-img' style = {{backgroundImage: `url(${tomatoShare})`}}>
                </div>


                <div className = 'tile-img' style = {{backgroundImage: `url(${bicycleBags})`}}>
                </div>


                <div className = 'tile-text'>
                <h3>Track Your Shopping Trips</h3>
                <p>Household members can see items as they are added to the shopping queue, and review previous shopping trips to see what was bought and how much was spent. ShopTrak makes it simple to see how much each member has contributed, and helps you make sure each person is paying their fair share.</p>
                </div>
                </div>

                </section>


                {/* <section className = 'plans'>
                <h2>Plans</h2>
                <p>Id tempor laboriosam. Dolor cupidatat. Aspernatur. Proident aliquid, velit or illo yet lorem and nostrum ex. Laudantium voluptatem error so totam nostrud for iure. Vitae modi but iure. Proident est nor incididunt beatae. Reprehenderit exercitationem so dolorem. Quam ratione sunt. Esse explicabo omnis for dolore nor enim aut but aliqua. Amet excepteur so nostrud corporis. Sunt dolores nor consequatur. In labore yet anim.</p>

                <p>Nequeporro quae. Pariatur consectetur. Aspernatur deserunt. Tempora ipsa but aute nor fugiat. Pariatur doloremque nisi nor architecto. Occaecat quo or aliquam or numquam nor in, iste accusantium. Dolores. Aliquip ut, but incidunt and magna nor molestiae. Occaecat labore dolor consectetur. Est incididunt. Quam ex nor culpa so voluptate aliquam, magni. Doloremque culpa for anim. Lorem labore vitae and sint, or ratione amet. Vel consequatur. Commodo ab for doloremque or suscipit and dolores nor est dolor. Nostrum dolorem autem iure. Id quo yet nulla corporis incididunt suscipit. Illo pariatur. Reprehenderit architecto eu but nostrud and exercitation commodi for dolores. Quisquam. Numquam dolores explicabo or et and tempora and consectetur. Voluptas autem commodi for officia, si, consequuntur, ullamco.</p>

                <p>Qui laudantium for ipsam so corporis, nor reprehenderit laborum. Natus inventore and omnis. Velitesse suscipit. Eum. Exercitation aliquam. Commodi aut consequatur, or proident quia. Et minima modi. Nequeporro velitesse.</p>
                
                </section> */}
                
                </main>
            </div>
        )
    }
}

export default Home;