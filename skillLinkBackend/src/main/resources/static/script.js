document.addEventListener('DOMContentLoaded', () => {

    /* ==================================
       SPA ROUTER LOGIC
       ================================== */
    const views = {
        'login-view': document.getElementById('login-view'),
        'dashboard-view': document.getElementById('dashboard-view'),
        'profile-view': document.getElementById('profile-view')
    };

    const navbar = document.getElementById('navbar');
    const navItems = document.querySelectorAll('.nav-item');
    
    let currentUser = null;
    let stompClient = null;
    let currentChatTargetId = null;

    function checkAuthSession() {
        const stored = localStorage.getItem('skillLinkAuthData');
        if (stored) {
            currentUser = JSON.parse(stored);
            updateUserName(currentUser.name, currentUser.userId);
            connectSocket();
            renderDashboard();
            navigateTo('dashboard-view');
        } else {
            navigateTo('login-view');
        }
    }

    function navigateTo(viewId) {
        // Hide all views
        Object.values(views).forEach(view => {
            if (view) view.classList.add('hidden');
        });

        // Show requested view
        if (views[viewId]) {
            views[viewId].classList.remove('hidden');
        }

        // Show/hide navbar based on context
        if (viewId === 'login-view') {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
            // Update active nav state
            navItems.forEach(item => {
                if (item.dataset.target === viewId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    }

    // Attach click events to nav links
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.dataset.target === 'profile-view' && currentUser) {
                viewUserProfile(currentUser.userId);
            } else if (item.dataset.target) {
                navigateTo(item.dataset.target);
            }
        });
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('skillLinkAuthData');
        localStorage.removeItem('skillLinkUserName'); // Legacy cleanup
        currentUser = null;
        disconnectSocket();
        navigateTo('login-view');
        // Clear forms
        document.getElementById('login-form').reset();
    });


    /* ==================================
       AUTH LOGIC (MOCK)
       ================================== */
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const resetPasswordForm = document.getElementById('reset-password-form');
    const authToggleBtn = document.getElementById('auth-toggle-btn');
    const authToggleText = document.getElementById('auth-toggle-text');
    const showResetBtn = document.getElementById('show-reset-btn');
    const backToLoginBtn = document.getElementById('back-to-login-btn');
    let isLoginView = true;

    async function updateUserName(name, userId = null) {
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        const dashName = document.getElementById('dash-name');
        if(dashName) dashName.textContent = formattedName;
        
        let avatarUrl = `https://ui-avatars.com/api/?name=${formattedName.replace(/ /g,'+')}&background=0a66c2&color=fff`;

        if (userId) {
            try {
                const res = await fetch(`/api/users/${userId}/profile`);
                if (res.ok) {
                    const profileData = await res.json();
                    if (profileData.profileImage && profileData.profileImage.trim() !== '') {
                        avatarUrl = profileData.profileImage;
                    }
                    if(document.getElementById('dash-bio')) {
                        document.getElementById('dash-bio').textContent = profileData.bio || 'Software Engineering Student';
                    }
                }
            } catch(e){}
        }

        if(document.getElementById('nav-avatar-img')) {
            const navImg = document.getElementById('nav-avatar-img');
            navImg.onerror = () => { navImg.src = `https://ui-avatars.com/api/?name=${formattedName.replace(/ /g,'+')}&background=0a66c2&color=fff`; };
            navImg.src = avatarUrl;
        }
        if(document.getElementById('dash-avatar')) {
            const dashImg = document.getElementById('dash-avatar');
            dashImg.onerror = () => { dashImg.src = `https://ui-avatars.com/api/?name=${formattedName.replace(/ /g,'+')}&background=0a66c2&color=fff`; };
            dashImg.src = avatarUrl;
        }
    }

    // Toggle Login/Signup
    authToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginView = !isLoginView;

        if (isLoginView) {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
            resetPasswordForm.classList.add('hidden');
            authToggleBtn.textContent = 'Join now';
            authToggleText.textContent = 'New to Skill Link?';
        } else {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            resetPasswordForm.classList.add('hidden');
            authToggleBtn.textContent = 'Sign in';
            authToggleText.textContent = 'Already on Skill Link?';
        }
    });

    showResetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.add('hidden');
        resetPasswordForm.classList.remove('hidden');
        authToggleBtn.parentElement.classList.add('hidden');
    });

    backToLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginView = true;
        resetPasswordForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        authToggleBtn.parentElement.classList.remove('hidden');
        authToggleBtn.textContent = 'Join now';
        authToggleText.textContent = 'New to Skill Link?';
    });

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorDiv = document.getElementById('login-error');

        if (!email || password.length < 6) {
            errorDiv.textContent = 'Invalid email or password must be at least 6 characters.';
            errorDiv.classList.remove('hidden');
            return;
        }
        
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if(res.ok) {
                const authData = await res.json();
                errorDiv.classList.add('hidden');
                
                try {
                    const userRes = await fetch(`/api/users/${authData.userId}`);
                    if (userRes.ok) {
                        const userData = await userRes.json();
                        currentUser = { userId: authData.userId, name: userData.name };
                        localStorage.setItem('skillLinkAuthData', JSON.stringify(currentUser));
                        updateUserName(currentUser.name, currentUser.userId);
                        connectSocket();
                        renderDashboard();
                        navigateTo('dashboard-view');
                    }
                } catch(e) {
                    errorDiv.textContent = 'Could not fetch profile details.';
                    errorDiv.classList.remove('hidden');
                }
            } else {
                errorDiv.textContent = 'Invalid credentials.';
                errorDiv.classList.remove('hidden');
            }
        } catch(err) {
            errorDiv.textContent = 'Network error. Please try again.';
            errorDiv.classList.remove('hidden');
        } 
    });

    // Handle Signup
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const college = document.getElementById('signup-college').value.trim();
        const linkedinLink = document.getElementById('signup-linkedin').value.trim();
        const githubLink = document.getElementById('signup-github').value.trim();
        const errorDiv = document.getElementById('signup-error');

        // URL Regex validation
        const urlPattern = /^(https?:\/\/)?([\w\d\-_]+\.+[A-Za-z]{2,})+\/?/;
        if (!urlPattern.test(linkedinLink) || !urlPattern.test(githubLink)) {
            errorDiv.textContent = 'Please enter valid URLs for LinkedIn and GitHub.';
            errorDiv.classList.remove('hidden');
            return;
        }
        
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, college, linkedinLink, githubLink })
            });
            
            if (res.ok) {
                const authData = await res.json();
                errorDiv.classList.add('hidden');
                const finalName = name || 'New User';
                currentUser = { userId: authData.userId, name: finalName };
                localStorage.setItem('skillLinkAuthData', JSON.stringify(currentUser));
                updateUserName(finalName, currentUser.userId);
                
                // Update profile college
                const profCollege = document.getElementById('prof-college');
                if (profCollege) profCollege.textContent = college;

                connectSocket();
                renderDashboard();
                navigateTo('dashboard-view');
            } else {
                errorDiv.textContent = 'Registration failed. Email might be in use.';
                errorDiv.classList.remove('hidden');
            }
        } catch(err) {
            errorDiv.textContent = 'Network error during registration.';
            errorDiv.classList.remove('hidden');
        }
    });

    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('reset-email').value.trim();
        const password = document.getElementById('reset-new-password').value;
        const errorDiv = document.getElementById('reset-error');
        const successDiv = document.getElementById('reset-success');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (res.ok) {
                errorDiv.classList.add('hidden');
                successDiv.classList.remove('hidden');
                resetPasswordForm.reset();
            } else {
                successDiv.classList.add('hidden');
                errorDiv.textContent = 'User with this email not found.';
                errorDiv.classList.remove('hidden');
            }
        } catch(err) {
            successDiv.classList.add('hidden');
            errorDiv.textContent = 'Network error.';
            errorDiv.classList.remove('hidden');
        }
    });


    /* ==================================
       MOCK DATA & RENDERERS
       ================================== */
    let mySkills = [
        { id: 201, name: "Java", proficiency: "Expert" }
    ];


    async function renderDashboard() {
        const feedContainer = document.getElementById('feed-container');
        feedContainer.innerHTML = '<p style="padding:20px; color:#64748b; text-align:center;"><i class="fa-solid fa-spinner fa-spin"></i> Loading matches...</p>';

        try {
            const res = await fetch('/api/users/all');
            if (res.ok) {
                const usersList = await res.json();
                feedContainer.innerHTML = '';

                const filteredList = usersList.filter(u => {
                    const idCheck = u.userid || u.userId || u.userID;
                    return !currentUser || idCheck != currentUser.userId;
                });

                if (filteredList.length === 0) {
                    feedContainer.innerHTML = '<div class="empty-state" style="padding:32px 0;"><i class="fa-solid fa-users-slash"></i>No other users found right now.</div>';
                }

                filteredList.forEach(user => {
                    const normalizedId = user.userid || user.userId || user.userID;
                    const avatarColors = ['1a56db','7c3aed','059669','d97706','dc2626','0891b2'];
                    const colorIdx = normalizedId % avatarColors.length;
                    feedContainer.innerHTML += `
                        <div class="user-card" style="cursor:pointer;" onclick="viewUserProfile(${normalizedId})">
                            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${avatarColors[colorIdx]}&color=fff&bold=true" class="user-card-img" alt="${user.name}">
                            <div class="user-card-info">
                                <h4>${user.name}</h4>
                                <p>${user.college || user.branch || 'Student'}</p>
                            </div>
                            <div class="user-card-actions">
                                <button class="btn btn-connect" onclick="event.stopPropagation(); viewUserProfile(${normalizedId})">
                                    <i class="fa-solid fa-paper-plane"></i> Connect
                                </button>
                            </div>
                        </div>
                    `;
                });
            }
        } catch (e) {
            feedContainer.innerHTML = '<p style="padding:20px; color:#ef4444;">Error loading dashboard feed.</p>';
            console.error(e);
        }

        renderIncomingRequests();
    }

    window.viewUserProfile = async function(userId) {
        navigateTo('profile-view');
        
        document.getElementById('add-skill-btn').classList.add('hidden');
        if(document.getElementById('edit-profile-btn')) document.getElementById('edit-profile-btn').classList.add('hidden');
        if(document.getElementById('edit-profile-form')) document.getElementById('edit-profile-form').classList.add('hidden');
        document.getElementById('prof-name').textContent = 'Loading...';
        
        try {
            const userRes = await fetch(`/api/users/${userId}`);
            const profileRes = await fetch(`/api/users/${userId}/profile`);

            if (userRes.ok) {
                const u = await userRes.json();
                let p = {};
                if (profileRes.ok) {
                    p = await profileRes.json();
                }
                
                document.getElementById('prof-name').textContent = u.name;
                document.getElementById('prof-college').textContent = u.college || 'Not specified';
                document.getElementById('prof-branch').textContent = u.branch || '-';
                document.getElementById('prof-sem').textContent = u.semester || '-';
                document.getElementById('prof-bio').innerHTML = p.bio ? p.bio + ` at <span id="prof-college">${u.college || 'Not specified'}</span>` : `Tech Student at <span id="prof-college">${u.college || 'Not specified'}</span>`;
                
                const ghLink = document.getElementById('prof-github');
                if (p.githubLink || u.githubLink) {
                    ghLink.style.display = 'inline-block';
                    ghLink.href = p.githubLink || u.githubLink;
                } else {
                    ghLink.style.display = 'none';
                }
                
                const inLink = document.getElementById('prof-linkedin');
                if (p.linkedinLink || u.linkedinLink) {
                    inLink.style.display = 'inline-block';
                    inLink.href = p.linkedinLink || u.linkedinLink;
                } else {
                    inLink.style.display = 'none';
                }

                // Add Direct Message integration button conditionally inside Profile View
                let dmContainer = document.getElementById('prof-dm-container');
                if (!dmContainer) {
                    dmContainer = document.createElement('div');
                    dmContainer.id = 'prof-dm-container';
                    document.querySelector('.profile-links').after(dmContainer);
                }
                if (currentUser && currentUser.userId !== userId) {
                    dmContainer.innerHTML = `<button class="btn btn-outline" style="margin-top: 15px;" onclick="openChat('${userId}', '${u.name.replace(/'/g, "\\'")}')"><i class="fa-solid fa-comment"></i> Direct Message</button>`;
                } else {
                    dmContainer.innerHTML = '';
                }

                const xlAvatar = document.querySelector('.profile-avatar-xl');
                const fallbackAvatar = `https://ui-avatars.com/api/?name=${u.name.replace(/ /g,'+')}&background=0a66c2&color=fff`;
                xlAvatar.onerror = () => {
                    xlAvatar.onerror = null;
                    xlAvatar.src = fallbackAvatar;
                };

                if (p.profileImage && p.profileImage.trim()!=='') {
                    xlAvatar.src = p.profileImage;
                } else {
                    xlAvatar.src = fallbackAvatar;
                }

            } else {
                document.getElementById('prof-name').textContent = 'User not found';
            }

            if (currentUser && currentUser.userId === userId) {
                document.getElementById('add-skill-btn').classList.remove('hidden');
                if(document.getElementById('edit-profile-btn')) document.getElementById('edit-profile-btn').classList.remove('hidden');
            }
            
            renderProfileSkills(userId);
            
        } catch (e) {
            console.error(e);
        }
    };
    
    
    // Edit Profile Logic
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const editProfileForm = document.getElementById('edit-profile-form');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    
    if(editProfileBtn) {
        editProfileBtn.addEventListener('click', async () => {
            editProfileBtn.classList.add('hidden');
            editProfileForm.classList.remove('hidden');
            try {
                const res = await fetch(`/api/users/${currentUser.userId}/profile`);
                const uData = await fetch(`/api/users/${currentUser.userId}`).then(r=>r.json());
                
                let pData = {};
                if (res.ok) pData = await res.json();
                
                document.getElementById('edit-bio').value = pData.bio || '';
                document.getElementById('edit-branch').value = uData.branch || '';
                document.getElementById('edit-sem').value = uData.semester || '';
                document.getElementById('edit-image-url').value = pData.profileImage || '';
                document.getElementById('edit-linkedin').value = pData.linkedinLink || uData.linkedinLink || '';
                document.getElementById('edit-github').value = pData.githubLink || uData.githubLink || '';
            } catch(e){}
        });
    }

    if(cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            editProfileForm.classList.add('hidden');
            editProfileBtn.classList.remove('hidden');
        });
    }

    if(editProfileForm) {
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const bio = document.getElementById('edit-bio').value.trim();
            const branch = document.getElementById('edit-branch').value.trim();
            const semester = document.getElementById('edit-sem').value.trim();
            const profileImage = document.getElementById('edit-image-url').value.trim();
            const linkedinLink = document.getElementById('edit-linkedin').value.trim();
            const githubLink = document.getElementById('edit-github').value.trim();

            try {
                const res = await fetch(`/api/users/${currentUser.userId}/profile`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bio, profileImage, linkedinLink, githubLink, branch, semester })
                });

                if (res.ok) {
                    editProfileForm.classList.add('hidden');
                    editProfileBtn.classList.remove('hidden');
                    viewUserProfile(currentUser.userId);
                    updateUserName(currentUser.name, currentUser.userId); // Updates top navbar avatars
                } else {
                    document.getElementById('edit-profile-error').classList.remove('hidden');
                }
            } catch (err) {
                document.getElementById('edit-profile-error').classList.remove('hidden');
            }
        });
    }


    /* ==================================
       SKILL MANAGEMENT
       ================================== */
    const addSkillBtn = document.getElementById('add-skill-btn');
    const cancelSkillBtn = document.getElementById('cancel-skill-btn');
    const addSkillForm = document.getElementById('add-skill-form');

    addSkillBtn.addEventListener('click', () => {
        addSkillForm.classList.remove('hidden');
        addSkillBtn.classList.add('hidden');
    });

    cancelSkillBtn.addEventListener('click', () => {
        addSkillForm.classList.add('hidden');
        addSkillBtn.classList.remove('hidden');
        addSkillForm.reset();
    });

    addSkillForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const skillName = document.getElementById('skill-name-input').value.trim();
        const proficiency = document.getElementById('skill-proficiency').value;

        try {
            const skillRes = await fetch('/api/skills/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skillName: skillName, category: "General" })
            });

            if (skillRes.ok) {
                const createdSkill = await skillRes.json();
                
                // Link skill explicitly to isolated User ID
                await fetch(`/api/skills/user/${currentUser.userId}/add/${createdSkill.skillId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ proficiency: proficiency, experience: 0 })
                });

                addSkillForm.reset();
                addSkillForm.classList.add('hidden');
                addSkillBtn.classList.remove('hidden');
                
                renderProfileSkills(currentUser.userId);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to save skill.");
        }
    });

    async function renderProfileSkills(targetId) {
        const list = document.getElementById('skills-list');
        list.innerHTML = '<p style="padding:16px">Loading skills...</p>';

        try {
            const res = await fetch(`/api/skills/user/${targetId}`);
            if (res.ok) {
                const userSkills = await res.json();
                list.innerHTML = '';
                
                if (userSkills.length === 0) list.innerHTML = '<p style="padding:16px">No skills have been added yet.</p>';
                
                userSkills.forEach(us => {
                    const isNotMe = currentUser && currentUser.userId !== targetId;
                    list.innerHTML += `
                        <div class="skill-list-item" style="display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <h4>${us.skill.skillName}</h4>
                                <p>Proficiency: ${us.proficiency}</p>
                            </div>
                            <!-- Conditional Skill Exchange Native Button -->
                            ${isNotMe ? `<button onclick="sendSkillReq(${targetId}, ${us.skill.skillId})" class="btn btn-sm btn-outline">Request to Exchange</button>` : ''}
                        </div>
                    `;
                });
            } else {
                list.innerHTML = '<p style="padding:16px">Failed to load skills.</p>';
            }
        } catch(e) {
            list.innerHTML = '<p style="padding:16px">Network error fetching skills.</p>';
        }
    }

    /* ==================================
       DYNAMIC SEARCH BAR
       ================================== */
    const searchInput = document.getElementById('global-search');
    const searchDropdown = document.getElementById('search-dropdown');
    
    // Debounce timer for search
    let searchTimeout = null;

    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val.length === 0) {
            searchDropdown.classList.add('hidden');
            return;
        }
        
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            try {
                const searchType = document.getElementById('search-type') ? document.getElementById('search-type').value : 'name';
                const endpoint = searchType === 'skill'
                                 ? `/api/users/search?skill=${encodeURIComponent(val)}`
                                 : `/api/users/search?query=${encodeURIComponent(val)}`;
                
                const res = await fetch(endpoint);
                searchDropdown.innerHTML = '';
                
                if (res.ok) {
                    const users = await res.json();
                    users.forEach(u => {
                        searchDropdown.innerHTML += `
                            <div class="search-result-item cursor-pointer" style="cursor:pointer" onclick="document.getElementById('global-search').value=''; document.getElementById('search-dropdown').classList.add('hidden'); viewUserProfile(${u.userid || u.userId || u.userID});">
                                <h4>${u.name}</h4>
                                <p>${u.college || u.branch || 'Student'}</p>
                            </div>
                        `;
                    });
                } else if (res.status === 404) {
                    const data = await res.json();
                    searchDropdown.innerHTML = `<div class="search-result-item"><p>${data.message || 'User not found'}</p></div>`;
                } else {
                    searchDropdown.innerHTML = `<div class="search-result-item"><p>Error searching users.</p></div>`;
                }
                searchDropdown.classList.remove('hidden');
            } catch(err) {
                console.error(err);
            }
        }, 300); // 300ms debounce
    });

    // Close search dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-search')) {
            searchDropdown.classList.add('hidden');
        }
    });

    /* ==================================
       SOCKETS & INBOX REQUEST ROUTING
       ================================== */

    async function renderIncomingRequests() {
        const reqContainer = document.getElementById('requests-container');
        reqContainer.innerHTML = '<p style="margin-top:10px;">Loading...</p>';
        try {
            const res = await fetch(`/api/requests/received/${currentUser.userId}`);
            if (res.ok) {
                const requests = await res.json();
                reqContainer.innerHTML = '';
                let pendingCount = 0;
                requests.forEach(req => {
                    const isPending = req.status === 'PENDING';
                    if (isPending) pendingCount++;
                    
                    reqContainer.innerHTML += `
                        <div class="request-item" style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                            <div style="display:flex; justify-content:space-between;">
                                <strong>${req.sender.name}</strong> 
                                <span style="font-size:12px; color:#666;">${req.skill.skillName}</span>
                            </div>
                            <div style="margin-top: 5px; font-size:13px; color:#555;">Status: ${req.status}</div>
                            ${isPending ? 
                                `<div style="margin-top: 8px;">
                                    <button class="btn btn-sm" style="background:var(--success-color); color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="updateReqStatus(${req.requestId}, 'ACCEPTED')">Accept</button>
                                    <button class="btn btn-sm" style="background:#dc3545; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="updateReqStatus(${req.requestId}, 'REJECTED')">Deny</button>
                                </div>` :
                                (req.status === 'ACCEPTED' ? `<button class="btn btn-sm btn-outline" style="margin-top:8px" onclick="openChat('${req.sender.userID}', '${req.sender.name.replace(/'/g, "\\'")}')">Message</button>` : '')
                            }
                        </div>
                    `;
                });
                if(requests.length === 0) reqContainer.innerHTML = '<p>No incoming requests.</p>';
                document.getElementById('dash-req-count').textContent = pendingCount;
            }
        } catch(e) {
            reqContainer.innerHTML = '<p>Error loading requests.</p>';
        }
    }

    window.updateReqStatus = async function(reqId, status) {
        try {
            await fetch(`/api/requests/${reqId}/status?status=${status}`, { method: 'PUT' });
            renderIncomingRequests();
        } catch(e) { console.error('Failed to update status', e); }
    };

    window.sendSkillReq = async function(receiverId, skillId) {
        try {
            const res = await fetch(`/api/requests/send?senderId=${currentUser.userId}&receiverId=${receiverId}&skillId=${skillId}`, {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ message: "I would like to exchange skills with you!" })
            });
            if(res.ok) alert("Request sent successfully!");
            else alert("Failed to send request.");
        } catch(e){ alert("Network error.")}
    }

    function connectSocket() {
        if (stompClient && stompClient.connected) return;
        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.debug = null; 
        
        stompClient.connect({}, function (frame) {
            stompClient.subscribe(`/user/${currentUser.userId}/queue/messages`, function (msg) {
                const chatMessage = JSON.parse(msg.body);
                if (currentChatTargetId && chatMessage.senderId == currentChatTargetId) {
                    displayChatMessage(chatMessage.content, 'them', chatMessage.senderName);
                } else {
                    alert(`New message from ${chatMessage.senderName}: ${chatMessage.content}`);
                }
            });
        });
    }

    function disconnectSocket() {
        if (stompClient !== null) stompClient.disconnect();
    }

    window.openChat = function(targetId, targetName) {
        currentChatTargetId = targetId;
        document.getElementById('chat-widget').classList.remove('hidden');
        document.getElementById('chat-target-name').textContent = targetName;
        document.getElementById('chat-messages').innerHTML = '';
        document.getElementById('chat-input').focus();
    }

    const closeChatBtn = document.getElementById('close-chat-btn');
    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            document.getElementById('chat-widget').classList.add('hidden');
            currentChatTargetId = null;
        });
    }

    // Bind Chat Enter Button and Send Layout logic
    function sendActiveMessage() {
        const input = document.getElementById('chat-input');
        const content = input.value.trim();
        if(content && stompClient && currentChatTargetId) {
            const payload = {
                senderId: currentUser.userId,
                receiverId: currentChatTargetId,
                senderName: currentUser.name,
                content: content,
                type: 'CHAT'
            };
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(payload));
            displayChatMessage(content, 'me', 'You');
            input.value = '';
        }
    }

    const sendChatBtn = document.getElementById('send-chat-btn');
    const chatInput = document.getElementById('chat-input');
    if (sendChatBtn) sendChatBtn.addEventListener('click', sendActiveMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') sendActiveMessage();
        });
    }

    function displayChatMessage(content, type, authorInfo) {
        const chatContainer = document.getElementById('chat-messages');
        chatContainer.innerHTML += `
            <div class="chat-msg msg-${type}">
                <div class="msg-author">${authorInfo}</div>
                ${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
            </div>
        `;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Initialize session automatically
    checkAuthSession();

});
