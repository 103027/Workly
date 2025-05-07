import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Link from "next/link";

const BidCard = ({
  id,
  userId,
  userName,
  userAvatar,
  amount,
  message,
  deliveryTime,
  rating = 0,
  taskId,
  status = 'pending',
  viewerIsTaskOwner = false,
  onAcceptBid
}) => {
  const initials = userName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
    
  const getStatusBadge = () => {
    switch (status) {
      case 'accepted':
        return <Badge variant="success">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <Link href={`/profile/${userId}`}>
            <Avatar className="h-9 w-9">
              <AvatarImage src={userAvatar} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href={`/profile/${userId}`}>
              <p className="text-sm font-medium leading-none">{userName}</p>
            </Link>
            {rating > 0 && (
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-xs text-gray-500">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
        {getStatusBadge()}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="text-2xl font-bold">${amount.toFixed(2)}</span>
            {deliveryTime && (
              <p className="text-xs text-muted-foreground">
                Delivery: {deliveryTime}
              </p>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{message}</p>
        {viewerIsTaskOwner && status === 'pending' && (
          <Button onClick={onAcceptBid} className="w-full">
            Accept Bid
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BidCard;