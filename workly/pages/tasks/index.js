import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/layout/Navbar';
import TaskCard from '@/components/tasks/TaskCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin } from 'lucide-react';

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
        location: 'Oakland, CA',
        budget: 85,
        description: 'Need someone to install a ceiling fan in the master bedroom. I have already purchased the fan.',
        status: 'open',
        bidCount: 5,
        postedDate: '4 days ago',
    },
    {
        id: '3',
        title: 'Move furniture to new apartment',
        category: 'Moving',
        location: 'San Jose, CA',
        budget: 200,
        description: 'Need help moving furniture from current apartment to new one about 3 miles away. Have a few heavy items.',
        status: 'open',
        bidCount: 4,
        postedDate: '1 week ago',
    },
    {
        id: '4',
        title: 'Paint living room walls',
        category: 'Painting',
        location: 'San Francisco, CA',
        budget: 300,
        description: 'Need to paint my living room walls (approximately 400 sq ft). I will provide the paint.',
        status: 'open',
        bidCount: 2,
        postedDate: '3 days ago',
    },
    {
        id: '5',
        title: 'Fix broken kitchen cabinet',
        category: 'Carpentry',
        location: 'Palo Alto, CA',
        budget: 150,
        description: 'One of my kitchen cabinet doors is broken at the hinge. Need someone to repair or replace it.',
        status: 'open',
        bidCount: 1,
        postedDate: '5 days ago',
    },
    {
        id: '6',
        title: 'Deep clean 2-bedroom apartment',
        category: 'Cleaning',
        location: 'San Mateo, CA',
        budget: 180,
        description: 'Looking for thorough cleaning of my 2-bedroom apartment before I move out. Need all rooms, kitchen, and bathrooms cleaned.',
        status: 'open',
        bidCount: 6,
        postedDate: '2 days ago',
    },
];

const categoryOptions = [
    "All Categories",
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "Cleaning",
    "Moving",
    "Gardening",
    "Driving",
    "Home Repairs",
    "Computer Help",
    "Pet Care",
    "Other"
];

const sortOptions = [
    "Most Recent",
    "Budget: High to Low",
    "Budget: Low to High",
    "Most Bids",
    "Fewest Bids"
];

export default function TaskListing() {
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [location, setLocation] = useState('');

    const [filteredTasks, setFilteredTasks] = useState(mockTasks);

    // Apply filters
    useEffect(() => {
        let results = [...mockTasks];

        // Filter by search term
        if (searchTerm) {
            results = results.filter(task =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory && selectedCategory !== 'All Categories') {
            results = results.filter(task => task.category === selectedCategory);
        }

        // Filter by location
        if (location) {
            results = results.filter(task =>
                task.location.toLowerCase().includes(location.toLowerCase())
            );
        }

        setFilteredTasks(results);
    }, [searchTerm, selectedCategory, location]);

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All Categories');
        setLocation('');

        // Clear URL params
        router.push('/task-listing');
    };

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-8">
                <div className="container-custom">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Find Tasks</h1>
                        <p className="text-gray-600">
                            Browse through available tasks and submit bids for work you're interested in.
                        </p>
                    </div>

                    <div className="mb-8 bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                        <div className="grid gap-4 md:flex md:items-center">
                            <div className="flex relative items-center flex-1">
                                <Search className="absolute left-3 text-gray-400" size={18} />
                                <Input
                                    placeholder="Search tasks..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 form-input"
                                />
                            </div>

                            <div className="md:w-60">
                                <Select
                                    value={selectedCategory}
                                    onValueChange={handleCategoryChange}
                                >
                                    <SelectTrigger className="form-input">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoryOptions.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex relative items-center md:w-60">
                                <MapPin className="absolute left-3 text-gray-400" size={18} />
                                <Input
                                    placeholder="Location..."
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="pl-10 form-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 flex justify-between items-center">
                        <p className="text-gray-600">{filteredTasks.length} tasks found</p>
                    </div>

                    {filteredTasks.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTasks.map(task => (
                                <TaskCard key={task.id} {...task} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                            <p className="text-gray-500 mb-4">Try adjusting your search filters</p>
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="border-pro text-pro hover:bg-pro hover:text-white"
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}