'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. PARTICLE ENGINE & MAGIC WAND EFFECT
    // ==========================================
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    const colors = ['#F4A261', '#E76F51', '#2A9D8F', '#FFD166', '#FFFFFF', '#FF85A1'];
    
    function createParticle(x, y, isClick = false) {
        const particle = document.createElement('div');
        particle.className = 'magic-particle';
        
        const randShape = Math.random();
        if (randShape < 0.35) particle.classList.add('star');
        else if (randShape < 0.7) particle.classList.add('rift');
        else particle.classList.add('circle');
        
        const size = isClick ? Math.random() * 12 + 6 : Math.random() * 8 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        
        if (particle.classList.contains('circle')) {
            particle.style.boxShadow = `0 0 ${size}px ${color}`;
        } else if (particle.classList.contains('rift')) {
            particle.style.boxShadow = `0 0 ${size / 2}px ${color}`;
        }
        
        const angle = Math.random() * Math.PI * 2;
        const distance = isClick ? Math.random() * 80 + 30 : Math.random() * 40 + 10;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const rot = (Math.random() - 0.5) * 360;
        
        particle.style.setProperty('--dx', `${dx}px`);
        particle.style.setProperty('--dy', `${dy}px`);
        particle.style.setProperty('--rot', `${rot}deg`);
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }

    function createButtonSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'magic-particle';
        sparkle.classList.add(Math.random() < 0.6 ? 'star' : 'rift');
        
        const size = Math.random() * 7 + 5;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.backgroundColor = color;
        
        if (sparkle.classList.contains('rift')) {
            sparkle.style.boxShadow = `0 0 6px ${color}`;
        } else {
            sparkle.style.filter = `drop-shadow(0 0 4px ${color})`;
        }
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 35 + 15;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance - 8;
        const rot = (Math.random() - 0.5) * 360;
        
        sparkle.style.setProperty('--dx', `${dx}px`);
        sparkle.style.setProperty('--dy', `${dy}px`);
        sparkle.style.setProperty('--rot', `${rot}deg`);
        
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 800);
    }
    
    const sparkleTargets = document.querySelectorAll('.btn-utama, .read-more, .btn-kembali');
    sparkleTargets.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (!el.lastSparkleTime || now - el.lastSparkleTime > 30) {
                el.lastSparkleTime = now;
                createButtonSparkle(e.clientX, e.clientY);
                if (Math.random() < 0.4) {
                    createButtonSparkle(e.clientX + (Math.random() - 0.5) * 10, e.clientY + (Math.random() - 0.5) * 10);
                }
            }
        });
    });
    
    // OPTIMIZED: Touch Device Detection & Throttle
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouchDevice) {
        let ticking = false;
        document.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const now = Date.now();
                    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
                    const isHovering = e.target.closest('a, button, .article-card, .logo, .btn-utama, .read-more, .btn-kembali, .decor-polaroid');
                    
                    const threshold = isHovering ? 5 : 12;
                    const timeThreshold = isHovering ? 40 : 80;
                    
                    if (dist > threshold || (now - lastTime > timeThreshold)) {
                        createParticle(e.clientX, e.clientY);
                        if (isHovering && Math.random() < 0.3) {
                            createParticle(e.clientX + (Math.random() - 0.5) * 15, e.clientY + (Math.random() - 0.5) * 15);
                        }
                        lastX = e.clientX;
                        lastY = e.clientY;
                        lastTime = now;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    document.addEventListener('mousedown', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'rift-ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 500);
        
        const particleCount = Math.floor(Math.random() * 3) + 4;
        for (let i = 0; i < particleCount; i++) {
            createParticle(e.clientX, e.clientY, true);
        }
    });

    // ==========================================
    // 2. LOGO INTERACTION & QUOTES
    // ==========================================
    const logo = document.querySelector('.logo');
    const quotes = [
        "\"Di bawah langit senja, memori kita akan selalu abadi...\"",
        "\"Sebuah ruang hangat untuk kenangan manis yang tak ingin terlupakan.\"",
        "\"Jangan biarkan kecemasan melipat impian-impian indahmu.\"",
        "\"Seperti riak air, memori kecil ini akan selalu menghangatkan hati.\"",
        "\"Menyelam ke dalam memori untuk menemukan kedamaian diri.\"",
        "\"Sudahkah kamu berdamai dengan masa lalumu hari ini?\""
    ];
    let bubbleTimeout = null;
    
    if (logo) {
        logo.addEventListener('click', (e) => {
            logo.classList.remove('logo-pop');
            void logo.offsetWidth; 
            logo.classList.add('logo-pop');
            setTimeout(() => logo.classList.remove('logo-pop'), 300);
            
            const rect = logo.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    createParticle(centerX + (Math.random() - 0.5) * 30, centerY + (Math.random() - 0.5) * 15);
                }, i * 40);
            }
            
            let bubble = document.querySelector('.logo-thought-bubble');
            if (!bubble) {
                bubble = document.createElement('div');
                bubble.className = 'logo-thought-bubble';
                logo.appendChild(bubble);
            }
            
            let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            if (bubble.innerText === randomQuote) {
                randomQuote = quotes[(quotes.indexOf(randomQuote) + 1) % quotes.length];
            }
            bubble.innerText = randomQuote;
            bubble.classList.add('show');
            
            clearTimeout(bubbleTimeout);
            bubbleTimeout = setTimeout(() => bubble.classList.remove('show'), 4000);
        });
    }

    // ==========================================
    // 3. CINEMATIC PAGE TRANSITIONS
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const isSpaceDive = urlParams.get('transition') === 'spacedive';
    const isFlashback = urlParams.get('transition') === 'flashback';

    const transOverlay = document.createElement('div');
    transOverlay.className = 'page-transition-overlay';
    if (isSpaceDive) transOverlay.classList.add('space-dive-style', 'fade-in-active');
    else if (isFlashback) transOverlay.classList.add('flashback-style');
    document.body.appendChild(transOverlay);
    
    setTimeout(() => {
        if (isSpaceDive) transOverlay.classList.remove('fade-in-active');
        transOverlay.classList.add('fade-out');
        setTimeout(() => { transOverlay.style.display = 'none'; }, isSpaceDive ? 600 : (isFlashback ? 500 : 350));
    }, 100);
    
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        const target = link.getAttribute('target');
        
        if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('http') && target !== '_blank') {
            e.preventDefault();
            
            const isSpaceDiveNav = href.includes('transition=spacedive') || link.classList.contains('btn-kembali');
            const isFlashbackNav = href.includes('transition=flashback');
            
            if (isSpaceDiveNav) transOverlay.className = 'page-transition-overlay space-dive-style';
            else if (isFlashbackNav) transOverlay.className = 'page-transition-overlay flashback-style';
            else transOverlay.className = 'page-transition-overlay';
            
            transOverlay.style.display = 'flex';
            setTimeout(() => {
                if (isSpaceDiveNav) transOverlay.classList.add('fade-in-active');
                transOverlay.classList.remove('fade-out');
                
                setTimeout(() => {
                    window.location.href = isSpaceDiveNav && !href.includes('transition=spacedive')
                        ? href + (href.includes('?') ? '&' : '?') + 'transition=spacedive'
                        : (isFlashbackNav && !href.includes('transition=flashback')
                            ? href + (href.includes('?') ? '&' : '?') + 'transition=flashback'
                            : href);
                }, isSpaceDiveNav ? 600 : (isFlashbackNav ? 500 : 350));
            }, 15);
        }
    });

    // ==========================================
    // 4. EASTER EGG: ADMIRAL THE CAT
    // ==========================================
    const retroCat = document.getElementById('retro-cat');
    if (retroCat) {
        let catClicks = 0;
        let clickTimeout, revertTimeout;
        
        retroCat.addEventListener('click', () => {
            clearTimeout(revertTimeout);
            catClicks++;
            
            const catEmoji = retroCat.querySelector('.cat-emoji');
            const catZzz = retroCat.querySelector('.cat-zzz');
            const catTooltip = retroCat.querySelector('.cat-tooltip');
            
            if (catEmoji) catEmoji.textContent = '😻';
            if (catZzz) catZzz.style.display = 'none';
            
            const heartCount = Math.floor(Math.random() * 2) + 2;
            const rect = retroCat.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;
            
            for (let i = 0; i < heartCount; i++) {
                const heart = document.createElement('div');
                heart.className = 'heart-particle';
                heart.textContent = '❤️';
                heart.style.left = `${startX}px`;
                heart.style.top = `${startY}px`;
                
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 40 + 20;
                const dx = Math.cos(angle) * distance;
                const dy = Math.sin(angle) * distance + 15;
                
                heart.style.setProperty('--dx', `${dx}px`);
                heart.style.setProperty('--dy', `${dy}px`);
                
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 1200);
            }
            
            clearTimeout(clickTimeout);
            clickTimeout = setTimeout(() => { catClicks = 0; }, 1000);
            
            if (catClicks >= 5 && catTooltip) catTooltip.classList.add('show');
            
            revertTimeout = setTimeout(() => {
                if (catEmoji) catEmoji.textContent = '🐈';
                if (catZzz) catZzz.style.display = 'block';
                if (catTooltip) catTooltip.classList.remove('show');
                catClicks = 0;
            }, 2000);
        });
    }

    // ==========================================
    // 5. BACK TO TOP BUTTON
    // ==========================================
    const btnTop = document.getElementById('btn-top');
    if (btnTop) {
        window.addEventListener('scroll', () => {
            btnTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
        }, { passive: true });
        
        btnTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 6. JURNAL POLAROID MODAL (ZOOM)
    // ==========================================
    const charModal = document.getElementById('char-modal');
    const polaroids = document.querySelectorAll('.decor-polaroid');
    
    // SAFETY CHECK: Only run if elements exist on the page
    if (charModal && polaroids.length > 0) {
        const modalPhoto    = document.getElementById('modal-photo');
        const modalCaption  = document.getElementById('modal-caption');
        const modalDesc     = document.getElementById('modal-desc');
        const modalCard     = document.getElementById('char-modal-card');

        polaroids.forEach(polaroid => {
            polaroid.addEventListener('click', function (e) {
                e.stopPropagation();

                const photoEl   = this.querySelector('.photo-img');
                const captionEl = this.querySelector('.caption');
                const descEl    = this.querySelector('.character-desc p');

                if (!photoEl) return;

                const bgImg = window.getComputedStyle(photoEl).getPropertyValue('background-image');
                modalPhoto.style.backgroundImage   = bgImg;
                modalPhoto.style.backgroundSize    = 'cover';
                modalPhoto.style.backgroundPosition = 'center';

                modalCaption.textContent = captionEl ? captionEl.textContent : '';
                modalDesc.textContent    = descEl    ? descEl.textContent    : '';

                // Reset animations
                modalDesc.style.transition = 'none';
                modalDesc.style.opacity    = '0';
                modalDesc.style.transform  = 'translateY(6px)';

                modalCard.style.transition = 'none';
                modalCard.style.transform  = 'scale(0.7) translateY(20px)';
                modalCard.style.opacity    = '0';

                // Activate overlay
                charModal.classList.add('active');
                document.body.style.overflow = 'hidden';

                // Re-enable transitions
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        modalCard.style.transition = '';
                        modalCard.style.transform  = '';
                        modalCard.style.opacity    = '';

                        modalDesc.style.transition = '';
                        modalDesc.style.opacity    = ''; 
                        modalDesc.style.transform  = ''; 
                    });
                });
            });
        });

        charModal.addEventListener('click', function () {
            this.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        modalCard.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                charModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});