import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/store/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TaskCard from '@/components/tasks/TaskCard';
import BidCard from '@/components/tasks/BidCard';
import { Plus, ListChecks, Clock, CheckCheck, X } from 'lucide-react';
import axios from 'axios';

const Dashboard = (props) => {
    const { name, role, isAuthenticated } = useAuth();

    const user = {
        name,
        role,
    };

    const router = useRouter();
    const [activeTab, setActiveTab] = useState('open');
    const [filteredTasks, setFilteredTasks] = useState(props.tasks);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        if (!user?.role) {
            router.push('/role');
            return;
        }

        const { role: routeRole, userId } = router.query;
        if (!routeRole && !userId) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, user?.role, router.query, isLoading]);

    useEffect(() => {
        if (!isAuthenticated) return;
        setIsLoading(false);
    }, [isAuthenticated]);


    useEffect(() => {
        // Filter tasks based on active tab
        if (activeTab === 'all') {
            setFilteredTasks(props.tasks);
        } else {
            setFilteredTasks(props.tasks.filter(task => task.status === activeTab));
        }
    }, [activeTab]);

    // if (!isAuthenticated || !user?.role) {
    //     return null; // Don't render until auth check is complete
    // }

    return (
        <>
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
                            <Button onClick={() => router.push('/tasks')} className="mt-4 md:mt-0 bg-pro hover:bg-pro-light">
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
                                <div className="text-2xl font-bold text-pro">{props.counts.open}</div>
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
                                <div className="text-2xl font-bold text-pro-lighter">{props.counts.inProgress}</div>
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
                                <div className="text-2xl font-bold text-green-500">{props.counts.completed}</div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm text-gray-500">
                                    {user.role === 'employer' ? 'Tasks successfully completed' : 'Tasks you have completed'}
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="flex items-center">
                                    <X className="mr-3 h-5 w-5 text-amber-500" />
                                    <CardTitle className="text-lg">Canceled</CardTitle>
                                </div>
                                <div className="text-2xl font-bold text-amber-500">{props.counts.canceled}</div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm text-gray-500">
                                    {user.role === 'employer' ? 'Tasks You canceled' : 'Bids you have Canceled'}
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
                                        <TabsTrigger value="canceled">Canceled</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="all" className="space-y-0">
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredTasks.map(task => (
                                                <TaskCard key={task._id} {...task} isMine={true} />
                                            ))}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="open" className="space-y-0">
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredTasks.map(task => (
                                                <TaskCard key={task._id} {...task} isMine={true} />
                                            ))}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="in-progress" className="space-y-0">
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredTasks.map(task => (
                                                <TaskCard key={task._id} {...task} isMine={true} />
                                            ))}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="completed" className="space-y-0">
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredTasks.map(task => (
                                                <TaskCard key={task._id} {...task} isMine={true} />
                                            ))}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="canceled" className="space-y-0">
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredTasks.map(task => (
                                                <TaskCard key={task._id} {...task} isMine={true} />
                                            ))}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-xl font-medium mb-4">Tasks You are Linked With</h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {props.tasks.map(task => (
                                        <TaskCard key={task._id} {...task} />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-medium mb-4">Your Bids</h2>
                                {props.bids.length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {props.bids.map(bid => (
                                            <BidCard key={bid._id} {...bid} viewerIsTaskOwner={false} />
                                        ))}
                                    </div>
                                ) : (
                                    <Card>
                                        <CardContent className="pt-6 text-center">
                                            <p className="text-gray-500">You haven't placed any bids yet.</p>
                                            <Button
                                                onClick={() => router.push('/tasks')}
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

export async function getServerSideProps(context) {
    try {
        const response = await axios.post(`http://localhost:3000/api/${context.params.userId}`, {
            userType: context.params.role,
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        const tasks = response.data.tasks;
        const bids = response.data.bids;
        const counts = response.data.counts;
        return {
            props: {
                tasks,
                counts,
                bids
            },
        };
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return {
            props: {
                tasks: [],
                counts: [],
                bids: []
            },
        };
    }
}