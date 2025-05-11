import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/store/AuthContext";

const TaskCard = (task) => {
    const { userId } = useAuth()
    let showActions = true
    let isMine = false
    if(task.userId === userId ){
        isMine = true
    }
    const date = new Date(task.createdAt);
    const shortFormat = date.toLocaleString('en-PK', {
        timeZone: 'Asia/Karachi',
        dateStyle: 'short',
        timeStyle: 'short'
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'bg-green-100 text-green-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card key={task.id} className="card-hover overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl">{task.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1 text-sm">
                            <MapPin size={14} className="mr-1" /> {task.location}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="bg-pro/10 text-pro border-pro/20">
                            {task.category}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(task.status)}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{task.description}</p>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-pro font-semibold">PKR {task.budget}</p>
                        <p className="text-xs text-gray-500">Posted at {shortFormat}</p>
                    </div>
                    {!isMine && task?.bids?.length > 0 && (
                        <div className="text-sm text-gray-500">
                            <span className="font-medium">{task?.bids?.length}</span> bids
                        </div>
                    )}
                </div>
            </CardContent>
            {showActions && (
                <CardFooter className="pt-2 pb-4 px-6">
                    <Link href={`/tasks/${task._id}`} className="w-full">
                        <Button variant="default" className="w-full bg-pro hover:bg-pro-light">
                            {isMine ? 'View Details' : 'Bid Now'}
                        </Button>
                    </Link>
                </CardFooter>
            )}
        </Card>
    );
};

export default TaskCard;