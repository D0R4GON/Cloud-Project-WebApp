'use client';

import { useState, useEffect } from 'react';
import { useAuthenticator } from "@aws-amplify/ui-react";
import axios from 'axios';

export default function OfferLoanPage({ item, goBack }) {
    const { user } = useAuthenticator((context) => [context.route, context.user]);
    const API_URL = process.env.NEXT_PUBLIC_CLOUD_API_URL + '/booking/create';

    const [formData, setFormData] = useState({
        "id_product": item.ad_id,
        "id_customer": user.userId,
        "from_date": "",
        "to_date": "",
        "returned_at_date": "",
        "status": "offer",
        "damage": "",
        "compesation_amount": 0,
        "notes": ""
    });


    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (window.confirm("Are you sure?")) {
            e.preventDefault();
    
            const payload = formData;
        
            try {
                // const lambdaUrl = process.env.NEXT_PUBLIC_CLOUD_API_URL + '/ads/create';;
        
                const response = await axios.post(API_URL, payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
        
                console.log('Ad submitted:', response.data);
                alert('Ponuka úspešné zdieľaná!');
                
                // reset data
                setFormData({
                    "id_product": item.ad_id,
                    "id_customer": user.userId,
                    "from_date": "",
                    "to_date": "",
                    "returned_at_date": "",
                    "status": "offer",
                    "damage": "",
                    "compesation_amount": 0,
                    "notes": ""
                });
            } catch (err) {
                console.error('Submission error:', err.response ? err.response.data : err.message);
                alert('Chyba pri zdieľaní ponuky');
            }
          } else {
            // maybe cancel
          }
    };

    const getCompensation = () => {
        return getNumberOfDays() * Number(item.cena_prenajmu) + Number(item.cena_zalohy);
    };

    // Update the compensation amount dynamically
    const updateCompensation = () => {
        const compensation = getCompensation();
        setFormData({ ...formData, compesation_amount: compensation });
    };

    // Trigger compensation update when from_date or to_date changes
    useEffect(() => {
        updateCompensation();
    }, [formData.from_date, formData.to_date]);
        
    const getNumberOfDays = () => {
        if (!formData.from_date || !formData.to_date) return "";
    
        const from = new Date(formData.from_date);
        const to = new Date(formData.to_date);
        const diffTime = to - from;
    
        if (diffTime < 0) return "Dátumy sú zadané nesprávne.";
    
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <>
        <div className="pathBack">
            <strong className="pathBackPointer" onClick={goBack}>← Späť</strong>
        </div>
        <div className="register-card">
            <label>Položka:</label>
            <div className="itemBox" key={item.ad_id} onClick={goBack}>
                <img className="itemImage" src={item.image_urls[0]} alt={item.image_urls[0]}/>
                <div className="itemDetails">
                    <h2>{item.nazov}</h2>
                    <p>{item.popis}</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} style={{marginTop:30}}>
                <div className="form-group">
                    <label>Od dátumu:</label>
                    <input
                        type="date"
                        name="from_date"
                        className="whole"
                        value={formData.from_date}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        max={formData.to_date || ""}
                    />
                </div>
                <div className="form-group">
                    <label>Do dátumu:</label>
                    <input
                        type="date"
                        name="to_date"
                        className="whole"
                        value={formData.to_date}
                        onChange={handleChange}
                        required
                        min={formData.from_date || new Date().toISOString().split("T")[0]}
                    />
                </div>
                <div className="form-group">
                    <label>Poznámky:</label>
                    <textarea name="notes" className="whole" value={formData.notes} onChange={handleChange} />
                </div>
                <label style={{marginTop:"50"}}>Kontrola údajov:</label>
                <div className="item-info" style={{width:"100%", marginLeft:"0%"}}>
                    <p><strong>Info o položke</strong></p>
                    <hr style={{ width: '100%', border: '1px solid black' }} />
                    <p><strong>Názov:</strong> {item.nazov}</p>
                    <p><strong>Majiteľ:</strong> {item.id_owner}</p>
                    <p><strong>Poloha:</strong> {item.lokalita}</p>
                    <br/>
                    <p><strong>Vybraný čas</strong></p>
                    <hr style={{ width: '100%', border: '1px solid black' }} />
                    <p><strong>Od dátumu:</strong> {formData.from_date}</p>
                    <p><strong>Do dátumu:</strong> {formData.to_date}</p>
                    <p><strong>Počet dní:</strong> {getNumberOfDays()}</p>
                    <br/>
                    <p><strong>Suma na zaplatenie</strong></p>
                    <hr style={{ width: '100%', border: '1px solid black' }} />
                    <p><strong>Cena za prenájom:</strong> 
                        {getNumberOfDays() > 0 
                            ? `${item.cena_prenajmu}€/deň x ${getNumberOfDays()} dní = ${item.cena_prenajmu * getNumberOfDays()}€` 
                            : "Vyberte dátumy na výpočet ceny"
                        }
                    </p>
                    <p><strong>Záloha:</strong> {item.cena_zalohy} €</p>
                    <p><strong>Celková suma:</strong> {formData.compesation_amount} €</p>
                </div>
                <input type="submit" className="button" value="Odoslať odpoveď" />
            </form>
        </div>
        </>
    );
}