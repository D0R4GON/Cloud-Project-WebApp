"use client";

import { useState, useEffect } from "react";
import React from "react";
import OfferLoanPage from "./offerLoan";
import OneItemPage from "./oneItem";

export default function ItemListPage({ user, itemCategory, setBar }) {
    const [field, setField] = useState("all");
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemList, setItemList] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const API_URL = process.env.NEXT_PUBLIC_CLOUD_API_URL + '/ads/get';
    const USER_API_URL = process.env.NEXT_PUBLIC_CLOUD_API_URL + '/ads/getUserItems';

    // choose which items to show and get correct data from cloud
    useEffect(() => {
        setSelectedItem(null);
        setItemList([]);

        // get items
        let data = {};
        if (itemCategory){
            if (itemCategory != "Všetko"){
                data = {
                    body: `{\"id_category\":\"${itemCategory}\"}`
                };
            }    
        } else if (user) {
            data = {
                body: `{\"userID\":\"${user}\"}`
            }; 
        }
        
        const API = user ? USER_API_URL : API_URL;
        
        fetch(API, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((json) => {
            const parsedBody = JSON.parse(json.body);
            const ads = parsedBody.ads;
            setItemList(ads);
        })
        .catch((err) => {
            console.error('Error posting data:', err);
        });

    }, [user, itemCategory]);

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
    
    // handle click on item
    const handleClick = (item) => {
        setField('oneItem');
        setSelectedItem(item);
    };

    // render items with image on left, name under image, description in the middle, and price on the right
    const renderItemsInBoxes = () => {
        return sortedItems.map((item) => (
            <div className="itemBox" key={item.ad_id} onClick={() => handleClick(item)}>
                <img className="itemImage" src={item.image_urls[0]} alt={item.image_urls[0]}/>
                <div className="itemDetails">
                    <h2>{item.nazov}</h2>
                    <p>{item.popis}</p>
                </div>
                <p className="itemPrice">€{item.cena_prenajmu}</p>
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
                return (
                    <OneItemPage
                        item={selectedItem}
                        user={user}
                        goBack={() => setField('all')}
                        setField={setField}
                    />
                ); 
            case 'responseForm':
                return (
                    <OfferLoanPage
                        item={selectedItem}
                        goBack={() => setField('oneItem')}
                    />
                );
            default:
                return (
                    <>
                        {user ? ( <></> ):(
                            <div className="pathBack">
                                <strong className="pathBackPointer" onClick={() => setBar('home')}>← Späť</strong>
                            </div>
                        )}  
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