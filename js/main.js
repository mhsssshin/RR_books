/**
 * rorongBooks Dashboard Script
 * Handles profile management, dynamic book loading, categories, mascot interactions, and wave canvas effects.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Ensure Audio Context initialization on first interaction
  document.body.addEventListener('click', () => {
    RorongAudio.initContext();
  }, { once: true });

  // 1. Touch Ripple Wave Animation
  const createRipple = (e) => {
    const target = e.target;
    // Don't draw ripple on text inputs
    if (target.tagName === 'INPUT') return;

    const ripple = document.createElement('div');
    ripple.className = 'wave-ripple';
    document.body.appendChild(ripple);

    // Get position
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);

    if (x === undefined || y === undefined) return;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    // Audio click feedback
    RorongAudio.playBubble();

    setTimeout(() => {
      ripple.remove();
    }, 500);
  };

  window.addEventListener('click', createRipple);
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      createRipple(e);
    }
  }, { passive: true });

  // 2. Profile Personalization Management
  const modalOverlay = document.getElementById('profile-modal');
  const nameInput = document.getElementById('name-input');
  const colorOptions = document.querySelectorAll('.color-option');
  const genderOptions = document.querySelectorAll('.gender-option');
  const languageOptions = document.querySelectorAll('.language-option');
  const submitProfileBtn = document.getElementById('submit-profile-btn');
  const profileCard = document.getElementById('profile-card');
  const greetingEl = document.getElementById('profile-greeting');
  const avatarEl = document.querySelector('.profile-avatar');
  
  let tempFavColor = 'pink';
  let tempGender = 'girl';
  let tempLanguage = 'ko';

  // Apply visual theme to dashboard background
  const applyTheme = (color) => {
    if (color === 'pink') {
      document.body.style.background = 'var(--bg-pink)';
    } else if (color === 'lavender') {
      document.body.style.background = 'var(--bg-lavender)';
    } else if (color === 'mint') {
      document.body.style.background = 'var(--bg-mint)';
    } else if (color === 'gold') {
      document.body.style.background = 'var(--bg-gold)';
    }
  };

  // Helper to determine natural Korean particle or English possessive bookshelf greeting
  const getGreetingText = (name, lang = 'ko') => {
    if (!name) return lang === 'en' ? "My Bookshelf" : '우리 아이의 책방';
    if (lang === 'en') {
      return `${name}'s Bookshelf`;
    }
    const lastChar = name.charAt(name.length - 1);
    const charCode = lastChar.charCodeAt(0);
    const hasPadchim = (charCode >= 0xAC00 && charCode <= 0xD7A3) && ((charCode - 0xAC00) % 28 > 0);
    return `${name}${hasPadchim ? '이' : ''}의 책방`;
  };

  // Localize dashboard labels based on language
  const applyDashboardLanguage = (lang = 'ko') => {
    const isEn = lang === 'en';
    
    // Header labels
    const taglineEl = document.querySelector('.profile-tagline');
    if (taglineEl) taglineEl.textContent = isEn ? '🎨 Edit Profile' : '🎨 프로필 설정하기';

    // Tabs
    const tabCreativeGirl = document.getElementById('tab-creative-girl');
    const tabCreativeBoy = document.getElementById('tab-creative-boy');
    const tabClassic = document.getElementById('tab-classic');

    if (tabCreativeGirl) tabCreativeGirl.innerHTML = `<span>👧</span> ${isEn ? 'Creative (Girl)' : '창작 동화 (여아)'}`;
    if (tabCreativeBoy) tabCreativeBoy.innerHTML = `<span>👦</span> ${isEn ? 'Creative (Boy)' : '창작 동화 (남아)'}`;
    if (tabClassic) tabClassic.innerHTML = `<span>📖</span> ${isEn ? 'Classic' : '유명 명작 동화'}`;

    // Modal UI Labels
    const modalTitle = document.querySelector('.modal-title');
    const modalSubtitle = document.querySelector('.modal-subtitle');
    const labelName = document.querySelector('label[for="name-input"]');
    const labelGender = document.querySelector('.form-group:nth-of-type(2) .form-label');
    const labelLang = document.getElementById('label-language');
    const labelColor = document.querySelector('.form-group:nth-of-type(4) .form-label');

    if (modalTitle) modalTitle.textContent = isEn ? 'Welcome! Set Profile 💖' : '반가워! 프로필 만들기 💖';
    if (modalSubtitle) modalSubtitle.textContent = isEn ? 'Choose name and color to customize your bookshelf!' : '이름과 좋아하는 색상을 고르면 책방이 바뀐단다!';
    if (labelName) labelName.textContent = isEn ? 'Child Name' : '아이 이름';
    if (labelGender) labelGender.textContent = isEn ? 'Child Gender' : '우리 아이 성별';
    if (labelLang) labelLang.textContent = isEn ? 'Language' : '읽기 언어 (Language)';
    if (labelColor) labelColor.textContent = isEn ? 'Favorite Color' : '좋아하는 색상';
    if (nameInput) nameInput.placeholder = isEn ? "Enter name! (e.g. Roa)" : "이름을 알려줘! (예: 민지)";

    // Modal Options Label Text
    const optionGirl = document.querySelector('.gender-option[data-gender="girl"]');
    const optionBoy = document.querySelector('.gender-option[data-gender="boy"]');
    if (optionGirl) optionGirl.textContent = isEn ? '👧 Girl' : '👧 여자아이';
    if (optionBoy) optionBoy.textContent = isEn ? '👦 Boy' : '👦 남자아이';

    const optionPink = document.querySelector('.color-option[data-color="pink"]');
    const optionLavender = document.querySelector('.color-option[data-color="lavender"]');
    const optionMint = document.querySelector('.color-option[data-color="mint"]');
    const optionGold = document.querySelector('.color-option[data-color="gold"]');
    if (optionPink) optionPink.textContent = isEn ? 'Pink' : '분홍색';
    if (optionLavender) optionLavender.textContent = isEn ? 'Purple' : '보라색';
    if (optionMint) optionMint.textContent = isEn ? 'Mint' : '민트색';
    if (optionGold) optionGold.textContent = isEn ? 'Yellow' : '노란색';

    if (submitProfileBtn) submitProfileBtn.textContent = isEn ? 'Enter Bookshelf ⭐' : '책방 입장하기 ⭐';
  };

  // Load existing profile or show modal
  const checkProfile = () => {
    const savedName = localStorage.getItem('rorong_child_name');
    const savedColor = localStorage.getItem('rorong_fav_color');
    const savedGender = localStorage.getItem('rorong_gender') || 'girl';
    const savedLang = localStorage.getItem('rorong_language') || 'ko';

    if (!savedName || !savedColor) {
      // First time user -> Show Profile Setup Modal
      modalOverlay.classList.add('active');
    } else {
      greetingEl.textContent = getGreetingText(savedName, savedLang);
      applyTheme(savedColor);
      avatarEl.textContent = savedGender === 'boy' ? '👦' : '👧';
      applyDashboardLanguage(savedLang);
      
      // Auto switch default tab based on gender
      activeCategory = savedGender === 'boy' ? 'creative-boy' : 'creative-girl';
      updateTabUI();
    }
  };

  // Profile Modal Language Option Click
  languageOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      RorongAudio.playBubble();
      languageOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      tempLanguage = opt.getAttribute('data-lang');
      applyDashboardLanguage(tempLanguage);
    });
  });

  // Profile Modal Gender Option Click
  genderOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      RorongAudio.playBubble();
      genderOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      tempGender = opt.getAttribute('data-gender');
      
      // Auto name suggestion & default color recommendation
      const currentName = nameInput.value.trim();
      const isEn = tempLanguage === 'en';
      if (tempGender === 'boy') {
        if (!currentName || currentName === '민지' || currentName === '로아' || currentName === 'Roa' || currentName === 'Minji') {
          nameInput.value = isEn ? 'Roy' : '로이';
        }
        // Switch recommended color to mint/gold
        colorOptions.forEach(o => o.classList.remove('selected'));
        const mintOption = document.querySelector('.color-option[data-color="mint"]');
        if (mintOption) {
          mintOption.classList.add('selected');
          tempFavColor = 'mint';
        }
      } else {
        if (!currentName || currentName === '로이' || currentName === '민수' || currentName === 'Roy' || currentName === 'Minsu') {
          nameInput.value = isEn ? 'Roa' : '로아';
        }
        // Switch recommended color to pink/lavender
        colorOptions.forEach(o => o.classList.remove('selected'));
        const pinkOption = document.querySelector('.color-option[data-color="pink"]');
        if (pinkOption) {
          pinkOption.classList.add('selected');
          tempFavColor = 'pink';
        }
      }
    });
  });

  // Profile Modal Color Option Click
  colorOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      RorongAudio.playBubble();
      colorOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      tempFavColor = opt.getAttribute('data-color');
    });
  });

  // Submit Profile Setup
  submitProfileBtn.addEventListener('click', () => {
    const isEn = tempLanguage === 'en';
    const nameVal = nameInput.value.trim() || (tempGender === 'boy' ? (isEn ? 'Roy' : '로이') : (isEn ? 'Roa' : '로아'));
    
    localStorage.setItem('rorong_child_name', nameVal);
    localStorage.setItem('rorong_fav_color', tempFavColor);
    localStorage.setItem('rorong_gender', tempGender);
    localStorage.setItem('rorong_language', tempLanguage);

    RorongAudio.playChime();
    
    // Update Greeting, theme & avatar
    greetingEl.textContent = getGreetingText(nameVal, tempLanguage);
    applyTheme(tempFavColor);
    avatarEl.textContent = tempGender === 'boy' ? '👦' : '👧';
    applyDashboardLanguage(tempLanguage);

    // Close Modal
    modalOverlay.classList.remove('active');

    // Auto set tab based on saved gender
    activeCategory = tempGender === 'boy' ? 'creative-boy' : 'creative-girl';
    updateTabUI();
    renderBooks();

    // Trigger Mascot Jump
    triggerMascotJump(isEn ? 'Nice to meet you! Let\'s read books!' : '만나서 반가워! 책 고르자!');
  });

  // Click profile card to edit profile
  profileCard.addEventListener('click', () => {
    const currentName = localStorage.getItem('rorong_child_name') || '';
    const currentColor = localStorage.getItem('rorong_fav_color') || 'pink';
    const currentGender = localStorage.getItem('rorong_gender') || 'girl';
    const currentLang = localStorage.getItem('rorong_language') || 'ko';
    
    nameInput.value = currentName;
    tempFavColor = currentColor;
    tempGender = currentGender;
    tempLanguage = currentLang;

    // Set active options
    genderOptions.forEach(opt => {
      if (opt.getAttribute('data-gender') === currentGender) {
        opt.classList.add('selected');
      } else {
        opt.classList.remove('selected');
      }
    });

    languageOptions.forEach(opt => {
      if (opt.getAttribute('data-lang') === currentLang) {
        opt.classList.add('selected');
      } else {
        opt.classList.remove('selected');
      }
    });

    colorOptions.forEach(opt => {
      if (opt.getAttribute('data-color') === currentColor) {
        opt.classList.add('selected');
      } else {
        opt.classList.remove('selected');
      }
    });

    applyDashboardLanguage(tempLanguage);
    modalOverlay.classList.add('active');
  });

  let allBooks = [];
  const gridContainer = document.getElementById('books-grid');
  const creativeGirlTabBtn = document.getElementById('tab-creative-girl');
  const creativeBoyTabBtn = document.getElementById('tab-creative-boy');
  const classicTabBtn = document.getElementById('tab-classic');
  
  let activeCategory = 'creative-girl'; // Default
  
  const updateTabUI = () => {
    [creativeGirlTabBtn, creativeBoyTabBtn, classicTabBtn].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    if (activeCategory === 'creative-girl' && creativeGirlTabBtn) {
      creativeGirlTabBtn.classList.add('active');
    } else if (activeCategory === 'creative-boy' && creativeBoyTabBtn) {
      creativeBoyTabBtn.classList.add('active');
    } else if (activeCategory === 'classic' && classicTabBtn) {
      classicTabBtn.classList.add('active');
    }
  };

  const indicatorsContainer = document.getElementById('carousel-indicators');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  // Drag and Swipe Carousel variables
  let isDown = false;
  let startX;
  let scrollLeft;
  let dragMoved = false;

  // Carousel mouse dragging event listeners
  gridContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    dragMoved = false;
    gridContainer.classList.add('dragging');
    startX = e.pageX - gridContainer.offsetLeft;
    scrollLeft = gridContainer.scrollLeft;
  });

  gridContainer.addEventListener('mouseleave', () => {
    isDown = false;
    gridContainer.classList.remove('dragging');
  });

  gridContainer.addEventListener('mouseup', () => {
    isDown = false;
    gridContainer.classList.remove('dragging');
  });

  gridContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - gridContainer.offsetLeft;
    const walk = (x - startX) * 1.6;
    if (Math.abs(x - startX) > 8) {
      dragMoved = true;
    }
    gridContainer.scrollLeft = scrollLeft - walk;
  });

  // Calculate active center card
  const handleCarouselScroll = () => {
    const cards = gridContainer.querySelectorAll('.book-card');
    if (cards.length === 0) return;

    const containerRect = gridContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestCard = null;
    let closestDistance = Infinity;
    let closestIndex = 0;

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - containerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
        closestIndex = index;
      }
    });

    cards.forEach(card => {
      if (card === closestCard) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update active dot indicator
    const dots = indicatorsContainer.querySelectorAll('.indicator-dot');
    dots.forEach((dot, idx) => {
      if (idx === closestIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  gridContainer.addEventListener('scroll', handleCarouselScroll);

  // Arrow click controls
  const scrollCarousel = (direction) => {
    RorongAudio.playBubble();
    const cardWidth = window.innerWidth <= 768 ? 190 : 280;
    const gap = window.innerWidth <= 768 ? 15 : 30;
    const scrollAmount = cardWidth + gap;
    
    gridContainer.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  prevBtn.addEventListener('click', () => scrollCarousel('prev'));
  nextBtn.addEventListener('click', () => scrollCarousel('next'));

  const fetchAndRenderBooks = async () => {
    try {
      const response = await fetch('./data/stories.json');
      if (!response.ok) throw new Error('Failed to fetch stories database');
      allBooks = await response.json();
      renderBooks();
    } catch (e) {
      console.error('Error loading stories:', e);
      gridContainer.innerHTML = '<div style="font-size:1.8rem; color:#d81b60; padding: 20px;">동화책을 불러오는데 실패했어요 😢</div>';
    }
  };

  const renderBooks = () => {
    gridContainer.innerHTML = '';
    indicatorsContainer.innerHTML = '';
    
    const isEn = localStorage.getItem('rorong_language') === 'en';
    
    // Filter books based on selected tab (mapped to book.category)
    const filtered = allBooks.filter(book => book.category === activeCategory);

    filtered.forEach((book, idx) => {
      // Load saved rating from localStorage
      const savedRating = localStorage.getItem(`rorong_rating_${book.id}`);
      let ratingHtml = '';
      if (savedRating) {
        ratingHtml = `<div class="book-rating-badge">⭐ ${'★'.repeat(parseInt(savedRating, 10))}</div>`;
      }

      const card = document.createElement('div');
      card.className = 'book-card';
      
      // We will render cover image if it is a featured book, otherwise fallback cover art using emoji
      const isFeatured = book.featured;
      const imageUrl = isFeatured ? `./assets/images/${book.pages[0].image}` : '';

      const bookTitle = isEn ? (book.englishTitle || book.title) : book.title;
      const bookMoral = isEn ? (book.englishMoral || book.moral) : book.moral;

      card.innerHTML = `
        <div class="book-cover-art" style="background: var(--bg-${book.coverColor || 'pink'});">
          ${ratingHtml}
          ${isFeatured ? `
            <img src="${imageUrl}" alt="${bookTitle}" class="book-cover-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          ` : ''}
          <div class="book-cover-fallback" style="display: ${isFeatured ? 'none' : 'flex'}; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
            <span class="book-cover-emoji">${book.emoji}</span>
          </div>
        </div>
        <div class="book-details">
          <h3 class="book-title">${bookTitle}</h3>
          <span class="book-moral">${bookMoral}</span>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (dragMoved) {
          e.preventDefault();
          return;
        }
        RorongAudio.playBubble();
        // Redirect to modular HTML book page
        setTimeout(() => {
          window.location.href = `./books/${book.id}.html`;
        }, 150);
      });

      gridContainer.appendChild(card);

      // Create indicator dot
      const dot = document.createElement('div');
      dot.className = 'indicator-dot';
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        RorongAudio.playBubble();
        const cardWidth = window.innerWidth <= 768 ? 190 : 280;
        const gap = window.innerWidth <= 768 ? 15 : 30;
        gridContainer.scrollTo({
          left: idx * (cardWidth + gap),
          behavior: 'smooth'
        });
      });
      indicatorsContainer.appendChild(dot);
    });

    // Reset scroll to start on render
    gridContainer.scrollLeft = 0;
    // Set first card active immediately
    setTimeout(handleCarouselScroll, 100);
  };

  // Tab switching click handlers
  if (creativeGirlTabBtn) {
    creativeGirlTabBtn.addEventListener('click', () => {
      if (activeCategory !== 'creative-girl') {
        RorongAudio.playBubble();
        activeCategory = 'creative-girl';
        updateTabUI();
        renderBooks();
      }
    });
  }

  if (creativeBoyTabBtn) {
    creativeBoyTabBtn.addEventListener('click', () => {
      if (activeCategory !== 'creative-boy') {
        RorongAudio.playBubble();
        activeCategory = 'creative-boy';
        updateTabUI();
        renderBooks();
      }
    });
  }

  if (classicTabBtn) {
    classicTabBtn.addEventListener('click', () => {
      if (activeCategory !== 'classic') {
        RorongAudio.playBubble();
        activeCategory = 'classic';
        updateTabUI();
        renderBooks();
      }
    });
  }

  // 4. Mascot "Rorong" Interactions
  const mascotContainer = document.getElementById('mascot-container');
  const mascotSprite = document.getElementById('mascot-sprite');
  const mascotBubble = document.getElementById('mascot-bubble');

  const mascotPhrases = {
    ko: [
      '안녕! 오늘도 재밌는 모험 가자! ✨',
      '어떤 동화책이 읽고 싶어? 📚',
      '글자를 꾹 누르면 소리내어 읽어줘! 🔊',
      '책을 다 읽고 나면 별점 꼭 눌러줘! ⭐',
      '로롱이는 너가 너무 좋아! 💖',
      '우와! 핑크색 별이 쏟아져! 🪄'
    ],
    en: [
      "Hi! Let's go on an adventure! ✨",
      "Which book do you want to read? 📚",
      "Press and hold any word to read aloud! 🔊",
      "Please leave a star rating after reading! ⭐",
      "Rorong loves you so much! 💖",
      "Wow! Pink sparkles are everywhere! 🪄"
    ]
  };

  const triggerMascotJump = (customText = null) => {
    RorongAudio.playChime();
    mascotSprite.classList.add('excited');
    
    // Pick text
    const currentLang = localStorage.getItem('rorong_language') || 'ko';
    const phrases = mascotPhrases[currentLang] || mascotPhrases.ko;
    const text = customText || phrases[Math.floor(Math.random() * phrases.length)];
    mascotBubble.textContent = text;

    setTimeout(() => {
      mascotSprite.classList.remove('excited');
    }, 1500);
  };

  mascotContainer.addEventListener('click', () => triggerMascotJump());

  // Mascot speaks occasionally in background
  setInterval(() => {
    if (!modalOverlay.classList.contains('active')) {
      const currentLang = localStorage.getItem('rorong_language') || 'ko';
      const phrases = mascotPhrases[currentLang] || mascotPhrases.ko;
      const text = phrases[Math.floor(Math.random() * phrases.length)];
      mascotBubble.textContent = text;
    }
  }, 10000);

  // 5. Canvas Sparkle Particle Effect
  const canvas = document.getElementById('sparkle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight; // support full scroll height
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    // Re-adjust size on tab render
    if (creativeGirlTabBtn) creativeGirlTabBtn.addEventListener('click', () => setTimeout(resizeCanvas, 100));
    if (creativeBoyTabBtn) creativeBoyTabBtn.addEventListener('click', () => setTimeout(resizeCanvas, 100));
    if (classicTabBtn) classicTabBtn.addEventListener('click', () => setTimeout(resizeCanvas, 100));

    class SparkleParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 14 + 6; // Bigger and highly visible sparkles
        this.speedY = Math.random() * -1.8 - 0.7; // Rise upwards
        this.speedX = Math.random() * 1.5 - 0.75; // Slight drift
        
        const colorPalette = localStorage.getItem('rorong_fav_color') || 'pink';
        const baseHue = colorPalette === 'pink' ? 330 : colorPalette === 'lavender' ? 260 : colorPalette === 'mint' ? 140 : 40;
        
        const rand = Math.random();
        if (rand < 0.25) {
          this.color = `hsla(50, 100%, 80%, ${Math.random() * 0.4 + 0.6})`; // Golden star
        } else if (rand < 0.4) {
          this.color = `hsla(0, 0%, 100%, ${Math.random() * 0.4 + 0.6})`; // Pure white star
        } else {
          this.color = `hsla(${Math.random() * 40 + baseHue}, 100%, 75%, ${Math.random() * 0.4 + 0.6})`;
        }
        
        this.alpha = 1;
        this.life = Math.random() * 40 + 50; // Longer life
        this.maxLife = this.life;
        this.wobbleSpeed = Math.random() * 0.05 + 0.02;
        this.wobbleAngle = Math.random() * Math.PI * 2;
      }
      update() {
        this.y += this.speedY;
        this.wobbleAngle += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobbleAngle) * 0.8;
        
        this.life--;
        this.alpha = this.life / this.maxLife;
        this.size *= 0.97;
      }
      draw() {
        ctx.save();
        // Twinkling opacity
        ctx.globalAlpha = this.alpha * (0.6 + Math.sin(Date.now() * 0.01) * 0.4);
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        
        ctx.beginPath();
        const spikes = 4;
        let rot = Math.PI / 2 * 3;
        let cx = this.x;
        let cy = this.y;
        let rOuter = this.size;
        let rInner = this.size / 2.8; // Sharper star shape
        let step = Math.PI / spikes;

        ctx.moveTo(cx, cy - rOuter);
        for (let i = 0; i < spikes; i++) {
          let xOuter = cx + Math.cos(rot) * rOuter;
          let yOuter = cy + Math.sin(rot) * rOuter;
          ctx.lineTo(xOuter, yOuter);
          rot += step;

          let xInner = cx + Math.cos(rot) * rInner;
          let yInner = cy + Math.sin(rot) * rInner;
          ctx.lineTo(xInner, yInner);
          rot += step;
        }
        ctx.lineTo(cx, cy - rOuter);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Ambient sparkles: 16% chance per frame, rising from lower screen areas
      if (Math.random() < 0.16) {
        const randX = Math.random() * canvas.width;
        // Bias generation towards the bottom 65% of the page
        const randY = canvas.height - (Math.random() * canvas.height * 0.65);
        particles.push(new SparkleParticle(randX, randY));
      }

      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // Initial Run
  checkProfile();
  fetchAndRenderBooks();
});
