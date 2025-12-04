document.addEventListener('DOMContentLoaded', function(){
    // Elements
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const postsEl = document.getElementById('posts');
    const loading = document.getElementById('loading');
    const composer = document.getElementById('composer');
    const postBtn = document.getElementById('postBtn');

    // helper to apply theme classes (used by radios elsewhere)
    function applyTheme(name){
        document.documentElement.classList.remove('theme-eyecare','theme-light','theme-dark');
        document.documentElement.classList.add('theme-' + (name || 'eyecare'));
    }

    // Ensure global ThemeManager (from theme.js) is synchronized with this page
    if(window.themeManager && typeof window.themeManager.updateThemeToggleIcon === 'function'){
        // Update the header theme button icon to match current theme
        window.themeManager.updateThemeToggleIcon();
    }

    // Collapse behavior: toggle compact sidebar
    if(collapseBtn && sidebar){
        collapseBtn.addEventListener('click', ()=>{
            sidebar.classList.toggle('collapsed');
        });
    }

    // Header hamburger: on small screens toggle `.open` to show sidebar
    if(sidebarToggle && sidebar){
        sidebarToggle.setAttribute('aria-expanded', 'false');
        sidebarToggle.addEventListener('click', ()=>{
            const isOpen = sidebar.classList.toggle('open');
            sidebarToggle.setAttribute('aria-expanded', String(isOpen));
            if(isOpen) sidebar.classList.remove('hidden');
        });
    }

    // Header menu (top-right) toggle
    const headerMenuBtn = document.getElementById('headerMenuBtn');
    const headerMenu = document.getElementById('headerMenu');
    if(headerMenuBtn && headerMenu){
        headerMenuBtn.addEventListener('click', (e)=>{
            const isOpen = headerMenu.classList.toggle('open');
            headerMenuBtn.setAttribute('aria-expanded', String(isOpen));
            headerMenu.setAttribute('aria-hidden', String(!isOpen));
        });

        // close on outside click
        document.addEventListener('click', (e)=>{
            if(!headerMenu.contains(e.target) && !headerMenuBtn.contains(e.target)){
                if(headerMenu.classList.contains('open')){
                    headerMenu.classList.remove('open');
                    headerMenuBtn.setAttribute('aria-expanded','false');
                    headerMenu.setAttribute('aria-hidden','true');
                }
            }
        });

        // close on Esc
        document.addEventListener('keydown', (e)=>{
            if(e.key === 'Escape'){
                if(headerMenu.classList.contains('open')){
                    headerMenu.classList.remove('open');
                    headerMenuBtn.setAttribute('aria-expanded','false');
                    headerMenu.setAttribute('aria-hidden','true');
                }
            }
        });
    }

    // Close button inside sidebar
    if(closeSidebar && sidebar){
        closeSidebar.addEventListener('click', ()=>{
            sidebar.classList.remove('open');
            sidebar.classList.add('hidden');
            if(sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'false');
        });
    }

    // Infinite scroll placeholder
    let loadingPosts = false;
    window.addEventListener('scroll', ()=>{
        if(loadingPosts) return;
        const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 240;
        if(nearBottom){
            loadingPosts = true;
            if(loading) loading.style.display = 'block';
            setTimeout(()=>{
                appendDummyPost();
                if(loading) loading.style.display = 'none';
                loadingPosts = false;
            }, 800);
        }
    });

    function appendDummyPost(){
        if(!postsEl) return;
        const a = document.createElement('article');
        a.className = 'post card fade-in';
        a.innerHTML = `
            <div class="post-header"><img src="assets/images/login.png" class="post-avatar" alt="User"><div><strong>Auto</strong><div class="muted small">Just now • Public</div></div></div>
            <div class="post-body">This is a newly loaded post. Infinite scroll placeholder.</div>
            <div class="post-actions"><button class="btn-link">Like</button><button class="btn-link">Comment</button><button class="btn-link">Share</button></div>
        `;
        postsEl.appendChild(a);
    }

    // Composer post
    if(postBtn && composer){
        postBtn.addEventListener('click', ()=>{
            const text = composer.value.trim();
            if(!text) return;
            const el = document.createElement('article');
            el.className = 'post card fade-in';
            el.innerHTML = `<div class="post-header"><img src="assets/images/login.png" class="post-avatar" alt="You"><div><strong>You</strong><div class="muted small">Just now • Friends</div></div></div><div class="post-body">${escapeHtml(text)}</div><div class="post-actions"><button class="btn-link">Like</button><button class="btn-link">Comment</button><button class="btn-link">Share</button></div>`;
            postsEl.insertBefore(el, postsEl.firstChild);
            composer.value = '';
        });
    }

    // Small utilities
    function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

});
