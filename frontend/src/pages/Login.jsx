import LoginPage from '@react-login-page/page8';
import { Submit, Logo, Footer, Password, Username, Input } from '@react-login-page/page8';

function Login() {
    return (
        <LoginPage>
            <Logo />

            <Input name="phone" placeholder="Phone number" />

            <Password />

            <Submit>Login</Submit>

            <Footer>
                Not a member? <a href="#">Sign up now</a>
            </Footer>
        </LoginPage>
    );
}

export default Login;


