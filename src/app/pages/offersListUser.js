import { useEffect, useState } from 'react';
import axios from "axios";
import { useAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import OneItemPage from "./oneItem";
import { LoanEditPage } from './offerLoan';
import PayPalButton from './paypalButton';


const BookingList = () => {
  const { user } = useAuthenticator((context) => [context.route, context.user]);

  const [bookings, setBookings] = useState([]);
  const [field, setField] = useState("reservations");
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [showOffers, setShowOffers] = useState(false);
  const [showAccepted, setShowAccepted] = useState(false);
  const [showForReturn, setShowForReturn] = useState(false);
  const [showReturned, setShowReturned] = useState(false);

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

  const renderItemsInBoxes = (statusFilter) => {
    const filters = Array.isArray(statusFilter) ? statusFilter : [statusFilter];
    return bookings
      .filter((item) => filters.includes(item.status_of_reservation))
      .map((item) => (
        <ReservationWithItem key={item.id_reservation} item={item} handleClick={handleClick} setField={setField}/>
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
  <>
    {/* Offers */}
    <div className="ItemField">
      <span onClick={() => setShowOffers(!showOffers)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
        Odoslané... {showOffers ? "▲" : "▼"}
      </span>
      <hr style={{ marginTop:"-10px", width: '100%', border: '1px solid black' }} />
    </div>
    {showOffers && (
      <div className="ItemField">
        {renderItemsInBoxes('offer')}
      </div>
    )}

    {/* Accepted */}
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
    
    {/* Waiting for return */}
    <div className="ItemField">
      <span onClick={() => setShowForReturn(!showForReturn)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
        Na vrátenie... {showForReturn ? "▲" : "▼"}
      </span>
      <hr style={{ marginTop:"-10px", width: '100%', border: '1px solid black' }} />
    </div>
    {showForReturn && (
      <div className="ItemField">
        {renderItemsInBoxes('pickedUp')}
      </div>
    )}

    {/* Returned */}
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
          setField={() => setField('reservations')}
      />      
    )}
    </>
  );
};


const ReservationWithItem = ({ item, handleClick }) => {
  const [product, setProduct] = useState(null);
  const [render, setRender] = useState('all');
  const [sending, setSending] = useState(false);
  const [payButtons, setPayButtons] = useState(false);
  const [itemStatus, setItemStatus] = useState(item.status_of_reservation);

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

  function handleClickOnReservation(){
    setRender(render == 'all' ? 'one' : 'all');
  }

  const editReservation = (newStatus) => {
    if (window.confirm("Are you sure?")) {
      const data = {
        status_of_reservation : newStatus
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
      case 'Prevziať':
        editReservation('pickedUp');
        return;
      case 'Zrušiť':
        editReservation('canceled');
        return;
      case 'Vrátiť':
        const today = new Date().toISOString().split("T")[0];
        editReservation('returned', today);
        // editReservation('returned');
        return;

      default:
        console.log(e.target.value, 'is not correct input...');
    }
  }

  const renderButton = () => {
    switch(itemStatus){
      case 'offer':
        return ( 
          <div>
            <input type="submit" className="button" value="Zrušiť" style={{ padding: '0.5rem 1rem' }} onClick={handleReservationAnswer}/>        
            <input type="submit" className="button" value="Zobraziť" style={{ padding: '0.5rem 1rem' }} onClick={handleClickOnReservation}/>
          </div>
        );
        // return <input type="submit" className="button" value="Zrušiť" style={{ padding: '0.5rem 1rem' }} onClick={handleReservationAnswer}/>
      case 'accepted':
      case 'paid':
        return (
          <div>
            {itemStatus !== 'paid' ? (
              <>
                { payButtons ? 
                <>
                  <input type="submit" className="button" value="Späť" style={{ padding: '0.5rem 1rem' }} onClick={() => setPayButtons(!payButtons)}/>
                  <PayPalButton valueToPay={item.compesation_amount} id_reservation={item.id_reservation} setItemStatus={setItemStatus}/>
                </> 
                : <input type="submit" className="button" value="Zaplatiť" style={{ padding: '0.5rem 1rem' }} onClick={() => setPayButtons(!payButtons)}/>
              }
              </>
            ):(<></>)}
            <input type="submit" className="button" value="Prevziať" style={{ padding: '0.5rem 1rem' }} onClick={handleReservationAnswer}/>
            <input type="submit" className="button" value="Zrušiť" style={{ padding: '0.5rem 1rem' }} onClick={handleReservationAnswer}/>
            <input type="submit" className="button" value="Zobraziť" style={{ padding: '0.5rem 1rem' }} onClick={handleClickOnReservation}/>
          </div>
        );
      case 'pickedUp':
        return (
          <div>
            <input type="submit" className="button" value="Vrátiť" style={{ padding: '0.5rem 1rem' }} onClick={handleReservationAnswer}/>
            <input type="submit" className="button" value="Zobraziť" style={{ padding: '0.5rem 1rem' }} onClick={handleClickOnReservation}/>
          </div>
        );
      default:
        return (
          <input type="submit" className="button" value="Zobraziť" style={{ padding: '0.5rem 1rem' }} onClick={handleClickOnReservation}/>
          // <strong>Vrátené...</strong>
        );
    }
  }

  const renderField = () => {
    if (render == 'one'){
      return <LoanEditPage item={product} reservation={item} goBack={handleClickOnReservation} goToItem={() => handleClick(product)}/>;
    }
    return (
    <div className="itemBox" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '1rem',
    }}>
      <div className="itemDetails" onClick={() => handleClick(product)}>
      <p><strong>{product?.nazov || 'Načítava sa...'}</strong></p>
      {product?.image_urls?.[0] ? (
        <img className="itemImage" src={product.image_urls[0]} alt="image" />
      ) : (
        <div className="noImagePlaceholder">Obrázok nedostupný</div>
      )}
    </div>
      <div></div>
      <div className="itemDetails">
        <p><strong>Od:</strong> {item.from_date}</p>
        <p><strong>Do:</strong> {item.to_date}</p>
      </div>
      <div className="itemDetails">
        <p><strong>Poznámky:</strong> {item.notes}</p>
      </div>
      <div className="itemDetails">
        <p><strong>Cena:</strong> {item.compesation_amount}€</p>
        {itemStatus == 'paid' ?
          <p><strong>Zaplatené!</strong></p>
          : <></>
        }
      </div>
      {sending ? <strong>Odpoveď odoslaná</strong> :  <>{renderButton()}</>}
    </div>
    );
  }

  return (
    <>{renderField()}</>
  );
};


export default BookingList;