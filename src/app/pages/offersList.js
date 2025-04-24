import { useEffect, useState } from 'react';

const axios = require('axios');
import { useAuthenticator } from "@aws-amplify/ui-react";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useAuthenticator((context) => [context.route, context.user]);
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
        <div className="itemBox" key={item.id_reservation}> {/* onClick={() => handleClick(item)}> */}
            {/* <img className="itemImage" src={item.image_urls[0]} alt={item.image_urls[0]}/> */}
            <div className="itemDetails">
                <p><strong>Produkt:</strong></p><p> {item.id_product}</p>
            </div>
            <div className="itemDetails">
                <p><strong>Od:</strong> {item.from_date}</p>
                <p><strong>Do:</strong> {item.to_date}</p>
            </div>
            <p className="itemPrice"><strong>Status:</strong> {item.status}</p>
        </div>
    ));
};

  console.log(bookings);

  return (
    <div className="ItemField">
        {renderItemsInBoxes()}
    </div>
  );
};

export default BookingList;
