const fs = require('fs');
const path = require('path');

const storiesPath = path.join(__dirname, '../data/stories.json');
const guidePath = path.join(__dirname, '../prompt_guide.md');

const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf8'));

const themes = {
  creative_girl_01: { subject: "a cute baby flying squirrel with tiny wings", base: "magical rainbow forest background, soft pastel colors" },
  creative_girl_02: { subject: "a cute baby rabbit with big sparkly eyes", base: "cozy bedroom and starry night background" },
  creative_girl_03: { subject: "a group of tiny cute smiling baby stars", base: "deep purple night sky with glowing stardust" },
  creative_girl_04: { subject: "a friendly cute king lion with a fluffy pink cotton candy mane", base: "magical sweet candy land background" },
  creative_girl_05: { subject: "a cute gold harp and a magic wooden broom", base: "sky palace golden garden background" },
  creative_girl_06: { subject: "a cute little starfish and a friendly little mermaid", base: "emerald blue sea sand dune background" },
  creative_girl_07: { subject: "a cute baby squirrel", base: "glowing fluffy cloud garden background" },
  creative_girl_08: { subject: "a cute chubby baby bear holding a gold honey pot", base: "honeybee forest background" },
  creative_girl_09: { subject: "a beautiful pink baby dolphin", base: "deep blue sea with glowing corals at sunset" },
  creative_girl_10: { subject: "a cute little baby fairy with a magnifying glass", base: "magical forest meadow background" },
  creative_girl_11: { subject: "a cute little baby penguin", base: "antarctic white icy snow background" },
  creative_girl_12: { subject: "a friendly white dove postman holding colorful letters", base: "warm cozy forest village background" },
  creative_girl_13: { subject: "a cute little yellow butterfly", base: "beautiful rose garden background" },
  creative_girl_14: { subject: "a tiny green seedling sprouting in a cute pot", base: "beautiful magical flower garden background" },
  creative_girl_15: { subject: "a cute clock gear fairy", base: "cozy toy room with shelves background" },
  creative_girl_16: { subject: "a cute crying little yellow chick being hugged", base: "warm sunny meadow background" },
  creative_girl_17: { subject: "a cute baby deer walking safely on a path", base: "beautiful green forest path background" },
  creative_girl_18: { subject: "a beautiful garden with different colorful flowers blooming", base: "bright sunny flowerbed background" },
  creative_girl_19: { subject: "a cute fluffy cloud fairy painting with a magic brush", base: "pastel sky background" },
  creative_girl_20: { subject: "cute living toys sharing a toy box", base: "colorful kids playroom background" },
  creative_boy_01: { subject: "little rescue robot Roni", base: "glowing space station and rainbow stardust rails background" },
  creative_boy_02: { subject: "Dino the green baby dinosaur", base: "cool colorful volcanic water fountain background" },
  creative_boy_03: { subject: "baby airplane Jet and fire engine Hose", base: "glowing cliff forest background" },
  creative_boy_04: { subject: "yellow submarine Boat", base: "glowing sea cave with gemstone lanterns background" },
  creative_boy_05: { subject: "cool blue racing car Thunder", base: "sweet cookie macaron racing circuit background" },
  classic_01: { subject: "beautiful Cinderella in a glowing blue ballgown", base: "magic fairytale palace background" },
  classic_02: { subject: "beautiful Snow White princess with a red apple", base: "cozy forest cottage background" },
  classic_03: { subject: "beautiful Sleeping Beauty princess sleeping peacefully", base: "rose flower covered castle bedroom background" },
  classic_04: { subject: "beautiful Little Mermaid swimming with fish", base: "colorful deep sea coral background" },
  classic_05: { subject: "beautiful Belle princess and a friendly furry Beast", base: "grand library palace setting" },
  classic_06: { subject: "Hansel and Gretel children next to a candy house", base: "mysterious forest background" },
  classic_07: { subject: "Little Red Riding Hood with a picnic basket", base: "beautiful forest path background" },
  classic_08: { subject: "Dorothy with straw Scarecrow, Tin Woodman, and Cowardly Lion", base: "yellow brick road emerald city background" },
  classic_09: { subject: "Peter Pan and Tinkerbell flying through clouds", base: "starry London night sky background" },
  classic_10: { subject: "Alice looking at a white rabbit with a pocket watch", base: "wonderland giant mushroom background" }
};

const keywords = [
  { kr: "침대", en: "lying on a cozy bed under a warm blanket" },
  { kr: "이불", en: "covered with a soft fluffy colorful blanket" },
  { kr: "창문", en: "looking out of a large glass window" },
  { kr: "노래", en: "singing happily with musical notes floating around" },
  { kr: "바다", en: "swimming deep under the sparkling blue sea" },
  { kr: "하늘", en: "flying high in the sky among soft pastel clouds" },
  { kr: "숲", en: "walking on a green forest path filled with sunshine" },
  { kr: "가방", en: "holding a small cute backpack" },
  { kr: "성", en: "in front of a grand fairytale castle" },
  { kr: "궁전", en: "inside a magnificent palace hall" },
  { kr: "울고", en: "looking sad with small tears in eyes" },
  { kr: "기뻐", en: "jumping with joy and smiling happily" },
  { kr: "선물", en: "giving a beautiful shiny gift box" },
  { kr: "꽃", en: "surrounded by blooming colorful flowers" },
  { kr: "별", en: "under a starry night sky with twinkling yellow stars" },
  { kr: "먹구름", en: "with dark stormy clouds floating above" },
  { kr: "무지개", en: "with a bright colorful rainbow across the sky" },
  { kr: "거짓말", en: "with a guilty look on face, looking down" },
  { kr: "도토리", en: "gathering golden acorns in the grass" },
  { kr: "꿀", en: "eating sweet golden honey from a jar" },
  { kr: "편지", en: "holding a tiny envelope/letter" },
  { kr: "나비", en: "chasing a beautiful butterfly" },
  { kr: "새싹", en: "watering a tiny green plant in a pot" },
  { kr: "시계", en: "looking at a large wall clock" },
  { kr: "사과", en: "holding a shiny red apple" },
  { kr: "마차", en: "riding in a glowing golden carriage" },
  { kr: "구두", en: "holding a sparkling glass slipper" },
  { kr: "야수", en: "dancing with a friendly furry Beast" },
  { kr: "과자", en: "surrounded by tasty candy and gingerbread house" },
  { kr: "길", en: "walking on a yellow brick road" },
  { kr: "장난감", en: "playing with cute wooden toys" }
];

const customPrompts = {
  // Manual prompts that were pre-defined
  // creative_girl_02
  "creative_girl_02/creative_girl_02_1.jpg": "A cover illustration of a cute baby rabbit with big sparkly eyes looking scared in a dark cozy bedroom. The Korean text \"꼬마 토끼의 용기 상자\" is written in bubbly, warm golden 3D typography at the top. Whimsical watercolor children's book style.",
  "creative_girl_02/creative_girl_02_2.jpg": "Cute baby rabbit shivering under a fluffy blanket in bed, look of fear on its face. Soft lamp light, cozy children's room setting, clock visible on the wall. Whimsical watercolor style.",
  "creative_girl_02/creative_girl_02_3.jpg": "A kind little girl with a warm smile is presenting a beautiful, glowing golden box to a scared baby rabbit in a cozy bedroom setting. Magical warm light, watercolor style.",
  "creative_girl_02/creative_girl_02_4.jpg": "Close-up of a beautifully decorated, glowing golden box resting on a child's hands. Soft sparkling gold dust floating around, magical fairytale atmosphere, watercolor style.",
  "creative_girl_02/creative_girl_02_5.jpg": "The cute baby rabbit holds the golden box and gently opens it. Warm golden light and sparkling dust float out, illuminating the rabbit's face with a look of wonder. Watercolor style.",
  "creative_girl_02/creative_girl_02_6.jpg": "The glowing golden light wraps around the baby rabbit's shoulders like a soft magic scarf. The rabbit has a warm, comforted expression, feeling brave. Watercolor style.",
  "creative_girl_02/creative_girl_02_7.jpg": "The brave baby rabbit extends its paw and opens a large glass bedroom window, looking out to the night sky, curious and no longer afraid. Watercolor style.",
  "creative_girl_02/creative_girl_02_8.jpg": "View out the window showing a beautiful starry night sky. Friendly little stars with smiling faces in the sky are winking down. Soft dark blue and purple tones, magical dreamlike watercolor style.",
  "creative_girl_02/creative_girl_02_9.jpg": "Cute baby rabbit sleeping peacefully in bed under a soft starry-patterned blanket, smiling. Cozy room, stars visible outside the window, warm and safe atmosphere. Watercolor style.",
  "creative_girl_02/creative_girl_02_10.jpg": "The brave rabbit is happily playing in a sunny forest clearing with other friendly animal friends, wearing a tiny golden star badge. Bright, cheerful morning light, whimsical watercolor style.",
  
  // creative_girl_01
  "creative_girl_01/creative_girl_01_1.png": "A cover illustration of a cute baby flying squirrel with tiny wings sitting on a pastel rainbow. The Korean text \"로롱이와 무지개 요정\" is written in cute, colorful 3D typography at the top. Whimsical watercolor style.",
  "creative_girl_01/creative_girl_01_2.png": "A cover illustration of a cute baby flying squirrel with tiny wings sitting on a pastel rainbow. The Korean text \"로롱이와 무지개 요정\" is written in cute, colorful 3D typography at the top. Whimsical watercolor style.",
  "creative_girl_01/creative_girl_01_3.png": "A cute baby flying squirrel with tiny wings meets a crying little rainbow fairy under a giant glowing mushroom tree in a magical forest. Soft pastel pink, purple and violet tones, sparkly watercolor style.",
  "creative_girl_01/creative_girl_01_4.png": "A cute baby flying squirrel with tiny wings meets a crying little rainbow fairy under a giant glowing mushroom tree in a magical forest. Soft pastel pink, purple and violet tones, sparkly watercolor style.",
  "creative_girl_01/creative_girl_01_5.png": "A cute baby flying squirrel is sharing colorful, shiny magic crayons from a small pouch with a smiling little rainbow fairy. Magical garden setting, sparkling stars, pastel colors, watercolor.",
  "creative_girl_01/creative_girl_01_6.png": "A cute baby flying squirrel is sharing colorful, shiny magic crayons from a small pouch with a smiling little rainbow fairy. Magical garden setting, sparkling stars, pastel colors, watercolor.",
  "creative_girl_01/creative_girl_01_7.png": "A cute little rainbow fairy uses a magical crayon to paint a bright, beautiful multi-colored rainbow across a soft purple sky. Soft pastel clouds, sparkling stars, dreamy watercolor style.",
  "creative_girl_01/creative_girl_01_8.png": "A cute little rainbow fairy uses a magical crayon to paint a bright, beautiful multi-colored rainbow across a soft purple sky. Soft pastel clouds, sparkling stars, dreamy watercolor style.",
  "creative_girl_01/creative_girl_01_9.png": "A smiling little rainbow fairy slides a glowing pink star ring onto the paw of a cute baby flying squirrel. Magical forest background, sparkling gold fairy dust, warm pastel colors, watercolor style.",
  "creative_girl_01/creative_girl_01_10.png": "A smiling little rainbow fairy slides a glowing pink star ring onto the paw of a cute baby flying squirrel. Magical forest background, sparkling gold fairy dust, warm pastel colors, watercolor style.",
  
  // classic_01
  "classic_01/classic_01_1.png": "A dreamlike book cover illustration of Cinderella. A beautiful princess in a glowing blue ballgown next to a pumpkin carriage. Prominently features the Korean text \"신데렐라\" in elegant gold typography at the top. Fairytale watercolor style.",
  "classic_01/classic_01_2.png": "A dreamlike book cover illustration of Cinderella. A beautiful princess in a glowing blue ballgown next to a pumpkin carriage. Prominently features the Korean text \"신데렐라\" in elegant gold typography at the top. Fairytale watercolor style.",
  "classic_01/classic_01_3.png": "Cinderella in a ragged dress is sitting on a wooden stool in a dusty stone kitchen, crying softly as her stepsisters leave in a carriage. Warm fire glow, soft watercolor style.",
  "classic_01/classic_01_4.png": "Cinderella in a ragged dress is sitting on a wooden stool in a dusty stone kitchen, crying softly as her stepsisters leave in a carriage. Warm fire glow, soft watercolor style.",
  "classic_01/classic_01_5.png": "A kind, glowing fairy godmother is waving a magic wand over Cinderella, transforming her ragged clothes into a beautiful glowing blue ballgown. Sparkles, stars, soft watercolor style.",
  "classic_01/classic_01_6.png": "A kind, glowing fairy godmother is waving a magic wand over Cinderella, transforming her ragged clothes into a beautiful glowing blue ballgown. Sparkles, stars, soft watercolor style.",
  "classic_01/classic_01_7.png": "A glowing golden pumpkin carriage is parked outside a grand castle at night. Sparkles in the air, full moon, soft dreamlike fairytale style, watercolor.",
  "classic_01/classic_01_8.png": "A glowing golden pumpkin carriage is parked outside a grand castle at night. Sparkles in the air, full moon, soft dreamlike fairytale style, watercolor.",
  "classic_01/classic_01_9.png": "A handsome prince is sliding a tiny glowing glass slipper onto Cinderella's foot. It fits perfectly! Cinderella is smiling, magical celebration sparkles, soft watercolor fairytale style.",
  "classic_01/classic_01_10.png": "A handsome prince is sliding a tiny glowing glass slipper onto Cinderella's foot. It fits perfectly! Cinderella is smiling, magical celebration sparkles, soft watercolor fairytale style.",
  
  // creative_girl_03
  "creative_girl_03/creative_girl_03_1.jpg": "A cover illustration for a children's fairytale book. A group of tiny cute smiling baby stars are dancing on a sparkling river of stardust in a deep purple night sky. Bouncy colorful Korean text \"아기 별들의 밤하늘 축제\" is written in glowing letters at the top. Whimsical watercolor children's book style.",
  "creative_girl_03/creative_girl_03_2.jpg": "A giant dark grumpy storm cloud monster sweeps across the starry sky, covering the sparkling little stars and casting a dark shadow over the land. Soft watercolor style.",
  "creative_girl_03/creative_girl_03_3.jpg": "A group of cute friendly forest animals (a little bear, squirrel, and deer) are sitting on a grassy hill, looking up at the dark night sky with sad faces. Soft glowing moon hidden behind clouds, watercolor style.",
  "creative_girl_03/creative_girl_03_4.jpg": "A kind little girl/boy is standing on a high mountain peak at night, calling out and waving to a group of cute forest animals to follow. Bright sparkling stars peeking through clouds, watercolor style.",
  "creative_girl_03/creative_girl_03_5.jpg": "A group of children and cute forest animals are holding hands in a circle on top of a mountain under the night sky, singing together happily. Whimsical watercolor style.",
  "creative_girl_03/creative_girl_03_6.jpg": "Glowing musical notes and sparkles float up from the singing animals on the mountain peak, traveling through the dark storm clouds toward the hidden stars. Soft dreamlike watercolor style.",
  "creative_girl_03/creative_girl_03_7.jpg": "A group of tiny cute baby stars in the sky are holding hands, their bodies glowing brighter and brighter as they gather their light together. Sparkles, magical watercolor style.",
  "creative_girl_03/creative_girl_03_8.jpg": "The dark grumpy storm cloud monster is blown away by the combined brilliant light of the glowing baby stars. The night sky becomes bright and clear again, watercolor style.",
  "creative_girl_03/creative_girl_03_9.jpg": "A grand, magical stardust dance festival under the night sky. Tiny smiling baby stars and cute forest animals are dancing together on a glowing silver silver-blue Milky Way field. Watercolor fairytale style.",
  "creative_girl_03/creative_girl_03_10.jpg": "A smiling baby star winks down from the bright starry sky toward a happy child who is looking up from a bedroom window, holding hands with a toy squirrel. Cozy room, warm and happy atmosphere, watercolor style.",
  
  // creative_girl_04
  "creative_girl_04/creative_girl_04_1.jpg": "A cover illustration for a children's fairytale book. A friendly cute king lion with a fluffy pink cotton candy mane is sitting on a waffle throne in a magical candy land. Bouncy colorful Korean text \"과자 나라의 다정한 사자\" is written in glowing letters at the top. Whimsical children's book watercolor style.",
  "creative_girl_04/creative_girl_04_2.jpg": "The cute friendly king lion with a pink cotton candy mane is watering a flowerbed of chocolate cookies in a bright candy kingdom. Sweet rivers of melted chocolate nearby, watercolor style.",
  "creative_girl_04/creative_girl_04_3.jpg": "A curious little girl with a warm smile is walking along a path made of colorful sweet macarons, heading towards a grand pastel candy castle. Whimsical watercolor style.",
  "creative_girl_04/creative_girl_04_4.jpg": "A tiny cute baby squirrel is crying outside a grand candy castle gate because it lost its key made of shiny red jelly. The friendly king lion and a little girl look on with concern. Watercolor style.",
  "creative_girl_04/creative_girl_04_5.jpg": "The tiny baby squirrel is sitting sadly on a macaron path, rubbing its eyes, looking hungry and tired. Soft warm colors, cozy but sad candy land background, watercolor style.",
  "creative_girl_04/creative_girl_04_6.jpg": "The kind king lion is gently tearing a fluffy piece of sweet strawberry cotton candy from his own pink mane and giving it to the hungry baby squirrel. Warm, touching atmosphere, watercolor style.",
  "creative_girl_04/creative_girl_04_7.jpg": "A little girl uses a magnifying glass to search for a lost red jelly key between the cracks of colorful sweet macarons on a path. Whimsical watercolor style.",
  "creative_girl_04/creative_girl_04_8.jpg": "A little girl finds a shiny red jelly key hidden under a patch of green chocolate grass. The tiny baby squirrel is jumping with joy, happy atmosphere, watercolor style.",
  "creative_girl_04/creative_girl_04_9.jpg": "The cute baby squirrel is happily presenting a plate of heart-shaped madeline cakes to the kind king lion and the little girl as a thank you. Warm and grateful atmosphere, watercolor style.",
  "creative_girl_04/creative_girl_04_10.jpg": "A group of cute forest animals and the kind king lion are having a happy picnic party in a beautiful candy meadow under a soft rainbow sky. Bright, cheerful watercolor style.",
  
  // creative_girl_05
  "creative_girl_05/creative_girl_05_1.jpg": "A cover illustration for a children's fairytale book. A cute gold harp with gentle eyes is standing next to a cheerful magic wooden broom in a glowing sky palace garden. Bouncy colorful Korean text \"마법 빗자루와 요술 하프\" is written in glowing letters at the top. Whimsical watercolor children's book style.",
  "creative_girl_05/creative_girl_05_2.jpg": "A lonely magic wooden broom with a cute face is sweeping dust alone in a quiet, shadowy palace garden. Whimsical watercolor style.",
  "creative_girl_05/creative_girl_05_3.jpg": "A friendly little girl with a warm smile is introducing the sad gold harp and the lonely magic wooden broom to each other in a sunny garden clearing. Cozy and welcoming atmosphere, watercolor style.",
  "creative_girl_05/creative_girl_05_4.jpg": "A friendly little girl is gesturing with excitement, encouraging the magic wooden broom and the gold harp to hold hands/touch. Bright sparkling stars in the air, fairytale watercolor style.",
  "creative_girl_05/creative_girl_05_5.jpg": "The magic wooden broom gently strokes the shiny silver strings of the gold harp with its soft feathers. A warm and hopeful light glows from the point of contact, watercolor style.",
  "creative_girl_05/creative_girl_05_6.jpg": "Brilliant colorful sparkles and glowing music notes burst out as the broom strokes the harp. The air is filled with magical, bright melodies, painting the environment with soft colors. Whimsical watercolor style.",
  "creative_girl_05/creative_girl_05_7.jpg": "The gold harp is singing happily with a big smile, and the magic wooden broom is dancing and spinning around in circles with joy. Whimsical children's book watercolor style.",
  "creative_girl_05/creative_girl_05_8.jpg": "A group of cute fairytale characters and animals are dancing in a circle in the sky palace garden, enjoying the beautiful harp music. Colorful flowers, bright happy watercolor style.",
  "creative_girl_05/creative_girl_05_9.jpg": "The magic wooden broom and the gold harp are walking side by side down a sparkling corridor, happy and holding hands as best friends. Watercolor style.",
  "creative_girl_05/creative_girl_05_10.jpg": "A friendly little girl is smiling as she watches the magic broom and the gold harp play together under a warm, glowing sunset sky. Cozy, happy watercolor style."
};

const generatePrompt = (storyId, pageNum, text) => {
  // Build a generic file path key
  const ext = (storyId === "creative_girl_01" || storyId === "classic_01") ? "png" : "jpg";
  const pathKey = `${storyId}/${storyId}_${pageNum}.${ext}`;
  
  if (customPrompts[pathKey]) {
    return customPrompts[pathKey];
  }
  
  const t = themes[storyId] || { subject: "a cute fairytale character", base: "magical fairytale background" };
  
  // Scan text to find action keywords
  let actions = [];
  keywords.forEach(kw => {
    if (text.includes(kw.kr)) {
      actions.push(kw.en);
    }
  });
  
  // Clean text a bit for readability
  let cleanText = text.replace(/\[이름\]/g, "민지").replace(/\{\{name\}\}/g, "민지").replace(/\(이\)/g, "");
  
  let actionDesc = actions.length > 0 ? actions.join(", ") : "happily smiling and posing";
  
  // Custom cover rule for page 1
  if (pageNum === 1) {
    const cleanTitle = stories.find(s => s.id === storyId).title;
    return `A cover illustration for a children's fairytale book. Features ${t.subject} in a beautiful setting. The Korean text "${cleanTitle}" is written in bubbly, warm glowing 3D typography at the top. Whimsical watercolor children's book illustration style, soft pastel colors, warm fairytale lighting, 5-year-old girl target audience.`;
  }
  
  return `${t.subject} ${actionDesc}, ${t.base}, whimsical watercolor children's book illustration, cute cartoon style, soft pastel colors, warm fairytale lighting, 5-year-old girl target audience`;
};

// Start building prompt_guide.md content
let md = `# 🎨 로롱북스 (rorongBooks) 모든 콘텐츠 이미지 생성 프롬프트 가이드

이 가이드는 AI 이미지 생성 모델(Gemini, Midjourney, DALL-E 등)을 사용하여 동화책 삽화를 직접 생성할 때 사용할 수 있는 **파일명, 이미지 생성 영문 프롬프트, 그리고 매핑되는 대본** 목록입니다.

> [!TIP]
> **디자인 일관성(Consistency) 유지 비결**
> 모든 프롬프트의 앞이나 뒤에 아래 스타일 키워드를 공통으로 삽입하면, 책장마다 일러스트 화풍이 깨지지 않고 부드러운 수채화 동화책 느낌으로 통일됩니다:
> \`whimsical watercolor children's book illustration, cute cartoon style, soft pastel colors, warm fairytale lighting, 5-year-old girl target audience\`

---
`;

stories.forEach(story => {
  md += `\n## ${story.emoji} [${story.id}] ${story.title} (${story.moral})\n`;
  md += `* **설명**: ${story.title} - 10페이지 아동 맞춤 스토리라인\n\n`;
  md += `| 파일명 | 프롬프트 | 대본 |\n`;
  md += `| :--- | :--- | :--- |\n`;
  
  story.pages.forEach(page => {
    const ext = (story.id === "creative_girl_01" || story.id === "classic_01") ? "png" : "jpg";
    const fileName = `${story.id}_${page.pageNumber}.${ext}`;
    
    // Process text
    let cleanText = page.text.replace(/\[이름\]/g, "민지").replace(/\{\{name\}\}/g, "민지").replace(/\(이\)/g, "").trim();
    cleanText = cleanText.replace(/\r?\n|\r/g, " "); // remove newlines inside cells
    
    // Generate prompt
    let prompt = generatePrompt(story.id, page.pageNumber, page.text);
    prompt = prompt.replace(/\r?\n|\r/g, " "); // remove newlines inside cells
    
    md += `| \`${fileName}\` | ${prompt} | ${cleanText} |\n`;
  });
  
  md += `\n---\n`;
});

fs.writeFileSync(guidePath, md, 'utf8');
console.log('prompt_guide.md successfully compiled with all ' + stories.length + ' stories!');
