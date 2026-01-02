// ------------------------------
// Original Form Validation Logic (Preserved & Cleaned)
// ------------------------------
function validateLogin(event) {
    event.preventDefault();

    const userEmail = document.getElementById('userEmail');
    const password = document.getElementById('pword');
    const userEmailError = document.getElementById('userEmailError');
    const pwordError = document.getElementById('pwordError');

    resetFieldErrors(userEmail, userEmailError);
    resetFieldErrors(password, pwordError);

    let isValid = true;

    // Email/Username validation
    if (userEmail.value.trim() === '') {
        setFieldError(userEmail, userEmailError, 'Email/username cannot be empty');
        isValid = false;
    } else if (userEmail.value.includes('@') && !userEmail.value.includes('.')) {
        setFieldError(userEmail, userEmailError, 'Email must include @ and a domain (e.g., .com)');
        isValid = false;
    }

    // Password validation
    if (password.value.trim() === '') {
        setFieldError(password, pwordError, 'Password cannot be empty');
        isValid = false;
    } else if (password.value.length < 6) {
        setFieldError(password, pwordError, 'Password must be at least 6 characters');
        isValid = false;
    }

    // Simulate successful login
    if (isValid) {
        alert('Login validation passed! Redirecting...');
        localStorage.setItem('userLoggedIn', 'true');
        if (document.getElementById('loginForm')) {
            document.getElementById('loginForm').submit();
        }
    }
}

function validateRegistration(event) {
    event.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const successMsg = document.getElementById('registrationSuccess');

    // Reset all errors and success message
    resetFieldErrors(name, nameError);
    resetFieldErrors(email, emailError);
    resetFieldErrors(username, usernameError);
    resetFieldErrors(password, passwordError);
    resetFieldErrors(confirmPassword, confirmPasswordError);
    if (successMsg) {
        successMsg.style.display = 'none';
    }

    let isValid = true;

    // Field validations
    if (name.value.trim() === '') {
        setFieldError(name, nameError, 'Full name cannot be empty');
        isValid = false;
    }

    if (email.value.trim() === '') {
        setFieldError(email, emailError, 'Email cannot be empty');
        isValid = false;
    } else if (!email.value.includes('@')) {
        setFieldError(email, emailError, 'Email must include @ symbol');
        isValid = false;
    }

    if (username.value.trim() === '') {
        setFieldError(username, usernameError, 'Username cannot be empty');
        isValid = false;
    } else if (username.value.length < 3) {
        setFieldError(username, usernameError, 'Username must be at least 3 characters');
        isValid = false;
    }

    if (password.value.trim() === '') {
        setFieldError(password, passwordError, 'Password cannot be empty');
        isValid = false;
    }

    if (confirmPassword.value.trim() === '') {
        setFieldError(confirmPassword, confirmPasswordError, 'Confirm password cannot be empty');
        isValid = false;
    } else if (confirmPassword.value !== password.value) {
        setFieldError(confirmPassword, confirmPasswordError, 'Passwords do not match');
        isValid = false;
    }

    // Show success on valid registration
    if (isValid && successMsg) {
        successMsg.textContent = 'Registration successful! Redirecting to login...';
        successMsg.style.display = 'block';
    }
}

// Form helper functions
function setFieldError(field, errorElement, message) {
    if (!field || !errorElement) return;
    field.classList.add('invalid');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function resetFieldErrors(field, errorElement) {
    if (!field || !errorElement) return;
    field.classList.remove('invalid');
    errorElement.textContent = '';
    errorElement.style.display = 'none';
}

function clearRegistrationForm() {
    const form = document.getElementById('registrationForm');
    if (!form) return;
    form.reset();

    // Clear all error messages
    const errorElements = form.querySelectorAll('.error');
    errorElements.forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });

    // Clear success message
    const successMsg = document.getElementById('registrationSuccess');
    if (successMsg) {
        successMsg.style.display = 'none';
    }

    // Reset invalid classes
    const inputFields = form.querySelectorAll('input');
    inputFields.forEach(field => field.classList.remove('invalid'));
}

// Original Form Event Listeners (Preserved & Safeguarded)
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', validateLogin);

    // Clear errors on input
    const userEmail = document.getElementById('userEmail');
    const pword = document.getElementById('pword');
    const userEmailError = document.getElementById('userEmailError');
    const pwordError = document.getElementById('pwordError');

    userEmail?.addEventListener('input', () => {
        resetFieldErrors(userEmail, userEmailError);
    });
    pword?.addEventListener('input', () => {
        resetFieldErrors(pword, pwordError);
    });
}

if (document.getElementById('registrationForm')) {
    document.getElementById('registrationForm').addEventListener('submit', validateRegistration);
    document.getElementById('clearFormBtn')?.addEventListener('click', clearRegistrationForm);

    // Clear errors on input for registration fields
    const regFields = ['name', 'email', 'username', 'password', 'confirmPassword'];
    regFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const errorField = document.getElementById(`${fieldId}Error`);
        field?.addEventListener('input', () => {
            resetFieldErrors(field, errorField);
        });
    });
}


// API Configuration & Helpers
// Replace the existing API_URL line with this:
const API_URL = "https://sariel-1949.github.io/personalblog/data/api/mock-data.json";
let mockData = null; // Cached mock API data (persists across calls)

// Safe element show/hide (prevents null errors)
function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
    }
}

function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

// Fetch data from mock JSON (with error handling & cache)
async function fetchData(refresh = false) {
    // Return cached data if not refreshing
    if (mockData && !refresh) {
        return mockData;
    }

    try {
        // Show loading state
        showElement('loading-spinner');
        hideElement('api-error');
        showElement('main-content'); // Keep main content visible (fix for hidden blog post)

        // Fetch from JSON file
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse and cache data
        mockData = await response.json();
        console.log('Mock API data loaded successfully:', mockData); // WebStorm debug log

        // Hide loading state
        hideElement('loading-spinner');
        return mockData;
    } catch (error) {
        console.error('Failed to fetch mock data:', error); // WebStorm debug log
        // Show error state
        hideElement('loading-spinner');
        hideElement('main-content');
        showElement('api-error');
        return null;
    }
}


// Dynamic Content Rendering
// Render Featured Blog Post (main blog post - #featblog)
function renderFeaturedPost(post) {
    const featblog = document.getElementById('featblog');
    // Guard clauses to prevent null errors
    if (!featblog) {
        console.error('Featured blog element (#featblog) not found');
        return;
    }
    if (!post) {
        console.error('Featured post data is missing');
        featblog.innerHTML = '<p>Failed to load featured post.</p>';
        return;
    }

    // Ensure the element is visible and populate content
    featblog.style.display = 'block';
    featblog.innerHTML = `
        <h2>${post.title}</h2>
        <div class="post-meta">By ${post.author} | ${post.date} | ${post.category}</div>
        <p>${post.content}</p>
        <button class="view-comments-btn" data-post-id="${post.id}" data-post-title="${post.title}">View Comments</button>
    `;
}

// Render Recent Posts (below featured post)
function renderRecentPosts(posts) {
    const recentPostsContainer = document.getElementById('recent-posts');
    if (!recentPostsContainer || !posts || posts.length < 2) {
        console.error('Recent posts container or data missing');
        return;
    }

    // Exclude featured post (first item) and render remaining
    const nonFeaturedPosts = posts.slice(1);
    recentPostsContainer.innerHTML = '';

    nonFeaturedPosts.forEach(post => {
        const article = document.createElement('article');
        article.innerHTML = `
            <h4>${post.title}</h4>
            <div class="post-meta">By ${post.author} | ${post.date} | ${post.category}</div>
            <p>${post.content}</p>
            <button class="view-comments-btn" data-post-id="${post.id}" data-post-title="${post.title}">View Comments</button>
        `;
        recentPostsContainer.appendChild(article);
    });
}

// Render User Profile (in navigation bar)
function renderUserProfile(user) {
    if (!user) {
        console.error('User data is missing');
        return;
    }

    const userAvatar = document.getElementById('user-avatar');
    const userUsername = document.getElementById('user-username');
    const userBio = document.getElementById('user-bio');
    const logoutLink = document.getElementById('logout-link');
    const userProfile = document.getElementById('user-profile');

    // Populate user data
    if (userAvatar) userAvatar.src = user.avatar;
    if (userUsername) userUsername.textContent = user.username;
    if (userBio) userBio.textContent = user.bio;

    // Toggle visibility (hide logout, show profile)
    hideElement('logout-link');
    showElement('user-profile');
}

// Render Comments for a Specific Post
function renderPostComments(postId, comments) {
    const postCommentsContainer = document.getElementById('post-comments');
    if (!postCommentsContainer || !comments) {
        console.error('Comments container or data missing');
        return;
    }

    // Filter comments for the target post
    const postComments = comments.filter(comment => comment.postId === postId);
    postCommentsContainer.innerHTML = '';

    // Handle empty comments
    if (postComments.length === 0) {
        postCommentsContainer.innerHTML = '<p>No comments for this post yet.</p>';
        return;
    }

    // Render comment cards
    postComments.forEach(comment => {
        const commentCard = document.createElement('div');
        commentCard.className = 'comment-card';
        commentCard.innerHTML = `
            <div class="comment-meta">${comment.author} | ${new Date(comment.date).toLocaleString()}</div>
            <p>${comment.content}</p>
        `;
        postCommentsContainer.appendChild(commentCard);
    });
}

// Render Recent Comments (sidebar)
function renderRecentComments(comments) {
    const recentCommentsContainer = document.getElementById('recent-comments');
    if (!recentCommentsContainer) {
        console.error('Recent comments container not found');
        return;
    }

    // Handle empty comments
    if (!comments || comments.length === 0) {
        recentCommentsContainer.innerHTML = '<p>No comments yet</p>';
        return;
    }

    // Sort by date (newest first) and take top 2
    const sortedComments = [...comments].sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentComments = sortedComments.slice(0, 2);

    recentCommentsContainer.innerHTML = '';
    recentComments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.innerHTML = `
            <p><strong>${comment.author}</strong>: ${comment.content.substring(0, 50)}${comment.content.length > 50 ? '...' : ''}</p>
        `;
        recentCommentsContainer.appendChild(commentElement);
    });
}

// ------------------------------
// Asynchronous Data Loading (Fixed Initial Load)
// ------------------------------
// Load all initial data on page load
async function loadInitialData() {
    const data = await fetchData();
    if (!data) {
        console.error('Aborting initial data render - no mock data available');
        return;
    }

    // Render all dynamic content (including main blog post)
    renderFeaturedPost(data.blogPosts[0]); // Render first post as featured
    renderRecentPosts(data.blogPosts);
    renderRecentComments(data.comments);

    // Render user profile if logged in
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (isLoggedIn) {
        renderUserProfile(data.userData);
    }
}

// Load comments for the modal (when "View Comments" is clicked)
async function loadPostComments(postId, postTitle) {
    const modalPostTitle = document.getElementById('modal-post-title');
    const modalLoading = document.getElementById('modal-loading');
    const modalError = document.getElementById('modal-error');
    const postCommentsContainer = document.getElementById('post-comments');

    // Guard clauses
    if (!modalPostTitle || !modalLoading || !modalError || !postCommentsContainer) {
        console.error('Comment modal elements missing');
        return;
    }

    // Set modal state
    modalPostTitle.textContent = postTitle;
    showElement('modal-loading');
    hideElement('modal-error');
    hideElement('post-comments');

    try {
        const data = await fetchData();
        if (!data) {
            throw new Error('No mock data available for comments');
        }

        // Render comments and update modal state
        hideElement('modal-loading');
        showElement('post-comments');
        renderPostComments(postId, data.comments);
    } catch (error) {
        console.error('Failed to load post comments:', error);
        hideElement('modal-loading');
        showElement('modal-error');
    }
}

// ------------------------------
// Data Submission (Add Comment - Optimistic UI)
// ------------------------------
async function submitNewComment(postId) {
    const newCommentContent = document.getElementById('new-comment-content');
    const commentSubmitError = document.getElementById('comment-submit-error');
    const postCommentsContainer = document.getElementById('post-comments');

    // Guard clauses
    if (!newCommentContent || !commentSubmitError || !postCommentsContainer) {
        console.error('Comment submission elements missing');
        return;
    }

    const content = newCommentContent.value.trim();
    if (!content) {
        return; // Abort if empty comment
    }

    // Optimistic UI update (show comment before API confirmation)
    const optimisticComment = {
        id: Date.now(), // Unique ID for mock submission
        postId: postId,
        userId: 1,
        content: content,
        author: mockData?.userData?.username || 'Anonymous',
        date: new Date().toISOString()
    };

    // Create optimistic comment card
    const commentCard = document.createElement('div');
    commentCard.className = 'comment-card';
    commentCard.innerHTML = `
        <div class="comment-meta">${optimisticComment.author} | ${new Date(optimisticComment.date).toLocaleString()}</div>
        <p>${optimisticComment.content}</p>
        <div class="optimistic-tag" style="font-size: 0.7rem; color: #165dff;">Saving...</div>
    `;
    postCommentsContainer.prepend(commentCard);
    newCommentContent.value = '';
    hideElement('comment-submit-error');

    try {
        // Simulate API POST delay (1 second)
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (!mockData) {
            throw new Error('No cached mock data to update');
        }

        // Update cached mock data (persist comment in memory)
        mockData.comments.unshift(optimisticComment);

        // Remove "Saving..." tag (complete optimistic update)
        const optimisticTag = commentCard.querySelector('.optimistic-tag');
        if (optimisticTag) {
            optimisticTag.remove();
        }

        // Update sidebar recent comments
        renderRecentComments(mockData.comments);
    } catch (error) {
        console.error('Failed to submit comment:', error);
        // Rollback UI (remove optimistic comment)
        commentCard.remove();
        showElement('comment-submit-error');
        newCommentContent.value = content; // Restore comment text
    }
}

// ------------------------------
// Original Navigation & User Feedback (Preserved & Cleaned)
// ------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Highlight Active Navigation Link
    const navLinks = document.querySelectorAll('#main-nav .float-link[data-path]');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const linkPath = link.dataset.path;
        const isActive = (currentPath === linkPath) || (currentPath === '/' && linkPath === '/home');

        if (isActive) {
            link.classList.add('nav-active');
        } else {
            link.classList.remove('nav-active');
        }
    });

    // Navigation Link Hover Effects
    const allNavLinks = document.querySelectorAll('#main-nav .float-link');
    allNavLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'color 0.3s ease';
        });

        link.addEventListener('mouseleave', function() {
            this.style.color = this.classList.contains('nav-active') ? '#c90000' : '';
        });
    });

    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY >= 300) {
                showElement('back-to-top');
            } else {
                hideElement('back-to-top');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Logout Confirmation
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();

            const confirmLogout = confirm('Are you sure you want to logout? You will be redirected to the login page.');
            if (confirmLogout) {
                localStorage.removeItem('userLoggedIn');
                window.location.href = this.href;
            }
        });
    }

    // Auto-Hide Welcome Message
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        showElement('welcome-message');
        setTimeout(function() {
            hideElement('welcome-message');
        }, 5000);
    }

    // Preference Helpers (Local Storage)
    function savePreference(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function loadPreference(key) {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : null;
    }

    function clearPreferences(key = null) {
        if (key) {
            localStorage.removeItem(key);
        } else {
            localStorage.clear();
        }
    }

    // Theme Toggle (Preserved)
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = document.getElementById('theme-label');
    const body = document.body;
    const header = document.querySelector('header');
    const sidebar = document.querySelector('.side-bar');
    const footer = document.querySelector('footer');
    const featblog = document.getElementById('featblog');
    const sidebarInputs = document.querySelectorAll('.side-bar input');

    const savedTheme = loadPreference('userTheme') || 'dark';
    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-mode');
            header?.classList.add('light-mode');
            sidebar?.classList.add('light-mode');
            footer?.classList.add('light-mode');
            featblog?.classList.add('light-mode');
            themeToggle?.classList.add('light-mode');
            themeLabel.textContent = 'Light Mode';
            sidebarInputs.forEach(input => input.classList.add('light-mode'));
        } else {
            body.classList.remove('light-mode');
            header?.classList.remove('light-mode');
            sidebar?.classList.remove('light-mode');
            footer?.classList.remove('light-mode');
            featblog?.classList.remove('light-mode');
            themeToggle?.classList.remove('light-mode');
            themeLabel.textContent = 'Dark Mode';
            sidebarInputs.forEach(input => input.classList.remove('light-mode'));
        }
    }

    // Apply saved theme
    applyTheme(savedTheme);

    // Theme toggle event
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
            savePreference('userTheme', currentTheme);
            applyTheme(currentTheme);
        });
    }

    // Form Auto-Save (Preserved)
    const savedNotification = document.getElementById('saved-notification');
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const clearSavedBtn = document.getElementById('clear-saved-data');

    function showSavedNotification() {
        showElement('saved-notification');
        setTimeout(() => {
            hideElement('saved-notification');
        }, 1000);
    }

    // Auto-save login form
    if (loginForm) {
        const loginFields = ['userEmail', 'pword'];
        const savedLoginData = loadPreference('loginFormData') || {};

        loginFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && savedLoginData[fieldId]) {
                field.value = savedLoginData[fieldId];
            }
            field?.addEventListener('input', function() {
                savedLoginData[fieldId] = this.value;
                savePreference('loginFormData', savedLoginData);
                showSavedNotification();
            });
        });
    }

    // Auto-save registration form
    if (registrationForm) {
        const regFields = ['name', 'email', 'username', 'password', 'confirmPassword'];
        const savedRegData = loadPreference('registrationFormData') || {};

        regFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && savedRegData[fieldId]) {
                field.value = savedRegData[fieldId];
            }
            field?.addEventListener('input', function() {
                savedRegData[fieldId] = this.value;
                savePreference('registrationFormData', savedRegData);
                showSavedNotification();
            });
        });
    }

    // Clear saved form data
    if (clearSavedBtn) {
        clearSavedBtn.addEventListener('click', function() {
            clearPreferences('loginFormData');
            clearPreferences('registrationFormData');
            loginForm?.reset();
            registrationForm?.reset();

            // Clear errors and invalid classes
            document.querySelectorAll('.error').forEach(el => {
                el.textContent = '';
                hideElement(el.id);
            });
            document.querySelectorAll('input').forEach(el => el.classList.remove('invalid'));

            alert('Saved form data cleared!');
        });
    }

    // Font Size Controls (Preserved)
    const fontSizeBtns = document.querySelectorAll('.font-size-btn');
    const blogContent = document.querySelectorAll('.main-content p, .main-content h2, .main-content h3, .main-content h4');
    const fontSizes = {
        small: { p: '0.9rem', h2: '1.4rem', h3: '1.2rem', h4: '1rem' },
        medium: { p: '1rem', h2: '1.6rem', h3: '1.3rem', h4: '1.1rem' },
        large: { p: '1.2rem', h2: '1.8rem', h3: '1.5rem', h4: '1.3rem' }
    };

    const savedFontSize = loadPreference('userFontSize') || 'medium';
    function applyFontSize(size) {
        blogContent.forEach(element => {
            switch (element.tagName) {
                case 'P':
                    element.style.fontSize = fontSizes[size].p;
                    break;
                case 'H2':
                    element.style.fontSize = fontSizes[size].h2;
                    break;
                case 'H3':
                    element.style.fontSize = fontSizes[size].h3;
                    break;
                case 'H4':
                    element.style.fontSize = fontSizes[size].h4;
                    break;
                default:
                    break;
            }
        });

        // Highlight active font size button
        fontSizeBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.fontSize === size) {
                btn.classList.add('active');
            }
        });
    }

    // Apply saved font size
    applyFontSize(savedFontSize);

    // Font size button events
    fontSizeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const selectedSize = this.dataset.fontSize;
            savePreference('userFontSize', selectedSize);
            applyFontSize(selectedSize);
        });
    });

    // ------------------------------
    // New: API Feature Event Listeners (Fixed)
    // ------------------------------
    // Refresh Data Button
    document.getElementById('refresh-data')?.addEventListener('click', async () => {
        await fetchData(true); // Force refresh
        loadInitialData();
    });

    // View Comments Button (Delegate to parent to handle dynamic elements)
    document.getElementById('main-content')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-comments-btn')) {
            const postId = parseInt(e.target.dataset.postId);
            const postTitle = e.target.dataset.postTitle;

            if (!isNaN(postId) && postTitle) {
                showElement('comment-modal');
                loadPostComments(postId, postTitle);
            }
        }
    });

    // Close Comment Modal
    document.querySelector('.comment-modal-close')?.addEventListener('click', () => {
        hideElement('comment-modal');
    });

    // Submit New Comment
    document.getElementById('submit-comment')?.addEventListener('click', () => {
        const modalPostTitle = document.getElementById('modal-post-title');
        if (!modalPostTitle || !mockData) {
            return;
        }

        // Find post ID by title
        const post = mockData.blogPosts.find(post => post.title === modalPostTitle.textContent);
        if (post) {
            submitNewComment(post.id);
        }
    });

    // Close Modal on Outside Click
    window.addEventListener('click', (e) => {
        const commentModal = document.getElementById('comment-modal');
        if (e.target === commentModal) {
            hideElement('comment-modal');
        }
    });

    // ------------------------------
    // Initialize Dynamic Content (Critical Fix for Main Blog Post)
    // ------------------------------
    loadInitialData();
});

// ------------------------------
// Window Load (Preserved & Cleaned)
// ------------------------------
window.onload = function() {
    const savedTheme = JSON.parse(localStorage.getItem('userTheme')) || 'dark';
    const savedFontSize = JSON.parse(localStorage.getItem('userFontSize')) || 'medium';
    const body = document.body;
    const header = document.querySelector('header');
    const sidebar = document.querySelector('.side-bar');
    const footer = document.querySelector('footer');
    const featblog = document.getElementById('featblog');
    const sidebarInputs = document.querySelectorAll('.side-bar input');
    const blogContent = document.querySelectorAll('.main-content p, .main-content h2, .main-content h3, .main-content h4');
    const fontSizes = {
        small: { p: '0.9rem', h2: '1.4rem', h3: '1.2rem', h4: '1rem' },
        medium: { p: '1rem', h2: '1.6rem', h3: '1.3rem', h4: '1.1rem' },
        large: { p: '1.2rem', h2: '1.8rem', h3: '1.5rem', h4: '1.3rem' }
    };

    // Re-apply theme to prevent flicker
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        header?.classList.add('light-mode');
        sidebar?.classList.add('light-mode');
        footer?.classList.add('light-mode');
        featblog?.classList.add('light-mode');
        document.getElementById('theme-toggle')?.classList.add('light-mode');
        document.getElementById('theme-label').textContent = 'Light Mode';
        sidebarInputs.forEach(input => input.classList.add('light-mode'));
    }

    // Re-apply font size to prevent flicker
    blogContent.forEach(element => {
        switch (element.tagName) {
            case 'P':
                element.style.fontSize = fontSizes[savedFontSize].p;
                break;
            case 'H2':
                element.style.fontSize = fontSizes[savedFontSize].h2;
                break;
            case 'H3':
                element.style.fontSize = fontSizes[savedFontSize].h3;
                break;
            case 'H4':
                element.style.fontSize = fontSizes[savedFontSize].h4;
                break;
            default:
                break;
        }
    });

    // Highlight active font size button
    document.querySelectorAll('.font-size-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.fontSize === savedFontSize) {
            btn.classList.add('active');
        }
    });
};