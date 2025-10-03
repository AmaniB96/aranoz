import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import './login.css';
import Nav from '@/Components/nav/Nav';
import Footer from '@/Components/Footer/Footer';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="login-page">
            <Head title="Log in" />

            <Nav/>

            {/* Conteneur principal */}
            <div className="login-container">
                {/* Panneau gauche - Promotion */}
                <div className="login-promo">
                    <h2>New to our Shop?</h2>
                    <p>
                        There are advances being made in science and technology everyday,
                        and a good example of this is the
                    </p>
                    <Link href={route('register')} className="create-account-btn">
                        Create an Account
                    </Link>
                </div>

                {/* Panneau droit - Formulaire */}
                <div className="login-form-container">
                    <div className="login-form-header">
                        <h1>Welcome Back !</h1>
                        <p>Please Sign in now</p>
                    </div>

                    {status && (
                        <div className="status-message">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="form-input"
                                autoComplete="username"
                                autoFocus
                                placeholder="Enter your email"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && (
                                <div className="form-error">{errors.email}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="form-input"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && (
                                <div className="form-error">{errors.password}</div>
                            )}
                        </div>

                        <div className="remember-me">
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <label htmlFor="remember">Remember me</label>
                        </div>

                        <button type="submit" className="login-submit-btn" disabled={processing}>
                            {processing ? 'Logging in...' : 'Log In'}
                        </button>

                        <div className="login-links">
                            {canResetPassword && (
                                <Link href={route('password.request')} className="forgot-password">
                                    Forgot your password?
                                </Link>
                            )}
                            <div className="register-link">
                                Don't have an account? <Link href={route('register')}>Register here</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <Footer/>
        </div>
    );
}