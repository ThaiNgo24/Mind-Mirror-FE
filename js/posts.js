// Global state
let posts = [];
let currentUser = null;

// Initialize when page loads
document.addEventListener("DOMContentLoaded", async () => {
  await checkAuthState();
  await loadPosts();
  setupEventListeners();
});

// Check authentication state
async function checkAuthState() {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch("https://mind-mirror-be.onrender.com/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        currentUser = data.user; // Đảm bảo cấu trúc này khớp với API response
        updateUIForLoggedInUser();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    }
  }
}

// Load posts from API
async function loadPosts() {
  try {
    showLoading(true);
    const response = await fetch("https://mind-mirror-be.onrender.com/api/posts");

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    posts = await response.json();
    renderPosts();
  } catch (error) {
    console.error("Failed to load posts:", error);
    showError("Could not load posts. Please try again later.");
  } finally {
    showLoading(false);
  }
}

// Render posts to the page
function renderPosts() {
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = "";

  if (posts.length === 0) {
    postsContainer.innerHTML =
      '<div class="no-posts">No posts yet. Be the first to share!</div>';
    return;
  }

  posts.forEach((post) => {
    const postElement = createPostElement(post);
    postsContainer.appendChild(postElement);
  });
}

// Create HTML for a single post
function createPostElement(post) {
  const postElement = document.createElement("div");
  postElement.className = "post";
  postElement.dataset.postId = post._id;

  postElement.innerHTML = `
    <div class="post-header">
      <div class="post-avatar">${post.author.name.charAt(0)}</div>
      <div>
        <div class="post-author">${post.author.name}</div>
        <div class="post-time">${formatTime(post.createdAt)}</div>
      </div>
    </div>
    <div class="post-content">${escapeHtml(post.content)}</div>

    <div class="comments-section">
      <div class="comment-form">
        <input type="text" class="comment-input" 
               placeholder="Write a comment..." 
               data-post-id="${post._id}">
        <button class="comment-submit" data-post-id="${post._id}">Post</button>
      </div>
      <div class="comment-list" id="comment-list-${post._id}">
        ${
          post.comments && post.comments.length > 0
            ? post.comments
                .map((comment) => renderComment(comment, post._id))
                .join("")
            : '<div class="no-comments">No comments yet</div>'
        }
      </div>
    </div>
  `;

  return postElement;
}

// Render a single comment
function renderComment(comment, postId) {
  if (!comment.author) {
    console.error("Comment author missing:", comment);
    return '<div class="comment">Error loading comment</div>';
  }

  let authorId, authorName;

  // Xử lý cả trường hợp author là object hoặc chỉ là ID
  if (comment.author && typeof comment.author === "object") {
    authorId = comment.author._id?.toString() || "";
    authorName = comment.author.name || "Unknown";
  } else if (comment.author) {
    authorId = comment.author.toString();
    authorName = "Loading..."; // Hoặc có thể fetch thông tin user
  } else {
    authorId = "";
    authorName = "Unknown";
  }

  // Kiểm tra quyền xóa
  const canDelete =
    currentUser &&
    currentUser._id &&
    authorId &&
    authorId === currentUser._id.toString();

  return `
    <div class="comment">
      <div class="comment-avatar">${authorName.charAt(0).toUpperCase()}</div>
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-author">${authorName}</span>
          ${
            canDelete
              ? `<span class="comment-actions">
                  <i class="fas fa-trash delete-comment" 
                     data-comment-id="${comment._id}" 
                     data-post-id="${postId}"
                     title="Delete comment"></i>
                </span>`
              : ""
          }
        </div>
        <div class="comment-text">${escapeHtml(comment.content)}</div>
        <div class="comment-time">${formatTime(comment.createdAt)}</div>
      </div>
    </div>
  `;
}

// Set up event listeners
function setupEventListeners() {
  // Handle comment submission
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("comment-submit")) {
      const postId = e.target.dataset.postId;
      const input = document.querySelector(
        `.comment-input[data-post-id="${postId}"]`
      );

      if (input && input.value.trim()) {
        await addComment(postId, input.value.trim());
        input.value = "";
      }
    }
  });

  // Handle post creation
  document.getElementById("postSubmit").addEventListener("click", async (e) => {
    e.preventDefault();
    const content = document.getElementById("postContent").value.trim();
    if (content) {
      await createPost(content);
      document.getElementById("postContent").value = "";
    }
  });

  // Handle comment deletion
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-comment")) {
      e.stopPropagation();
      const commentId = e.target.dataset.commentId;
      const postId = e.target.dataset.postId;

      if (confirm("Are you sure you want to delete this comment?")) {
        await deleteComment(postId, commentId);
      }
    }
  });
}

// Add comment to a post
async function addComment(postId, content) {
  if (!currentUser) {
    showError("Please login to comment");
    return;
  }

  try {
    const response = await fetch(`https://mind-mirror-be.onrender.com/api/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add comment");
    }

    // Reload trang sau khi post comment thành công
    window.location.reload();
  } catch (error) {
    console.error("Comment error:", error);
    showError(error.message || "Failed to add comment. Please try again.");
  }
}

async function deleteComment(postId, commentId) {
  if (!currentUser) {
    showError("Please login to delete comments");
    return;
  }

  try {
    const response = await fetch(`https://mind-mirror-be.onrender.com/api/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete comment");
    }

    const data = await response.json();

    // Reload trang nếu xóa thành công
    if (data.message === "Comment deleted successfully") {
      window.location.reload();
    }
  } catch (error) {
    console.error("Delete comment error:", error);
    showError(error.message || "Failed to delete comment. Please try again.");
  }
}

// Helper functions
function formatTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = (now - date) / 1000;

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showLoading(show) {
  const loader = document.getElementById("loadingIndicator");
  if (loader) loader.style.display = show ? "block" : "none";
}

function showError(message) {
  const errorElement = document.getElementById("errorDisplay");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
    setTimeout(() => (errorElement.style.display = "none"), 5000);
  }
}

function updateUIForLoggedInUser() {
  const authButtons = document.getElementById("authButtons");
  const mobileAuthButtons = document.getElementById("mobileAuthButtons");
  const userProfile = document.getElementById("userProfile");

  if (authButtons) authButtons.style.display = "none";
  if (mobileAuthButtons) mobileAuthButtons.style.display = "none";
  if (userProfile) {
    userProfile.style.display = "block";
    const userAvatar = document.getElementById("userAvatar");
    if (userAvatar)
      userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
  }
}

async function createPost(content) {
  if (!currentUser) {
    showError("Please login to post");
    return;
  }

  try {
    const response = await fetch("https://mind-mirror-be.onrender.com/api/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) throw new Error("Failed to create post");

    const newPost = await response.json();
    posts.unshift(newPost);
    renderPosts();
  } catch (error) {
    console.error("Post creation error:", error);
    showError(error.message || "Failed to create post. Please try again.");
  }
}
