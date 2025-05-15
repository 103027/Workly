import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/store/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { useNotification } from '@/store/NotificationContext';

const AuthForm = () => {
    const router = useRouter();
    const { mode } = router.query;
    const { showNotification } = useNotification();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const value = useAuth()

    const login = async (email, password) => {
        try {
            const response = await axios.post(`/api/auth/signin`, {
                email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            setEmail("")
            setPassword("")
            setName("")
            console.log(response)
            value.afterlogin(response.data?.user)
            router.push(`/role`)
            showNotification('Login successfully!', 'success');
        } catch (error) {
            console.error('Login failed:', error.response?.data?.error || error.message);
            showNotification('Error in Login', 'error', 5000);
        }
    };

    const signup = async (email, password, name) => {
        try {
            const response = await axios.post(`/api/auth/signup`, {
                email,
                password,
                fullname: name,
                phoneNumber
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setEmail("")
            setPassword("")
            setName("")
            router.push(`/auth/login`)
            showNotification('Registered successfully!', 'success');
        } catch (error) {
            console.error('Signup failed:', error.response?.data?.error || error.message);
            showNotification(error.message, 'error', 5000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!email || !password) {
                alert("Please fill in all required fields");
                setIsLoading(false);
                return;
            }

            if (mode === 'signup' && !name) {
                alert("Please enter your name");
                setIsLoading(false);
                return;
            }

            if (mode === 'signup' && !phoneNumber) {
                alert("Please enter your Phone Number");
                setIsLoading(false);
                return;
            }

            if (mode === 'login') {
                await login(email, password);
            } else {
                await signup(email, password, name, phoneNumber);
            }
        } catch (error) {
            console.error('Authentication error:', error);
            showNotification(error.message, 'error', 5000);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        if (mode === 'login') {
            router.push(`/auth/signup`);
        }
        else if (mode === 'signup') {
            router.push(`/auth/login`);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {mode === 'login' ? 'Log in to your account' : 'Create an account'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            disabled={isLoading}
                            className="form-input"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        disabled={isLoading}
                        className="form-input"
                    />
                </div>

                {mode === 'signup' && (
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="03123456789"
                            disabled={isLoading}
                            className="form-input"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="form-input"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-pro hover:bg-pro-light"
                >
                    {isLoading ? 'Processing...' : mode === 'login' ? 'Log In' : 'Sign Up'}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm">
                <p>
                    {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                    {' '}
                    <button
                        onClick={toggleMode}
                        className="text-pro hover:text-pro-light font-medium"
                    >
                        {mode === 'login' ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;