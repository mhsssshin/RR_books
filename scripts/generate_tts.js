const fs = require('fs');
const path = require('path');

const storiesPath = path.join(__dirname, '../data/stories.json');
const audioOutputDir = path.join(__dirname, '../assets/audio/tts');

// Ensure output directory exists
if (!fs.existsSync(audioOutputDir)) {
  fs.mkdirSync(audioOutputDir, { recursive: true });
}

// Get API Key from environment variable
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error('Error: ELEVENLABS_API_KEY environment variable is not set.');
  console.error('Please run the script with the API key set in your environment:');
  console.error('$env:ELEVENLABS_API_KEY="your_api_key_here"; node scripts/generate_tts.js');
  process.exit(1);
}

// ElevenLabs Configuration
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel (Very natural, friendly female voice)
const MODEL_ID = 'eleven_multilingual_v2';
const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

// Helper delay function to prevent rate limits
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const cleanTextForTTS = (text) => {
  // Replace personalization tokens with a warm default "우리 친구" (our friend)
  let clean = text
    .replace(/\[이름\]\(이\)는/g, '우리 친구는')
    .replace(/\[이름\]\(이\)가/g, '우리 친구가')
    .replace(/\[이름\]\(이\)를/g, '우리 친구를')
    .replace(/\[이름\]\(이\)와/g, '우리 친구와')
    .replace(/\[이름\]이의/g, '우리 친구의')
    .replace(/\[이름\]이와/g, '우리 친구와')
    .replace(/\[이름\]이에게/g, '우리 친구에게')
    .replace(/\[이름\]\(이\)/g, '우리 친구')
    .replace(/\[이름\]/g, '우리 친구')
    .replace(/\{\{name\}\}/g, '우리 친구');
    
  // Strip any markdown link brackets/parentheses used in raw text
  clean = clean.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  return clean;
};

const generateTTSForPage = async (storyId, pageNumber, rawText) => {
  const fileName = `${storyId}_${pageNumber}.mp3`;
  const outputPath = path.join(audioOutputDir, fileName);

  // Skip if already generated to preserve ElevenLabs credits
  if (fs.existsSync(outputPath)) {
    console.log(`- Skipping: ${fileName} already exists.`);
    return true;
  }

  const textToSpeak = cleanTextForTTS(rawText);
  console.log(`- Generating TTS for ${storyId} Page ${pageNumber}: "${textToSpeak}"`);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: textToSpeak,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`ElevenLabs API returned ${response.status}: ${errText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(outputPath, buffer);
    console.log(`  ✓ Saved: ${fileName}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Error generating TTS for ${fileName}:`, error.message);
    return false;
  }
};

const run = async () => {
  const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf8'));
  console.log(`Starting ElevenLabs TTS generation for ${stories.length} stories...`);
  
  const featuredStories = stories.filter(s => s.featured);
  console.log(`Found ${featuredStories.length} featured stories to narrate.`);

  for (const story of featuredStories) {
    console.log(`\nProcessing Book: "${story.title}" (${story.id})`);
    for (const page of story.pages) {
      const success = await generateTTSForPage(story.id, page.pageNumber, page.text);
      if (!success) {
        console.error('Generation stopped due to error.');
        process.exit(1);
      }
      // Delay 500ms between requests to respect rate limits
      await sleep(500);
    }
  }
  
  console.log('\nAll TTS audio files generated successfully!');
};

run();
