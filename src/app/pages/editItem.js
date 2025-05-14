'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function EditItemPage({ item, goBack }) {
    const lambdaUrl = process.env.NEXT_PUBLIC_CLOUD_API_URL + '/ads/edit';
    
    // Initialize formData with 'files' as an empty array if it's undefined
    const [formData, setFormData] = useState({
        ...item,
        image_urls: Array.isArray(item.image_urls)
            ? item.image_urls.map((url) => ({
                file_name: url.split('/').pop(), // Get the file name from the URL (for simplicity)
                file_data: url, // For old images, treat the URL as the base64 data (or path)
            }))
            : [],
    });

    console.log(formData);


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
        const image_urls = Array.from(e.target.files);
        const fileReaders = [];
        
        image_urls.forEach((file) => {
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
                image_urls: [
                    ...prev.image_urls, 
                    ...fileDataArray // Add the new base64 files to the existing image_urls
                ],
            }));
        });
    };

    // handle all on submit
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const payload = formData;
    
        try {    
            const response = await axios.post(lambdaUrl, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Ad submitted:', response.data);
            alert('Ponuka úspešne zdieľaná!');

        } catch (err) {
            console.error('Submission error:', err.response ? err.response.data : err.message);
            alert('Chyba pri zdieľaní ponuky');
        }
    };

    // remove pictures
    const handleRemoveFile = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            image_urls: prev.image_urls.filter((_, index) => index !== indexToRemove), // Remove the selected file
        }));
    };


    // render page
    return (
        <>
        <div className="pathBack">
            <strong className="pathBackPointer" onClick={goBack}>← Späť</strong>
        </div>
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
                        value={formData.nazov}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Popis:</label>
                    <textarea
                        className="whole"
                        name="description"
                        value={formData.popis}
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
                        value={formData.cena_zalohy}
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
                        value={formData.cena_prenajmu}
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
                        value={formData.lokalita}
                        onChange={handleChange}
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

                {formData.image_urls?.length > 0 && (
                    <div className="file-preview-container" style={{ marginTop: '1rem' }}>
                        <p>Nahraté súbory:</p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {formData.image_urls.map((image, index) => (
                                <div key={index} style={{ maxWidth: '150px', position: 'relative' }}>
                                    <img
                                        src={image.file_data.startsWith('data:image') 
                                            ? `data:image/jpeg;base64,${image.file_data}` 
                                            : image.file_data} // Handle both base64 and URL formats
                                        alt={`Image ${index}`}
                                        style={{ width: '100%', borderRadius: '8px' }}
                                    />
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
        </>
    );
}
