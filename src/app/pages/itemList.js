"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import React from "react";
import { OfferLoanPage } from "./offerLoan";
import OneItemPage from "./oneItem";

export default function ItemListPage({ user, itemCategory, setBar }) {
    const [fielder, setFielder] = useState("all");
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemList, setItemList] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const API_URL = process.env.NEXT_PUBLIC_CLOUD_API_URL + '/ads/get';

    // choose which items to show and get correct data from cloud
    useEffect(() => {
        setSelectedItem(null);
        setItemList([]);

        // get items
        let data = {};
        let country = localStorage.getItem("country");
        if (itemCategory){
            if (itemCategory != "Všetko"){
                data = {
                    body: `{\"id_category\":\"${itemCategory}\", \"country\":\"${country}\"}`
                };
            } else {
                data = {
                    body: `{\"country\":\"${country}\"}`
                };
            }
        }
        
        fetch(API_URL, {
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

    }, []);

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
        setFielder('oneItem');
        setSelectedItem(item);
    };

    // render items with image on left, name under image, description in the middle, and price on the right
    const renderItemsInBoxes = () => {
        return sortedItems.map((item) => (
            <div className="itemBox" key={item.ad_id} onClick={() => handleClick(item)}>
                {item?.image_urls?.[0] ? (
                    <img className="itemImage" src={item.image_urls[0]} alt="image" />
                ) : (
                    <strong >Obrázok nedostupný</strong>
                )}
                {/* <img className="itemImage" src={item.image_urls[0]} alt={item.image_urls[0]}/> */}
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

                <label className="radio" >
                    <button type="radio" name="radio" onClick={() => requestSort('cena_prenajmu')}></button>
                    <p className="itemName">Cena</p>
                </label>

            </div>
        );
    };

    // render different fields
    const renderField = () => {
        switch (fielder) {
            case 'oneItem':
                return (
                    <OneItemPage
                        item={selectedItem}
                        user={user}
                        setField={setFielder}
                    />
                ); 
            case 'responseForm':
                // if (route != "authenticated") {
                //     setBar('login');
                //     return null;
                // } else {
                    return (
                        <OfferLoanPage
                            item={selectedItem}
                            goBack={() => setFielder('oneItem')}
                        />
                    );
                // }
            default:
                return (
                    <div>
                        <div className="pathBack">
                            <strong className="pathBackPointer" onClick={() => setBar('home')}>← Späť</strong>
                        </div>
                        {renderHeader()}
                        <div className="ItemField">{renderItemsInBoxes()}</div>
                    </div>
                )
        }
    }
    return (
        <>
            {renderField()}
        </>
    );

}