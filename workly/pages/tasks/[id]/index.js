import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/store/AuthContext';
import BidCard from '@/components/tasks/BidCard.js';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, Delete, DollarSign, MapPin, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';
import TaskRatingForm from '@/components/rating/SubmitReview';
import { io } from 'socket.io-client';
import { useNotification } from '@/store/NotificationContext';
import { format } from 'date-fns';

const TaskDetail = (props) => {
    const router = useRouter();
    const { id } = router.query;
    const { userId, name, role, isAuthenticated, phoneNumber } = useAuth();
    const user = {
        name,
        role,
        id: userId,
        phoneNumber
    };
    const { showNotification } = useNotification()
    const [bidAmount, setBidAmount] = useState('');
    const [bidMessage, setBidMessage] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [isSubmittingBid, setIsSubmittingBid] = useState(false);
    const [task, setTask] = useState(props.task);
    const [taskBids, setTaskBids] = useState([]);
    const [socket, setSocket] = useState(null);

    const formatDate = (dateString) => {
        return format(new Date(dateString), 'dd/MM/yyyy, h:mm a');
    };

    // Initialize socket connection
    useEffect(() => {
        // Initialize socket connection
        const initSocket = async () => {
            await fetch('/api/socket');
            const socketIo = io();
            setSocket(socketIo);

            return () => {
                socketIo.disconnect();
            };
        };

        initSocket();
    }, []);

    // Listen for socket events
    useEffect(() => {
        if (socket) {
            // Listen for task updates
            socket.on('refreshData', async () => {
                try {
                    // Fetch updated task data
                    const response = await axios.get(`/api/tasks/${id}`);
                    if (response.data?.data) {
                        setTask(response.data.data);
                        filterBids(response.data.data);
                        showNotification("Task information updated", "success");
                    }
                } catch (error) {
                    console.error('Error fetching updated task data:', error);
                }
            });

            return () => {
                socket.off('refreshData');
            };
        }
    }, [socket, id]);

    // Filter bids based on user role
    useEffect(() => {
        filterBids(task);
    }, [task, isAuthenticated, user.id, user.role]);

    const filterBids = (taskData) => {
        if (!taskData) return;
        
        // Check if user is the task poster
        const isTaskOwner = isAuthenticated && user?.role === 'employer' && taskData?.postedBy?._id === user.id;
        
        if (!isTaskOwner && isAuthenticated && user?.role === 'employee') {
            // If user is an employee and not the task owner, only show their bids
            setTaskBids(taskData.bids.filter(bid => bid.userId === user.id));
        } else {
            // If user is the task owner or not authenticated, show all bids
            setTaskBids(taskData.bids);
        }
    };

    // Check if user is the task poster
    const isTaskOwner = isAuthenticated && user?.role === 'employer' && task?.postedBy?._id === user.id;

    // Check if user has already bid on this task
    const userHasBid = isAuthenticated && user?.role === 'employee' &&
        taskBids.some(bid => bid.userId === user.id);

    const emitUpdateEvent = () => {
        if (socket) {
            socket.emit('updateData');
        }
    };

    const submitBid = async (formData) => {
        try {
            const response = await axios.post(
                `/api/submitBid/${id}`,
                {
                    userId: userId,
                    userName: user.name,
                    amount: formData.bidAmount,
                    message: formData.bidMessage,
                    deliveryTime: formData.deliveryTime,
                    phoneNumber: user.phoneNumber
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            // Emit socket event to notify others about the update
            emitUpdateEvent();
            return response.data;
        } catch (error) {
            console.error('Failed to Post task:', error);
            throw error;
        }
    }

    const handleBidSubmit = (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            showNotification("Please log in to submit a bid", "error", 5000);
            router.push('/auth/login');
            return;
        }

        if (!bidAmount || !bidMessage) {
            showNotification("Please fill in all required fields", "error", 5000);
            return;
        }

        setIsSubmittingBid(true);

        submitBid({ bidAmount, bidMessage, deliveryTime })
            .then(() => {
                setIsSubmittingBid(false);
                showNotification("Your bid has been submitted successfully!", "success");
                router.push(`/dashboard/${role}/${userId}`);
            })
            .catch((error) => {
                setIsSubmittingBid(false);
                showNotification("Failed to submit bid. Please try again.", "error", 5000);
                console.error(error);
            });
    };

    const AcceptBid = async (bidId) => {
        try {
            const response = await axios.patch(
                `/api/submitBid/${id}/${bidId}`,
                {
                    userId: userId
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            // Emit socket event to notify others about the update
            emitUpdateEvent();
            return response.data;
        } catch (error) {
            console.error('Failed to Accept the bid:', error);
            throw error;
        }
    }

    const handleAcceptBid = (bidId) => {
        AcceptBid(bidId)
            .then(() => {
                showNotification("You've accepted the bid!", "success");
                router.push('/dashboard');
            })
            .catch((error) => {
                showNotification("Failed to accept bid. Please try again.", "error", 5000);
                console.error(error);
            });
    };

    const handleCompleteTask = async (rating, review) => {
        try {
            const response = await axios.patch(
                `/api/tasks/${id}/complete`,
                {
                    userId: userId,
                    userType: user.role,
                    rating,
                    review
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            // Emit socket event to notify others about the update
            emitUpdateEvent();
            showNotification("Task Completed!", "success");
            router.push('/dashboard');
            return response.data;
        } catch (error) {
            console.error('Failed to complete the task:', error);
            showNotification("Failed to complete task. Please try again.", "error", 5000);
        }
    };

    const DeleteBid = async (bidId) => {
        try {
            const response = await axios.delete(
                `/api/bids/${bidId}/delete`,
                {
                    data: { userId: userId }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            // Emit socket event to notify others about the update
            emitUpdateEvent();
            showNotification("Your Bid Deleted", "success");
            router.push('/dashboard');
            return response.data;
        } catch (error) {
            console.error('Failed to Delete the bid:', error);
            showNotification("Failed to delete bid. Please try again.", "error", 5000);
        }
    }

    const DeleteTask = async () => {
        try {
            const response = await axios.delete(
                `/api/tasks/${id}/delete`,
                {
                    data: { userId: userId }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            // Emit socket event to notify others about the update
            emitUpdateEvent();
            showNotification("Your Task Deleted", "success");
            router.push('/dashboard');
            return response.data;
        } catch (error) {
            console.error('Failed to Delete the task:', error);
            showNotification("Failed to delete task. Please try again.", "error", 5000);
            throw error;
        }
    }

    const handleCancelTask = async () => {
        try {
            const response = await axios.patch(
                `/api/tasks/${id}/cancel`,
                {
                    userId: userId
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            // Emit socket event to notify others about the update
            emitUpdateEvent();
            showNotification("Your Task Canceled", "success");
            router.push('/dashboard');
            return response.data;
        } catch (error) {
            console.error('Failed to Cancel the task:', error);
            showNotification("Failed to cancel task. Please try again.", "error", 5000);
            throw error;
        }
    }

    const handleCancelBid = async (bidId) => {
        try {
            const response = await axios.patch(
                `/api/bids/${bidId}/cancel`,
                {
                    userId: userId
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            // Emit socket event to notify others about the update
            emitUpdateEvent();
            showNotification("Your Bid Canceled", "success");
            router.push('/dashboard');
            return response.data;
        } catch (error) {
            console.error('Failed to Cancel the Bid:', error);
            showNotification("Failed to cancel bid. Please try again.", "error", 5000);
            throw error;
        }
    }

    if (!task) {
        return (
            <>
                <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center">
                    <div className="text-center p-6">
                        <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
                        <p className="text-gray-600 mb-6">
                            Sorry, the task you're looking for doesn't exist or has been removed.
                        </p>
                        <Button
                            onClick={() => router.push('/tasks')}
                            className="bg-pro hover:bg-pro-light"
                        >
                            Browse Available Tasks
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-8">
                <div className="container-custom max-w-5xl">
                    <div className="mb-4">
                        <Link href="/tasks" className="text-pro hover:underline flex items-center">
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
                                            {task.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center text-gray-600">
                                            <MapPin size={18} className="mr-2" />
                                            {task.location}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Calendar size={18} className="mr-2" />
                                            Posted at {formatDate(task?.createdAt)}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <DollarSign size={18} className="mr-2" />
                                            Budget: ${task.budget}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Clock size={18} className="mr-2" />
                                            {task?.bids?.length} bids
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h2 className="text-lg font-medium mb-3">Description</h2>
                                        <p className="text-gray-700 whitespace-pre-line">
                                            {task.description}
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <h2 className="text-lg font-medium mb-3">Phone Number</h2>
                                        <p className="text-gray-700 whitespace-pre-line">
                                            {task?.postedBy?.phoneNumber}
                                        </p>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4">
                                        <div className="flex items-center text-gray-700">
                                            <User size={18} className="mr-2" />
                                            Posted by:{' '}
                                            <Link href={`/profile/${task?.postedBy?._id}`} className="ml-1 text-pro hover:underline">
                                                {task?.postedBy?.Fullname}
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
                                                    key={bid._id}
                                                    {...bid}
                                                    viewerIsTaskOwner={isTaskOwner}
                                                    onAcceptBid={() => handleAcceptBid(bid._id)}
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
                                                <Label htmlFor="bidAmount">Your Bid Amount (PKR)</Label>
                                                <div className="relative mt-1">
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
                                            <div className="space-y-3">
                                                {taskBids.length > 0 && taskBids[0].status === "accepted" && <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
                                                        >
                                                            Complete Task
                                                        </Button>
                                                    </DialogTrigger>
                                                    <TaskRatingForm onSubmit={handleCompleteTask} />
                                                </Dialog>
                                                }
                                                {task?.employeeConfirmed !== true && taskBids.length > 0 && taskBids[0].status !== "rejected" && taskBids[0].status !== "canceled" && taskBids[0].status !== "Canceled" && <Button
                                                    variant="outline"
                                                    className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                                                    onClick={() => { handleCancelBid(taskBids[0]._id) }}
                                                >
                                                    Cancel Bid
                                                </Button>}
                                                {task.status === "open" && taskBids.length > 0 && taskBids[0].status !== "rejected" && taskBids[0].status !== "canceled" && <Button
                                                    variant="outline"
                                                    className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                                    onClick={() => { DeleteBid(taskBids[0]._id) }}
                                                >
                                                    Delete Bid
                                                </Button>}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {isTaskOwner && task?.status !== "completed" && task?.status !== "canceled" && (
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <h2 className="text-xl font-medium mb-2">Task Actions</h2>
                                            <p className="text-gray-600 mb-4">
                                                Manage your posted task here.
                                            </p>
                                            <div className="space-y-3">
                                                {
                                                    task?.employerConfirmed !== true && task?.status === "in-progress" && (
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
                                                                >
                                                                    Complete Task
                                                                </Button>
                                                            </DialogTrigger>
                                                            <TaskRatingForm onSubmit={handleCompleteTask} />
                                                        </Dialog>
                                                    )}
                                                {task?.employerConfirmed !== true && <Button
                                                    variant="outline"
                                                    onClick={handleCancelTask}
                                                    className="w-full border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
                                                >
                                                    Cancel Task
                                                </Button>}
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                                    onClick={DeleteTask}
                                                >
                                                    Delete Task
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
                                                            onClick={() => router.push('/auth/login')}
                                                            className="w-full bg-pro hover:bg-pro-light"
                                                        >
                                                            Sign In
                                                        </Button>
                                                        <Button
                                                            onClick={() => router.push('/auth/signup')}
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TaskDetail;

export async function getServerSideProps(context) {
    try {
        const response = await axios.get(`/api/tasks/${context.params.id}`);

        if (!response.data?.data) {
            return { notFound: true };
        }

        return {
            props: {
                task: response.data.data
            }
        };
    } catch (error) {
        console.error('Error fetching task:', error);

        if (error.response?.status === 404) {
            return { notFound: true };
        }

        return {
            props: {
                task: null,
                error: 'Failed to load task'
            }
        };
    }
}