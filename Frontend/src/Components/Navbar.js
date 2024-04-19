
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {useTranslation} from "react-i18next";

const Navbar = () => {
    const location = useLocation();
    const { t } = useTranslation();

    const navbarStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 0',
        listStyle: 'none',
        margin: 10,
        gap: '30px',
    };

    const linkStyle = {
        textDecoration: 'none',
        color: 'black', // Set the default color
    };

    const activeLinkStyle = {
        textDecoration: 'none',
        color: 'white', // Set the color for the active link
        backgroundColor: '#8DB580',
        borderRadius: '50%', // Create a circular background
        padding: '8px 16px', // Add padding for better appearance
    };

    const isLinkActive = (pathname) => location.pathname === pathname;

    return (
        <nav style={navbarStyle}>
            <NavLink to="/" style={isLinkActive('/') ? activeLinkStyle : linkStyle}>
                {t('Home')}
            </NavLink>
            <NavLink to="/weatherstation" style={isLinkActive('/weatherstation') ? activeLinkStyle : linkStyle}>
                {t('Weather Station')}
            </NavLink>

        </nav>
    );
};

export default Navbar;
