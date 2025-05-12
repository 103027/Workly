import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/store/AuthContext';

const Auth = () => {
    const {isAuthenticated} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated]);

    return (
        <>
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-8">
                <div className="w-full max-w-4xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="hidden md:block">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2">
                                    <div className="h-12 w-12 rounded-full bg-pro flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="white"
                                            className="h-6 w-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold">Trusted Platform</h2>
                                </div>
                                <p className="text-gray-600">
                                    Join thousands of users who trust ProMatch to connect with skilled professionals or find work opportunities.
                                </p>

                                <div className="flex items-center space-x-2">
                                    <div className="h-12 w-12 rounded-full bg-pro flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="white"
                                            className="h-6 w-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold">Secure Payments</h2>
                                </div>
                                <p className="text-gray-600">
                                    Our platform ensures secure transactions between clients and service providers.
                                </p>

                                <div className="flex items-center space-x-2">
                                    <div className="h-12 w-12 rounded-full bg-pro flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="white"
                                            className="h-6 w-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold">Fast Matching</h2>
                                </div>
                                <p className="text-gray-600">
                                    Get connected with the right professionals quickly and efficiently.
                                </p>
                            </div>
                        </div>
                        <div>
                            <AuthForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Auth;