/*
 * *
 *  * Copyright 2021 eBay Inc.
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *  http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import eBayLogo from './ebay_logo.svg';

const useStyles = styled(() => ({
    logo: {
        float: 'right'
    }
}));

const Logo = ({ style }) => {
    const classes = useStyles();

    return <img className={classes.logo} src={eBayLogo} style={style} alt="eBay Logo" />;
};

Logo.propTypes = {
    style: PropTypes.object
};

export default Logo;
