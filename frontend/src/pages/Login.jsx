function Login() {
    return (
        <div style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px',
                padding: '32px 24px',
                borderRadius: '18px',
                background: '#fff',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ marginBottom: '24px', textAlign: 'center',
                color: "black"
                 }}>Sign in</h2>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' ,color: "black"}}>
                        <label htmlFor="phone">Phone number</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="Phone number"
                            style={{
                                padding: '12px 14px',
                                border: '1px solid #ddd',
                                borderRadius: '10px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px',color: "black" }}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            style={{
                                padding: '12px 14px',
                                border: '1px solid #ddd',
                                borderRadius: '10px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: '8px',
                            padding: '12px 18px',
                            border: 'none',
                            borderRadius: '10px',
                            background: '#4f46e5',
                            color: '#fff',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        Login
                    </button>
                </form>

                <p style={{ marginTop: '20px', textAlign: 'center' ,color: "black"}}>
                    Not a member? <a href="#">Sign up now</a>
                </p>
            </div>
        </div>
    );
}

export default Login;


