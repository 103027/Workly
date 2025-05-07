import { useState } from 'react';
import { useRouter } from 'next/router';
// import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const categoryOptions = [
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

const PostTask = () => {
    //   const { user, isAuthenticated } = useAuth();
    const user = {
        name: 'John Doe',
        role: 'employer'
    };
    const isAuthenticated = true;

    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        location: '',
        budget: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate form
        if (!formData.title || !formData.category || !formData.location || !formData.budget || !formData.description) {
            alert("Please fill in all required fields");
            setIsSubmitting(false);
            return;
        }

        // Mock task submission
        setTimeout(() => {
            setIsSubmitting(false);
            alert("Task posted successfully!");
            router.push('/dashboard');
        }, 1000);
    };

    // Check if user is authenticated and is an employer
    if (!isAuthenticated || user?.role !== 'employer') {
        return (
            <>
                <Navbar />
                <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center">
                    <div className="text-center p-6 max-w-md mx-auto">
                        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                        <p className="text-gray-600 mb-6">
                            {!isAuthenticated
                                ? "You must be logged in to post a task."
                                : "Only employers can post tasks."}
                        </p>
                        <Button
                            onClick={() => router.push(isAuthenticated ? '/dashboard' : '/auth?mode=login')}
                            className="bg-pro hover:bg-pro-light"
                        >
                            {isAuthenticated ? 'Go to Dashboard' : 'Log In'}
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-8">
                <div className="container-custom max-w-3xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Post a New Task</h1>
                        <p className="text-gray-600">
                            Describe your task to get matched with skilled professionals
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Task Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="E.g., Fix leaking bathroom sink"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        onValueChange={(value) => handleSelectChange("category", value)}
                                        defaultValue={formData.category}
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

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        placeholder="E.g., San Francisco, CA"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="budget">Budget ($)</Label>
                                <Input
                                    id="budget"
                                    name="budget"
                                    type="number"
                                    placeholder="Enter your budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    min="5"
                                    step="5"
                                    className="form-input"
                                    required
                                />
                                <p className="text-xs text-gray-500">
                                    Set a realistic budget to attract qualified professionals
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Task Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Provide details about the task, including any specific requirements, timing preferences, or materials needed..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="form-input min-h-[120px]"
                                    required
                                />
                            </div>

                            <div className="pt-4 flex flex-col-reverse sm:flex-row gap-4 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/dashboard')}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-pro hover:bg-pro-light"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Posting...
                                        </>
                                    ) : (
                                        'Post Task'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostTask;