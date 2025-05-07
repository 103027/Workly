import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TaskCard from '@/components/tasks/TaskCard';
import BidCard from '@/components/tasks/BidCard';
import Navbar from '@/components/layout/Navbar';
import { Plus, ListChecks, Clock, CheckCheck } from 'lucide-react';

// Mock data for demonstration
const mockTasks = [
    {
        id: '1',
        title: 'Fix leaking bathroom sink',
        category: 'Plumbing',
        location: 'San Francisco, CA',
        budget: 120,
        description: 'The sink in my master bathroom is leaking from the pipes below. Need a professional to fix it as soon as possible.',
        status: 'open',
        bidCount: 3,
        postedDate: '2 days ago',
    },
    {
        id: '2',
        title: 'Install ceiling fan in bedroom',
        category: 'Electrical',
        location: 'San Francisco, CA',
        budget: 85,
        description: 'Need someone to install a ceiling fan in the master bedroom. I have already purchased the fan.',
        status: 'in-progress',
        bidCount: 5,
        postedDate: '4 days ago',
    },
    {
        id: '3',
        title: 'Move furniture to new apartment',
        category: 'Moving',
        location: 'San Francisco, CA',
        budget: 200,
        description: 'Need help moving furniture from current apartment to new one about 3 miles away. Have a few heavy items.',
        status: 'completed',
        bidCount: 4,
        postedDate: '1 week ago',
    }
];

const mockBids = [
    {
        id: '1',
        userId: 'user1',
        userName: 'John Smith',
        userAvatar: '',
        amount: 110,
        message: 'I can fix this for you today. I have 10+ years of experience with plumbing issues like this one.',
        deliveryTime: '1-2 hours',
        rating: 4.8,
        taskId: '1',
        status: 'pending'
    },
    {
        id: '2',
        userId: 'user2',
        userName: 'Maria Rodriguez',
        userAvatar: '',
        amount: 95,
        message: 'I have all the tools needed and can be there this afternoon. Similar repairs usually take me about 1-2 hours.',
        deliveryTime: 'Same day',
        rating: 4.5,
        taskId: '1',
        status: 'accepted'
    }
];

const Dashboard = () => {
    //   const { user, isAuthenticated } = useAuth();

    const user = {
        name: 'John Doe',
        // role: 'employer'
        role: 'employee'
    };
    const isAuthenticated = true;

    const router = useRouter();
    const [activeTab, setActiveTab] = useState('open');
    const [filteredTasks, setFilteredTasks] = useState(mockTasks);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            router.push('/auth?mode=login');
            return;
        }

        // Redirect to role selection if no role
        if (!user?.role) {
            router.push('/role-selection');
        }
    }, [isAuthenticated, user, router]);

    useEffect(() => {
        // Filter tasks based on active tab
        if (activeTab === 'all') {
            setFilteredTasks(mockTasks);
        } else {
            setFilteredTasks(mockTasks.filter(task => task.status === activeTab));
        }
    }, [activeTab]);

    if (!isAuthenticated || !user?.role) {
        return null; // Don't render until auth check is complete
    }

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-8">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                            <p className="text-gray-600">
                                Welcome back, {user.name}!
                                <span className="ml-1 text-sm bg-pro-lighter text-white px-2 py-0.5 rounded-full">
                                    {user.role === 'employer' ? 'Employer' : 'Service Provider'}
                                </span>
                            </p>
                        </div>

                        {user.role === 'employer' && (
                            <Button onClick={() => router.push('/post-task')} className="mt-4 md:mt-0 bg-pro hover:bg-pro-light">
                                <Plus size={18} className="mr-2" />
                                Post a New Task
                            </Button>
                        )}

                        {user.role === 'employee' && (
                            <Button onClick={() => router.push('/task-listing')} className="mt-4 md:mt-0 bg-pro hover:bg-pro-light">
                                <Plus size={18} className="mr-2" />
                                Find New Tasks
                            </Button>
                        )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="flex items-center">
                                    <ListChecks className="mr-3 h-5 w-5 text-pro" />
                                    <CardTitle className="text-lg">Open Tasks</CardTitle>
                                </div>
                                <div className="text-2xl font-bold text-pro">3</div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm text-gray-500">
                                    {user.role === 'employer' ? 'Tasks awaiting bids' : 'Available tasks to bid on'}
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="flex items-center">
                                    <Clock className="mr-3 h-5 w-5 text-pro-lighter" />
                                    <CardTitle className="text-lg">In Progress</CardTitle>
                                </div>
                                <div className="text-2xl font-bold text-pro-lighter">1</div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm text-gray-500">
                                    {user.role === 'employer' ? 'Tasks currently being worked on' : 'Tasks you are currently working on'}
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="flex items-center">
                                    <CheckCheck className="mr-3 h-5 w-5 text-green-500" />
                                    <CardTitle className="text-lg">Completed</CardTitle>
                                </div>
                                <div className="text-2xl font-bold text-green-500">2</div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm text-gray-500">
                                    {user.role === 'employer' ? 'Tasks successfully completed' : 'Tasks you have completed'}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Content based on user role */}
                    {user.role === 'employer' ? (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-xl font-medium mb-4">Your Tasks</h2>
                                <Tabs defaultValue="open" onValueChange={(value) => setActiveTab(value)}>
                                    <TabsList className="mb-6">
                                        <TabsTrigger value="all">All Tasks</TabsTrigger>
                                        <TabsTrigger value="open">Open</TabsTrigger>
                                        <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                                        <TabsTrigger value="completed">Completed</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="all" className="space-y-0">
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredTasks.map(task => (
                                                <TaskCard key={task.id} {...task} isMine={true} />
                                            ))}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="open" className="space-y-0">
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredTasks.map(task => (
                                                <TaskCard key={task.id} {...task} isMine={true} />
                                            ))}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="in-progress" className="space-y-0">
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredTasks.map(task => (
                                                <TaskCard key={task.id} {...task} isMine={true} />
                                            ))}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="completed" className="space-y-0">
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredTasks.map(task => (
                                                <TaskCard key={task.id} {...task} isMine={true} />
                                            ))}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            <div>
                                <h2 className="text-xl font-medium mb-4">Recent Bids</h2>
                                {mockBids.length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {mockBids.map(bid => (
                                            <BidCard key={bid.id} {...bid} viewerIsTaskOwner={true} />
                                        ))}
                                    </div>
                                ) : (
                                    <Card>
                                        <CardContent className="pt-6 text-center">
                                            <p className="text-gray-500">No bids yet for your tasks.</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-xl font-medium mb-4">Tasks You Might Like</h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {mockTasks.filter(task => task.status === 'open').map(task => (
                                        <TaskCard key={task.id} {...task} />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-medium mb-4">Your Active Bids</h2>
                                {mockBids.length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {mockBids.map(bid => (
                                            <BidCard key={bid.id} {...bid} viewerIsTaskOwner={false} />
                                        ))}
                                    </div>
                                ) : (
                                    <Card>
                                        <CardContent className="pt-6 text-center">
                                            <p className="text-gray-500">You haven't placed any bids yet.</p>
                                            <Button
                                                onClick={() => router.push('/task-listing')}
                                                className="mt-4 bg-pro hover:bg-pro-light"
                                            >
                                                Browse Available Tasks
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;