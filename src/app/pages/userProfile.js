'use client';

import { useState, useEffect } from 'react';
import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession } from 'aws-amplify/auth';

export default function UserProfilePage() {
    const { user } = useAuthenticator((context) => [context.route, context.user]);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [idUser, setIdUser] = useState("");
    const [tokens, setTokens] = useState(null);

    useEffect(() => {
        const loadSession = async () => {
            try {
                const session = await fetchAuthSession();
                const idToken = session.tokens?.idToken;
                const accessToken = session.tokens?.accessToken;

                console.log("Token Payload:", idToken.payload);

                setTokens({ idToken, accessToken });
                
                setName(idToken?.payload?.name || '');
                setEmail(idToken?.payload?.email || '');
                setIdUser(user?.userId);

            } catch (err) {
                console.error("Failed to fetch session:", err);
            }
        };

        loadSession();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "name") setName(value);
        if (name === "email") setEmail(value);
    };


    // render page
    return (
        <div className="register-card">
            <div className="card-header">
                <h1 className="log">Profil</h1>
            </div>
                <div className="form-group">
                    <label htmlFor="name">User ID:</label>
                    <input
                        className="whole"
                        type="text"
                        name="name"
                        value={idUser}
                        disabled
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="name">Meno:</label>
                    <input
                        className="whole"
                        type="text"
                        name="name"
                        value={name}
                        // onChange={handleChange}
                        disabled
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="name">Email:</label>
                    <input
                        className="whole"
                        type="text"
                        name="name"
                        value={email}
                        // onChange={handleChange}
                        disabled
                        required
                    />
                </div>

        </div>
    );
}
