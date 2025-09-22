import React, { useState } from "react";

// Sample nested comments data
const initialComments = [
    {
        id: 1,
        text: "This is the first comment",
        children: [
            {
                id: 2,
                text: "First reply to first comment",
                children: [
                    {
                        id: 3,
                        text: "Nested reply",
                        children: [],
                    },
                ],
            },
            {
                id: 4,
                text: "Second reply to first comment",
                children: [],
            },
        ],
    },
    {
        id: 5,
        text: "This is the second top-level comment",
        children: [],
    },
];

// Helper to generate unique IDs
let nextId = 6;

// Recursive component to render comments
function Comment({ comment, onAdd, onDelete }) {
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");

    const handleAdd = () => {
        if (replyText.trim()) {
            onAdd(comment.id, replyText.trim());
            setReplyText("");
            setShowReply(false);
        }
    };

    return (
        <div style={{ marginLeft: 20, marginTop: 10 }}>
            <div>
                <span>{comment.text}</span>
                <button style={{ marginLeft: 10 }} onClick={() => setShowReply((v) => !v)}>
                    Reply
                </button>
                <button style={{ marginLeft: 5 }} onClick={() => onDelete(comment.id)}>
                    Delete
                </button>
            </div>
            {showReply && (
                <div style={{ marginTop: 5 }}>
                    <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply"
                    />
                    <button onClick={handleAdd}>Add</button>
                </div>
            )}
            {comment.children &&
                comment.children.map((child) => (
                    <Comment key={child.id} comment={child} onAdd={onAdd} onDelete={onDelete} />
                ))}
        </div>
    );
}

// Helper to add a comment by parentId
function addCommentById(comments, parentId, text) {
    return comments.map((comment) => {
        if (comment.id === parentId) {
            return {
                ...comment,
                children: [
                    ...comment.children,
                    { id: nextId++, text, children: [] },
                ],
            };
        }
        return {
            ...comment,
            children: addCommentById(comment.children, parentId, text),
        };
    });
}

// Helper to delete a comment by id
function deleteCommentById(comments, id) {
    return comments
        .filter((comment) => comment.id !== id)
        .map((comment) => ({
            ...comment,
            children: deleteCommentById(comment.children, id),
        }));
}

export default function NestedComments() {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState("");

    const handleAdd = (parentId, text) => {
        setComments((prev) => addCommentById(prev, parentId, text));
    };

    const handleDelete = (id) => {
        setComments((prev) => deleteCommentById(prev, id));
    };

    const handleAddRoot = () => {
        if (newComment.trim()) {
            setComments((prev) => [
                ...prev,
                { id: nextId++, text: newComment.trim(), children: [] },
            ]);
            setNewComment("");
        }
    };

    return (
        <div>
            <h2>Nested Comments</h2>
            <div style={{ marginBottom: 10 }}>
                <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                />
                <button onClick={handleAddRoot}>Add</button>
            </div>
            <div>
                {comments.map((comment) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        onAdd={handleAdd}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
}