import { useEffect, useState } from 'react';
import axios from "axios";
import { useAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import OneItemPage from "./oneItem";

const BookingList = () => {
  const { user } = useAuthenticator((context) => [context.route, context.user]);

  const [bookings, setBookings] = useState([]);
  const [field, setField] = useState("reservations");
  const [selectedItem, setSelectedItem] = useState(null);

  const GET_API_URL = process.env.NEXT_PUBLIC_CLOUD_API_URL + `/booking/customer/${user.userId}`;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(GET_API_URL,
          {
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
  
        const data = JSON.parse(response.data.body);
        setBookings(data);
      } catch (err) {
        console.error(err);
      }
    };
  
    if (user.userId) {
      fetchBookings();
    }
  }, [user.userId]);

  const renderItemsInBoxes = () => {
    return bookings.map((item) => (
      <ReservationWithItem key={item.id_reservation} item={item} handleClick={handleClick}/>
    ));
  };
  
  // handle click on item
  const handleClick = (item) => {
    setField('oneItem');
    setSelectedItem(item);
  };


  return (
    <>
    {field === 'reservations' ? (
      <div className="ItemField">
        {renderItemsInBoxes()}
      </div>
    ) : (
      <OneItemPage
          item={selectedItem}
          user={user}
          goBack={() => setField('reservations')}
      />      
    )}
    </>
  );
};


const ItemBookingList = ({ bookings }) => {

  // const [bookings, setBookings] = useState([]);
  const [field, setField] = useState("reservations");
  const [selectedItem, setSelectedItem] = useState(null);

  const renderItemsInBoxes = () => {
    return bookings.map((item) => (
      <Reservation key={item.id_reservation} item={item}/>
    ));
  };
  
  return (
    <>
    {field === 'reservations' ? (
      <div className="ItemField">
        {renderItemsInBoxes()}
      </div>
    ) : (
      <OneItemPage
          item={selectedItem}
          user={user}
          goBack={() => setField('reservations')}
      />      
    )}
    </>
  );
}

const Reservation = ({ item }) => {

  const handleReservationAnswer = () => {

  }

  return (
    <div className="itemBox" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '1rem',
    }}>
      <div className="itemDetails" >
        <p><strong>User:</strong> {item.id_customer}</p>
      </div>
      <div className="itemDetails">
        <p><strong>Od:</strong> {item.from_date}</p>
        <p><strong>Do:</strong> {item.to_date}</p>    
      </div>
      <div className="itemDetails">
        <p><strong>Poznámky:</strong> {item.notes}</p>
      </div>
      <div className="itemDetails">
        <p><strong>Cena:</strong> {item.compesation_amount}€</p>
      </div>
      <div className="itemDetails">
        {item.status == 'offer' ? (
        <>
          <input type="submit" className="button" value="Prijať" style={{ padding: '0.5rem 1rem' }} onClick={handleReservationAnswer}/>
          <input type="submit" className="button" value="Odmietnuť" style={{ padding: '0.5rem 1rem' }} onClick={handleReservationAnswer}/>
        </>
        ) : (
          <strong>{item.status}</strong>
        )}
      </div>
    </div>
  );
};

const ReservationWithItem = ({ item, handleClick }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const getItem = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_CLOUD_API_URL + '/ads/getItem';
        const response = await fetch(API_URL, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: `{"ad_id":"${item.id_product}"}` }),
        });

        const json = await response.json();
        const parsedBody = JSON.parse(json.body);
        setProduct(parsedBody.ad || null);
      } catch (err) {
        console.error('Error fetching item:', err);
      }
    };

    getItem();
  }, [item.id_product]);  

  return (
    <div className="itemBox">
      <div className="itemDetails" onClick={() => handleClick(product)}>
      <p><strong>{product?.nazov || 'Načítava sa...'}</strong></p>
      {product?.image_urls?.[0] ? (
        <img className="itemImage" src={product.image_urls[0]} alt="image" />
      ) : (
        <div className="noImagePlaceholder">Obrázok nedostupný</div>
      )}
    </div>
      <div className="itemDetails">
        <p><strong>Od:</strong> {item.from_date}</p>
        <p><strong>Do:</strong> {item.to_date}</p>
      </div>
      <p className="itemPrice"><strong>Status:</strong> {item.status}</p>
    </div>
  );
};


export { BookingList, ItemBookingList };
