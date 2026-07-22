/**
 * rorongBooks Shared Book Runner
 * Handles page turning, personalization, 3-second long-press TTS, star rating overlay, and canvas particle animations.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme and Personalization Setup
  const childName = localStorage.getItem('rorong_child_name') || '우리 아이';
  const favColor = localStorage.getItem('rorong_fav_color') || 'pink';
  const bookContainer = document.querySelector('.book-viewer');
  
  // Set theme background based on user's preference
  if (favColor === 'pink') {
    document.body.style.background = 'var(--bg-pink)';
  } else if (favColor === 'lavender') {
    document.body.style.background = 'var(--bg-lavender)';
  } else if (favColor === 'mint') {
    document.body.style.background = 'var(--bg-mint)';
  } else if (favColor === 'gold') {
    document.body.style.background = 'var(--bg-gold)';
  }

  // Personalize page texts and split into word-by-word TTS triggers
  const processStoryTexts = () => {
    const paragraphs = document.querySelectorAll('.story-paragraph');
    
    // Check if the last character of the childName has a batchim (jongseong)
    const lastChar = childName.charAt(childName.length - 1);
    const hasPadchim = (() => {
      const charCode = lastChar.charCodeAt(0);
      if (charCode < 0xAC00 || charCode > 0xD7A3) return false;
      return (charCode - 0xAC00) % 28 > 0;
    })();

    paragraphs.forEach(p => {
      let text = p.innerHTML.trim();
      
      // Replace name tokens with correct Korean particles based on batchim
      text = text.replace(/\[이름\]\(이\)는/g, hasPadchim ? `${childName}이는` : `${childName}는`);
      text = text.replace(/\[이름\]\(이\)가/g, hasPadchim ? `${childName}이가` : `${childName}가`);
      text = text.replace(/\[이름\]\(이\)와/g, hasPadchim ? `${childName}이와` : `${childName}와`);
      text = text.replace(/\[이름\]이의/g, hasPadchim ? `${childName}이의` : `${childName}의`);
      text = text.replace(/\[이름\]이와/g, hasPadchim ? `${childName}이와` : `${childName}와`);
      text = text.replace(/\[이름\]이에게/g, hasPadchim ? `${childName}이에게` : `${childName}에게`);
      text = text.replace(/\[이름\]이를/g, hasPadchim ? `${childName}이를` : `${childName}를`);
      text = text.replace(/\[이름\]\(이\)/g, hasPadchim ? `${childName}이` : childName);
      
      // General replacements
      text = text.replace(/\[이름\]/g, childName);
      text = text.replace(/\{\{name\}\}/g, childName);

      // Split by whitespace to create individual words
      const words = text.split(/\s+/);
      p.innerHTML = words.map(word => {
        if (!word) return '';
        return `<span class="tts-trigger">${word}</span>`;
      }).join(' ');
    });
  };
  processStoryTexts();

  // 2. Book Pages Navigation Setup
  const pages = document.querySelectorAll('.book-page');
  let currentPageIdx = 0;

  // Render navigation buttons
  const prevBtn = document.createElement('button');
  prevBtn.className = 'nav-btn prev-btn';
  prevBtn.innerHTML = '◀';
  prevBtn.style.display = 'none'; // Initially hidden
  bookContainer.appendChild(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'nav-btn next-btn';
  nextBtn.innerHTML = '▶';
  bookContainer.appendChild(nextBtn);

  const showPage = (idx) => {
    pages.forEach((page, i) => {
      if (i === idx) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    // Update buttons visibility
    prevBtn.style.display = idx === 0 ? 'none' : 'flex';
    // On the last page, next button still displays to trigger the rating overlay
    nextBtn.innerHTML = idx === pages.length - 1 ? '🌟' : '▶';
  };
  showPage(currentPageIdx);

  const turnPageNext = () => {
    if (currentPageIdx < pages.length - 1) {
      RorongAudio.playPageTurn();
      const currentEl = pages[currentPageIdx];
      currentEl.classList.add('page-flip-next');
      setTimeout(() => {
        currentEl.classList.remove('page-flip-next');
        currentPageIdx++;
        showPage(currentPageIdx);
      }, 400);
    } else {
      // Last page -> Trigger rating system
      showRatingOverlay();
    }
  };

  const turnPagePrev = () => {
    if (currentPageIdx > 0) {
      RorongAudio.playPageTurn();
      const currentEl = pages[currentPageIdx];
      currentEl.classList.add('page-flip-prev');
      setTimeout(() => {
        currentEl.classList.remove('page-flip-prev');
        currentPageIdx--;
        showPage(currentPageIdx);
      }, 400);
    }
  };

  nextBtn.addEventListener('click', turnPageNext);
  prevBtn.addEventListener('click', turnPagePrev);

  // Swipe support for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', e => {
    // Only capture swipes on main areas
    if (e.target.closest('.nav-btn') || e.target.closest('.tts-trigger') || e.target.closest('.rating-overlay')) return;
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    if (e.target.closest('.nav-btn') || e.target.closest('.tts-trigger') || e.target.closest('.rating-overlay')) return;
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const diff = touchEndX - touchStartX;
    if (diff < -60) {
      // Swipe left -> Next page
      turnPageNext();
    } else if (diff > 60) {
      // Swipe right -> Prev page
      turnPagePrev();
    }
  };

  // 3. 3-Second Long-Press TTS Feature
  let pressTimer = null;
  let pressInterval = null;
  let currentPressedEl = null;
  let pressStartTimestamp = 0;
  let currentUtterance = null;
  const PRESS_DURATION = 3000; // 3 seconds

  const speakText = (text, element) => {
    // Stop any current voice output
    window.speechSynthesis.cancel();

    // Create a new utterance
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'ko-KR';
    
    // Find friendly Korean female voice if available
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find(v => v.lang.includes('KO') || v.lang.includes('ko'));
    if (koreanVoice) {
      currentUtterance.voice = koreanVoice;
    }

    currentUtterance.rate = 0.85; // Slightly slower, child-friendly pace
    currentUtterance.pitch = 1.2; // Slightly higher pitch, friendly child-like voice

    currentUtterance.onstart = () => {
      element.classList.add('speaking');
    };

    currentUtterance.onend = () => {
      element.classList.remove('speaking');
    };

    currentUtterance.onerror = () => {
      element.classList.remove('speaking');
    };

    window.speechSynthesis.speak(currentUtterance);
  };

  // Ensure voices are loaded
  window.speechSynthesis.getVoices();

  const handlePressStart = (e) => {
    const trigger = e.currentTarget;
    currentPressedEl = trigger;
    pressStartTimestamp = Date.now();
    
    // Play quick tick to notify press started
    RorongAudio.playTick();

    trigger.classList.add('pressing');
    trigger.style.setProperty('--press-progress', '0%');

    let elapsed = 0;
    const intervalTick = 50; // update every 50ms
    let nextTickSoundTime = 1000; // sound every 1 sec

    pressInterval = setInterval(() => {
      elapsed = Date.now() - pressStartTimestamp;
      const progress = Math.min((elapsed / PRESS_DURATION) * 100, 100);
      trigger.style.setProperty('--press-progress', `${progress}%`);

      // Play rhythmic audio ticks during hold
      if (elapsed >= nextTickSoundTime && elapsed < PRESS_DURATION) {
        RorongAudio.playTick();
        nextTickSoundTime += 1000;
      }

      if (elapsed >= PRESS_DURATION) {
        clearInterval(pressInterval);
        trigger.classList.remove('pressing');
        trigger.style.setProperty('--press-progress', '0%');
        
        // Success Chime
        RorongAudio.playChime();
        
        // Trigger Speak
        speakText(trigger.textContent, trigger);
      }
    }, intervalTick);
  };

  const handlePressEnd = () => {
    if (pressInterval) {
      clearInterval(pressInterval);
      pressInterval = null;
    }
    if (currentPressedEl) {
      currentPressedEl.classList.remove('pressing');
      currentPressedEl.style.setProperty('--press-progress', '0%');
      currentPressedEl = null;
    }
  };

  const triggers = document.querySelectorAll('.tts-trigger');
  triggers.forEach(trigger => {
    // Touch Events
    trigger.addEventListener('touchstart', (e) => {
      // Prevent context menu/default selection on touch
      e.preventDefault();
      handlePressStart(e);
    }, { passive: false });

    trigger.addEventListener('touchend', handlePressEnd);
    trigger.addEventListener('touchcancel', handlePressEnd);
    
    // Mouse Events for desktop testing
    trigger.addEventListener('mousedown', handlePressStart);
    trigger.addEventListener('mouseup', handlePressEnd);
    trigger.addEventListener('mouseleave', handlePressEnd);
  });

  // Cancel TTS when moving away from a page
  window.addEventListener('beforeunload', () => {
    window.speechSynthesis.cancel();
  });

  // 4. Full Screen Star Rating Overlay
  const ratingOverlay = document.getElementById('rating-overlay');
  const starIcons = document.querySelectorAll('.star-icon');
  const submitBtn = document.getElementById('submit-rating-btn');
  let selectedRating = 0;

  const showRatingOverlay = () => {
    // Stop voice reading
    window.speechSynthesis.cancel();
    ratingOverlay.classList.add('active');
  };

  starIcons.forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.getAttribute('data-value'), 10);
      selectedRating = val;

      // Update UI stars
      starIcons.forEach(s => {
        const sVal = parseInt(s.getAttribute('data-value'), 10);
        if (sVal <= val) {
          s.classList.add('selected');
        } else {
          s.classList.remove('selected');
        }
      });

      // Play cute bubble/chime sound
      RorongAudio.playChime();
      
      // Make submit button visible
      submitBtn.classList.add('visible');
    });
  });

  submitBtn.addEventListener('click', () => {
    const bookId = document.getElementById('book-container').getAttribute('data-book-id');
    
    // Save to localStorage
    localStorage.setItem(`rorong_rating_${bookId}`, selectedRating);

    // Play fanfare
    RorongAudio.playSuccess();
    
    // Start Confetti!
    startConfetti();

    // Disable button to prevent double-clicks
    submitBtn.disabled = true;
    submitBtn.style.transform = 'scale(0.9)';

    // Redirect to home page after a brief celebration
    setTimeout(() => {
      // Find back page path. Relative path since we are in books/ folder
      window.location.href = '../index.html';
    }, 2500);
  });

  // 5. Canvas Particles Effects
  // A. Sparkles on Drag/Mouse Move
  const canvas = document.getElementById('sparkle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class SparkleParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 3;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        // Theme customized color
        this.color = `hsla(${Math.random() * 40 + (favColor === 'pink' ? 330 : favColor === 'lavender' ? 260 : favColor === 'mint' ? 140 : 40)}, 100%, 75%, ${Math.random() * 0.5 + 0.5})`;
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
        
        // Draw star shape
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
      for (let i = 0; i < 3; i++) {
        particles.push(new SparkleParticle(x, y));
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

    // Animate loop
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

  // B. Confetti Engine on Rating Submission
  const confettiCanvas = document.getElementById('confetti-canvas');
  let confettiCtx = null;
  let confettiParticles = [];
  let isCelebrating = false;

  const startConfetti = () => {
    if (!confettiCanvas) return;
    confettiCtx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiParticles = [];
    isCelebrating = true;

    // Create 150 confetti particles
    const colors = ['#ffd700', '#ff69b4', '#e040fb', '#00e5ff', '#ffeb3b', '#69f0ae'];
    for (let i = 0; i < 180; i++) {
      confettiParticles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2 + 100,
        r: Math.random() * 6 + 4,
        d: Math.random() * 100 + 40,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0,
        speedX: Math.random() * 15 - 7.5,
        speedY: Math.random() * -18 - 5, // shoot upwards
        gravity: 0.25
      });
    }

    const drawConfetti = () => {
      if (!isCelebrating) return;
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      confettiParticles.forEach((p, idx) => {
        p.speedY += p.gravity;
        p.x += p.speedX;
        p.y += p.speedY;
        p.tiltAngle += p.tiltAngleIncremental;
        p.tilt = Math.sin(p.tiltAngle) * 12;

        confettiCtx.beginPath();
        confettiCtx.lineWidth = p.r;
        confettiCtx.strokeStyle = p.color;
        confettiCtx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        confettiCtx.stroke();

        // Remove if off-screen
        if (p.y > window.innerHeight) {
          confettiParticles[idx] = {
            x: Math.random() * window.innerWidth,
            y: -20,
            r: p.r,
            d: p.d,
            color: p.color,
            tilt: p.tilt,
            tiltAngleIncremental: p.tiltAngleIncremental,
            tiltAngle: p.tiltAngle,
            speedX: Math.random() * 4 - 2,
            speedY: Math.random() * 3 + 2,
            gravity: p.gravity
          };
        }
      });

      requestAnimationFrame(drawConfetti);
    };

    drawConfetti();
  };
});
