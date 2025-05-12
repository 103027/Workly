import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/store/AuthContext';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';
import { useRouter } from 'next/router';
const Navbar = () => {
    const router = useRouter()
    const { userId, name, role, isAuthenticated, logout } = useAuth();
    const user = {
        name,
        role
    }

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    function handleLogout() {
        router.push('/')
        logout()
    }

    return (
        <nav className="bg-white shadow">
            <div className="container-custom py-4">
                <div className="flex items-center justify-between">
                    <Logo />

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/tasks" className="text-gray-700 hover:text-pro">
                            Browse Tasks
                        </Link>

                        <Link href="/help/faqs" className="text-gray-700 hover:text-pro">
                            How It Works
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {user?.role === 'employer' && (
                                    <Link href="/post-task">
                                        <Button variant="default" className="bg-pro hover:bg-pro-light">
                                            Post a Task
                                        </Button>
                                    </Link>
                                )}

                                <div className="relative group">
                                    <Button variant="ghost" className="flex items-center gap-2">
                                        <User size={18} />
                                        <span>{user?.name}</span>
                                    </Button>

                                    <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                        <Link
                                            href={`/dashboard`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href={`/profile/${userId}`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            My Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/auth/login">
                                    <Button variant="outline" className="border-pro text-pro hover:bg-pro hover:text-white">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button variant="default" className="bg-pro hover:bg-pro-light">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button variant="ghost" onClick={toggleMobileMenu} aria-label="Menu">
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pt-4 pb-3 border-t mt-4 animate-fade-in">
                        <div className="flex flex-col space-y-3">
                            <Link
                                href="/tasks"
                                className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Browse Tasks
                            </Link>
                            <Link
                                href="/help/faqs"
                                className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                How It Works
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href={`/profile/${userId}`}
                                        className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        My Profile
                                    </Link>
                                    {user?.role === 'employer' &&
                                        <>
                                            <Link
                                                href="/post-task"
                                                className="px-3 py-2 rounded-md font-medium text-pro hover:bg-gray-100"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Post a Task
                                            </Link>
                                        </>}
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="px-3 py-2 text-left rounded-md text-red-500 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-3 pt-2">
                                    <Link
                                        href="/auth/login"
                                        className="px-3 py-2 rounded-md text-center border border-pro text-pro hover:bg-pro hover:text-white transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="px-3 py-2 rounded-md text-center bg-pro text-white hover:bg-pro-light transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;