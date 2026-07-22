const fs = require('fs');
const path = require('path');

const storiesPath = path.join(__dirname, '../data/stories.json');
const booksDir = path.join(__dirname, '../books');

// Load stories
if (!fs.existsSync(storiesPath)) {
  console.error('Error: stories.json not found at', storiesPath);
  process.exit(1);
}

const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf8'));

// Create books directory if it doesn't exist
if (!fs.existsSync(booksDir)) {
  fs.mkdirSync(booksDir, { recursive: true });
}

// Template generator
const generateHTML = (story) => {
  const pagesHtml = story.pages.map(page => {
    const imagePath = path.join(__dirname, '../assets/images', page.image || '');
    const hasPhysicalImage = page.image && fs.existsSync(imagePath);
    const isFeatured = story.featured && hasPhysicalImage;
    const imageSrc = isFeatured ? `../assets/images/${page.image}` : '';
    
    return `
    <!-- Page ${page.pageNumber} -->
    <div class="book-page">
      <div class="illustration-side">
        ${isFeatured ? `
        <img src="${imageSrc}" alt="${story.title}" class="illustration-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        ` : ''}
        <div class="fallback-illustration" style="display: ${isFeatured ? 'none' : 'flex'};">
          <div class="floating-emoji">${story.emoji}</div>
          <div class="moral-tag">${story.moral}</div>
        </div>
      </div>
      <div class="text-side">
        <button class="read-page-btn">🔊 페이지 읽기</button>
        <div class="story-text-container">
          <p class="story-paragraph" data-text="${page.text}" data-english-text="${page.englishText}">${page.text}</p>
        </div>
        <div class="tts-hint" data-hint="👉 모르는 단어를 1초 동안 꾹 누르면 읽어줘요! 🔊" data-english-hint="👉 Press and hold any word for 1 second to hear it! 🔊">👉 모르는 단어를 1초 동안 꾹 누르면 읽어줘요! 🔊</div>
        <div class="page-num">${page.pageNumber} / ${story.pages.length}</div>
      </div>
    </div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${story.title} - 로롱북스</title>
  <link rel="stylesheet" href="../css/book.css">
  <meta name="description" content="5세 맞춤형 동화 플랫폼 로롱북스 - ${story.title} (${story.moral})">
</head>
<body>
  <!-- Dynamic floating background bubbles (Metaball/Aurora) -->
  <div class="bg-bubbles">
    <div class="bubble bubble-1"></div>
    <div class="bubble bubble-2"></div>
    <div class="bubble bubble-3"></div>
    <div class="bubble bubble-4"></div>
  </div>

  <!-- Interactive sparkles overlay -->
  <canvas id="sparkle-canvas"></canvas>
  <canvas id="confetti-canvas"></canvas>

  <div class="header-bar">
    <button class="back-btn" onclick="window.location.href='../index.html'">
      🏠 홈으로
    </button>
    <button class="lang-toggle-btn" id="lang-toggle-btn">🇺🇸 English</button>
  </div>

  <div class="book-viewer">
    <div class="book" id="book-container" data-book-id="${story.id}">
      ${pagesHtml}
    </div>
  </div>

  <!-- Full-screen rating overlay -->
  <div class="rating-overlay" id="rating-overlay">
    <div class="rating-box">
      <h2 class="rating-title">책을 재미있게 읽었나요? 🥰</h2>
      <p class="rating-subtitle">로롱이에게 별점을 남겨주세요!</p>
      <div class="stars-container">
        <span class="star-icon" data-value="1">★</span>
        <span class="star-icon" data-value="2">★</span>
        <span class="star-icon" data-value="3">★</span>
        <span class="star-icon" data-value="4">★</span>
        <span class="star-icon" data-value="5">★</span>
      </div>
      <button class="submit-rating-btn" id="submit-rating-btn">별점 남기기 ⭐</button>
    </div>
  </div>

  <script src="../js/audio.js"></script>
  <script src="../js/book.js?v=1.0.1"></script>
</body>
</html>`;
};

// Generate each file
stories.forEach(story => {
  const htmlContent = generateHTML(story);
  const fileName = `${story.id}.html`;
  const filePath = path.join(booksDir, fileName);
  fs.writeFileSync(filePath, htmlContent, 'utf8');
  console.log(`Generated: ${fileName}`);
});

console.log('All ' + stories.length + ' stories generated successfully!');
