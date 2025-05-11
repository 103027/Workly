import { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const TaskRatingForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    onSubmit( rating, review );
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Complete Task</DialogTitle>
        <DialogDescription>
          Please rate your experience.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-6">
        {/* Rating Stars */}
        <div className="space-y-2">
          <Label htmlFor="rating" className="text-sm font-medium flex items-center gap-2">
            <Star size={16} className="text-gray-500" /> Rating
          </Label>
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={32}
                className={`cursor-pointer transition-all ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-1">
            {rating > 0 ? (
              <span>You selected {rating} star{rating !== 1 ? 's' : ''}</span>
            ) : (
              <span>Click to rate</span>
            )}
          </p>
        </div>

        {/* Review Text Area */}
        <div className="space-y-2">
          <Label htmlFor="review" className="text-sm font-medium flex items-center gap-2">
            <MessageSquare size={16} className="text-gray-500" /> Review
          </Label>
          <Textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience..."
            className="min-h-[120px] resize-none border-gray-300 focus:border-pro focus:ring focus:ring-pro focus:ring-opacity-50"
          />
        </div>
      </div>

      <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          className={`w-full sm:w-auto ${
            rating === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white hover:text-white border-green-600"
          } transition-colors`}
          onClick={handleSubmit}
          disabled={rating === 0}
        >
          Submit Review
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default TaskRatingForm;