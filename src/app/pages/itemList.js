"use client";

import { useState, useEffect} from "react";

export function ItemListPage({user}) {
    const [field, setField] = useState("all");
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemList,setItemList] = useState([]);

    // choose which items to show
    useEffect(() => {
        if (user) {
            setField('user');
        } else {
            setField("all");
        }
        setSelectedItem(null);
        setItemList([]);
        getItemsFromCloud();
    }, [user]);

        
    // get items from cloud 
    // add and change later
    const getItemsFromCloud = () => {
        if (user){
            setItemList([1])
        } else {
            setItemList([1,2,3,4,5])
        }
    }


    // changes field to the item user clicked
    const handleClick = (item) => {
        setField('oneItem');
        setSelectedItem(item);
    };

    // for rendering items inside boxes 
    const renderItemsInBoxes = () => {
        return itemList.map((item, index) => (
            <div className="itemBox" key={index} onClick={() => handleClick(item)}>
                <h1>Item {item}</h1>
            </div>
        ));
    };

    // render diff fields
    const renderField = () => {
        switch (field) {
            case 'user':
                return <div className="Field">{renderItemsInBoxes()}</div>
            case 'oneItem':
                return <OneItemPage item={selectedItem} />
            default:
                return (
                    <>
                        <div className="Field">Here will be aws search</div>
                        <div className="Field">{renderItemsInBoxes()}</div>
                    </>
                )
        }
    }

    return (
        <>{renderField()}</>
    );
}

// function to show only one item on the field
export function OneItemPage({item}) {
    return (
        <div className="OneItemPage">
            <h1>One Item: {item}</h1>
        </div>
    );
}