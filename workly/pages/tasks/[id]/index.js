import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import BidCard from '@/components/tasks/BidCard.js';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, DollarSign, MapPin, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Mock task data
const mockTasks = [
    {
        id: '1',
        title: 'Fix leaking bathroom sink',
        category: 'Plumbing',
        location: 'San Francisco, CA',
        budget: 120,
        description: 'The sink in my master bathroom is leaking from the pipes below. Need a professional to fix it as soon as possible. I\'ve noticed water collecting in the cabinet below the sink. The issue seems to be with the P-trap or the drain pipe connection. I need someone with experience in plumbing repairs who can identify the problem and fix it properly. I have basic tools available, but you may need to bring specialized plumbing tools. Looking for someone who can come within the next 1-2 days.',
        status: 'open',
        bidCount: 3,
        postedDate: '2 days ago',
        postedBy: {
            id: 'user123',
            name: 'Michael Johnson',
            rating: 4.8,
        }
    },
    {
        id: '2',
        title: 'Install ceiling fan in bedroom',
        category: 'Electrical',
        location: 'Oakland, CA',
        budget: 85,
        description: 'Need someone to install a ceiling fan in the master bedroom. I have already purchased the fan. The room currently has a ceiling light fixture, so the wiring is in place. The fan is a standard size with a light kit included. Please bring any tools needed for the installation. I would prefer someone with experience in electrical installations who can ensure the fan is properly balanced and securely mounted. Available weekday evenings after 6pm or weekends.',
        status: 'open',
        bidCount: 5,
        postedDate: '4 days ago',
        postedBy: {
            id: 'user456',
            name: 'Sarah Williams',
            rating: 4.5,
        }
    },
];

// Mock bids data
const mockBids = [
    {
        id: 'bid1',
        userId: 'user1',
        userName: 'John Smith',
        userAvatar: '',
        amount: 110,
        message: 'I can fix this for you today. I have 10+ years of experience with plumbing issues like this one. I have all the necessary tools and parts that might be needed for this repair. I can be available this afternoon or early evening.',
        deliveryTime: '1-2 hours',
        rating: 4.8,
        taskId: '1',
        status: 'pending'
    },
    {
        id: 'bid2',
        userId: 'user2',
        userName: 'Maria Rodriguez',
        userAvatar: '',
        amount: 95,
        message: 'I have all the tools needed and can be there this afternoon. Similar repairs usually take me about 1-2 hours. I\'ve worked on many sink leaks, and it\'s typically an issue with the connectors or the P-trap. I can replace any parts needed if you have them, or I can pick them up on the way.',
        deliveryTime: 'Same day',
        rating: 4.5,
        taskId: '1',
        status: 'pending'
    },
    {
        id: 'bid3',
        userId: 'user3',
        userName: 'Robert Chen',
        userAvatar: '',
        amount: 125,
        message: 'Licensed plumber with 15 years experience. I can identify and fix the issue quickly. I carry most standard replacement parts with me, so I can likely fix it in one visit. I can come tomorrow morning if that works for you. I provide a 30-day warranty on all my work.',
        deliveryTime: 'Next day',
        rating: 4.9,
        taskId: '1',
        status: 'pending'
    },
];

// Notification component to replace toast
const Notification = ({ message, type, onClose }) => {
    return (
        <Alert className={`fixed top-4 right-4 w-auto max-w-sm z-50 ${type === 'error' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
            <AlertDescription className={`${type === 'error' ? 'text-red-800' : 'text-green-800'} flex justify-between items-center`}>
                <span>{message}</span>
                <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
                    &times;
                </button>
            </AlertDescription>
        </Alert>
    );
};

const TaskDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    //   const { user, isAuthenticated } = useAuth();
    const user = {
        name: 'John Doe',
        role: 'employer'
    };
    const isAuthenticated = true;

    const [bidAmount, setBidAmount] = useState('');
    const [bidMessage, setBidMessage] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [isSubmittingBid, setIsSubmittingBid] = useState(false);
    const [notification, setNotification] = useState(null);
    const [task, setTask] = useState(null);
    const [taskBids, setTaskBids] = useState([]);

    // Wait for router to be ready and id to be available
    useEffect(() => {
        if (!router.isReady) return;

        // Find the task based on the id parameter
        const foundTask = mockTasks.find(task => task.id === id);
        setTask(foundTask);

        // Get bids for this task
        if (id) {
            const filteredBids = mockBids.filter(bid => bid.taskId === id);
            setTaskBids(filteredBids);
        }
    }, [router.isReady, id]);

    // Check if user is the task poster
    const isTaskOwner = isAuthenticated && user?.role === 'employer' && task?.postedBy?.id === user.id;

    // Check if user has already bid on this task
    const userHasBid = isAuthenticated && user?.role === 'employee' &&
        taskBids.some(bid => bid.userId === user.id);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const handleBidSubmit = (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            showNotification("Please log in to submit a bid", "error");
            router.push('/auth?mode=login');
            return;
        }

        if (!bidAmount || !bidMessage) {
            showNotification("Please fill in all required fields", "error");
            return;
        }

        setIsSubmittingBid(true);

        // Mock bid submission
        setTimeout(() => {
            setIsSubmittingBid(false);
            showNotification("Your bid has been submitted successfully!");
            router.push('/dashboard');
        }, 1000);
    };

    const handleAcceptBid = (bidId) => {
        showNotification("You've accepted the bid!");
        router.push('/dashboard');
    };

    if (!task && router.isReady) {
        return (
            <>
                <Navbar />
                <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center">
                    <div className="text-center p-6">
                        <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
                        <p className="text-gray-600 mb-6">
                            Sorry, the task you're looking for doesn't exist or has been removed.
                        </p>
                        <Button
                            onClick={() => router.push('/task-listing')}
                            className="bg-pro hover:bg-pro-light"
                        >
                            Browse Available Tasks
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    // Show loading state while waiting for router or data
    if (!task) {
        return (
            <>
                <Navbar />
                <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center">
                    <div className="text-center p-6">
                        <h2 className="text-xl">Loading task details...</h2>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <Navbar />
            <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-8">
                <div className="container-custom max-w-5xl">
                    <div className="mb-4">
                        <Link href="/task-listing" className="text-pro hover:underline flex items-center">
                                &larr; Back to Tasks
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Task details */}
                        <div className="md:col-span-2">
                            <Card className="mb-8">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h1 className="text-2xl font-bold">{task.title}</h1>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center text-gray-600">
                                            <MapPin size={18} className="mr-2" />
                                            {task.location}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Calendar size={18} className="mr-2" />
                                            Posted {task.postedDate}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <DollarSign size={18} className="mr-2" />
                                            Budget: ${task.budget}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Clock size={18} className="mr-2" />
                                            {task.bidCount} bids
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h2 className="text-lg font-medium mb-3">Description</h2>
                                        <p className="text-gray-700 whitespace-pre-line">
                                            {task.description}
                                        </p>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4">
                                        <div className="flex items-center text-gray-700">
                                            <User size={18} className="mr-2" />
                                            Posted by:{' '}
                                            <Link href={`/profile/${task.postedBy.id}`} className="ml-1 text-pro hover:underline">
                                                    {task.postedBy.name}
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Bids section - visible to task owners or once users have placed a bid */}
                            {(isTaskOwner || userHasBid) && (
                                <div>
                                    <h2 className="text-xl font-medium mb-4">
                                        Bids ({taskBids.length})
                                    </h2>

                                    {taskBids.length > 0 ? (
                                        <div className="space-y-4">
                                            {taskBids.map(bid => (
                                                <BidCard
                                                    key={bid.id}
                                                    {...bid}
                                                    viewerIsTaskOwner={isTaskOwner}
                                                    onAcceptBid={() => handleAcceptBid(bid.id)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <Card>
                                            <CardContent className="p-6 text-center">
                                                <p className="text-gray-500">
                                                    No bids have been placed on this task yet.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Place Bid or Task Actions */}
                        <div>
                            {isAuthenticated && user?.role === 'employee' && task.status === 'open' && !userHasBid && (
                                <Card>
                                    <CardContent className="p-6">
                                        <h2 className="text-xl font-medium mb-4">Place Your Bid</h2>
                                        <form onSubmit={handleBidSubmit} className="space-y-4">
                                            <div>
                                                <Label htmlFor="bidAmount">Your Bid Amount ($)</Label>
                                                <div className="relative mt-1">
                                                    <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <Input
                                                        id="bidAmount"
                                                        type="number"
                                                        value={bidAmount}
                                                        onChange={(e) => setBidAmount(e.target.value)}
                                                        className="pl-8 form-input"
                                                        placeholder="Enter your price"
                                                        min="1"
                                                        step="1"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="deliveryTime">Delivery Time</Label>
                                                <Input
                                                    id="deliveryTime"
                                                    value={deliveryTime}
                                                    onChange={(e) => setDeliveryTime(e.target.value)}
                                                    className="form-input"
                                                    placeholder="e.g., 2-3 days, Same day"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="bidMessage">Cover Letter</Label>
                                                <Textarea
                                                    id="bidMessage"
                                                    value={bidMessage}
                                                    onChange={(e) => setBidMessage(e.target.value)}
                                                    className="form-input min-h-[120px]"
                                                    placeholder="Describe why you're a good fit for this task..."
                                                    required
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full bg-pro hover:bg-pro-light"
                                                disabled={isSubmittingBid}
                                            >
                                                {isSubmittingBid ? 'Submitting...' : 'Submit Bid'}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            {isAuthenticated && user?.role === 'employee' && userHasBid && (
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <h2 className="text-xl font-medium mb-2">You've placed a bid</h2>
                                            <p className="text-gray-600 mb-4">
                                                You'll be notified if the client responds to your bid.
                                            </p>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" className="border-pro text-pro hover:bg-pro hover:text-white">
                                                        View Your Bid
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Your Bid</DialogTitle>
                                                        <DialogDescription>
                                                            Here's the bid you've submitted for this task.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    {taskBids
                                                        .filter(bid => bid.userId === user.id)
                                                        .map(bid => (
                                                            <div key={bid.id} className="space-y-4">
                                                                <div>
                                                                    <Label className="text-sm">Amount</Label>
                                                                    <p className="font-medium text-lg">${bid.amount}</p>
                                                                </div>
                                                                <div>
                                                                    <Label className="text-sm">Delivery Time</Label>
                                                                    <p>{bid.deliveryTime}</p>
                                                                </div>
                                                                <div>
                                                                    <Label className="text-sm">Message</Label>
                                                                    <p className="text-gray-700">{bid.message}</p>
                                                                </div>
                                                                <div>
                                                                    <Label className="text-sm">Status</Label>
                                                                    <p className="capitalize">{bid.status}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    <DialogFooter>
                                                        <Button variant="outline" className="w-full">Close</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {isTaskOwner && (
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <h2 className="text-xl font-medium mb-2">Task Actions</h2>
                                            <p className="text-gray-600 mb-4">
                                                Manage your posted task here.
                                            </p>
                                            <div className="space-y-3">
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
                                                >
                                                    Edit Task
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                                >
                                                    Cancel Task
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {(!isAuthenticated || (user?.role !== 'employee' && !isTaskOwner)) && (
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <h2 className="text-xl font-medium mb-2">Interested?</h2>
                                            {!isAuthenticated ? (
                                                <>
                                                    <p className="text-gray-600 mb-4">
                                                        Sign in or create an account to bid on this task.
                                                    </p>
                                                    <div className="space-y-3">
                                                        <Button
                                                            onClick={() => router.push('/auth?mode=login')}
                                                            className="w-full bg-pro hover:bg-pro-light"
                                                        >
                                                            Sign In
                                                        </Button>
                                                        <Button
                                                            onClick={() => router.push('/auth?mode=signup')}
                                                            variant="outline"
                                                            className="w-full border-pro text-pro hover:bg-pro hover:text-white"
                                                        >
                                                            Create Account
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-gray-600">
                                                    Only service providers can bid on tasks.
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Similar tasks */}
                            <div className="mt-6">
                                <h3 className="text-lg font-medium mb-4">Similar Tasks</h3>
                                <div className="space-y-4">
                                    {mockTasks
                                        .filter(t => t.id !== task.id && t.category === task.category)
                                        .slice(0, 2)
                                        .map(task => (
                                            <Card key={task.id} className="card-hover">
                                                <CardContent className="p-4">
                                                    <h4 className="font-medium mb-1 line-clamp-1">{task.title}</h4>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-gray-600">{task.location}</span>
                                                        <span className="font-medium text-pro">${task.budget}</span>
                                                    </div>
                                                    <Link href={`/tasks/${task.id}`}>
                                                        <a className="block w-full">
                                                            <Button variant="outline" className="w-full mt-2 border-pro text-pro hover:bg-pro hover:text-white">
                                                                View Task
                                                            </Button>
                                                        </a>
                                                    </Link>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TaskDetail;