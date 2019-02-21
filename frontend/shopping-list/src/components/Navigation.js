import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
// import {Link, withRouter} from 'react-router-dom';
import auth0Client from './Auth';
import './Styles/Navigation.css';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon, MDBFormInline, MDBBtn } from "mdbreact";

class Navigation extends Component{
    state = {
        collapseID: "",
        activeTabClassname: "home"
    };

    // Toggles dropdown menus for MDB
    toggleCollapse = collapseID => () =>
        this.setState(prevState => ({
            collapseID: prevState.collapseID !== collapseID ? collapseID : ""
        }));
    
    signOut = () => { // logs out the current user and redirects to the homepage
        auth0Client.signOut();
        this.props.history.replace('/');
    };

    render(){
        // Gather user id to determine if user is logged in or not
        const id = localStorage.getItem("userId");
        let isLogged = false;
        if (id !== null) isLogged = true;

        // Gather the url pathname to set active class to proper link
        const pathname = this.props.location.pathname;
        return(
            <MDBNavbar color="default-color" dark expand="md">
                <MDBNavbarBrand>
                    <strong className="white-text">ShopTrak</strong>
                </MDBNavbarBrand>

                <MDBNavbarToggler onClick={this.toggleCollapse} />

                <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                    <MDBNavbarNav left>
                        <MDBNavItem active={pathname === "/" ? "active" : null} >
                            <MDBNavLink to="/">Home</MDBNavLink>
                        </MDBNavItem>
                        {isLogged ? (
                            <MDBNavItem active={pathname === "/groups" ? "active" : null} >
                                <MDBNavLink to="/groups">Groups</MDBNavLink>
                            </MDBNavItem>
                        ) : null}

                    </MDBNavbarNav>

                    <MDBNavbarNav right>
                        <MDBNavItem>
                            {isLogged ? (
                                <MDBDropdown>
                                    <MDBDropdownToggle className="dopdown-toggle" nav>
                                        <img src={localStorage.getItem("img_url")} className="rounded-circle z-depth-0"
                                             style={{ height: "35px", padding: 0 }} alt="" />
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu className="dropdown-default" right>
                                        <MDBDropdownItem href="/profile">My account</MDBDropdownItem>
                                        <MDBDropdownItem href="#!" onClick={this.signOut}>Log out</MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            ) : (
                                <MDBNavItem>
                                    <MDBBtn color="success" onClick={auth0Client.signIn}>
                                        Login
                                    </MDBBtn>
                                </MDBNavItem>
                            ) }

                        </MDBNavItem>
                    </MDBNavbarNav>

                </MDBCollapse>
            </MDBNavbar>

        )
    }
}

export default withRouter(Navigation);