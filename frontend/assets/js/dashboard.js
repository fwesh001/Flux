document.addEventListener('DOMContentLoaded', function(){
    // Elements
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    const postsEl = document.getElementById('posts');
    const loading = document.getElementById('loading');
    const chatPreview = document.getElementById('chatPreview');

    // Collapse sidebar
    if(collapseBtn){
        collapseBtn.addEventListener('click', ()=>{
            if(sidebar.style.width === '64px'){
                sidebar.style.width = '';
                sidebar.querySelectorAll('span').forEach(s=>s.style.display='');
            } else {
                sidebar.style.width = '64px';
                sidebar.querySelectorAll('span').forEach(s=>s.style.display='none');
            }
        });
    }

    // Theme switching (eyecare, light, dark)
    themeRadios.forEach(r=>r.addEventListener('change', e=>applyTheme(e.target.value)));
    function applyTheme(name){
        document.documentElement.classList.remove('theme-eyecare','theme-light','theme-dark');
        document.documentElement.classList.add('theme-' + (name || 'eyecare'));
    }

    // Simple infinite scroll: append placeholder posts when near bottom
    let loadingPosts = false;
    window.addEventListener('scroll', ()=>{
        if(loadingPosts) return;
        const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 240;
        if(nearBottom){
            loadingPosts = true;
            loading.style.display = 'block';
            setTimeout(()=>{
                appendDummyPost();
                loading.style.display = 'none';
                loadingPosts = false;
            }, 900);
        }
    });

    function appendDummyPost(){
        const a = document.createElement('article');
        a.className = 'post card fade-in';
        a.innerHTML = `
            <div class="post-header"><img src="assets/images/login.png" class="post-avatar" alt="User"><div><strong>Auto</strong><div class="muted small">Just now • Public</div></div></div>
            <div class="post-body">This is a newly loaded post. Infinite scroll placeholder.</div>
            <div class="post-actions"><button class="btn-link">Like</button><button class="btn-link">Comment</button><button class="btn-link">Share</button></div>
        `;
        postsEl.appendChild(a);
    }

    // Composer quick actions
    const composer = document.getElementById('composer');
    const postBtn = document.getElementById('postBtn');
    if(postBtn){
        postBtn.addEventListener('click', ()=>{
            const text = composer.value.trim();
            if(!text) return; // no empty posts
            const el = document.createElement('article');
            el.className = 'post card fade-in';
            el.innerHTML = `<div class="post-header"><img src="assets/images/login.png" class="post-avatar" alt="You"><div><strong>You</strong><div class="muted small">Just now • Friends</div></div></div><div class="post-body">${escapeHtml(text)}</div><div class="post-actions"><button class="btn-link">Like</button><button class="btn-link">Comment</button><button class="btn-link">Share</button></div>`;
            postsEl.insertBefore(el, postsEl.firstChild);
            composer.value = '';
        });
    }

    // Chat preview click behavior
    if(chatPreview){
        chatPreview.querySelectorAll('li').forEach(li=>{
            li.addEventListener('click', ()=>{
                alert('Open chat with ' + (li.querySelector('strong')?.innerText || 'User'));
            });
        });
    }

    // small helpers
    function escapeHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
});
