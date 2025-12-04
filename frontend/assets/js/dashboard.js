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

    // Welcome card personalization: set greeting and last-visit
    (function(){
        const greetingEl = document.getElementById('welcomeGreeting');
        const lastVisitEl = document.getElementById('welcomeLastVisit');
        const viewBtn = document.getElementById('viewHighlightsBtn');
        try{
            if(greetingEl){
                // try to read profile name if present
                const profileNameEl = document.querySelector('.profile-name');
                let name = 'there';
                if(profileNameEl){
                    const txt = profileNameEl.textContent.trim().split(/\s+/)[0];
                    if(txt) name = txt;
                }
                greetingEl.textContent = `Welcome back, ${name}!`;
            }

            if(lastVisitEl){
                const key = 'flux:lastVisit';
                const prev = localStorage.getItem(key);
                const now = Date.now();
                let msg = 'Nice to see you.';
                if(prev){
                    const diff = Math.floor((now - Number(prev)) / 1000);
                    if(diff < 60) msg = 'Last seen just now';
                    else if(diff < 3600) msg = `Last seen ${Math.floor(diff/60)}m ago`;
                    else if(diff < 86400) msg = `Last seen ${Math.floor(diff/3600)}h ago`;
                    else {
                        const d = new Date(Number(prev));
                        msg = `Last seen on ${d.toLocaleDateString()}`;
                    }
                }
                lastVisitEl.textContent = msg;
                localStorage.setItem(key, String(now));
            }

            if(viewBtn){
                viewBtn.addEventListener('click', ()=>{
                    // simple behavior: scroll to feed (if present)
                    const feed = document.querySelector('.feed');
                    if(feed) feed.scrollIntoView({behavior:'smooth'});
                });
            }
        }catch(e){ console.warn('Welcome card init error', e); }
    })();

    // Ensure global ThemeManager (from theme.js) is synchronized with this page
    if(window.themeManager && typeof window.themeManager.updateThemeToggleIcon === 'function'){
        // Update the header theme button icon to match current theme
        window.themeManager.updateThemeToggleIcon();
    }

    // Persisted sidebar state keys
    const SIDEBAR_COLLAPSED_KEY = 'flux:sidebar:collapsed';
    const SIDEBAR_OPEN_KEY = 'flux:sidebar:open';

    // Collapse behavior: toggle compact sidebar (persisted)
    if(collapseBtn && sidebar){
        // restore collapsed state
        try{
            const collapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
            if(collapsed === 'true') sidebar.classList.add('collapsed');
            if(collapseBtn) collapseBtn.setAttribute('aria-pressed', String(sidebar.classList.contains('collapsed')));
        }catch(e){/* ignore storage errors */}

        collapseBtn.addEventListener('click', ()=>{
            const isCollapsed = sidebar.classList.toggle('collapsed');
            try{ localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed)); }catch(e){}
            collapseBtn.setAttribute('aria-pressed', String(isCollapsed));
        });
    }

    // Header hamburger: on small screens toggle `.open` to show sidebar (persisted)
    if(sidebarToggle && sidebar){
        // restore open state
        try{
            const open = localStorage.getItem(SIDEBAR_OPEN_KEY);
            const isOpen = open === 'true';
            if(isOpen) sidebar.classList.add('open');
            sidebarToggle.setAttribute('aria-expanded', String(isOpen));
            if(isOpen) sidebar.classList.remove('hidden');
        }catch(e){}

        sidebarToggle.setAttribute('aria-expanded', 'false');
        sidebarToggle.addEventListener('click', ()=>{
            const isOpen = sidebar.classList.toggle('open');
            sidebarToggle.setAttribute('aria-expanded', String(isOpen));
            try{ localStorage.setItem(SIDEBAR_OPEN_KEY, String(isOpen)); }catch(e){}
            if(isOpen) sidebar.classList.remove('hidden');
        });
    }

    // Header menu (top-right) toggle with improved accessibility
    const headerMenuBtn = document.getElementById('headerMenuBtn');
    const headerMenu = document.getElementById('headerMenu');
    if(headerMenuBtn && headerMenu){
        // Ensure menu items are focusable
        const menuItems = Array.from(headerMenu.querySelectorAll('.menu-item'));
        menuItems.forEach(mi => mi.setAttribute('tabindex', '0'));

        let focusIndex = -1;
        function openHeaderMenu(){
            headerMenu.classList.add('open');
            headerMenuBtn.setAttribute('aria-expanded','true');
            headerMenu.setAttribute('aria-hidden','false');
            // focus first item
            focusIndex = 0;
            if(menuItems[0]) menuItems[0].focus();
            document.addEventListener('keydown', headerMenuKeyHandler);
        }

        function closeHeaderMenu(){
            headerMenu.classList.remove('open');
            headerMenuBtn.setAttribute('aria-expanded','false');
            headerMenu.setAttribute('aria-hidden','true');
            headerMenuBtn.focus();
            focusIndex = -1;
            document.removeEventListener('keydown', headerMenuKeyHandler);
        }

        headerMenuBtn.addEventListener('click', (e)=>{
            const isOpen = headerMenu.classList.contains('open');
            if(isOpen) closeHeaderMenu(); else openHeaderMenu();
        });

        // close on outside click (but ignore clicks inside menu)
        document.addEventListener('click', (e)=>{
            if(!headerMenu.contains(e.target) && !headerMenuBtn.contains(e.target)){
                if(headerMenu.classList.contains('open')) closeHeaderMenu();
            }
        });

        // keyboard navigation within menu
        function headerMenuKeyHandler(e){
            const max = menuItems.length - 1;
            if(e.key === 'Escape'){
                closeHeaderMenu();
                return;
            }
            if(e.key === 'ArrowDown'){
                e.preventDefault();
                focusIndex = Math.min(max, focusIndex + 1);
                menuItems[focusIndex].focus();
                return;
            }
            if(e.key === 'ArrowUp'){
                e.preventDefault();
                focusIndex = Math.max(0, focusIndex - 1);
                menuItems[focusIndex].focus();
                return;
            }
            if(e.key === 'Home'){
                e.preventDefault(); focusIndex = 0; menuItems[0].focus(); return;
            }
            if(e.key === 'End'){
                e.preventDefault(); focusIndex = max; menuItems[max].focus(); return;
            }
            if(e.key === 'Tab'){
                // allow tab to close the menu and proceed
                closeHeaderMenu();
            }
        }

        // Also close when a menu item is activated
        menuItems.forEach(mi => mi.addEventListener('click', ()=>{ closeHeaderMenu(); }));
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

    // Composer autosave + character count
    (function(){
        const COMPOSER_KEY = 'flux:composer:draft';
        const MAX_CHARS = 280;
        if(!composer) return;

        // create a small controls container if not present
        let controls = document.querySelector('.composer-controls');
        if(!controls){
            controls = document.createElement('div');
            controls.className = 'composer-controls';
            const count = document.createElement('div');
            count.className = 'char-count';
            count.id = 'composerCount';
            const holder = composer.parentNode;
            if(holder) holder.appendChild(controls);
            controls.appendChild(count);
        }

        const countEl = document.getElementById('composerCount');
        let saveTimer = null;

        function updateCharCount(){
            if(!countEl) return;
            const len = (composer.value || '').length;
            const rem = MAX_CHARS - len;
            countEl.textContent = `${rem} characters left`;
            countEl.classList.remove('warning','exceeded');
            if(rem < 0) countEl.classList.add('exceeded');
            else if(rem < 30) countEl.classList.add('warning');
        }

        // restore draft
        try{
            const draft = localStorage.getItem(COMPOSER_KEY);
            if(draft) composer.value = draft;
        }catch(e){}
        updateCharCount();

        composer.addEventListener('input', ()=>{
            updateCharCount();
            if(saveTimer) clearTimeout(saveTimer);
            saveTimer = setTimeout(()=>{
                try{ localStorage.setItem(COMPOSER_KEY, composer.value); }catch(e){}
            }, 700);
        });

        // keyboard shortcut: Ctrl/Cmd + Enter to post
        composer.addEventListener('keydown', (e)=>{
            if((e.ctrlKey || e.metaKey) && e.key === 'Enter'){
                if(postBtn) postBtn.click();
            }
        });

        // clear draft on successful post
        if(postBtn){
            postBtn.addEventListener('click', ()=>{
                try{ localStorage.removeItem(COMPOSER_KEY); }catch(e){}
                updateCharCount();
            });
        }
    })();

    // Small utilities
    function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

});
