// Dữ liệu bài viết mẫu
let posts = [
  {
    id: 1,
    author: "John Doe",
    content:
      "I've been feeling really anxious lately with all the work pressure. Anyone else feeling the same?",
    time: "2 hours ago",
    likes: 5,
    isLiked: false,
    comments: [
      {
        id: 1,
        author: "Jane Smith",
        content:
          "I totally understand how you feel. Take some time for yourself!",
        time: "1 hour ago",
      },
      {
        id: 2,
        author: "Mike Johnson",
        content: "Hang in there! Maybe try some meditation?",
        time: "45 minutes ago",
      },
    ],
  },
  {
    id: 2,
    author: "Sarah Williams",
    content:
      "Just wanted to share that today was a good day. Small wins matter!",
    time: "5 hours ago",
    likes: 12,
    isLiked: true,
    comments: [
      {
        id: 3,
        author: "Alex Chen",
        content: "Happy for you! Keep it up!",
        time: "3 hours ago",
      },
    ],
  },
];

// Tải bài viết
function loadPosts() {
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "post";
    postElement.innerHTML = `
                    <div class="post-header">
                        <div class="post-avatar">${post.author.charAt(0)}</div>
                        <div>
                            <div class="post-author">${post.author}</div>
                            <div class="post-time">${post.time}</div>
                        </div>
                    </div>
                    <div class="post-content">
                        ${post.content}
                    </div>
                    <div class="post-actions">
                        <button class="action-btn like-btn ${
                          post.isLiked ? "liked" : ""
                        }" data-post-id="${post.id}">
                            <i class="fas fa-heart"></i> Like (${post.likes})
                        </button>
                        <button class="action-btn comment-btn" data-post-id="${
                          post.id
                        }">
                            <i class="fas fa-comment"></i> Comment
                        </button>
                        <button class="action-btn share-btn">
                            <i class="fas fa-share"></i> Share
                        </button>
                    </div>
                    <div class="comments-section" id="comments-${post.id}">
                        <div class="comment-form">
                            <input type="text" class="comment-input" placeholder="Write a comment..." data-post-id="${
                              post.id
                            }">
                            <button class="comment-submit" data-post-id="${
                              post.id
                            }">Post</button>
                        </div>
                        <div class="comment-list" id="comment-list-${post.id}">
                            ${loadComments(post.comments)}
                        </div>
                    </div>
                `;
    postsContainer.appendChild(postElement);
  });

  // Thêm event listeners cho các nút like và comment
  document.querySelectorAll(".like-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const postId = parseInt(this.getAttribute("data-post-id"));
      toggleLike(postId);
    });
  });

  document.querySelectorAll(".comment-submit").forEach((btn) => {
    btn.addEventListener("click", function () {
      const postId = parseInt(this.getAttribute("data-post-id"));
      const commentInput = document.querySelector(
        `.comment-input[data-post-id="${postId}"]`
      );
      addComment(postId, commentInput.value);
      commentInput.value = "";
    });
  });
}

// Tải bình luận
function loadComments(comments) {
  if (!comments || comments.length === 0) return "";

  return comments
    .map(
      (comment) => `
                <div class="comment">
                    <div class="comment-avatar">${comment.author.charAt(
                      0
                    )}</div>
                    <div class="comment-content">
                        <div class="comment-author">${comment.author}</div>
                        <div class="comment-text">${comment.content}</div>
                        <div class="comment-actions">
                            <span class="comment-action">Like</span>
                            <span class="comment-action">Reply</span>
                            <span class="comment-time">${comment.time}</span>
                        </div>
                    </div>
                </div>
            `
    )
    .join("");
}

// Thích/bỏ thích bài viết
function toggleLike(postId) {
  const post = posts.find((p) => p.id === postId);
  if (post) {
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
    loadPosts();
  }
}

// Thêm bình luận
function addComment(postId, content) {
  if (!content.trim()) return;

  const post = posts.find((p) => p.id === postId);
  if (post) {
    const newComment = {
      id: post.comments.length + 1,
      author: "You",
      content: content,
      time: "Just now",
    };
    post.comments.unshift(newComment);
    loadPosts();
  }
}

// Đăng bài viết mới
document.getElementById("postSubmit").addEventListener("click", function () {
  const content = document.getElementById("postContent").value.trim();
  if (!content) return;

  const newPost = {
    id: posts.length + 1,
    author: "You",
    content: content,
    time: "Just now",
    likes: 0,
    isLiked: false,
    comments: [],
  };

  posts.unshift(newPost);
  document.getElementById("postContent").value = "";
  loadPosts();
  window.scrollTo(0, document.getElementById("backBtn").offsetTop);
});

// Tải bài viết khi trang được mở
window.addEventListener("load", function () {
  loadPosts();
  checkLoginState();
});
