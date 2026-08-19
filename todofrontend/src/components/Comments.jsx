import { useEffect, useState } from "react";
import styles from "./comments.module.css";


function Comments({ taskId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/comments/${taskId}`, {
          credentials: "include"
        });
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      }
    };

    if (taskId) fetchComments();
  }, [taskId]);

  const handleAddComment = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          task_id: taskId,
          content,
          author: "watson"
        })
      });

      const newComment = await res.json();
      setComments(prev => [...prev, newComment]);
      setContent("");
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/comments/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      setComments(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  return (
    <div className={styles.commentsContainer}>
      <h3 className={styles.header}>Comments</h3>

      <div className={styles.commentsList}>
        {comments.length === 0 && (
          <p className={styles.empty}>No comments yet.</p>
        )}

        {comments?.map(comment => (
          <div key={comment.id} className={styles.commentItem}>
            <div className={styles.meta}>
              <span className={styles.author}>{comment.author}</span>
              <span className={styles.date}>
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>

            <p className={styles.content}>{comment.content}</p>

            <button
              className={styles.deleteBtn}
              onClick={() => handleDeleteComment(comment.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className={styles.inputSection}>
        <textarea
          className={styles.textarea}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write a comment..."
        />

        <button
          className={styles.addBtn}
          onClick={handleAddComment}
          disabled={loading}
        >
          {loading ? "Posting..." : "Add Comment"}
        </button>
      </div>
    </div>
  );
}

export default Comments;
