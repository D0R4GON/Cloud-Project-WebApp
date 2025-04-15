"use client";

import "../css/login_page.css";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';

export default function ProfilePage({ setBar }) {
    const { user, signOut } = useAuthenticator((context) => [context.user]);
    // const [email, setEmail] = useState('');

    // useEffect(() => {
    //     const loadAttributes = async () => {
    //         try {
    //             const attributes = await fetchUserAttributes();
    //             setEmail(attributes.email || '');
    //         } catch (error) {
    //             console.error("Error fetching user attributes:", error);
    //         }
    //     };

    //     loadAttributes();
    // }, []);

    const handleLogout = () => {
        signOut();
        setBar("home");
    };

    const handleBarChange = (event) => {
        setBar(event.target.placeholder);
    };

    return (
        <div className="login_page">
            <div className="login-card">
                <div className="form-group">
                    <strong>User: {user.username}</strong>
                </div>
                {/* <div className="form-group">
                    <strong>Email: {email}</strong>
                </div> */}
                <div className="form-group">
                    <input className="button" type="submit" value="Moje položky" placeholder="userList" onClick={handleBarChange} />
                </div>
                <div className="form-group">
                    <input className="button" type="submit" value="Zdieľaj ponuku" placeholder="offer" onClick={handleBarChange} />
                </div>
                {/* <div className="form-group">
                    <input className="button" type="submit" value="Change profile" placeholder="profileChange" onClick={handleBarChange} />
                </div> */}
                <div className="form-group">
                    <input className="button" type="submit" value="Logout" onClick={handleLogout} />
                </div>
            </div>
        </div>
    );
}
