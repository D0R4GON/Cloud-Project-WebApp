import axios from "axios";
import React from "react";
import { useEffect, useState } from 'react';
import ItemBookingList from "./offersList";
import EditItemPage from "./editItem";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { getCurrentUser } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';


// function to show only one item on the field
export default function OneItemPage({ user, item, setField }) {
  const DELETE_API_URL = process.env.NEXT_PUBLIC_CLOUD_API_URL + '/ads/delete';
  const [bookings, setBookings] = useState([]);
  const [fielder, setFielder] = useState("item");
  const [loggedIn, setLoggedIn] = useState(false);
  const { route } = useAuthenticator((context) => [context.route]);
  const [userCountry, setUserCountry] = useState('');

  useEffect(() => {
    const loadSession = async () => {
      try {
          const user = await getCurrentUser();
          // Optional: set logged in state here
          if (user){
              setLoggedIn(true);
          }
      } catch (err) {
          // console.error("Failed to fetch session:", err);
          setLoggedIn(false); // if session fails, mark as not logged in
      }
    };

    loadSession();
  }, [route]); 

  useEffect(() => {
      const loadSession = async () => {
          try {
              const session = await fetchAuthSession();
              const idToken = session.tokens?.idToken;
              setUserCountry(idToken?.payload?.zoneinfo || '');
          } catch (err) {
              console.error("Failed to fetch session:", err);
          }
      };
      loadSession();
  }, [user]);
  
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


  const ImageRow = () => {
    return (
      <div style={{
        display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          overflowY: 'hidden',
          padding: '10px',
          gap: '10px',
          scrollbarWidth: 'thin',
          WebkitOverflowScrolling: 'touch' 
        }}>
        {item.image_urls.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Image ${index}`}
            style={{
              width: '300px',
              height: '300px',
              objectFit: 'contain',
              flexShrink: 0,
              borderRadius: '8px'
            }}
          />
        ))}
      </div>
    );
  };
      
  // handle delete of item
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${item.nazov}?`)) {
      const data = {
        ad_id : item.ad_id
      };
          
      fetch(DELETE_API_URL, {
          method: 'POST',
          mode: 'cors',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
      })
      .then(() => {
        setField('all');
        alert("Inzerát úspešne vymazaný!")
      })
      .catch((err) => {
          console.error('Error posting data:', err);
      });
    }
  };
    
  const handleShowReservation = () => {
    setFielder('booking');
  }
  const handleEditReservation = () => {
    setFielder('edit');
  }
  const handleShowItem = () => {
    setFielder('item');
  }
  

  const handleSetReservation = () => {
    if (loggedIn && item.country != userCountry){
      alert(`Je nutné byť prihlásený účtom v krajine ${item.country}!`)
    } else if (loggedIn) {
      setField('responseForm');
    } else {
      alert("Je nutné sa prihlásiť!")
    }
  }

  const renderFielder = () => {
    if (fielder == 'item'){
      return (
        <>
        <div className="pathBack">
            <strong className="pathBackPointer" onClick={() => setField('all')}>← Späť</strong>
        </div>
        <div className="OneItemPage">
            <div className="item-name">
                <strong>{item.nazov}</strong>
            </div>
            <ImageRow />
            <div className="item-container">
                <div className="item-description">
                    <strong>Popis</strong>
                    <hr style={{ width: '100%', border: '1px solid black' }} />
                    <p>{item.popis}</p>
                    <p/>
                </div>
                <div className="item-info">
                    <p><strong>Info</strong></p>
                    <hr style={{ width: '100%', border: '1px solid black' }} />
                    <p><strong>Majiteľ:</strong> {item.id_owner}</p>
                    <p><strong>Krajina:</strong> {item.country == 'CZ' ? 'Česká Republika' : "Slovensko"}</p>
                    <p><strong>Poloha:</strong> {item.lokalita}</p>
                    <p><strong>Kategória:</strong> {item.id_category}</p>
                    <p><strong>Cena za prenájom:</strong> {item.cena_prenajmu} €</p>
                    <p><strong>Záloha:</strong> {item.cena_zalohy} €</p>
                    {user?.userId === item.id_owner ? (
                        <div className="form-group">
                            <input className="button" type="submit" value="Upraviť" onClick={handleEditReservation}/>
                            <input className="button" type="submit" value="Zmazať" onClick={handleDelete}/>
                            <input className="button" type="submit" value={`Prehľad ponúk [${bookings.length}]`} onClick={handleShowReservation}/>
                          </div>
                    ) : (
                        <div className="form-group">
                            <input className="button" type="submit" value="Požiadať o prenájom" onClick={handleSetReservation}/>
                        </div>   
                    )}
                </div>
            </div>
        </div>
        </>
      );
    } else if (fielder == 'edit'){
      return < EditItemPage item={item} goBack={handleShowItem}/>;
    }
    return (
      < ItemBookingList item={item} user={user} goBack={handleShowItem}/>
    );
  }

  return (
      <>
        {renderFielder()}
      </>
  );
}