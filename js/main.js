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
  const submitProfileBtn = document.getElementById('submit-profile-btn');
  const profileCard = document.getElementById('profile-card');
  const greetingEl = document.getElementById('profile-greeting');
  
  let tempFavColor = 'pink';

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

  // Load existing profile or show modal
  const checkProfile = () => {
    const savedName = localStorage.getItem('rorong_child_name');
    const savedColor = localStorage.getItem('rorong_fav_color');

    if (!savedName || !savedColor) {
      // First time user -> Show Profile Setup Modal
      modalOverlay.classList.add('active');
    } else {
      greetingEl.textContent = `${savedName}이의 책방`;
      applyTheme(savedColor);
    }
  };

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
    const nameVal = nameInput.value.trim() || '우리 아이';
    
    localStorage.setItem('rorong_child_name', nameVal);
    localStorage.setItem('rorong_fav_color', tempFavColor);

    RorongAudio.playChime();
    
    // Update Greeting & theme
    greetingEl.textContent = `${nameVal}이의 책방`;
    applyTheme(tempFavColor);

    // Close Modal
    modalOverlay.classList.remove('active');

    // Trigger Mascot Jump
    triggerMascotJump('만나서 반가워! 책 고르자!');
  });

  // Click profile card to edit profile
  profileCard.addEventListener('click', () => {
    const currentName = localStorage.getItem('rorong_child_name') || '';
    const currentColor = localStorage.getItem('rorong_fav_color') || 'pink';
    
    nameInput.value = currentName;
    tempFavColor = currentColor;

    colorOptions.forEach(opt => {
      if (opt.getAttribute('data-color') === currentColor) {
        opt.classList.add('selected');
      } else {
        opt.classList.remove('selected');
      }
    });

    modalOverlay.classList.add('active');
  });

  let allBooks = [];
  let activeCategory = 'creative'; // Default to creative stories
  const gridContainer = document.getElementById('books-grid');
  const creativeTabBtn = document.getElementById('tab-creative');
  const classicTabBtn = document.getElementById('tab-classic');
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
    
    // Filter books based on selected tab
    const filtered = allBooks.filter(book => book.type === activeCategory);

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

      card.innerHTML = `
        <div class="book-cover-art" style="background: var(--bg-${book.coverColor});">
          ${ratingHtml}
          ${isFeatured ? `
            <img src="${imageUrl}" alt="${book.title}" class="book-cover-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          ` : ''}
          <div class="book-cover-fallback" style="display: ${isFeatured ? 'none' : 'flex'}; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
            <span class="book-cover-emoji">${book.emoji}</span>
          </div>
        </div>
        <div class="book-details">
          <h3 class="book-title">${book.title}</h3>
          <span class="book-moral">${book.moral}</span>
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
  creativeTabBtn.addEventListener('click', () => {
    if (activeCategory !== 'creative') {
      RorongAudio.playBubble();
      activeCategory = 'creative';
      creativeTabBtn.classList.add('active');
      classicTabBtn.classList.remove('active');
      renderBooks();
    }
  });

  classicTabBtn.addEventListener('click', () => {
    if (activeCategory !== 'classic') {
      RorongAudio.playBubble();
      activeCategory = 'classic';
      classicTabBtn.classList.add('active');
      creativeTabBtn.classList.remove('active');
      renderBooks();
    }
  });

  // 4. Mascot "Rorong" Interactions
  const mascotContainer = document.getElementById('mascot-container');
  const mascotSprite = document.getElementById('mascot-sprite');
  const mascotBubble = document.getElementById('mascot-bubble');

  const mascotPhrases = [
    '안녕! 오늘도 재밌는 모험 가자! ✨',
    '어떤 동화책이 읽고 싶어? 📚',
    '글자를 꾹 누르면 소리내어 읽어줘! 🔊',
    '책을 다 읽고 나면 별점 꼭 눌러줘! ⭐',
    '로롱이는 너가 너무 좋아! 💖',
    '우와! 핑크색 별이 쏟아져! 🪄'
  ];

  const triggerMascotJump = (customText = null) => {
    RorongAudio.playChime();
    mascotSprite.classList.add('excited');
    
    // Pick text
    const text = customText || mascotPhrases[Math.floor(Math.random() * mascotPhrases.length)];
    mascotBubble.textContent = text;

    setTimeout(() => {
      mascotSprite.classList.remove('excited');
    }, 1500);
  };

  mascotContainer.addEventListener('click', () => triggerMascotJump());

  // Mascot speaks occasionally in background
  setInterval(() => {
    if (!modalOverlay.classList.contains('active')) {
      const text = mascotPhrases[Math.floor(Math.random() * mascotPhrases.length)];
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
    creativeTabBtn.addEventListener('click', () => setTimeout(resizeCanvas, 100));
    classicTabBtn.addEventListener('click', () => setTimeout(resizeCanvas, 100));

    class SparkleParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 3;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        const colorPalette = localStorage.getItem('rorong_fav_color') || 'pink';
        this.color = `hsla(${Math.random() * 40 + (colorPalette === 'pink' ? 330 : colorPalette === 'lavender' ? 260 : colorPalette === 'mint' ? 140 : 40)}, 100%, 75%, ${Math.random() * 0.5 + 0.5})`;
        this.alpha = 1;
        this.life = Math.random() * 30 + 20;
        this.maxLife = this.life;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        this.alpha = this.life / this.maxLife;
        this.size *= 0.95;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        
        ctx.beginPath();
        const spikes = 4;
        let rot = Math.PI / 2 * 3;
        let cx = this.x;
        let cy = this.y;
        let rOuter = this.size;
        let rInner = this.size / 2;
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

    const addParticles = (x, y) => {
      // Compensate for page scroll
      const actualY = y + window.scrollY;
      for (let i = 0; i < 3; i++) {
        particles.push(new SparkleParticle(x, actualY));
      }
    };

    window.addEventListener('mousemove', (e) => {
      addParticles(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        addParticles(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
