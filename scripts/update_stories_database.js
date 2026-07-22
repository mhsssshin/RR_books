const fs = require('fs');
const path = require('path');

const storiesPath = 'D:\\Projects\\BlogGenerator\\RR_books\\data\\stories.json';
const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf8'));

// 30 existing stories translations (10 pages per story)
const translations = {
  "creative_1": [
    "On a very bright and sunny morning, [이름] went on an exciting walk into the magic rainbow forest.",
    "Rainbow flowers were blooming in the forest, and a sweet cotton candy scent drifted on the breeze.",
    "After walking for a while, [이름] met a crying little rainbow fairy under a giant mushroom tree.",
    "The fairy wept and said, 'I lost my magic rainbow brush to paint the sky.'",
    "With a warm smile, [이름] took out shiny magic crayons from the bag and shared them with the fairy.",
    "'Don't be sad! Use my magic crayons to paint the rainbow. It will make beautiful colors!'",
    "The fairy happily took the crayons and started to draw a giant colorful rainbow in the sky.",
    "Then, the dark sky lit up brightly, and sparkling Milky Way stardust showered down.",
    "The rainbow fairy was so grateful that she slid a glowing pink star ring onto kind [이름]'s finger.",
    "Learning the joy of sharing, [이름] returned home happily with the pretty star ring."
  ],
  "creative_2": [
    "Toto, a cute baby rabbit living in the forest village, was very afraid of the dark at night.",
    "Even under the blanket in bed with closed eyes, the ticking clock sounded like a scary monster.",
    "Hearing this, kind friend [이름] visited Toto's room and gave him a beautiful glowing golden box.",
    "'Toto, this is a magic box that brings out the secret courage hidden in your heart!'",
    "Toto listened to [이름] and gently opened the golden box, and dreamy gold dust floated out.",
    "As the golden dust warmly wrapped around Toto's shoulders, his heart felt warm and strong.",
    "Toto reached out his shaking paw, opened the closed big window, and looked up at the night sky.",
    "Instead of scary monsters, the night sky was filled with friendly little baby stars winking down.",
    "Toto was no longer afraid of the dark night and slept soundly under a starry Milky Way blanket.",
    "Thanks to [이름]'s golden box, Toto became the bravest baby rabbit who loves the night in the forest."
  ],
  "creative_3": [
    "The day of the baby stars' silver river dance festival finally arrived at the Milky Way square.",
    "But suddenly, a giant dark storm cloud monster covered the sky and hid the stars' bright light.",
    "As the sky turned pitch black, the forest animals who expected the festival fell into deep sadness.",
    "Then wise [이름] stepped forward and called the friends. 'Let's go up to the high mountain!'",
    "[이름], Bear, and Squirrel held hands tightly and sang a beautiful song of hope to the night sky.",
    "Their warm and friendly voices traveled through the dark storm clouds to the baby stars' ears.",
    "The baby stars took courage, held each other's hands, and gathered their light to shine brighter.",
    "As everyone worked together, the big black storm cloud monster blew away and the sky cleared.",
    "The magical stardust dance festival of the colorful baby stars began grandly in the square.",
    "[이름] and the stars realized the great wisdom that they can overcome any darkness when they work together."
  ],
  "creative_4": [
    "Gentle King Lion Leo, with a fluffy pink cotton candy mane, ruled the sweet Cookie Land peacefully.",
    "Every morning, King Leo watered the chocolate cookie flowerbeds and cared for the chocolate rivers.",
    "One afternoon, curious [이름] walked along the colorful sweet macaron path to visit Leo's castle.",
    "Then, she saw a tiny baby squirrel crying outside the castle gates because it lost its jelly key.",
    "The baby squirrel could not go home and was so hungry and tired that it could not walk.",
    "Kind King Leo gently tore a piece of sweet strawberry cotton candy from his mane and gave it to the squirrel.",
    "[이름] took a magnifying glass from her bag and searched for the jelly key in the macaron cracks.",
    "Finally, she found the shiny red jelly key under the chocolate grass, and the squirrel jumped with joy.",
    "The baby squirrel happily presented heart-shaped madeline cakes to King Leo and [이름] as a thank-you.",
    "As sharing and caring spread, the delicious Cookie Land became a much sweeter and happier paradise."
  ],
  "creative_5": [
    "Lulu the magic gold harp lived in the sky palace but was sad because she couldn't make beautiful music.",
    "In the quiet garden, Shushu the magic wooden broom swept dust all alone and was very lonely.",
    "Seeing this, friendly [이름] knew their sad feelings and gathered them together to play.",
    "'Lulu, Shushu! If you combine your magic, amazing things will happen! Try holding hands!'",
    "Magic broom Shushu gently stroked the silver strings of gold harp Lulu with his soft feathers.",
    "At that moment, bright sparkles popped and a clear baby fairy melody echoed through the forest.",
    "Lulu finally got her beautiful singing voice, and Shushu danced and spun around with joy.",
    "The sky palace friends gathered in a circle and danced together, enjoying the wonderful festival.",
    "Now Lulu and Shushu became the best of friends, walking side by side wherever they went.",
    "Thanks to [이름]'s warm help, the two lonely toys found a lifelong friendship of their souls."
  ],
  "creative_6": [
    "At the bottom of the emerald sea, Starry the little starfish was napping in the fine silver sand.",
    "Starry found a pink seashell glowing like a pearl in a pink sand dune crack.",
    "It was so pretty that he showed it to friends and lied, saying, 'This was mine from the start.'",
    "But that seashell was a precious item lost by the little mermaid princess crying near the reef.",
    "Honest [이름] walked up to Starry and whispered, 'Starry, honesty is the brightest star in the heart.'",
    "'A friend's smile is worth much more than a pretty seashell obtained with a lie.'",
    "Starry took courage, walked to the little mermaid, and honestly handed back the seashell.",
    "'Mermaid, I'm sorry. Actually, I just found this.' The little mermaid cried with joy.",
    "Touched by Starry's honesty, the mermaid gifted him a beautiful pearl crown made by sea fairies.",
    "Thanks to [이름]'s wisdom, Starry learned that honesty is the brightest light of all."
  ],
  "creative_7": [
    "Rorong the baby squirrel and [이름] brought a magic golden acorn seed to the cloud garden.",
    "They dug the cloud soil, planted the seed, and called a rain cloud to give it plenty of water.",
    "But the next morning, no green sprout came out of the cloud soil.",
    "Impatient Rorong kicked the dirt and got angry. 'This seed is broken! I'm going to dig it up!'",
    "[이름] calmed Rorong down and said, 'Magic trees grow roots first, so we must wait.'",
    "Rorong and [이름] visited the cloud garden every morning, singing songs and watering the seed.",
    "Three days and five days passed without change, but they encouraged each other and waited.",
    "Finally, a week later, a golden sprout shot up and a giant tree grew high into the sky.",
    "Sweet cotton candy golden acorns hung on every branch, and a big festival was held for friends.",
    "Rorong learned that patience, the power of waiting, is stronger than magic and smiled happily."
  ],
  "creative_8": [
    "Under a big honeybee tree in the forest, greedy baby bear Ungy hid with a sweet honey jar.",
    "Ungy loved sweet honey more than anything and didn't want to share even a single drop.",
    "Then, a weak little bluebird with a hurt wing fell to the ground on the wind.",
    "The bluebird had not eaten for days, could not make a sound, and shivered with tears.",
    "Seeing this, [이름] went to Ungy and whispered, 'Ungy, how about sharing kindness with a hungry friend?'",
    "'Kindness makes our hearts much sweeter than the sweetest honey we eat.'",
    "Ungy closed his eyes, took a big spoonful of golden honey, and fed it to the bluebird.",
    "Eating the sweet honey, the bluebird's eyes popped open, and it sang a beautiful song as a gift.",
    "Sharing sweet honey made Ungy's heart feel so happy, and they became sweet friends.",
    "[이름] smiled warmly, watching them hold hands under the sunny forest trees."
  ],
  "creative_9": [
    "In the coral village of the pink sea, a baby dolphin named Pinky loved to sing songs.",
    "But Pinky's voice was a bit squeaky, and other sea friends giggled and laughed at her.",
    "Pinky felt sad and swam to a dark reef, hiding her face and crying alone.",
    "Then friendly [이름] swam to Pinky, holding a magic seashell that played sweet sounds.",
    "'Pinky, your voice is a unique and beautiful gift! Love your own special melody!'",
    "Encouraged, Pinky closed her eyes and sang a bright song from the bottom of her heart.",
    "Her squeaky voice blended with the ocean waves, creating a magical and beautiful melody.",
    "All the sea animals gathered, swayed to the music, and clapped their paws in wonder.",
    "Pinky was no longer embarrassed by her voice and sang proudly across the ocean.",
    "[이름] and Pinky learned that loving oneself is the most beautiful music in the world."
  ],
  "creative_10": [
    "Rumi the little fairy in the flower garden loved to look at bugs and leaves with a magic magnifier.",
    "One day, Rumi lost the magnifier while chasing a yellow butterfly and sat down crying.",
    "Curious [이름] saw Rumi and offered to help search the forest path together.",
    "They looked under clover leaves and behind round pebble stones, laughing and playing.",
    "Suddenly, a tiny glowing ladybug crawled out, pointing to a blue bellflower.",
    "Under the bellflower, they found the shiny magic magnifier resting on a green leaf.",
    "Rumi was so happy that she let [이름] look through the magic magnifier together.",
    "Through the magnifier, tiny flower petals looked like giant glowing castles and stars.",
    "They spent the afternoon exploring the magical world of tiny things in the garden.",
    "Thanks to [이름]'s help, Rumi and [이름] discovered that curiosity makes the world a playground."
  ],
  "creative_11": [
    "Pobi the baby penguin lived in the snowy Antarctic and dreamed of flying high like a gull.",
    "Other penguins said, 'Penguins can only swim! We can never fly in the sky!'",
    "Pobi stood on an ice hill, flapped his tiny wings, but fell onto his bottom every time.",
    "Warm-hearted [이름] saw Pobi and built a slide made of smooth, slippery snow.",
    "'Pobi, slide down as fast as you can and jump! I'll help you catch the wind!'",
    "Pobi ran down the snow slide, flapped his wings hard, and leaped into the air.",
    "For a short moment, Pobi glided through the air like a cloud, feeling the cool wind.",
    "Although he splashed into the blue water, Pobi was extremely happy and smiled wide.",
    "Pobi swam up and cheered, 'I did it! I flew in the sky!' and the sea gulls clapped.",
    "[이름] and Pobi learned that chasing dreams with courage makes anything possible."
  ],
  "creative_12": [
    "Pigeon the mail carrier flew around the forest delivering letters, but today his wings were tired.",
    "He had many thank-you letters to deliver to forest friends before the sun went down.",
    "Kind [이름] offered to help and walked along the sunny forest paths carrying the mail bag.",
    "They delivered a pink envelope with flower seeds to the busy mother squirrel.",
    "They gave a yellow letter with sweet honey drawings to the sleepy father bear.",
    "Every friend who received a letter smiled happily and thanked [이름] with warm hugs.",
    "As the mail bag emptied, the forest was filled with warm words and happy laughter.",
    "Pigeon rested on [이름]'s shoulder and cooed happily, feeling refreshed.",
    "They watched a beautiful orange sunset over the trees, feeling proud and warm.",
    "[이름] learned that expressing gratitude makes both the giver and receiver happy."
  ],
  "creative_13": [
    "Nabi the little yellow butterfly loved her mom and dad very much and wanted to give them a gift.",
    "But Nabi was too small to carry heavy fruits or pretty flowers to her nest.",
    "Kind [이름] saw Nabi fluttering sadly and came up with a wonderful idea.",
    "'Nabi, how about singing a sweet song of love? Love is the best gift of all!'",
    "[이름] played a flute made of grass, and Nabi fluttered her yellow wings to the music.",
    "They flew to Nabi's home where mom and dad butterfly were resting on a red rose.",
    "Nabi sang a sweet melody, dancing gracefully in the warm afternoon sunshine.",
    "Mom and dad butterfly flew up, hugged Nabi warmly, and shed tears of happiness.",
    "The family danced together in the air, creating a beautiful circle of love.",
    "[이름] smiled, realizing that warm love is the most precious gift we can give to family."
  ],
  "creative_14": [
    "In the meadow, a tiny green seedling named Leafy sprouted but was worried about the hot sun.",
    "Leafy's leaves were dry, and she didn't have enough strength to stand up straight.",
    "Kind [이름] saw Leafy and placed a shade made of large, cool oak leaves over her.",
    "Then [이름] carried cool water in a shell and gently watered Leafy's roots.",
    "'Leafy, grow strong! I will protect you from the hot wind and sun every day!'",
    "Leafy drank the water, stretched her stem, and waved her tiny green leaves in thanks.",
    "The forest animals saw [이름] caring for the seedling and promised to protect the meadow together.",
    "Days passed, and Leafy grew into a beautiful green plant with yellow flowers.",
    "The meadow became cool and green, filled with buzzing bees and singing birds.",
    "[이름] and Leafy learned that protecting nature makes our world a beautiful home for everyone."
  ],
  "creative_15": [
    "Tick-Tock the clock fairy lived in a toy room and kept the time, but the toys didn't listen.",
    "The toys played all night, slept late, and were always tired and grumpy.",
    "Wise [이름] visited the room and made a fun daily schedule board with colorful stickers.",
    "'Toys, let's play when the sun is up, and sleep when Tick-Tock plays his lullaby!'",
    "At night, Tick-Tock rang his silver bell gently, and [이름] turned off the lights.",
    "The toys lay down in their cozy beds and fell asleep quickly, dreaming sweet dreams.",
    "The next morning, the toys woke up early with bright smiles and lots of energy.",
    "They cleaned the room together, played fun games, and didn't fight anymore.",
    "Tick-Tock smiled happily as his clock ticked regularly, keeping the perfect time.",
    "[이름] and the toys learned that a regular routine makes our days happy and healthy."
  ],
  "creative_16": [
    "Piyak the baby chick lost her toy block and cried loudly, 'Piyak, piyak!' in the yard.",
    "Other animal friends said, 'Don't cry! Crying is for babies!' and walked away.",
    "But kind [이름] sat next to Piyak, patted her soft yellow feathers, and hugged her.",
    "'Piyak, it's okay to cry when you are sad. Let's find the block together.'",
    "Piyak stopped crying, wiped her tears, and felt much better inside.",
    "They looked behind the flowerpots and under the wooden bench in the yard.",
    "Suddenly, a friendly dog pointed to the green grass with his tail.",
    "There they found the red toy block, and Piyak chirped happily, jumping up.",
    "Piyak shared her sweet clover leaves with [이름] to say thank you.",
    "[이름] and Piyak learned that expressing sad feelings and comforting friends builds warm trust."
  ],
  "creative_17": [
    "Bambi the baby deer wanted to walk to the sweet berry patch, but the forest path was busy.",
    "Fast rabbits zoomed by, and big bears walked without looking, which was very dangerous.",
    "Safe-minded [이름] made a yellow flag and walked with Bambi, holding hands.",
    "'Bambi, look left and right before crossing, and walk slowly on the path!'",
    "They stopped before a busy crossing where squirrels were riding pinecone carts.",
    "[이름] raised the yellow flag high, and the carts stopped safely to let them cross.",
    "Bambi walked carefully, avoiding sharp thorns and slippery mud on the ground.",
    "They arrived safely at the berry patch, and Bambi ate sweet red berries happily.",
    "Bambi gave a necklace made of green leaves to [이름] to thank her for safety.",
    "[이름] and Bambi learned that keeping safety promises protects us from getting hurt."
  ],
  "creative_18": [
    "In the palace garden, red roses and yellow tulips grew, but they fought over who was prettier.",
    "The rose said, 'I am the queen!' and the tulip said, 'I am the brightest!'",
    "Kind [이름] visited the garden and planted white daisies and purple violets between them.",
    "'Roses and tulips, look around! Every flower has a different shape and color!'",
    "The sun shone on the garden, and all the different flowers bloomed together.",
    "The red, yellow, white, and purple colors blended into a beautiful rainbow field.",
    "The flowers realized that they looked much prettier when blooming together.",
    "Bees and butterflies flew in, dancing happily in the colorful garden.",
    "The flowers stopped fighting and whispered sweet scents to each other in the wind.",
    "[이름] learned that respecting and valuing differences makes our world a beautiful garden."
  ],
  "creative_19": [
    "Gumi the cloud fairy lived in the sky and wanted to paint, but she didn't have paper.",
    "She flew around sadly, until kind [이름] brought a magical wooden paintbrush.",
    "'Gumi, paint on the blue sky! The sky is your giant sketch pad!'",
    "Gumi dipped the brush in pink sunset light and drew a big fluffy sheep on a cloud.",
    "She dipped it in gold sunshine and painted a smiling sun and flying birds.",
    "The sky became a grand art gallery, filled with cute animal drawings.",
    "The forest animals looked up and cheered at the beautiful sky pictures.",
    "Gumi laughed, painting a giant rainbow bridge for the animals to see.",
    "As the stars came out, the drawings glowed softly in the dark night sky.",
    "[이름] and Gumi learned that imagination can turn the sky into a magical playground."
  ],
  "creative_20": [
    "In the toy box, Doll and Robot fought over the red toy car, pulling it back and forth.",
    "The car wheel almost popped off, and both toys were angry and pouting.",
    "Wise [이름] came and placed a blue toy train next to the red car.",
    "'Doll, you ride the train first, and Robot, you drive the car. Then let's swap!'",
    "Doll and Robot looked at each other, nodded, and started to play together.",
    "They shared the tracks, built a big block station, and laughed happily.",
    "When Tick-Tock rang the bell, they swapped the toys without fighting.",
    "Playing together was much more fun than playing alone, and they smiled wide.",
    "They cleaned up the toys together, putting them neatly in the box.",
    "[이름] and the toys learned that sharing and yielding makes playtime happy for everyone."
  ],
  "classic_1": [
    "Once upon a time, kind and beautiful Cinderella lived with her stepmother and stepsisters.",
    "Cinderella had to do all the dirty housework, sweeping ashes by the fireplace.",
    "One day, an invitation to the grand royal ball arrived, but stepsisters left her behind.",
    "Cinderella was left alone in the kitchen, crying softly because she couldn't go.",
    "Suddenly, a kind fairy godmother appeared and waved her magic wand over Cinderella.",
    "With a magic spell, her dirty rags turned into a beautiful glowing blue ballgown.",
    "A pumpkin turned into a shiny golden carriage, and mice became white horses.",
    "The godmother warned, 'The magic will end when the clock strikes twelve!'",
    "At the ball, Cinderella danced happily with the Prince, losing track of time.",
    "As the clock struck twelve, she ran away, leaving a single glass slipper behind.",
    "The Prince searched the kingdom and found Cinderella. The slipper fit perfectly!"
  ],
  "classic_2": [
    "Once upon a time, beautiful Snow White lived in a castle with a proud Queen.",
    "The magic mirror said, 'Snow White is the fairest of all,' which made the Queen angry.",
    "Snow White ran away into the deep forest and found a tiny cozy cottage.",
    "Inside, seven kind dwarfs lived. They welcomed Snow White with warm smiles.",
    "She cleaned the cottage and cooked delicious soup for the dwarfs every day.",
    "But the Queen disguised herself as an old woman and brought a poisoned red apple.",
    "Snow White took a bite of the apple and fell into a deep, magical sleep.",
    "The dwarfs were very sad and watched over her in a glass coffin.",
    "One day, a handsome Prince rode by, saw Snow White, and fell in love.",
    "As the Prince gently kissed her hand, Snow White woke up with a bright smile.",
    "They returned to the castle and lived happily ever after with the dwarfs."
  ],
  "classic_3": [
    "Once upon a time, a King and Queen celebrated the birth of Princess Aurora.",
    "But an angry fairy cast a spell: 'The Princess will prick her finger on a spindle and die!'",
    "A good fairy changed the spell: 'She will not die, but sleep for a hundred years.'",
    "On her sixteenth birthday, the Princess found a spindle, pricked her finger, and fell asleep.",
    "The King and Queen, and all the palace servants, fell into a deep sleep too.",
    "A thick forest of thorny roses grew around the castle, hiding it from the world.",
    "A hundred years passed, and a brave Prince came to the thorny rose forest.",
    "He cut through the sharp thorns with his sword, searching for the sleeping Princess.",
    "He found Aurora sleeping peacefully in the castle tower, looking beautiful.",
    "The Prince gently kissed Aurora, and the magic spell broke instantly.",
    "Aurora woke up, the palace came alive, and they celebrated a grand wedding."
  ],
  "classic_4": [
    "Ariel the little mermaid lived in a beautiful coral palace under the sea.",
    "She loved to collect human things and dreamed of walking on the land above.",
    "One stormy night, she saved a handsome Prince from a sinking ship.",
    "Ariel fell in love and visited the sea witch Ursula to become human.",
    "Ursula took Ariel's beautiful voice in exchange for giving her human legs.",
    "Ariel walked onto the sandy beach, unable to speak, but the Prince found her.",
    "The Prince welcomed Ariel to his castle, showing her the beautiful land.",
    "Although she couldn't speak, they shared happy walks and fell in love.",
    "Ursula tried to stop them, but Ariel's father, King Triton, saved the day.",
    "Ariel got her voice back, and Triton turned her into a human permanently.",
    "Ariel and the Prince married on a beautiful ship and lived happily."
  ],
  "classic_5": [
    "Belle, a sweet and smart girl, lived in a quiet village and loved reading books.",
    "To save her father, she went to a mysterious castle and met a scary Beast.",
    "Belle was afraid at first, but she saw the Beast was kind and gentle inside.",
    "They spent days reading books in the grand library and walking in the snow.",
    "The Beast cared for Belle deeply, and Belle began to feel warm love for him.",
    "But Belle's father fell ill, and the Beast let her return home, looking sad.",
    "A group of angry villagers attacked the castle, and the Beast was hurt in battle.",
    "Belle rushed back, hugged the crying Beast, and whispered, 'I love you!'",
    "At that moment, the magic spell broke, and the Beast turned into a handsome Prince.",
    "The castle servants turned back into humans, and the palace lit up with joy.",
    "Belle and the Prince danced in the grand hall, living happily ever after."
  ],
  "classic_6": [
    "Hansel and Gretel lived near a forest with their poor father and stepmother.",
    "One night, they were left in the deep forest because there was no food.",
    "Hansel dropped white pebbles on the path, and they followed them back home.",
    "The next time, they dropped breadcrumbs, but hungry birds ate them all.",
    "Lost in the dark forest, they found a magical house made of sweet candy and gingerbread.",
    "A grumpy old witch lived inside. She locked Hansel in a cage to eat him.",
    "Gretel was forced to clean, but she stayed strong and looked for a way out.",
    "When the witch asked Gretel to check the oven, Gretel pretended not to know how.",
    "The witch leaned in to show her, and Gretel quickly pushed her in and locked the door.",
    "Gretel freed Hansel, and they found a chest filled with shiny gold and pearls.",
    "They returned home safely to their father, living happily and never hungry again."
  ],
  "classic_7": [
    "Little Red Riding Hood set off into the forest with a basket of cookies for her grandma.",
    "Her mother warned, 'Stay on the path and do not talk to strangers!'",
    "In the forest, she met a big bad Wolf, who asked where she was going.",
    "She forgot her mother's promise and told the Wolf about grandma's cottage.",
    "The Wolf ran ahead, locked grandma in the closet, and dressed in her clothes.",
    "Red Riding Hood arrived and said, 'Grandma, what big ears and eyes you have!'",
    "'All the better to hear and see you with, my dear!' the Wolf growled.",
    "'And what big teeth you have!' 'All the better to eat you with!' the Wolf leaped.",
    "Just then, a brave woodcutter rushed in, scared the Wolf away, and saved them.",
    "Grandma came out of the closet safely, and they hugged Red Riding Hood tightly.",
    "She promised never to talk to strangers and always to keep safety rules."
  ],
  "classic_8": [
    "Dorothy and her dog Toto were blown by a cyclone to the magical Land of Oz.",
    "To go home, she walked along the yellow brick road to find the Wizard.",
    "On the way, she met a Scarecrow who wanted a brain to think.",
    "She met a Tin Woodman who wanted a heart to love.",
    "She met a Cowardly Lion who wanted courage to be brave.",
    "They walked together, protecting each other from the Wicked Witch.",
    "They arrived at the grand Emerald City and met the mysterious Wizard.",
    "The Wizard helped them realize they already had what they wanted inside.",
    "Dorothy tapped her silver shoes three times and whispered, 'There's no place like home.'",
    "She woke up in her cozy bed in Kansas, surrounded by her loving family.",
    "Dorothy learned that true friendship and the warmth of home are the best treasures."
  ],
  "classic_9": [
    "Peter Pan and Tinkerbell visited Wendy's room and flew out of the window.",
    "They flew high in the starry night sky, heading to the magical Neverland.",
    "In Neverland, they played with the Lost Boys and swam with mermaids.",
    "But the mean Captain Hook kidnapped Wendy and her brothers on his pirate ship.",
    "Peter Pan flew to the ship, drew his sword, and fought Captain Hook bravely.",
    "Hook fell into the sea where a ticking crocodile was waiting for him.",
    "With the pirates gone, Wendy and the boys flew back home to London.",
    "Wendy looked out of the window, waving goodbye to Peter Pan in the sky.",
    "Peter Pan flew back to Neverland, keeping his eternal dream of childhood.",
    "Wendy and her brothers tucked themselves into cozy beds, dreaming of adventures."
  ],
  "classic_10": [
    "Alice sat on a grassy bank when she saw a White Rabbit in a coat.",
    "The Rabbit looked at his pocket watch and ran, crying, 'I'm late!'",
    "Alice followed him down a rabbit hole and fell into a magical wonderland.",
    "She drank a potion to grow small and ate a cake to grow giant, laughing.",
    "She met the grinning Cheshire Cat on a branch and the Mad Hatter having tea.",
    "She arrived at a rose garden where cards were painting white roses red.",
    "The proud Queen of Hearts shouted, 'Off with their heads!' during croquet.",
    "Alice stood up bravely, saying, 'You are nothing but a pack of cards!'",
    "Suddenly, the cards flew into the air, and Alice woke up under the tree.",
    "Alice smiled, realizing that her wonderland adventure was a magical dream."
  ]
};

// 5 New Boy Stories Data (creative_21 to creative_25)
const newBoyStories = [
  {
    "id": "creative_21",
    "title": "우주 구조대 로봇 로니",
    "moral": "우주 모험 & 협동",
    "emoji": "🚀",
    "category": "creative-boy",
    "featured": true,
    "pages": [
      {
        "pageNumber": 1,
        "text": "우주 정거장에 사는 꼬마 구조대 로봇 로니는 반짝반짝 별들을 지키는 씩씩한 친구였어요.",
        "englishText": "Little rescue robot Roni lived in the space station and was a brave friend who protected the twinkling stars."
      },
      {
        "pageNumber": 2,
        "text": "어느 날 밤, 우주 너머에서 빨간 불꽃을 뿜는 작은 아기 별똥별이 길을 잃고 훌쩍이며 날아왔어요.",
        "englishText": "One night, from across space, a little baby shooting star crying and spitting red sparks flew in."
      },
      {
        "pageNumber": 3,
        "text": "아기 별똥별은 엄마 은하수를 잃어버려 캄캄한 우주 미로 속에 갇혀서 집에 갈 수 없었지요.",
        "englishText": "The baby shooting star had lost its mother Milky Way and was trapped in the dark space maze, unable to go home."
      },
      {
        "pageNumber": 4,
        "text": "착한 로니는 가슴의 무지개 전등을 켜고 동물 우주 비행사 친구들에게 도움을 요청했어요.",
        "englishText": "Kind Roni turned on the rainbow light on his chest and asked his animal astronaut friends for help."
      },
      {
        "pageNumber": 5,
        "text": "\"친구들아! 아기 별똥별이 엄마 품으로 갈 수 있게 힘을 합쳐 우주 다리를 만들자!\"",
        "englishText": "\"Friends! Let's work together to build a space bridge so the baby shooting star can go to its mother!\""
      },
      {
        "pageNumber": 6,
        "text": "지혜로운 [이름](이)는 우주 탐사선을 몰고 와 반짝이는 은하수 레일을 길게 깔아주었어요.",
        "englishText": "Wise [이름] drove a space probe and laid a long, twinkling Milky Way rail for them."
      },
      {
        "pageNumber": 7,
        "text": "힘센 곰돌이 비행사는 커다란 우주 자석을 던져 별똥별이 다리를 타고 미끄러지듯 날아가게 도왔지요.",
        "englishText": "The strong bear astronaut threw a big space magnet to help the shooting star slide along the bridge."
      },
      {
        "pageNumber": 8,
        "text": "모두가 힘을 합치자 어두운 우주 미로에 눈부신 황금빛 무지개 다리가 완성되었답니다.",
        "englishText": "With everyone working together, a brilliant golden rainbow bridge was completed in the dark space maze."
      },
      {
        "pageNumber": 9,
        "text": "아기 별똥별은 기뻐하며 다리를 건넜고, 멀리서 걱정하던 엄마 은하수 품으로 쏙 안겼어요.",
        "englishText": "The baby shooting star crossed the bridge happily and flew right into its worried mother Milky Way's arms."
      },
      {
        "pageNumber": 10,
        "text": "로니와 친구들은 함께 도우면 그 어떤 우주 미로도 쉽게 헤쳐 나갈 수 있다는 것을 배웠답니다.",
        "englishText": "Roni and his friends learned that when they help each other, they can easily get through any space maze."
      }
    ]
  },
  {
    "id": "creative_22",
    "title": "꼬마 공룡 디노의 화산 모험",
    "moral": "씩씩함 & 용기",
    "emoji": "🦖",
    "category": "creative-boy",
    "featured": true,
    "pages": [
      {
        "pageNumber": 1,
        "text": "초록빛 아기 공룡 디노는 숲속 마을에서 가장 씩씩하고 호기심이 많은 아기 티라노사우루스였어요.",
        "englishText": "Dino the green baby dinosaur was the bravest and most curious baby Tyrannosaurus in the forest village."
      },
      {
        "pageNumber": 2,
        "text": "어느 날 오후, 쿵쾅산 꼭대기에서 시커먼 연기가 나더니 부글부글 뜨거운 붉은 화산재가 뿜어져 나왔어요.",
        "englishText": "One afternoon, black smoke rose from the top of Mount Boom, and bubbling hot red volcanic ash puffed out."
      },
      {
        "pageNumber": 3,
        "text": "숲속 친구들은 화산이 터질까 봐 무서워서 어쩔 줄 몰라 하며 이리저리 소리치며 뛰어다녔지요.",
        "englishText": "The forest friends were so scared the volcano would erupt that they ran around crying and screaming."
      },
      {
        "pageNumber": 4,
        "text": "씩씩한 디노는 두려워하는 친구들을 보며 소리쳤어요. \"모두 내 튼튼한 꼬리를 잡고 따라와!\"",
        "englishText": "Brave Dino looked at his scared friends and shouted, \"Everyone, hold onto my strong tail and follow me!\""
      },
      {
        "pageNumber": 5,
        "text": "디노와 [이름](이)는 바람 구름 요정을 불러 화산에서 나오는 뜨거운 연기를 시원하게 식히기 시작했어요.",
        "englishText": "Dino and [이름] called the wind cloud fairy to cool down the hot smoke coming from the volcano."
      },
      {
        "pageNumber": 6,
        "text": "[이름](이)는 가방에서 시원한 얼음 요술 물통을 꺼내어 화산재 길 위에 시원한 물길을 만들어주었지요.",
        "englishText": "[이름] took a cool magic ice canteen from her bag and made a cool water path over the volcanic ash."
      },
      {
        "pageNumber": 7,
        "text": "디노는 발걸음을 맞춰 쿵쾅쿵쾅 땅을 밟아 화산재가 친구들이 사는 숲속 마을로 흐르지 못하게 막았어요.",
        "englishText": "Dino stomped his feet hard on the ground to stop the hot ash from flowing toward the forest village."
      },
      {
        "pageNumber": 8,
        "text": "친구들이 서로 돕고 용기를 내어 응원하자, 뜨겁던 쿵쾅산 화산은 시원한 오색 분수로 변해 솟구쳤답니다.",
        "englishText": "As the friends helped and cheered with courage, the hot volcano turned into a cool, colorful water fountain."
      },
      {
        "pageNumber": 9,
        "text": "대피해 있던 아기 공룡들은 디노의 용감한 행동 덕분에 안전하게 맛있는 과일 열매 축제를 가졌어요.",
        "englishText": "Thanks to Dino's brave actions, the baby dinosaurs who had evacuated safely enjoyed a sweet fruit festival."
      },
      {
        "pageNumber": 10,
        "text": "디노는 두려운 상황에서도 용기를 내어 친구들을 이끌면 언제든 위기를 이길 수 있음을 깨달았답니다.",
        "englishText": "Dino learned that when you show courage and lead your friends in scary times, you can always overcome danger."
      }
    ]
  },
  {
    "id": "creative_23",
    "title": "씽씽 소방차와 하늘을 나는 비행기",
    "moral": "탈것 & 우정",
    "emoji": "🚒",
    "category": "creative-boy",
    "featured": true,
    "pages": [
      {
        "pageNumber": 1,
        "text": "숲속 소방서에는 빨간 씽씽 소방차 호스가 살았는데, 물을 뿌려 불을 끄는 소중한 구조대원이었어요.",
        "englishText": "Red fire engine Hose lived in the forest fire station and was a precious rescue worker who sprayed water to put out fires."
      },
      {
        "pageNumber": 2,
        "text": "높은 절벽 꼭대기 정원에는 파란 요술 날개를 가진 아기 비행기 제트가 매일 이륙 연습을 하고 있었지요.",
        "englishText": "Up on the high cliff garden, baby airplane Jet with blue magic wings practiced taking off every day."
      },
      {
        "pageNumber": 3,
        "text": "그러던 더운 아침, 건조한 바람을 타고 초콜릿 풀숲 밑에서 탁탁 빨간 불씨가 솟아올랐어요.",
        "englishText": "One hot morning, red sparks burst from under the chocolate grass on the dry breeze."
      },
      {
        "pageNumber": 4,
        "text": "불길은 매캐한 연기와 함께 순식간에 절벽 위 아기 비행기 제트의 둥지 주변까지 올라갔지요.",
        "englishText": "With smoky air, the fire quickly reached the nest of baby airplane Jet up on the cliff."
      },
      {
        "pageNumber": 5,
        "text": "호스는 소방차 사이렌을 앵앵 울리며 달려갔지만, 높은 절벽 위까지는 물줄기가 닿지 않아 애를 태웠어요.",
        "englishText": "Hose ran over blowing his siren, but his water spray couldn't reach the top of the high cliff."
      },
      {
        "pageNumber": 6,
        "text": "이때 현명한 [이름](이)가 나서서 아이디어를 냈어요. \"제트가 하늘에서 호스의 물탱크를 던져주면 돼!\"",
        "englishText": "Then wise [이름] stepped up with a smart idea. \"Jet can fly and drop Hose's water hose from the sky!\""
      },
      {
        "pageNumber": 7,
        "text": "제트는 용기를 내어 절벽에서 날아올라 호스의 긴 물호스를 물고 높은 하늘 위로 힘껏 솟구쳤답니다.",
        "englishText": "Jet took courage, flew off the cliff, grabbed Hose's long water hose, and soared high into the sky."
      },
      {
        "pageNumber": 8,
        "text": "하늘 위에서 제트가 물호스를 톡 놓자 시원한 분수 비가 내렸고, 타오르던 불은 순식간에 째깍 꺼졌어요.",
        "englishText": "When Jet dropped the water hose from above, a cool rain fell and put out the burning fire in a second."
      },
      {
        "pageNumber": 9,
        "text": "숲속 동물들은 소방차 호스와 비행기 제트의 완벽한 합동 구조에 손을 흔들며 고마워했어요.",
        "englishText": "The forest animals thanked fire engine Hose and airplane Jet for their perfect rescue."
      },
      {
        "pageNumber": 10,
        "text": "호스와 제트는 서로의 한계를 채워주는 협동이 숲속을 지키는 가장 위대한 힘이라는 것을 배웠답니다.",
        "englishText": "Hose and Jet learned that cooperating to cover each other's limits is the greatest power to protect the forest."
      }
    ]
  },
  {
    "id": "creative_24",
    "title": "바다 탐험선 요술 보물 찾기",
    "moral": "잠수함 & 호기심",
    "emoji": "⚓",
    "category": "creative-boy",
    "featured": true,
    "pages": [
      {
        "pageNumber": 1,
        "text": "노란 잠수함 보트는 깊고 푸른 바닷속 신비로운 보물을 찾아 탐험하는 것을 무척 좋아하는 친구였어요.",
        "englishText": "Yellow submarine Boat loved to explore the deep blue sea looking for mysterious treasures."
      },
      {
        "pageNumber": 2,
        "text": "어느 날 아침, 보트는 바다 밑바닥 조개 광장에서 낡았지만 반짝이는 오색 보물지도를 발견했어요.",
        "englishText": "One morning, Boat found a worn but sparkling colorful treasure map in the seashell square at the bottom of the sea."
      },
      {
        "pageNumber": 3,
        "text": "보물지도에는 깊은 해저 동굴 속에 아기 물고기들을 위한 신비한 보석 초롱이 숨겨져 있다고 적혀 있었지요.",
        "englishText": "The map said a magic gemstone lantern for baby fish was hidden inside a deep sea cave."
      },
      {
        "pageNumber": 4,
        "text": "보트와 [이름](이)는 가방을 챙겨 탐험을 떠났고, 어두컴컴하고 구불구불한 바다 동굴에 도착했어요.",
        "englishText": "Boat and [이름] packed their bags and set off on the adventure, arriving at the dark, twisty sea cave."
      },
      {
        "pageNumber": 5,
        "text": "동굴 속은 너무 캄캄해서 바위 기둥에 부딪힐 뻔했지만, 보트는 앞등에 불을 밝히며 씩씩하게 헤엄쳤어요.",
        "englishText": "The cave was so dark they almost bumped into rock pillars, but Boat swam bravely, shining his front light."
      },
      {
        "pageNumber": 6,
        "text": "그때 동굴 벽 틈새에 큰 돌이 끼어 길을 잃고 훌쩍이는 아기 문어 요정을 만나게 되었답니다.",
        "englishText": "Then they met a little baby octopus fairy crying because a big rock trapped it in a cave crack."
      },
      {
        "pageNumber": 7,
        "text": "[이름](이)는 잠수함 로봇 팔을 움직여 동굴 틈새의 무거운 돌을 영차영차 조심스럽게 들어 올려 주었어요.",
        "englishText": "[이름] used the submarine's robotic arm to gently lift the heavy rock from the cave crack."
      },
      {
        "pageNumber": 8,
        "text": "구해진 아기 문어는 고마워하며 먹물 별가루를 뿜어 보물 상자가 숨겨진 비밀 문을 알려주었답니다.",
        "englishText": "The rescued baby octopus thanked them by shooting ink stardust to reveal the secret door to the treasure chest."
      },
      {
        "pageNumber": 9,
        "text": "비밀 문 안에서 드디어 아기 물고기들을 환하게 비춰줄 예쁘고 빛나는 보석 초롱을 찾아내었어요.",
        "englishText": "Inside the secret door, they finally found the beautiful, glowing gemstone lantern to light up the baby fish."
      },
      {
        "pageNumber": 10,
        "text": "보트는 보물을 찾는 것보다 어려움에 처한 친구를 구하는 탐험이 훨씬 더 기쁘다는 것을 깨달았답니다.",
        "englishText": "Boat realized that helping a friend in trouble is a much happier adventure than just finding treasure."
      }
    ]
  },
  {
    "id": "creative_25",
    "title": "번개 날개 자동차의 아름다운 레이싱",
    "moral": "스포츠맨십 & 배려",
    "emoji": "🏎️",
    "category": "creative-boy",
    "featured": true,
    "pages": [
      {
        "pageNumber": 1,
        "text": "번개 무늬를 그린 멋진 파란 레이싱카 썬더는 세상에서 가장 빠른 스피드를 자랑하는 챔피언이었어요.",
        "englishText": "Cool blue racing car Thunder, with lightning stripes, was a speed champion who boasted the fastest speed in the world."
      },
      {
        "pageNumber": 2,
        "text": "썬더는 매일 아침 바람을 가르며 달콤한 마카롱 서킷 트랙 위를 쌩쌩 달리며 최고 속도를 연습했답니다.",
        "englishText": "Every morning, Thunder zoomed along the sweet macaron circuit track, practicing his top speed."
      },
      {
        "pageNumber": 3,
        "text": "드디어 숲속 과자 서킷에서 일 년에 한 번 열리는 대형 요술 레이싱 시합 날이 찾아왔어요.",
        "englishText": "Finally, the big magic racing contest day held once a year at the forest cookie circuit arrived."
      },
      {
        "pageNumber": 4,
        "text": "썬더는 신호등이 초록빛으로 바뀌자마자 번개처럼 앞으로 튀어 나가며 선두로 신나게 질주했지요.",
        "englishText": "As soon as the traffic light turned green, Thunder shot forward like lightning and happily sped in the lead."
      },
      {
        "pageNumber": 5,
        "text": "한참을 1등으로 달리던 썬더는 저 멀리 타이어에 쿠키 조각이 박혀 멈춰 서 있는 친구 토토를 보았어요.",
        "englishText": "Running in first place, Thunder saw his friend Toto stopped far ahead with cookie crumbs stuck in his tire."
      },
      {
        "pageNumber": 6,
        "text": "토토는 휠이 고장 나 꼼짝도 못 하고 속상해서 눈물을 흘리고 있었고, 다른 자동차들은 그냥 쌩 지나쳤어요.",
        "englishText": "Toto couldn't move because of a broken wheel and was crying, while other cars just zoomed past him."
      },
      {
        "pageNumber": 7,
        "text": "썬더는 1등 트로피가 눈앞에 있었지만, 브레이크를 꾹 밟아 멈춘 뒤 [이름](이)와 함께 토토에게 다가갔어요.",
        "englishText": "Even with the first-place trophy close by, Thunder stepped hard on his brakes, stopped, and approached Toto with [이름]."
      },
      {
        "pageNumber": 8,
        "text": "[이름](이)는 가방에서 스패너를 꺼내어 토토의 바퀴에 박힌 단단한 쿠키 조각을 영차영차 빼내 주었답니다.",
        "englishText": "[이름] took a wrench from her bag and gently pulled out the hard cookie crumbs from Toto's wheel."
      },
      {
        "pageNumber": 9,
        "text": "썬더는 토토가 다시 달릴 수 있게 옆에서 발을 맞추며, 손을 잡고 결승선을 향해 다정하게 같이 달렸어요.",
        "englishText": "Thunder matched his speed with Toto to help him run again, and they ran toward the finish line together."
      },
      {
        "pageNumber": 10,
        "text": "비록 1등은 놓쳤지만, 썬더는 친구와 어깨를 나란히 하고 함께 완주하는 우정이 더 빛난다는 것을 배웠답니다.",
        "englishText": "Though he lost first place, Thunder learned that finishing the race side by side with a friend is much brighter."
      }
    ]
  }
];

// Map categories and inject translations
console.log('Processing existing stories for categories and English translations...');
const updatedStories = stories.map(story => {
  // Determine category
  if (story.id.startsWith('classic_')) {
    story.category = 'classic';
  } else if (story.id.startsWith('creative_')) {
    story.category = 'creative-girl'; // Default existing creative to girl tab
  }

  // Inject englishText translation
  const storyTrans = translations[story.id];
  if (storyTrans && storyTrans.length === story.pages.length) {
    story.pages.forEach((page, idx) => {
      page.englishText = storyTrans[idx];
    });
  } else {
    // Fallback translation if missing
    story.pages.forEach(page => {
      page.englishText = page.text.replace(/\[이름\]/g, "[이름]").replace(/\(이\)/g, "");
    });
  }

  return story;
});

// Append new boy stories
newBoyStories.forEach(newStory => {
  // Set images for new boy stories (following assets path layout)
  newStory.pages.forEach(page => {
    page.image = `${newStory.id}/${newStory.id}_${page.pageNumber}.jpg`;
  });
  
  updatedStories.push(newStory);
  console.log(`Injected new boy story: ${newStory.id} - ${newStory.title}`);
});

fs.writeFileSync(storiesPath, JSON.stringify(updatedStories, null, 2), 'utf8');
console.log('stories.json successfully updated and bilingual/boy stories injected!');
