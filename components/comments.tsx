'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    // Load comments from session storage on mount
    const savedComments = sessionStorage.getItem('article_comments')
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments))
      } catch (e) {
        console.error("Failed to parse comments", e)
      }
    }
  }, [])

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Anonymous User',
        content: newComment,
        date: new Date().toISOString(),
      }
      const updatedComments = [...comments, comment]
      setComments(updatedComments)
      setNewComment('')

      // Save to session storage
      sessionStorage.setItem('article_comments', JSON.stringify(updatedComments))
    }
  }

  return (
    <div className="w-full h-full px-3">
      <h2 className="text-2xl font-bold mb-6 font-serif">Discussion</h2>

      <div className="mb-8">
        <Textarea
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] mb-4 bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-white/10"
        />
        <Button onClick={handleSubmitComment} className="w-full sm:w-auto font-bold uppercase tracking-wider text-xs">Post Comment</Button>
      </div>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 italic bg-slate-50 dark:bg-zinc-900 rounded-lg">No comments yet. Be the first to start the conversation!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4 p-4 rounded-lg bg-slate-50 dark:bg-zinc-900/50">
              <Avatar className="h-10 w-10 border border-slate-200 dark:border-white/10">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">{comment.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">{new Date(comment.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

