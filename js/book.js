/**
 * rorongBooks Shared Book Runner
 * Handles page turning, personalization, 3-second long-press TTS, star rating overlay, and canvas particle animations.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme and Personalization Setup
  const childName = localStorage.getItem('rorong_child_name') || '우리 아이';
  const favColor = localStorage.getItem('rorong_fav_color') || 'pink';
  const bookContainer = document.querySelector('.book-viewer');
  const readPageBtns = document.querySelectorAll('.read-page-btn');
  
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

    // Reset all whole page reading buttons when turning pages
    if (readPageBtns) {
      readPageBtns.forEach(btn => {
        btn.classList.remove('playing');
        btn.textContent = '🔊 페이지 읽기';
      });
    }
    window.speechSynthesis.cancel();

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

  // 3. 1-Second Long-Press TTS Feature
  let pressTimer = null;
  let pressInterval = null;
  let currentPressedEl = null;
  let pressStartTimestamp = 0;
  let currentUtterance = null;
  const PRESS_DURATION = 1000; // 1 second

  // Helper to extract clean content words (nouns/stems) by striping common Korean particles
  const cleanWordForTTS = (word) => {
    if (!word) return '';
    // Strip punctuation marks
    let clean = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
    
    // Korean particles to remove from the end of the word, ordered by length descending
    const josaRegex = /(에서|에게|으로|한테|이랑|하고|은|는|이|가|을|를|의|에|로|와|과|도|만|랑)$/;
    
    const processed = clean.replace(josaRegex, "");
    // Fallback to original clean word if it becomes empty after removing particles
    return processed.length > 0 ? processed : clean;
  };

  const speakText = (text, element, isWordOnly = true) => {
    // Stop any current voice output
    window.speechSynthesis.cancel();

    // Clean text by stripping Korean particles only if it's a word-only TTS
    const cleanedText = isWordOnly ? cleanWordForTTS(text) : text;

    // Create a new utterance
    currentUtterance = new SpeechSynthesisUtterance(cleanedText);
    currentUtterance.lang = 'ko-KR';
    
    // Find friendly child-like or natural Korean voice if available
    const voices = window.speechSynthesis.getVoices();
    const koreanVoices = voices.filter(v => v.lang.includes('KO') || v.lang.includes('ko'));
    
    // Preference: Microsoft SunHi (young child voice), Heami (narrator), Google Korean, etc.
    const selectedVoice = koreanVoices.find(v => v.name.includes('SunHi')) || 
                          koreanVoices.find(v => v.name.includes('Heami')) || 
                          koreanVoices.find(v => v.name.toLowerCase().includes('natural')) || 
                          koreanVoices.find(v => v.name.toLowerCase().includes('google')) || 
                          koreanVoices[0];
                          
    if (selectedVoice) {
      currentUtterance.voice = selectedVoice;
    }

    currentUtterance.rate = 0.72; // Slower and highly comfortable storytelling speed for kids
    currentUtterance.pitch = 1.35; // Slightly higher pitch to sound like a young child-like voice

    currentUtterance.onstart = () => {
      element.classList.add('speaking');
      if (!isWordOnly) {
        element.classList.add('playing');
        element.textContent = '⏹️ 멈추기';
      }
    };

    currentUtterance.onend = () => {
      element.classList.remove('speaking');
      if (!isWordOnly) {
        element.classList.remove('playing');
        element.textContent = '🔊 페이지 읽기';
      }
    };

    currentUtterance.onerror = () => {
      element.classList.remove('speaking');
      if (!isWordOnly) {
        element.classList.remove('playing');
        element.textContent = '🔊 페이지 읽기';
      }
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
    let nextTickSoundTime = 500; // sound every 0.5 sec

    pressInterval = setInterval(() => {
      elapsed = Date.now() - pressStartTimestamp;
      const progress = Math.min((elapsed / PRESS_DURATION) * 100, 100);
      trigger.style.setProperty('--press-progress', `${progress}%`);

      // Play rhythmic audio ticks during hold
      if (elapsed >= nextTickSoundTime && elapsed < PRESS_DURATION) {
        RorongAudio.playTick();
        nextTickSoundTime += 500;
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
        this.size = Math.random() * 14 + 6; // Bigger and highly visible sparkles
        this.speedY = Math.random() * -1.8 - 0.7; // Rise upwards
        this.speedX = Math.random() * 1.5 - 0.75; // Slight drift
        
        const baseHue = favColor === 'pink' ? 330 : favColor === 'lavender' ? 260 : favColor === 'mint' ? 140 : 40;
        
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

    // Animate loop
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

  // 6. Read Whole Page TTS Setup
  readPageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if (btn.classList.contains('playing')) {
        window.speechSynthesis.cancel();
        btn.classList.remove('playing');
        btn.textContent = '🔊 페이지 읽기';
        return;
      }

      readPageBtns.forEach(otherBtn => {
        otherBtn.classList.remove('playing');
        otherBtn.textContent = '🔊 페이지 읽기';
      });

      const textSide = btn.closest('.text-side');
      const paragraph = textSide.querySelector('.story-paragraph');
      const textToRead = paragraph.textContent.trim();

      speakText(textToRead, btn, false);
    });
  });
});
