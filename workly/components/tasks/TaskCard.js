import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Link from "next/link";


const TaskCard = ({
    id,
    title,
    category,
    location,
    budget,
    description,
    status,
    bidCount = 0,
    postedDate,
    showActions = true,
    isMine = false
}) => {


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
        <Card className="card-hover overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl">{title}</CardTitle>
                        <CardDescription className="flex items-center mt-1 text-sm">
                            <MapPin size={14} className="mr-1" /> {location}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="bg-pro/10 text-pro border-pro/20">
                            {category}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(status)}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{description}</p>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-pro font-semibold">${budget.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Posted {postedDate}</p>
                    </div>
                    {!isMine && bidCount > 0 && (
                        <div className="text-sm text-gray-500">
                            <span className="font-medium">{bidCount}</span> bids
                        </div>
                    )}
                </div>
            </CardContent>
            {showActions && (
                <CardFooter className="pt-2 pb-4 px-6">
                    <Link href={`/tasks/${id}`} className="w-full">
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