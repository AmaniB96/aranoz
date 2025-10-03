import { Head, Link, useForm } from '@inertiajs/react';
import './register.css';
import Nav from '@/Components/nav/Nav';
import Footer from '@/Components/Footer/Footer';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        name: '',
        pseudo: '',
        email: '',
        password: '',
        password_confirmation: '',
        subscribe_newsletter: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="register-page">
            <Head title="Register" />

            <Nav />

            {/* Conteneur principal */}
            <div className="register-container">
                {/* Panneau gauche - Formulaire */}
                <div className="register-form-container">
                    <div className="register-form-header">
                        <h1>Welcome !</h1>
                        <p>Please register now</p>
                    </div>

                    <form onSubmit={submit} className="register-form">
                        <div className="form-group">
                            <label htmlFor="first_name" className="form-label">First Name</label>
                            <input
                                id="first_name"
                                type="text"
                                name="first_name"
                                value={data.first_name}
                                className="form-input"
                                autoComplete="given-name"
                                autoFocus
                                placeholder="Enter your first name"
                                onChange={(e) => setData('first_name', e.target.value)}
                                required
                            />
                            {errors.first_name && (
                                <div className="form-error">{errors.first_name}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Last Name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="form-input"
                                autoComplete="family-name"
                                placeholder="Enter your last name"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && (
                                <div className="form-error">{errors.name}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="pseudo" className="form-label">Username</label>
                            <input
                                id="pseudo"
                                type="text"
                                name="pseudo"
                                value={data.pseudo}
                                className="form-input"
                                autoComplete="username"
                                placeholder="Enter your username"
                                onChange={(e) => setData('pseudo', e.target.value)}
                                required
                            />
                            {errors.pseudo && (
                                <div className="form-error">{errors.pseudo}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="form-input"
                                autoComplete="email"
                                placeholder="Enter your email"
                                onChange={(e) => setData('email', e.target.value)}
                                required
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
                                autoComplete="new-password"
                                placeholder="Enter your password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && (
                                <div className="form-error">{errors.password}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_confirmation" className="form-label">
                                Confirm Password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="form-input"
                                autoComplete="new-password"
                                placeholder="Confirm your password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                required
                            />
                            {errors.password_confirmation && (
                                <div className="form-error">{errors.password_confirmation}</div>
                            )}
                        </div>

                        <div className="newsletter-checkbox">
                            <input
                                type="checkbox"
                                id="subscribe_newsletter"
                                name="subscribe_newsletter"
                                checked={data.subscribe_newsletter}
                                onChange={(e) => setData('subscribe_newsletter', e.target.checked)}
                            />
                            <label htmlFor="subscribe_newsletter">Subscribe to newsletter</label>
                        </div>

                        <button type="submit" className="register-submit-btn" disabled={processing}>
                            {processing ? 'Creating account...' : 'Register'}
                        </button>

                        <div className="login-link">
                            Already have an account? <Link href={route('login')}>Login here</Link>
                        </div>
                    </form>
                </div>

                {/* Panneau droit - Promotion */}
                <div className="register-promo">
                    <h2>You are new ?</h2>
                    <h2>Create new account here</h2>
                    <p>
                        There are advances being made in science and technology everyday,
                        and a good example of this is the
                    </p>
                    <Link href={route('login')} className="login-account-btn">
                        Already have an account?
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}