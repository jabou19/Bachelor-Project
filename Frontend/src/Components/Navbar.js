
import React, {useEffect, useState} from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {useTranslation} from "react-i18next";
import Connection from "./Connection/Connection";

const Navbar = () => {
    const location = useLocation();

    const navbarStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left',
        padding: '10px 0',
        listStyle: 'none',
        margin: 10,
        marginLeft:70,
        gap: '30px',
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
            <NavLink to="/weatherstation" style={isLinkActive('/weatherstation') ? activeLinkStyle : linkStyle}>
                {'Weather Station'}
            </NavLink>
            <NavLink to="/waterlevel" style={isLinkActive('/waterlevel') ? activeLinkStyle : linkStyle}>
                {'Water Level'}
            </NavLink>
            <NavLink to="/personcounter" style={isLinkActive('/personcounter') ? activeLinkStyle : linkStyle}>
                {'Person Counter'}
            </NavLink>
            {/*<NavLink to="/weatherstationprediction" style={isLinkActive('/weatherstationprediction') ? activeLinkStyle : linkStyle}>
                {'Weather Prediction'}
            </NavLink>*/}
       {/*     <Connection> </Connection>*/}
        </nav>
    );
};

export default Navbar;
