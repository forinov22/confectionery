"use client"; // Client-side component

import { useState } from "react";
import styles from './page.module.scss';
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Send request to backend API for email/password login
        const response = await fetch(`http://localhost:5000/api/auth/local`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        if (response.ok) {
            // Handle successful login (e.g., redirect user)
            
        } else {
            const errorData = await response.json();
            setErrorMessage(errorData.message || "Login failed");
        }
    };

    return (
        <div className={styles.loginPage}>
            <h1>Login</h1>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {errorMessage && <p className={styles.error}>{errorMessage}</p>}

                <button type="submit">Login</button>
            </form>

            {/* Sign in with Google */}
            <div className={styles.googleLogin}>
                <p>Or sign in with</p>
                <Link href={`http://localhost:5000/api/auth/google`}>
                    <button type="button" className={styles.googleButton}>Sign in with Google</button>
                </Link>
            </div>
        </div>
    );
}
