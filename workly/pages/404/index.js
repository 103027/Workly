import Link from 'next/link';
import { Button } from "@/components/ui/button"

const NotFound = () => {
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
                    <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
                        <Button size="lg" className="bg-blue-700 text-white hover:bg-blue-500 border">
                            Return to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default NotFound;