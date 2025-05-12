import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/store/AuthContext';
import { Button } from '@/components/ui/button';
import RoleCard from '@/components/ui/RoleCard';
import axios from 'axios';
import { useNotification } from '@/store/NotificationContext';

const RoleSelection = () => {
    const { showNotification } = useNotification()
    const [selectedRole, setSelectedRole] = useState(null);
    const { userId, isAuthenticated, setRole, role } = useAuth();
    const router = useRouter();

    // Redirect if user is already authenticated with a role
    useEffect(() => {
        if (isAuthenticated && role) {
            router.push(`/dashboard`);
        }
        if (!isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, userId, router]);

    const updateUserRole = async (userId, newRole) => {
        try {
            const response = await axios.patch(
                `http://localhost:3000/api/role/${userId}`,
                { role: newRole },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            showNotification('Role Added!', 'success');
            return response.data;
        } catch (error) {
            console.error('Failed to update role:', error);
            showNotification('Failed to add role!', 'error', 5000);
        }
    };

    const handleContinue = () => {
        if (selectedRole) {
            setRole(selectedRole);
            updateUserRole(userId, selectedRole)
            router.push('/dashboard');
        }
    };

    return (
        <>
            <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-12">
                <div className="container-custom max-w-4xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Choose Your Role</h1>
                        <p className="text-gray-600">
                            Tell us how you'll be using Workly.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <RoleCard
                            title="I'm looking to hire"
                            description="Post tasks and hire skilled professionals for your needs."
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="h-6 w-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            }
                            isSelected={selectedRole === 'employer'}
                            onClick={() => setSelectedRole('employer')}
                        />

                        <RoleCard
                            title="I'm looking for work"
                            description="Browse tasks, submit bids, and offer your professional services."
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="h-6 w-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                                    />
                                </svg>
                            }
                            isSelected={selectedRole === 'employee'}
                            onClick={() => setSelectedRole('employee')}
                        />
                    </div>

                    <div className="flex justify-center">
                        <Button
                            onClick={handleContinue}
                            disabled={!selectedRole}
                            className="w-full max-w-xs bg-pro hover:bg-pro-light"
                            size="lg"
                        >
                            Continue as {selectedRole === 'employer' ? 'Employer' : selectedRole === 'employee' ? 'Employee' : '...'}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoleSelection;