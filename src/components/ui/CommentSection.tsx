
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface CommentSectionProps {
  comments?: Array<{ name: string; text: string; date: string }>;
}

const CommentSection = ({ comments = [] }: CommentSectionProps) => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Comment submitted",
      description: "Your comment has been submitted successfully.",
    });
    
    // Reset form
    setName('');
    setComment('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-3">Comments & Discussion</h2>
        
        {comments.length === 0 ? (
          <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="border border-border rounded-md p-4 bg-card">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{comment.name}</h3>
                  <span className="text-xs text-muted-foreground">{comment.date}</span>
                </div>
                <p className="mt-2 text-sm">{comment.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Leave a New Comment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Your Name:
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="bg-background"
            />
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-1">
              Your Comment:
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Your comment"
              className="h-32 bg-background"
            />
          </div>

          <Button type="submit" className="bg-primary hover:bg-primary/90">
            Submit Comment
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;
