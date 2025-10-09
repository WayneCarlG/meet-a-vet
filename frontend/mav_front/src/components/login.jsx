import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Replace with actual authentication logic
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        // Simulate login
        try {
            // await loginUser({ email, password });
            alert('Logged in successfully!');
        } catch (err) {
            setError('Invalid credentials.');
        }
    };

    return (
        <div style={styles.container}>
            <form style={styles.form} onSubmit={handleSubmit}>
                <h2 style={styles.title}>Vet Telemedicine Login</h2>
                {error && <div style={styles.error}>{error}</div>}
                <label style={styles.label}>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                </label>
                <label style={styles.label}>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                </label>
                <button type="submit" style={styles.button}>Login</button>
                <div style={styles.linkContainer}>
                    <a href="/register" style={styles.link}>New user? Register</a>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f7fafc',
    },
    form: {
        background: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '350px',
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        marginBottom: '1.5rem',
        textAlign: 'center',
        color: '#2d3748',
    },
    label: {
        marginBottom: '1rem',
        color: '#4a5568',
        fontWeight: '500',
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        marginTop: '0.5rem',
        padding: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #cbd5e0',
        fontSize: '1rem',
    },
    button: {
        padding: '0.75rem',
        background: '#3182ce',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '1rem',
    },
    error: {
        color: '#e53e3e',
        marginBottom: '1rem',
        textAlign: 'center',
    },
    linkContainer: {
        marginTop: '1rem',
        textAlign: 'center',
    },
    link: {
        color: '#3182ce',
        textDecoration: 'none',
        fontSize: '0.95rem',
    },
};

export default Login;