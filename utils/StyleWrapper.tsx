import React from 'react';
import { Root, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';

export default function StyleWrapper(props) {
    const {
        component
    } = props;
    return (
        <StyleProvider style={getTheme(material)}>
            {component}
        </StyleProvider>
    );
}

