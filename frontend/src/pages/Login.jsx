import { useState } from 'react';
import { signupUser } from '../services/api';
import '../css/App.css'; // İsteğe bağlı css


function Login({onLoginSuccess}) {
    const [isSignup, setIsSignup] = useState(false);
    const [inputUserId, setInputUserId] = useState('');
    const [message, setMessage] = useState('');

    //varolan userid ile giriş yapma
    const handleLogin = (e)=>{
        e.preventDefault();
        if(!inputUserId){
            setMessage("enter valid user id!");
            return;
        }
        const userIdNum = parseInt(inputUserId, 10);
        localStorage.setItem("userId", userIdNum);
        if(onLoginSuccess) onLoginSuccess(userIdNum);
    }

    // 2. Yeni Kayıt Olma (Sign Up)
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setMessage("Kullanıcı oluşturuluyor...");
      const data = await signupUser(); // Backend'de main_data.csv'ye yazılır
      
      if (data.userId) {
        localStorage.setItem("userId", data.userId);
        setMessage(`Kayıt Başarılı! Sizin User ID'niz: ${data.userId}`);
        
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(data.userId);
        }, 1500);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage("Kayıt oluşturulurken bir hata oluştu.");
    }
  };



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
                 }}>{isSignup ? "Sign Up" : "Login"}</h2>

                {message && <p style={{ color: '#ffd700', marginBottom: '1rem' }}>{message}</p>}

                
                {!isSignup ? (

                    //LOGIN FORM

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px'
                     }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' ,color: "black"}}>
                        <label htmlFor="phone">Phone number</label>
                        <input
                            value={inputUserId}
                            type="number"
                            placeholder="Enter User ID"
                            style={{
                                padding: '12px 14px',
                                border: '1px solid #ddd',
                                borderRadius: '10px',
                                fontSize: '16px'
                            }}
                            onChange={(e) => setInputUserId(e.target.value)}
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
                ):(
                    //SIGNUP FORM

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' ,color: "black"}}>

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
                            onClick={handleSignup}
                        >
                            Signup with default ID
                        </button>
                    </div>
                </form>
                )}







                <p style={{ marginTop: '20px', textAlign: 'center' ,color: "black"}}>
                    Not a member? <a href="#">Sign up now</a>
                </p>
            </div>
        </div>
    );
}

export default Login;


