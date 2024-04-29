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
import { render } from 'react-dom';
import CardMedia from '@mui/material/CardMedia';

import logo from './ebay.png';
import EbayItemsWidget from './ebaywidget.js';

const EbayComponent = () => {
    return (
        <div
            style={{
                margin: '0 auto'
            }}>
            <CardMedia
                component="img"
                alt="eBay logo"
                image={logo}
                title="eBay Logo"
                style={{ maxWidth: 200, margin: '0 auto', padding: 20 }}
            />
            <EbayItemsWidget
                defaultView="single-item-carousel"
                imageSearchEndpoint="http://localhost:3001/search_by_image"
                searchEndpoint="http://localhost:3001/search"
                searchKeyword="Sneakers"
            />
        </div>
    );
};

export default EbayComponent;
