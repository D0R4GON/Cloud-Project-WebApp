import { useEffect, useState } from 'react';
import React from "react";
import OneItemPage from "./oneItem";
import axios from "axios";



const ItemBookingList = ({ item, user, goBack }) => {

  const [showOffers, setShowOffers] = useState(false);
  const [showAccepted, setShowAccepted] = useState(false);
  const [showReturned, setShowReturned] = useState(false);
  const [showForReturn, setShowForReturn] = useState(true);


  const [bookings, setBookings] = useState([]);
  const [field, setField] = useState("reservations");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
  
      const fetchBookings = async () => {
        try {
          const GET_API_URL = process.env.NEXT_PUBLIC_CLOUD_API_URL + `/booking/product/${item.ad_id}`;
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
          console.log(data);
        } catch (err) {
          console.error(err);
        }
      };
    
      if (user) {
        fetchBookings();
      }
    }, [user]);

  const renderItemsInBoxes = (statusFilter) => {
    const filters = Array.isArray(statusFilter) ? statusFilter : [statusFilter];
    return bookings
      .filter((item) => filters.includes(item.status_of_reservation))
      .map((item) => (
        <Reservation key={item.id_reservation} item={item}/>
      ));
  };

  return (
    <>
    <div className="pathBack">
      <strong className="pathBackPointer" onClick={goBack}>← Späť</strong>
    </div>
    {field === 'reservations' ? (
      <>
        {/* picked up with user.. */}
        <div className="ItemField">
          <span onClick={() => setShowForReturn(!showForReturn)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            Aktuálne vypožičané... {showForReturn ? "▲" : "▼"}
          </span>
          <hr style={{ marginTop:"-10px", width: '100%', border: '1px solid black' }} />
        </div>
        {showForReturn && (
          <div className="ItemField">
            {renderItemsInBoxes('pickedUp')}
          </div>
        )}

        {/* Offers */}
        <div className="ItemField">
          <span onClick={() => setShowOffers(!showOffers)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            Ponuky... {showOffers ? "▲" : "▼"}
          </span>
          <hr style={{ marginTop:"-10px", width: '100%', border: '1px solid black' }} />
        </div>
        {showOffers && (
          <div className="ItemField">
            {renderItemsInBoxes('offer')}
          </div>
        )}

        {/* Accepted offers */}
        <div className="ItemField">
          <span onClick={() => setShowAccepted(!showAccepted)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            Akceptované... {showAccepted ? "▲" : "▼"}
          </span>
          <hr style={{ marginTop:"-10px", width: '100%', border: '1px solid black' }} />
        </div>
        {showAccepted && (
          <div className="ItemField">
            {renderItemsInBoxes(['accepted', 'paid'])}
          </div>
        )}

        {/* Returned items */}
        <div className="ItemField">
          <span onClick={() => setShowReturned(!showReturned)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            História... {showReturned ? "▲" : "▼"}
          </span>
          <hr style={{ marginTop:"-10px", width: '100%', border: '1px solid black' }} />
        </div>
        {showReturned && (
          <div className="ItemField">
            {renderItemsInBoxes(['returned', 'canceled'])}
          </div>
        )}
      </>
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
  const [sending, setSending] = useState(false);

  const editReservation = (newStatus, dateOfReturn) => {
    if (window.confirm("Are you sure?")) {
      const data = {
        status_of_reservation : newStatus,
        returned_at_date : dateOfReturn
      };

      const EDIT_API_URL = process.env.NEXT_PUBLIC_CLOUD_API_URL + `/booking/edit/${item.id_reservation}`;
      fetch(EDIT_API_URL, {
          method: 'POST',
          mode: 'cors',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
      })
      .then(() => {
        // setField('all');
        setSending(true);
        alert("Rezervácia úspešne aktualizovaná!")
      })
      .catch((err) => {
          console.error('Error posting data:', err);
      });
    }
  }


  const handleReservationAnswer = (e) => {
    switch(e.target.value){
      case 'Prijať':
        editReservation('accepted');
        return;    
      case 'Potvrdiť prevzatie':
        editReservation('pickedUp');
        return;
      case 'Zrušiť':
      case 'Odmietnuť':
        editReservation('canceled');
        return;
      case 'Vrátiť':
        const today = new Date().toISOString().split("T")[0];
        editReservation('returned', today);
        return;
      default:
        console.log(e.target.value, 'is not correct input...');
    }
  }

  const renderButton = () => {
    switch(item.status_of_reservation){
      case 'offer':
        return(
        <>
          <input type="submit" className="button" value="Prijať" style={{ padding: '0.5rem 1rem' }} onClick={handleReservationAnswer}/>
          <input type="submit" className="button" value="Odmietnuť" style={{ padding: '0.5rem 1rem' }} onClick={handleReservationAnswer}/>
        </>
        );
      case 'accepted':
      case 'paid':  
        return (
          <div>
            <input type="submit" className="button" value="Potvrdiť prevzatie" style={{ padding: '0.5rem 1rem' }} onClick={handleReservationAnswer}/>
            <input type="submit" className="button" value="Zrušiť" style={{ padding: '0.5rem 1rem' }} onClick={handleReservationAnswer}/>
          </div>
        );
      case 'pickedUp':
        return (
          <>
            <input type="submit" className="button" value="Vrátiť" style={{ padding: '0.5rem 1rem' }} onClick={handleReservationAnswer}/>
          </>
        );
      case 'canceled':
        return (
          <strong>Zamietnuté</strong>
        );
      default:
        return (
          <strong>Vrátené: {item.returned_at_date || ""}</strong>
        );
    }
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
        {item.status_of_reservation == 'paid' ?
          <p><strong>Zaplatené!</strong></p>
          : <></>
        }
      </div>
      <div className="itemDetails">
        {sending ? <strong>Odpoveď odoslaná</strong> :  <>{renderButton()}</>}
      </div>
    </div>
  );
};


export default ItemBookingList;
