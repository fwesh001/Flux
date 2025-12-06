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
        const welcomeCard = document.getElementById('welcomeCard');
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
            // hide welcome card after 60 seconds with fade
            try{
                if(welcomeCard){
                    setTimeout(()=>{
                        welcomeCard.classList.add('hidden');
                    }, 60000);
                }
            }catch(e){}
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

    // Allow clicking the profile area to toggle collapse (desktop UX)
    try{
        const profileArea = sidebar ? sidebar.querySelector('.profile') : null;
        if(profileArea && collapseBtn){
            profileArea.style.cursor = 'pointer';
            profileArea.addEventListener('click', (e)=>{
                // ignore clicks on the explicit collapse button itself
                if(e.target && (e.target.id === 'collapseBtn' || e.target.closest && e.target.closest('#collapseBtn'))) return;
                const isCollapsed = sidebar.classList.toggle('collapsed');
                try{ localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed)); }catch(e){}
                if(collapseBtn) collapseBtn.setAttribute('aria-pressed', String(isCollapsed));
            });
        }
    }catch(e){/* ignore */}

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
        a.className = 'post card feed-card fade-in';
        a.innerHTML = `
            <div class="corner-avatar" aria-hidden="true"><div class="avatar-circle"></div></div>
            <div class="feed-body">
                <div class="feed-content">This is a newly loaded post. Infinite scroll placeholder.</div>
                <div class="feed-meta">
                    <div class="meta-left"><button class="btn-link">Like</button> <button class="btn-link">views</button></div>
                    <div class="meta-right muted">● ● ● ● ● ● ● ●</div>
                </div>
            </div>
        `;
        postsEl.appendChild(a);
    }

    // Composer post
    if(postBtn && composer){
        postBtn.addEventListener('click', ()=>{
            const text = composer.value.trim();
            const attachments = composer._attachments || [];
            // require either text or at least one attachment
            if(!text && (!attachments || attachments.length === 0)) return;

            const el = document.createElement('article');
            el.className = 'post card feed-card fade-in';
            el.innerHTML = `
                <div class="corner-avatar" aria-hidden="true"><div class="avatar-circle"></div></div>
                <div class="feed-body">
                    <div class="feed-content">
                        <div class="feed-text"></div>
                        <div class="feed-attachments" aria-live="polite"></div>
                    </div>
                    <div class="feed-meta">
                        <div class="meta-left"><button class="btn-link">Like</button> <button class="btn-link">views</button></div>
                        <div class="meta-right muted">● ● ● ● ● ● ● ●</div>
                    </div>
                </div>
            `;

            const textEl = el.querySelector('.feed-text');
            const attachEl = el.querySelector('.feed-attachments');

            if(textEl && text) {
                const p = document.createElement('div');
                p.textContent = text;
                p.className = 'feed-text-content';
                textEl.appendChild(p);
            }

            // render attachments into separate container
            (attachments || []).forEach((f)=>{
                try{
                    if(f.type && f.type.startsWith('image/')){
                        const wrapper = document.createElement('div');
                        wrapper.className = 'feed-attachment-item';
                        const img = document.createElement('img');
                        const url = URL.createObjectURL(f);
                        img.src = url;
                        img.alt = f.name || 'image';
                        img.addEventListener('load', ()=>{ URL.revokeObjectURL(url); });
                        wrapper.appendChild(img);
                        attachEl.appendChild(wrapper);
                    } else {
                        const a = document.createElement('a');
                        a.className = 'attachment';
                        const url = URL.createObjectURL(f);
                        a.href = url;
                        a.textContent = f.name || 'attachment';
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                        attachEl.appendChild(a);
                    }
                }catch(e){ console.warn('attachment render error', e); }
            });

            // insert at top of posts
            postsEl.insertBefore(el, postsEl.firstChild);

            // clear composer and attachments
            composer.value = '';
            if(typeof composer.clearAttachments === 'function') composer.clearAttachments();
        });
    }

    // Composer autosave + attachment handling (no visible character count)
    (function(){
        const COMPOSER_KEY = 'flux:composer:draft';
        if(!composer) return;

        // restore draft
        try{
            const draft = localStorage.getItem(COMPOSER_KEY);
            if(draft) composer.value = draft;
        }catch(e){}

        let saveTimer = null;
        composer.addEventListener('input', ()=>{
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
            });
        }

        // Attachment handling
        const fileInput = document.getElementById('composerFiles');
        const preview = document.getElementById('composerPreview');
        let attachments = [];

        function clearPreview(){
            // clear in-place so external reference (composer._attachments) stays valid
            attachments.length = 0;
            if(preview) preview.innerHTML = '';
            if(fileInput) fileInput.value = '';
            // ensure external reference points to same array
            composer._attachments = attachments;
        }

        if(fileInput){
            fileInput.addEventListener('change', (e)=>{
                const files = Array.from(e.target.files || []);
                files.forEach(f => attachments.push(f));
                renderPreviews();
            });
        }

        function renderPreviews(){
            if(!preview) return;
            preview.innerHTML = '';
            attachments.forEach((f, idx) => {
                const item = document.createElement('div');
                item.className = 'composer-attachment';
                item.style.minWidth = '64px';
                item.style.maxWidth = '180px';
                item.style.border = '1px solid var(--color-border)';
                item.style.borderRadius = '8px';
                item.style.padding = '6px';
                item.style.background = 'var(--color-bg)';
                item.style.display = 'flex';
                item.style.flexDirection = 'column';
                item.style.alignItems = 'center';
                item.style.gap = '6px';

                const name = document.createElement('div');
                name.textContent = f.name;
                name.style.fontSize = '0.8rem';
                name.style.color = 'var(--color-text-secondary)';

                if(f.type.startsWith('image/')){
                    const img = document.createElement('img');
                    img.style.maxWidth = '160px';
                    img.style.maxHeight = '120px';
                    img.style.objectFit = 'cover';
                    img.alt = f.name;
                    const reader = new FileReader();
                    reader.onload = (ev)=>{ img.src = ev.target.result; }
                    reader.readAsDataURL(f);
                    item.appendChild(img);
                }else{
                    const icon = document.createElement('div');
                    icon.textContent = f.type.split('/')[0];
                    icon.style.fontSize = '0.85rem';
                    icon.style.color = 'var(--color-text-tertiary)';
                    item.appendChild(icon);
                }

                const removeBtn = document.createElement('button');
                removeBtn.className = 'btn-icon';
                removeBtn.textContent = '✕';
                removeBtn.title = 'Remove attachment';
                removeBtn.addEventListener('click', ()=>{
                    attachments.splice(idx,1);
                    renderPreviews();
                });

                item.appendChild(name);
                item.appendChild(removeBtn);
                preview.appendChild(item);
            });
        }

        // Expose attachments array to outer scope by closing over it
        composer._attachments = attachments;
        composer.clearAttachments = clearPreview;
    })();

    // Lightbox / full-size image viewer
    function createLightboxElements(){
        if(document.getElementById('lightboxOverlay')) return document.getElementById('lightboxOverlay');
        const overlay = document.createElement('div');
        overlay.id = 'lightboxOverlay';
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `<div class="lightbox-inner"><button class="lightbox-close" aria-label="Close">✕</button><img class="lightbox-img" alt="Preview"/><div class="lightbox-caption muted"></div></div>`;
        document.body.appendChild(overlay);

        const closeBtn = overlay.querySelector('.lightbox-close');
        function closeHandler(e){
            overlay.classList.remove('open');
        }

        overlay.addEventListener('click', (e)=>{
            if(e.target === overlay || e.target === closeBtn) closeHandler();
        });

        // close on escape
        function escHandler(e){ if(e.key === 'Escape') closeHandler(); }
        document.addEventListener('keydown', escHandler);

        return overlay;
    }

    function openLightbox(src, caption){
        const overlay = createLightboxElements();
        if(!overlay) return;
        const img = overlay.querySelector('.lightbox-img');
        const cap = overlay.querySelector('.lightbox-caption');
        img.src = src;
        cap.textContent = caption || '';
        overlay.classList.add('open');
    }

    // delegate click on post images to open lightbox
    if(postsEl){
        postsEl.addEventListener('click', (e)=>{
            try{
                const clicked = e.target;
                const img = clicked.closest ? clicked.closest('.feed-attachment-item img, .feed-content img') : null;
                if(img){
                    openLightbox(img.src, img.alt || '');
                }
            }catch(err){ /* ignore */ }
        });
    }

    // Small utilities
    function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

});
