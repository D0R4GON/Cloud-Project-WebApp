'use client';

import { useState, useEffect } from 'react';
import { useAuthenticator } from "@aws-amplify/ui-react";
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';


export default function OfferItemPage() {
    const { user } = useAuthenticator((context) => [context.route, context.user]);
    const lambdaUrl = process.env.NEXT_PUBLIC_CLOUD_API_URL + '/ads/create';
    
    const [formData, setFormData] = useState({
        name: '',
        id_owner: user.userId,
        description: '',
        deposit_price: 0,
        rental_price: 0,
        location: '',
        id_category: '',
        files: [],
        country: ''
    });


    useEffect(() => {
        const loadSession = async () => {
            try {
                const session = await fetchAuthSession();
                const idToken = session.tokens?.idToken;
                // setUserCountry(idToken?.payload?.zoneinfo || '');
                setFormData(prevFormData => ({
                    ...prevFormData,
                    country: idToken?.payload?.zoneinfo || ''
                }));
            } catch (err) {
                console.error("Failed to fetch session:", err);
            }
        };
        loadSession();
    }, [user]);

    // categories
    const categories = [
        { value: 'Dom, záhrada', label: 'Dom, záhrada' },
        { value: 'Náradie', label: 'Náradie' },
        { value: 'Auto, motocykle', label: 'Auto, motocykle' },
        { value: 'Stroje', label: 'Stroje' },
        { value: 'Kancelária', label: 'Kancelária' },
        { value: 'Hudba', label: 'Hudba' },
        { value: 'Knihy', label: 'Knihy' },
        { value: 'Šport', label: 'Šport' },
        { value: 'Oblečenie', label: 'Oblečenie' }
    ];


    // handle change of the input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name.startsWith('cena_') ? Number(value) : value,
        }));
    };

    // handle added files
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const fileReaders = [];
    
        files.forEach((file) => {
            const reader = new FileReader();
            fileReaders.push(
                new Promise((resolve) => {
                    reader.onloadend = () => {
                        const base64String = reader.result.split(',')[1]; // Remove metadata
                        resolve({
                            file_name: file.name,
                            file_data: base64String,
                        });
                    };
                })
            );
            reader.readAsDataURL(file);
        });
    
        Promise.all(fileReaders).then((fileDataArray) => {
            setFormData((prev) => ({
                ...prev,
                files: [...prev.files, ...fileDataArray],
            }));
        });
    };
    

    // handle all on submit
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const payload = {
            nazov: formData.name,
            id_owner: formData.id_owner,
            popis: formData.description,
            cena_zalohy: formData.deposit_price,
            cena_prenajmu: formData.rental_price,
            lokalita: formData.location,
            id_category: formData.id_category,
            files: formData.files,
            country: formData.country
        };

        localStorage.setItem('country', formData.country)
    
        try {    
            const response = await axios.post(lambdaUrl, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Ad submitted:', response.data);
            alert('Ponuka úspešné zdieľaná!');
            
            // reset data
            setFormData({
                name: '',
                id_owner: user.userId,
                description: '',
                deposit_price: 0,
                rental_price: 0,
                location: '',
                id_category: '',
                files: [],
                country: '',
            });
        } catch (err) {
            console.error('Submission error:', err.response ? err.response.data : err.message);
            alert('Chyba pri zdieľaní ponuky');
        }
    };

    // remove pictures
    const handleRemoveFile = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            files: prev.files.filter((_, index) => index !== indexToRemove),
        }));
    };


    // render page
    return (
        <div className="register-card">
            <div className="card-header">
                <h1 className="log">Vytvoriť ponuku</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Názov:</label>
                    <input
                        className="whole"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Popis:</label>
                    <textarea
                        className="whole"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                    />
                </div>


                <div className="form-group">
                    <label htmlFor="deposit_price">Cena zálohy:</label>
                    <input
                        className="whole"
                        type="number"
                        name="deposit_price"
                        value={formData.deposit_price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="rental_price">Cena prenájmu:</label>
                    <input
                        className="whole"
                        type="number"
                        name="rental_price"
                        value={formData.rental_price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="location">Lokalita:</label>
                    <input
                        className="whole"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="country">Krajina:</label>
                    <input
                        className="whole"
                        type="text"
                        name="country"
                        value={formData.country == 'CZ' ? 'Česká Republika' : "Slovensko"}
                        disabled
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="id_category">Kategória:</label>
                    <select
                        className="whole"
                        name="id_category"
                        value={formData.id_category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Vyberte kategóriu</option>
                        {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="files">Súbory:</label>
                    <input
                        type="file"
                        accept="image/jpeg"
                        onChange={handleFileChange}
                        multiple
                        className="whole"
                    />
                </div>

                {formData.files.length > 0 && (
                    <div className="file-preview-container" style={{ marginTop: '1rem' }}>
                        <p>Nahraté súbory:</p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {formData.files.map((file, index) => (
                                <div key={index} style={{ maxWidth: '150px', position: 'relative' }}>
                                    {file.file_name.toLowerCase().match(/\.(png|jpg|jpeg|gif|bmp|webp)$/) ? (
                                        <img
                                            src={`data:image/*;base64,${file.file_data}`}
                                            // src={`${file.file_data}`}
                                            alt={file.file_name}
                                            style={{ width: '100%', borderRadius: '8px' }}
                                        />
                                    ) : (
                                        <p>{file.file_name}</p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '-8px',
                                            background: 'black',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <input
                    type="submit"
                    value="Zverejni ponuku"
                    className="button"
                />
            </form>
        </div>
    );
}
