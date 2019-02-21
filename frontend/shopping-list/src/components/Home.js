import React from 'react';
import Navigation from './Navigation';
import './styles/Home.css';
import tomatoShare from '../images/tomato-share.jpg';

class Home extends React.Component{
    render(){
        return(
            <div className = 'home-container'>

                <header className = 'home-banner'>
                    <h1>SHOPTRAK</h1>
                    <h2>Share what you shop.</h2>
                </header>

                <nav className = 'home-nav'>
                    <Navigation />

                </nav>

                <main className = 'home-content'>
                    <section className = 'about'>
                        <h2>About</h2>
                        <p>Id tempor laboriosam. Dolor cupidatat. Aspernatur. Proident aliquid, velit or illo yet lorem and nostrum ex. Laudantium voluptatem error so totam nostrud for iure. Vitae modi but iure. Proident est nor incididunt beatae. Reprehenderit exercitationem so dolorem. Quam ratione sunt. Esse explicabo omnis for dolore nor enim aut but aliqua. Amet excepteur so nostrud corporis. Sunt dolores nor consequatur. In labore yet anim.</p>

                        <p>Nequeporro quae. Pariatur consectetur. Aspernatur deserunt. Tempora ipsa but aute nor fugiat. Pariatur doloremque nisi nor architecto. Occaecat quo or aliquam or numquam nor in, iste accusantium. Dolores. Aliquip ut, but incidunt and magna nor molestiae. Occaecat labore dolor consectetur. Est incididunt. Quam ex nor culpa so voluptate aliquam, magni. Doloremque culpa for anim. Lorem labore vitae and sint, or ratione amet. Vel consequatur. Commodo ab for doloremque or suscipit and dolores nor est dolor. Nostrum dolorem autem iure. Id quo yet nulla corporis incididunt suscipit. Illo pariatur. Reprehenderit architecto eu but nostrud and exercitation commodi for dolores. Quisquam. Numquam dolores explicabo or et and tempora and consectetur. Voluptas autem commodi for officia, si, consequuntur, ullamco.</p>

                        <p>Qui laudantium for ipsam so corporis, nor reprehenderit laborum. Natus inventore and omnis. Velitesse suscipit. Eum. Exercitation aliquam. Commodi aut consequatur, or proident quia. Et minima modi. Nequeporro velitesse.</p>

                    </section>


                    <section className = 'features'>
                        <h2>Features</h2>

                        <div className = 'content-tiles'>

                            <div className = 'tile-img'>
                                <img src = {tomatoShare} alt = 'sharing food'></img>
                            </div>

                            <div className = 'tile-text'>
                                <h3>Invite Your Household</h3>
                                <p>Id tempor laboriosam. Dolor cupidatat. Aspernatur. Proident aliquid, velit or illo yet lorem and nostrum ex. Laudantium voluptatem error so totam nostrud for iure. Vitae modi but iure. Proident est nor incididunt beatae. Reprehenderit exercitationem so dolorem. Quam ratione sunt. Esse explicabo omnis for dolore nor enim aut but aliqua. Amet excepteur so nostrud corporis. Sunt dolores nor consequatur. In labore yet anim.</p>
                            </div>

                            <div className = 'tile-text'>
                                <h3>Track Shared Items</h3>
                                <p>Id tempor laboriosam. Dolor cupidatat. Aspernatur. Proident aliquid, velit or illo yet lorem and nostrum ex. Laudantium voluptatem error so totam nostrud for iure. Vitae modi but iure. Proident est nor incididunt beatae. Reprehenderit exercitationem so dolorem. Quam ratione sunt. Esse explicabo omnis for dolore nor enim aut but aliqua. Amet excepteur so nostrud corporis. Sunt dolores nor consequatur. In labore yet anim.</p>
                            </div>

                            <div className = 'tile-img'>
                                <img src = {tomatoShare} alt = 'sharing food'></img>
                            </div>

                        </div>

                        <p>Nequeporro quae. Pariatur consectetur. Aspernatur deserunt. Tempora ipsa but aute nor fugiat. Pariatur doloremque nisi nor architecto. Occaecat quo or aliquam or numquam nor in, iste accusantium. Dolores. Aliquip ut, but incidunt and magna nor molestiae. Occaecat labore dolor consectetur. Est incididunt. Quam ex nor culpa so voluptate aliquam, magni. Doloremque culpa for anim. Lorem labore vitae and sint, or ratione amet. Vel consequatur. Commodo ab for doloremque or suscipit and dolores nor est dolor. Nostrum dolorem autem iure. Id quo yet nulla corporis incididunt suscipit. Illo pariatur. Reprehenderit architecto eu but nostrud and exercitation commodi for dolores. Quisquam. Numquam dolores explicabo or et and tempora and consectetur. Voluptas autem commodi for officia, si, consequuntur, ullamco.</p>

                        <p>Qui laudantium for ipsam so corporis, nor reprehenderit laborum. Natus inventore and omnis. Velitesse suscipit. Eum. Exercitation aliquam. Commodi aut consequatur, or proident quia. Et minima modi. Nequeporro velitesse.</p>

                    </section>


                    <section className = 'plans'>
                        <h2>Plans</h2>
                        <p>Id tempor laboriosam. Dolor cupidatat. Aspernatur. Proident aliquid, velit or illo yet lorem and nostrum ex. Laudantium voluptatem error so totam nostrud for iure. Vitae modi but iure. Proident est nor incididunt beatae. Reprehenderit exercitationem so dolorem. Quam ratione sunt. Esse explicabo omnis for dolore nor enim aut but aliqua. Amet excepteur so nostrud corporis. Sunt dolores nor consequatur. In labore yet anim.</p>

                        <p>Nequeporro quae. Pariatur consectetur. Aspernatur deserunt. Tempora ipsa but aute nor fugiat. Pariatur doloremque nisi nor architecto. Occaecat quo or aliquam or numquam nor in, iste accusantium. Dolores. Aliquip ut, but incidunt and magna nor molestiae. Occaecat labore dolor consectetur. Est incididunt. Quam ex nor culpa so voluptate aliquam, magni. Doloremque culpa for anim. Lorem labore vitae and sint, or ratione amet. Vel consequatur. Commodo ab for doloremque or suscipit and dolores nor est dolor. Nostrum dolorem autem iure. Id quo yet nulla corporis incididunt suscipit. Illo pariatur. Reprehenderit architecto eu but nostrud and exercitation commodi for dolores. Quisquam. Numquam dolores explicabo or et and tempora and consectetur. Voluptas autem commodi for officia, si, consequuntur, ullamco.</p>

                        <p>Qui laudantium for ipsam so corporis, nor reprehenderit laborum. Natus inventore and omnis. Velitesse suscipit. Eum. Exercitation aliquam. Commodi aut consequatur, or proident quia. Et minima modi. Nequeporro velitesse.</p>

                    </section>

                </main>
            </div>
        )
    }
}

export default Home;