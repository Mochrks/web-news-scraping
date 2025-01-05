'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Comment {
  id: string
  author: string
  content: string
  date: string
}



export function Comments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')


  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Anonymous User', // Replace with actual user name when authentication is implemented
        content: newComment,
        date: new Date().toISOString(),
      }
      setComments([...comments, comment])
      setNewComment('')
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <div className="space-y-4 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            <Avatar>
              <AvatarFallback>{comment.author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{comment.author}</span>
                <span className="text-sm text-muted-foreground">{new Date(comment.date).toLocaleDateString()}</span>
              </div>
              <p className="mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleSubmitComment}>Post Comment</Button>
      </div>
    </div>
  )
}

