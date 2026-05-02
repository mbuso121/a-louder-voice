// Simple shared "database" for now (NO BACKEND REQUIRED)

const KEY = "platform_posts";

// Get all posts
export const getPosts = () => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

// Save post
export const addPost = (post) => {
  const posts = getPosts();

  const newPost = {
    id: Date.now(),
    likes: 0,
    comments_count: 0,
    created_at: new Date().toISOString(),
    ...post,
  };

  posts.unshift(newPost);

  localStorage.setItem(KEY, JSON.stringify(posts));
  return newPost;
};

// Clear all (for testing)
export const clearPosts = () => {
  localStorage.removeItem(KEY);
};
