import React, { useState, useEffect } from 'react';
import './CommunityForum.css';

const CommunityForum = () => {
  const [openNewPost, setOpenNewPost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    media: null,
    mediaType: null
  });
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Tips for Self-Defense',
      author: 'Sarah',
      content: 'I recently took a self-defense class and wanted to share some valuable tips I learned about situational awareness and basic techniques. Always trust your instincts and remember the 3 Fs: Find, Focus, and Fight if necessary.',
      category: 'Safety',
      likes: 24,
      comments: [
        {
          id: 1,
          author: 'Priya',
          content: 'These tips are really helpful! I especially appreciate the reminder about trusting our instincts.',
          timestamp: '1 hour ago'
        },
        {
          id: 2,
          author: 'Maria',
          content: 'Could you recommend any good self-defense classes in the area?',
          timestamp: '45 minutes ago'
        }
      ],
      timestamp: '2 hours ago',
      media: null,
      mediaType: null,
      isLiked: false
    },
    {
      id: 2,
      title: 'Career Advice Needed',
      author: 'Priya',
      content: "I'm looking to transition into the tech industry from finance. Has anyone made a similar switch? I'd love to hear about your experiences and any resources you found valuable.",
      category: 'Career',
      likes: 15,
      comments: [
        {
          id: 1,
          author: 'Lisa',
          content: 'I made this transition last year! Happy to share my journey and some resources that helped me.',
          timestamp: '3 hours ago'
        }
      ],
      timestamp: '5 hours ago',
      media: null,
      mediaType: null,
      isLiked: false
    },
    {
      id: 3,
      title: 'Mental Health Check-in',
      author: 'Aisha',
      content: "How is everyone doing this week? Remember it's okay to not be okay sometimes. What are your go-to self-care practices when you're feeling overwhelmed?",
      category: 'Health',
      likes: 32,
      comments: [],
      timestamp: '1 day ago',
      media: null,
      mediaType: null,
      isLiked: false
    },
  ]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [deletePostId, setDeletePostId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Safety', 'Career', 'Health', 'Education', 'Lifestyle'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleNewPost = () => {
    setOpenNewPost(true);
  };

  const handleClose = () => {
    setOpenNewPost(false);
    setNewPost({ title: '', content: '', media: null, mediaType: null });
  };

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        return;
      }
      
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({
          ...newPost,
          media: reader.result,
          mediaType: file.type.startsWith('image/') ? 'image' : 
                    file.type.startsWith('video/') ? 'video' : 
                    file.type.startsWith('audio/') ? 'audio' : null
        });
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = () => {
    if (newPost.title && newPost.content) {
      setIsLoading(true);
      setTimeout(() => {
        const post = {
          id: posts.length + 1,
          title: newPost.title,
          content: newPost.content,
          author: 'You',
          category: 'Safety',
          likes: 0,
          comments: [],
          timestamp: 'Just now',
          media: newPost.media,
          mediaType: newPost.mediaType,
          isLiked: false
        };
        setPosts([post, ...posts]);
        handleClose();
        setIsLoading(false);
      }, 800);
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleShare = async (post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const handleComment = (postId) => {
    setSelectedPost(selectedPost === postId ? null : postId);
  };

  const handleSubmitComment = (postId) => {
    if (newComment.trim()) {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: post.comments.length + 1,
                author: 'You',
                content: newComment,
                timestamp: 'Just now'
              }
            ]
          };
        }
        return post;
      }));
      setNewComment('');
    }
  };

  const handleDeletePost = (postId) => {
    setDeletePostId(postId);
  };

  const confirmDelete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPosts(posts.filter(post => post.id !== deletePostId));
      setDeletePostId(null);
      setIsLoading(false);
    }, 500);
  };

  const cancelDelete = () => {
    setDeletePostId(null);
  };

  const renderMedia = (media, mediaType) => {
    if (!media) return null;

    switch (mediaType) {
      case 'image':
        return (
          <div className="mt-4 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
            <img src={media} alt="Post media" className="w-full h-auto max-h-96 object-cover rounded-lg transform hover:scale-[1.01] transition-transform duration-300" />
          </div>
        );
      case 'video':
        return (
          <div className="mt-4 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
            <video controls className="w-full h-auto max-h-96 object-cover rounded-lg transform hover:scale-[1.01] transition-transform duration-300">
              <source src={media} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'audio':
        return (
          <div className="mt-4 rounded-lg overflow-hidden bg-gray-100 p-4 transition-all duration-300 hover:shadow-lg">
            <audio controls className="w-full">
              <source src={media} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          </div>
        );
      default:
        return null;
    }
  };

  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  return (
    <div className="community-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      <div className="community-content">
        <div className="community-header">
          <div>
            <h1 className="community-title">Community Support Forum</h1>
            <p className="community-subtitle">Connect, share, and grow together</p>
          </div>
          <button 
            onClick={handleNewPost} 
            className="new-post-button hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Post
          </button>
        </div>

        <div className="categories-container">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`category-button ${category === activeCategory ? 'active' : ''} hover:bg-gray-100 transition-colors duration-300`}
            >
              {category}
              {category === activeCategory && (
                <span className="active-indicator"></span>
              )}
            </button>
          ))}
        </div>

        <div className="posts-container">
          {filteredPosts.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>No posts found</h3>
              <p>Be the first to start a discussion in this category!</p>
              <button 
                onClick={handleNewPost}
                className="empty-state-button hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
              >
                Create a Post
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div 
                key={post.id} 
                className="post-card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="post-header">
                  <div className="author-info">
                    <div className="author-avatar hover:bg-opacity-80 transition-colors duration-300">
                      {post.author[0]}
                      {post.author === 'You' && (
                        <span className="you-badge">You</span>
                      )}
                    </div>
                    <div>
                      <div className="author-name">{post.author}</div>
                      <div className="post-timestamp">{post.timestamp}</div>
                    </div>
                  </div>
                  {post.author === 'You' && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-300 p-2 hover:bg-red-50 rounded-full"
                      title="Delete post"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="post-category-badge">{post.category}</div>
                <h2 className="post-title hover:text-blue-600 transition-colors duration-300">{post.title}</h2>
                <p className="post-content">{post.content}</p>
                <div className="post-media">
                  {renderMedia(post.media, post.mediaType)}
                </div>
                <div className="post-actions">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`action-button ${post.isLiked ? 'liked' : ''} hover:bg-gray-100 transition-colors duration-300`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${post.isLiked ? 'fill-current text-red-500' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    <span className={`font-medium ${post.isLiked ? 'text-red-500' : ''}`}>{post.likes}</span>
                  </button>
                  <button 
                    onClick={() => handleComment(post.id)}
                    className={`action-button hover:bg-gray-100 transition-colors duration-300 ${selectedPost === post.id ? 'text-blue-500' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{post.comments.length}</span>
                  </button>
                  <button 
                    onClick={() => handleShare(post)}
                    className="action-button hover:bg-gray-100 transition-colors duration-300 hover:text-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                  </button>
                </div>

                {selectedPost === post.id && (
                  <div className="comments-section animate-fadeIn">
                    <div className="space-y-4 mb-4">
                      {post.comments.length === 0 ? (
                        <div className="empty-comments">
                          <svg className="empty-comments-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <p>No comments yet. Be the first to share your thoughts!</p>
                        </div>
                      ) : (
                        post.comments.map((comment) => (
                          <div key={comment.id} className="comment hover:bg-gray-50 transition-colors duration-300">
                            <div className="comment-avatar hover:bg-opacity-80 transition-colors duration-300">
                              {comment.author[0]}
                              {comment.author === 'You' && (
                                <span className="you-badge">You</span>
                              )}
                            </div>
                            <div className="comment-content">
                              <div className="comment-author">{comment.author}</div>
                              <p className="comment-text">{comment.content}</p>
                              <div className="comment-timestamp">{comment.timestamp}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="comment-input-container">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment(post.id)}
                        placeholder="Write a comment..."
                        className="comment-input hover:border-gray-300 focus:border-blue-500 transition-colors duration-300"
                      />
                      <button
                        onClick={() => handleSubmitComment(post.id)}
                        disabled={!newComment.trim()}
                        className={`comment-submit-button ${newComment.trim() ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'} transition-colors duration-300`}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {deletePostId && (
          <div className="delete-modal animate-fadeIn">
            <div className="delete-modal-content transform transition-all duration-300 scale-95 animate-scaleIn">
              <div className="text-center">
                <div className="delete-icon-container">
                  <svg className="delete-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="delete-title">Delete Post</h3>
                <p className="delete-message">
                  Are you sure you want to delete this post? This action cannot be undone.
                </p>
              </div>
              <div className="delete-actions">
                <button 
                  onClick={cancelDelete} 
                  className="delete-cancel-button hover:bg-gray-100 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="delete-confirm-button hover:bg-red-600 transition-colors duration-300"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {openNewPost && (
          <div className="modal-overlay animate-fadeIn">
            <div className="modal-content transform transition-all duration-300 scale-95 animate-scaleIn">
              <div className="modal-header">
                <h2 className="modal-title">Create New Post</h2>
                <button 
                  onClick={handleClose} 
                  className="modal-close-button hover:bg-gray-100 transition-colors duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="modal-form">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="form-input hover:border-gray-300 focus:border-blue-500 transition-colors duration-300"
                    placeholder="Enter a descriptive title for your post"
                  />
                </div>
                <div className="form-group">
                  <label>Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="form-textarea hover:border-gray-300 focus:border-blue-500 transition-colors duration-300"
                    placeholder="Share your thoughts, experiences, or ask questions..."
                    rows="4"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Upload Media</label>
                  <div className="upload-area hover:border-blue-300 hover:bg-blue-50 transition-colors duration-300">
                    <div className="upload-content">
                      <svg className="upload-icon" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="upload-text">
                        <label htmlFor="file-upload" className="upload-link hover:text-blue-600 transition-colors duration-300">
                          <span>Click to upload</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*,video/*,audio/*"
                            onChange={handleMediaUpload}
                            className="sr-only"
                          />
                        </label>
                        <p>or drag and drop your files here</p>
                      </div>
                      <p className="upload-hint">Supported formats: PNG, JPG, MP4, MP3 (Max size: 10MB)</p>
                    </div>
                  </div>
                  {isLoading && newPost.media === null && (
                    <div className="upload-loading">
                      <div className="loading-spinner-small"></div>
                    </div>
                  )}
                  {newPost.media && (
                    <div className="post-media">
                      {renderMedia(newPost.media, newPost.mediaType)}
                      <button
                        onClick={() => setNewPost({ ...newPost, media: null, mediaType: null })}
                        className="remove-media-button hover:bg-gray-100 transition-colors duration-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  onClick={handleClose} 
                  className="modal-cancel-button hover:bg-gray-100 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitPost} 
                  className={`modal-submit-button ${(!newPost.title || !newPost.content) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'} transition-colors duration-300`}
                  disabled={!newPost.title || !newPost.content}
                >
                  {isLoading ? 'Posting...' : 'Create Post'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityForum;