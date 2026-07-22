const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/stories.json');
const stories = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const translations = {
  creative_girl_01: { title: "Rorong and the Rainbow Fairy", moral: "Share things nicely with friends." },
  creative_girl_02: { title: "Little Rabbit's Courage Box", moral: "Be brave and do not fear." },
  creative_girl_03: { title: "Baby Stars' Night Sky Festival", moral: "We can do it if we work together." },
  creative_girl_04: { title: "The Friendly Lion of Cookie Land", moral: "Have a kind heart to help hungry friends." },
  creative_girl_05: { title: "Magic Broom and Magic Harp", moral: "Discover friends' strengths and be together." },
  creative_girl_06: { title: "Little Clam's Pearl Necklace", moral: "Enduring hard times brings beautiful results." },
  creative_girl_07: { title: "Squirrel's Acorn Piggy Bank", moral: "Save and prepare for the future." },
  creative_girl_08: { title: "Baby Bear's Honey Pot Journey", moral: "Share food without being greedy." },
  creative_girl_09: { title: "Baby Dolphin's Ocean Cleaning", moral: "Keep our ocean clean and green." },
  creative_girl_10: { title: "Forest Fairy's Magnifying Glass", moral: "Treat small insects precious and protect them." },
  creative_girl_11: { title: "Little Penguin's Ice Fishing", moral: "Do not give up and try until the end." },
  creative_girl_12: { title: "Pigeon Postman's Happy Letter", moral: "Send love to neighbors and share joy." },
  creative_girl_13: { title: "Butterfly and Flowerbed Promise", moral: "Value and keep promises with friends." },
  creative_girl_14: { title: "Tiny Sprout in the Flowerpot", moral: "Cherish life and take care with love." },
  creative_girl_15: { title: "Clock Land's Little Gears", moral: "Everyone does their part to achieve great things." },
  creative_girl_16: { title: "Baby Chick's Warm Embrace", moral: "Comfort and hug sad friends." },
  creative_girl_17: { title: "Baby Deer's Forest Walk", moral: "Keep safety rules and prevent danger." },
  creative_girl_18: { title: "Rainbow Flowerbed Secret", moral: "Respect differences and live in harmony." },
  creative_girl_19: { title: "Cloud Fairy's Drawing Adventure", moral: "Unleash imagination to create new things." },
  creative_girl_20: { title: "Toy Box Friendship", moral: "Cherish toys and play together with friends." },
  creative_boy_01: { title: "Space Robot Roni's Adventure", moral: "Forgive friends' mistakes and hold hands." },
  creative_boy_02: { title: "Baby Dinosaur Dino's Volcano Play", moral: "Refrain from dangerous acts and play safely." },
  creative_boy_03: { title: "Little Fire Engine Hose's Wish", moral: "Helping others is a truly happy thing." },
  creative_boy_04: { title: "Submarine Boat's Undersea Treasure", moral: "The real treasure is the beautiful nature around us." },
  creative_boy_05: { title: "Little Racing Car Thunder's Run", moral: "Keep the racing rules fair and square." },
  classic_01: { title: "Cinderella", moral: "If you have a kind heart, you will be blessed." },
  classic_02: { title: "Snow White", moral: "Do not envy others and treat them with kindness." },
  classic_03: { title: "Sleeping Beauty", moral: "Love overcomes any trials and hardships." },
  classic_04: { title: "The Little Mermaid", moral: "Realize the value of true, selfless love." },
  classic_05: { title: "Beauty and the Beast", moral: "Inner beauty is more important than appearance." },
  classic_06: { title: "Hansel and Gretel", moral: "Gather wisdom to overcome difficult situations." },
  classic_07: { title: "Little Red Riding Hood", moral: "Beware of strangers and listen to parents." },
  classic_08: { title: "The Wizard of Oz", moral: "The wisdom and courage we need are already within us." },
  classic_09: { title: "Peter Pan", moral: "Do not lose pure childhood innocence and adventure." },
  classic_10: { title: "Alice in Wonderland", moral: "Grow through new curiosities and adventures." }
};

stories.forEach(story => {
  const trans = translations[story.id];
  if (trans) {
    story.englishTitle = trans.title;
    story.englishMoral = trans.moral;
  }
});

fs.writeFileSync(dbPath, JSON.stringify(stories, null, 2), 'utf8');
console.log("stories.json database updated with englishTitle and englishMoral fields!");
