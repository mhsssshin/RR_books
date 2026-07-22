$storiesPath = Join-Path $PSScriptRoot "../data/stories.json"
$booksDir = Join-Path $PSScriptRoot "../books"

if (!(Test-Path $storiesPath)) {
    Write-Error "stories.json not found at $storiesPath"
    exit 1
}

if (!(Test-Path $booksDir)) {
    New-Item -ItemType Directory -Path $booksDir -Force | Out-Null
}

$stories = Get-Content -Raw -Encoding utf8 -Path $storiesPath | ConvertFrom-Json

foreach ($story in $stories) {
    $pagesHtmlList = @()
    foreach ($page in $story.pages) {
        $isFeatured = $story.featured
        $imageSrc = if ($isFeatured) { "../assets/images/$($page.image)" } else { "" }
        
        $imgTag = if ($isFeatured) {
            "<img src=""$imageSrc"" alt=""$($story.title)"" class=""illustration-img"" onerror=""this.style.display='none'; this.nextElementSibling.style.display='flex';"">"
        } else { "" }
        
        $fallbackDisplay = if ($isFeatured) { "none" } else { "flex" }
        
        $pageHtml = @"
    <!-- Page $($page.pageNumber) -->
    <div class="book-page">
      <div class="illustration-side">
        $imgTag
        <div class="fallback-illustration" style="display: $fallbackDisplay;">
          <div class="floating-emoji">$($story.emoji)</div>
          <div class="moral-tag">$($story.moral)</div>
        </div>
      </div>
      <div class="text-side">
        <div class="story-text-container">
          <p class="story-paragraph">$($page.text)</p>
        </div>
        <div class="tts-hint">👉 모르는 단어를 1초 동안 꾹 누르면 읽어줘요! 🔊</div>
        <div class="page-num">$($page.pageNumber) / $($story.pages.length)</div>
      </div>
    </div>
"@
        $pagesHtmlList += $pageHtml
    }
    $pagesHtml = $pagesHtmlList -join "`n"

    $htmlContent = @"
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$($story.title) - 로롱북스</title>
  <link rel="stylesheet" href="../css/book.css">
  <meta name="description" content="5세 맞춤형 동화 플랫폼 로롱북스 - $($story.title) ($($story.moral))">
</head>
<body>
  <!-- Interactive sparkles overlay -->
  <canvas id="sparkle-canvas"></canvas>
  <canvas id="confetti-canvas"></canvas>

  <div class="header-bar">
    <button class="back-btn" onclick="window.location.href='../index.html'">
      🏠 홈으로
    </button>
  </div>

  <div class="book-viewer">
    <div class="book" id="book-container" data-book-id="$($story.id)">
      $pagesHtml
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
  <script src="../js/book.js"></script>
</body>
</html>
"@

    $fileName = "$($story.id).html"
    $filePath = Join-Path $booksDir $fileName
    
    [System.IO.File]::WriteAllText($filePath, $htmlContent, [System.Text.Encoding]::UTF8)
}

Write-Host "All $($stories.Count) stories generated successfully via PowerShell!"
