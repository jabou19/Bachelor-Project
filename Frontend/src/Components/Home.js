import React from 'react';
import {useTranslation} from "react-i18next";

const Home = () => {;
    return (
        <div style={centerStyle}>
            <h2>{'welcome'}</h2>
            {/* Add more content here */}
        </div>
    );
};

export default Home;
const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    height: '100vh' ,// This makes the div take the full height of the viewport
    color:'black',
    marginTop:-10
};
