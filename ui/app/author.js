/**
 * Author Mode Logic (Commercial Refactor)
 * Handles the "Author Studio" Workspace.
 * managed by: ViewManager.js
 * 
 * Integrated with Real 9-Agent Backend API (/api/v2/books)
 */

const AuthorApp = {
    state: {
        activeProject: null,
        activeChapter: null,
        isAIProcessing: false,
        projects: []
    },

    init() {
        console.log('AuthorApp: Initialized (Real API Mode)');
        this.bindEvents();
    },

    bindEvents() {
        // Project Management
        document.getElementById('btn-new-project')?.addEventListener('click', () => {
            this.createNewProject();
        });

        document.getElementById('btn-back-projects')?.addEventListener('click', () => {
            this.showProjectList();
        });

        // Editor Toolbar (Formatting)
        document.querySelectorAll('.tool-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.dataset.action;
                document.execCommand(action, false, null);
                if (action === 'h1') document.execCommand('formatBlock', false, 'H1');
                if (action === 'h2') document.execCommand('formatBlock', false, 'H2');
            });
        });

        // AI Propose
        document.getElementById('btn-ai-propose')?.addEventListener('click', () => {
            this.triggerAIPropose();
        });

        // AI Chat
        document.getElementById('btn-ai-send')?.addEventListener('click', () => {
            this.handleInfoChat();
        });
    },

    // --- API Integration ---

    async loadProjects() {
        try {
            const response = await fetch('/api/v2/books/');
            if (!response.ok) throw new Error('Failed to fetch projects');
            
            const projects = await response.json();
            this.state.projects = projects;
            this.renderProjectList(projects);
        } catch (error) {
            console.error('Load projects error:', error);
            const list = document.getElementById('author-project-list');
            if (list) list.innerHTML = `<div class="error-state" style="padding:20px; color:var(--accent-primary); text-align:center;">${error.message}</div>`;
        }
    },

    renderProjectList(projects) {
        const list = document.getElementById('author-project-list');
        if (!list) return;

        if (!projects || projects.length === 0) {
            list.innerHTML = '<div class="empty-state" style="padding:20px; color:#666; text-align:center;">Chưa có dự án nào</div>';
            return;
        }

        list.innerHTML = projects.map(p => `
            <div class="project-card" onclick="AuthorApp.openProject('${p.id}')">
                <div class="card-header">
                    <span class="project-title">${p.title || 'Sách không tên'}</span>
                </div>
                <div class="card-meta">
                    <span class="status-badge" data-status="${p.status}">${this.formatStatus(p.status)}</span>
                    <span class="word-count">${p.total_words?.toLocaleString() || 0} từ</span>
                </div>
                <div class="card-footer">
                    Cập nhật: ${new Date(p.updated_at).toLocaleDateString('vi-VN')}
                </div>
            </div>
        `).join('');
    },

    formatStatus(status) {
        const map = {
            'created': 'Vừa tạo',
            'analyzing': 'Đang phân tích',
            'outline_ready': 'Dàn ý đã sẵn sàng',
            'writing': 'Đang viết nội dung',
            'complete': 'Hoàn thành',
            'failed': 'Lỗi'
        };
        return map[status] || status;
    },

    async createNewProject() {
        const ideas = prompt("Nhập ý tưởng cho cuốn sách của bạn (tối thiểu 10 ký tự):");
        if (!ideas || ideas.trim().length < 10) {
            if (ideas) alert("Ý tưởng quá ngắn!");
            return;
        }

        try {
            const response = await fetch('/api/v2/books/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ideas: ideas,
                    input_mode: 'seeds',
                    language: 'vi',
                    target_pages: 100,
                    output_formats: ['docx']
                })
            });

            if (!response.ok) throw new Error('Không thể tạo dự án');
            
            const newBook = await response.json();
            alert(`Đã khởi tạo dự án: ${newBook.title || 'Sách mới'}`);
            this.loadProjects();
        } catch (error) {
            alert(`Lỗi: ${error.message}`);
        }
    },

    async openProject(bookId) {
        try {
            const response = await fetch(`/api/v2/books/${bookId}`);
            if (!response.ok) throw new Error('Không thể tải thông tin dự án');
            
            const project = await response.json();
            this.state.activeProject = project;
            
            // Switch UI
            document.querySelector('.author-project-list').classList.add('hidden');
            document.getElementById('author-chapter-nav').classList.remove('hidden');
            
            this.renderChapterList(project);
            
            // Load first chapter if available
            if (project.chapters && project.chapters.length > 0) {
                this.openChapter(project.chapters[0].chapter_number);
            } else {
                const editor = document.getElementById('author-editor');
                editor.innerHTML = `<h1>${project.title || 'Sách mới'}</h1><p>Dự án đang ở trạng thái: <strong>${this.formatStatus(project.status)}</strong>. Vui lòng đợi AI xử lý hoặc kiểm tra dàn ý.</p>`;
            }
        } catch (error) {
            alert(`Lỗi: ${error.message}`);
        }
    },

    renderChapterList(project) {
        const list = document.getElementById('chapter-list');
        if (!list) return;

        if (!project.chapters || project.chapters.length === 0) {
            list.innerHTML = '<li style="padding:10px; font-size:13px; color:#666;">Chưa có chương nào được viết</li>';
            return;
        }

        list.innerHTML = project.chapters.map(c => `
            <li onclick="AuthorApp.openChapter(${c.chapter_number})" style="padding:8px 12px; cursor:pointer; border-radius:6px; margin-bottom:2px; font-size:14px; transition:all 0.2s;" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background='transparent'">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span>Chương ${c.chapter_number}: ${c.title}</span>
                    <span style="font-size:10px; opacity:0.6;">${c.word_count} từ</span>
                </div>
            </li>
        `).join('');
    },

    showProjectList() {
        this.state.activeProject = null;
        document.querySelector('.author-project-list').classList.remove('hidden');
        document.getElementById('author-chapter-nav').classList.add('hidden');
        this.loadProjects();
    },

    openChapter(chapterNumber) {
        const project = this.state.activeProject;
        if (!project) return;

        const chapter = project.chapters.find(c => c.chapter_number === chapterNumber);
        if (!chapter) return;

        this.state.activeChapter = chapter;
        const editor = document.getElementById('author-editor');
        
        // Show the best available content
        const content = chapter.final_content || chapter.edited_content || chapter.enriched_content || chapter.content || "Chương này chưa có nội dung.";
        
        editor.innerHTML = `<h1>${chapter.title}</h1><div>${this.formatContent(content)}</div>`;
        
        // Highlight active chapter in list
        document.querySelectorAll('#chapter-list li').forEach((li, idx) => {
            li.style.background = (idx + 1 === chapterNumber) ? 'var(--accent-light)' : 'transparent';
            li.style.color = (idx + 1 === chapterNumber) ? 'var(--accent-primary)' : 'inherit';
        });
    },

    formatContent(text) {
        if (!text) return "";
        return text.split('\n').map(p => p.trim() ? `<p>${p}</p>` : "").join('');
    },

    async triggerAIPropose() {
        if (!this.state.activeProject || !this.state.activeChapter) {
            alert("Hãy chọn một chương để AI viết tiếp!");
            return;
        }

        const btn = document.getElementById('btn-ai-propose');
        const editor = document.getElementById('author-editor');
        const currentContent = editor.innerText;

        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Đang suy nghĩ...';
        if (typeof lucide !== 'undefined') lucide.createIcons();

        try {
            // Note: v2 architecture uses full pipeline, but we can call a rewrite/propose endpoint if available
            // For now, we'll simulate by calling the general rewrite API
            const response = await fetch('/api/author/propose', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    context: currentContent.slice(-2000),
                    instruction: "Hãy viết tiếp nội dung chương này một cách tự nhiên và lôi cuốn.",
                    project_id: this.state.activeProject.id
                })
            });

            if (!response.ok) throw new Error('AI không thể phản hồi lúc này');
            
            const data = await response.json();
            const suggestion = data.variations[0].text;
            
            // Append suggestion to editor
            editor.innerHTML += `<div>${this.formatContent(suggestion)}</div>`;
            
            this.addChatMessage("AI", "Tôi đã viết thêm một đoạn nội dung mới vào cuối chương.");
        } catch (error) {
            this.addChatMessage("Hệ thống", `Lỗi: ${error.message}`);
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i data-lucide="sparkles"></i> AI Viết tiếp';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    },

    handleInfoChat() {
        const input = document.getElementById('ai-chat-input');
        const text = input.value.trim();
        if (!text) return;

        this.addChatMessage("Bạn", text);
        input.value = '';

        // Simulate AI response for chat (can be wired to /api/author/brainstorm)
        setTimeout(() => {
            this.addChatMessage("AI", "Tôi đã ghi nhận ý kiến của bạn. Tôi có thể giúp bạn triển khai ý tưởng này vào chương tiếp theo.");
        }, 1000);
    },

    addChatMessage(sender, text) {
        const container = document.getElementById('ai-chat-messages');
        if (!container) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ${sender === 'AI' ? 'system' : ''}`;
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }
};

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    AuthorApp.init();
});
