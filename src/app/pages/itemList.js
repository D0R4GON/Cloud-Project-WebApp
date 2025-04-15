"use client";

import { useState, useEffect } from "react";
import React from "react";
const axios = require('axios');

export default function ItemListPage({ user, itemCategory }) {
    const [field, setField] = useState("all");
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemList, setItemList] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const API_URL = 'https://s5i38bp79b.execute-api.eu-central-1.amazonaws.com/dev/ads/getByCategory';


    // choose which items to show
    useEffect(() => {
        if (user) {
            setField('user');
        } else {
            setField("all");
        }
        setSelectedItem(null);
        setItemList([]);

        // get items
        if (user) {
            getList();
        } else {
            if (itemCategory != "Všetko"){
                const data = {
                    id_category: itemCategory
                };
                
                fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then((json) => {
                        const parsedBody = JSON.parse(json.body);
                        const ads = parsedBody.ads;
                
                        setItemList(ads);  // Update your UI or state with the ads
                        console.log('Fetched ads:', ads);
                    })
                    .catch((err) => {
                        console.error('Error posting data:', err);
                    });

            } else {
                getList();
            }
        }

    }, [user]);

    // get list from 
    const getList = () => {
        const https = require('https');


        https.get(API_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const parsedBody = JSON.parse(json.body);
                    const ads = parsedBody.ads;

                    setItemList(ads);
                    console.log('Fetched ads:', ads);
                } catch (err) {
                    console.error('Error parsing response:', err);
                }
            });
        }).on('error', (err) => {
            console.error('Error fetching ads:', err.message);
        });
    }

    // handle click on item
    const handleClick = (item) => {
        setField('oneItem');
        setSelectedItem(item);
    };

    // sorting
    const sortedItems = React.useMemo(() => {
        let sortableItems = [...itemList];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                const { key, direction } = sortConfig;
                const aVal = a[key];
                const bVal = b[key];
            
                if (key === 'cena_prenajmu') {
                    // Numeric sort
                    return direction === 'ascending' ? aVal - bVal : bVal - aVal;
                } else {
                    // String (locale-aware) sort
                    return direction === 'ascending'
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                }
            });
            
        }
        return sortableItems;
    }, [itemList, sortConfig]);
    

    // render items with image on left, name under image, description in the middle, and price on the right
    const renderItemsInBoxes = () => {
        return sortedItems.map((item) => (
            <div className="itemBox" key={item.ad_id} onClick={() => handleClick(item)}>
                <img className="itemImage" src={item.image_urls[0]} alt={item.nazov}/>
                <div className="itemDetails">
                    <h2>{item.nazov}</h2>
                    <p>{item.popis}</p>
                </div>
                <p className="itemPrice">${item.cena_prenajmu}</p>
            </div>
        ));
    };
    
    // change sort arrow
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // render header for item list
    const renderHeader = () => {
        return (
            <div className="itemHeader">
                <div className="name"></div>
                <label className="radio">
                    <button type="radio" name="radio" onClick={() => requestSort('nazov')}></button>
                    <div className="itemName">Názov</div>
                </label>

                <label className="radio">
                    <button type="radio" name="radio" onClick={() => requestSort('cena_prenajmu')}></button>
                    <p className="itemName">Cena</p>
                </label>
            </div>
        );
    };


    // render different fields
    const renderField = () => {
        switch (field) {
            case 'oneItem':
                return <OneItemPage item={selectedItem} />
            default:
                return (
                    <>
                        {renderHeader()}
                        <div className="ItemField">{renderItemsInBoxes()}</div>                    
                    </>
                )
        }
    }

    return (
        <>
            {renderField()}
        </>
    );

}

// function to show only one item on the field
export function OneItemPage({ item }) {
    console.log(item.image_urls[0]);

    return (
        <div className="OneItemPage">
            <h1>Názov: {item.nazov}</h1>
            <img src={item.image_urls[0]} alt={item.name} />
            <p>Cena za prenájom: € {item.cena_prenajmu}</p>
            <p>Záloha: € {item.cena_zalohy}</p>
            <p>{item.popis}</p>
        </div>
    );
}
