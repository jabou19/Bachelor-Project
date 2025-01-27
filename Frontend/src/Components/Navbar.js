
import React, {useEffect, useState} from 'react';
import { NavLink, useLocation } from 'react-router-dom';


const Navbar = () => {
    const location = useLocation();

    const navbarStyle = {
        display: 'flex',
       alignItems: 'center',
        justifyContent: 'left',
        padding: '10px 0',
        listStyle: 'none',
        margin: 15,
        marginLeft:70,
        gap: '20px',
    };

    const linkStyle = {
        textDecoration: 'none',
        color: 'black', // Set the default color
    };

    const activeLinkStyle = {
        textDecoration: 'none',
        color: 'white', // Set the color for the active link
        backgroundColor: '#5e6ead',
        borderRadius: '50%', // Create a circular background
        padding: '8px 16px', // Add padding for better appearance
    };

    const isLinkActive = (pathname) => location.pathname === pathname;

    return (
        <nav style={navbarStyle}>
            <NavLink to="/" style={isLinkActive('/') ? activeLinkStyle : linkStyle}>
                {'Home'}
            </NavLink>
            <NavLink to="/weatherstation_wrsense" style={isLinkActive('/weatherstation_wrsense') ? activeLinkStyle : linkStyle}>
                {'Weather Station_WRSense'}
            </NavLink>
            <NavLink to="/weatherstation_wsense" style={isLinkActive('/weatherstation_wsense') ? activeLinkStyle : linkStyle}>
                {'Weather Station_WSense'}
            </NavLink>
            <NavLink to="/waterlevel" style={isLinkActive('/waterlevel') ? activeLinkStyle : linkStyle}>
                {'Water Level'}
            </NavLink>
            <NavLink to="/personcounter" style={isLinkActive('/personcounter') ? activeLinkStyle : linkStyle}>
                {'Person Counter'}
            </NavLink>
        </nav>
    );
};

export default Navbar;
