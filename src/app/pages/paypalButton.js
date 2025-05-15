'use client';

import { useEffect, useRef } from 'react';

export default function PayPalButton({ valueToPay, id_reservation, setItemStatus}) {
  const paypalRef = useRef(null);
  const isRendered = useRef(false); // na ochranu pred opakovaným renderom

  useEffect(() => {
    const loadPayPalScript = async () => {
      const scriptAlreadyLoaded = document.querySelector(
        'script[src*="https://www.paypal.com/sdk/js"]'
      );

      if (!scriptAlreadyLoaded) {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=ARI1SleKVFENSktoiykCcU9X_2Nd_qXM-IR0fryWhMsCvhL_gd3-Xd8scmL7f_vtx9Vlz1Gvz1nwNGw7&currency=EUR`;
        script.onload = renderPayPalButtons;
        document.body.appendChild(script);
      } else if (window.paypal) {
        renderPayPalButtons();
      }
    };

    const renderPayPalButtons = () => {
      if (isRendered.current) return;
      isRendered.current = true;

      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: valueToPay
              }
            }]
          });
        },
        onApprove: (data, actions) => {
            return actions.order.capture().then(() => {
            alert(`Transakcia prebehla úspešne!`);

            const data = {
              status_of_reservation: "paid"
            };

            const EDIT_API_URL = process.env.NEXT_PUBLIC_CLOUD_API_URL + `/booking/edit/${id_reservation}`;
            fetch(EDIT_API_URL, {
              method: 'POST',
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data)
            })
              .then(() => {
                // alert("Rezervácia úspešne aktualizovaná!");
                console.log("Rezervácia úspešne aktualizovaná!");
                setItemStatus('paid');
            })
              .catch((err) => {
                console.error('Error posting data:', err);
              });
          });
        },
        onCancel: (data) => {
            alert(`Transakcia bola zrušená!`);
            // console.warn('Transakcia bola zrušená', data);
        },
        onError: (err) => {
            console.error('PayPal chyba:', err);
        }
      }).render(paypalRef.current);
    };

    loadPayPalScript();
  }, [valueToPay, id_reservation]);

  return <div ref={paypalRef}></div>;
}
