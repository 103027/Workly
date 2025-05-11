import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TaskCard from '@/components/tasks/TaskCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin } from 'lucide-react';
import axios from 'axios';

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

export default function TaskListing({ initialTasks }) {
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [location, setLocation] = useState('');

    const [filteredTasks, setFilteredTasks] = useState(initialTasks);

    // Apply filters
    useEffect(() => {
        let results = [...initialTasks];

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
        router.push('/tasks');
    };

    return (
        <>
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
                                <TaskCard key={task._id} {...task} />
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

export async function getStaticProps() {
    try {
        const response = await axios.get('http://localhost:3000/api/tasks');
        const tasks = response.data.data.tasks;
        return {
            props: {
                initialTasks: tasks,
            },
            revalidate: 60,
        };
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return {
            props: {
                initialTasks: [],
            },
            revalidate: 60,
        };
    }
}