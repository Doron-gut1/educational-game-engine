/**
 * הגדרת דמויות למשחק פסח - "המסע לחירות"
 */
export const passoverCharacters = {
  rabbi_elazar: {
    name: "רבי אלעזר הסופר",
    avatar: "rabbi_elazar.png",
    description: "דמות ראשית שמספרת את הסיפור ומציגה את החידות",
    personality: "חכם, סבלני, בקיא בתורה ובמדרשים",
    animations: {
      idle: "rabbi_elazar_idle.json",
      talking: "rabbi_elazar_talking.json",
      excited: "rabbi_elazar_excited.json"
    },
    soundEffects: {
      greeting: "rabbi_elazar_greeting.mp3",
      encouragement: "rabbi_elazar_encouragement.mp3"
    },
    quotes: [
      "שמעו נא לדברי חכמים...",
      "האם תוכלו לפתור את החידה הבאה?",
      "כל הכבוד! הצלחתם לגלות את חלק המגילה הבא!",
      "היסטוריה היא לא רק אוסף של עובדות, אלא סיפור חי של מסעות וערכים"
    ]
  },
  
  miriam: {
    name: "מרים הנביאה",
    avatar: "miriam.png",
    description: "דמות עזר שמופיעה כשנדרש רמז או עזרה",
    personality: "חכמה, תומכת, אוהבת",
    animations: {
      idle: "miriam_idle.json",
      talking: "miriam_talking.json",
      helping: "miriam_helping.json"
    },
    soundEffects: {
      hint: "miriam_hint.mp3",
      success: "miriam_success.mp3"
    },
    quotes: [
      "האם תרצו לקבל רמז?",
      "בואו אסייע לכם למצוא את הדרך...",
      "לפעמים, התשובה נמצאת היכן שאיננו מצפים לה",
      "אל תתייאשו! אתם קרובים לפתרון"
    ]
  },
  
  moses: {
    name: "משה רבנו",
    avatar: "moses.png",
    description: "מנהיג עם ישראל ומובילם מעבדות לחרות",
    personality: "צנוע, רועה נאמן, מנהיג",
    animations: {
      idle: "moses_idle.json",
      talking: "moses_talking.json",
      leading: "moses_leading.json"
    },
    quotes: [
      "שלח את עמי ויעבדני",
      "לא בחפזון תצאו ובמנוסה לא תלכון",
      "החירות האמיתית היא החרות לעבוד את ה' ולקיים את מצוותיו"
    ]
  },
  
  pharaoh: {
    name: "פרעה",
    avatar: "pharaoh.png",
    description: "מלך מצרים ששעבד את בני ישראל",
    personality: "קשה עורף, שחצן, אכזר",
    animations: {
      idle: "pharaoh_idle.json",
      talking: "pharaoh_talking.json",
      angry: "pharaoh_angry.json"
    },
    quotes: [
      "מי ה' אשר אשמע בקולו?",
      "לכו לסבלותיכם!",
      "תכבד העבודה על האנשים"
    ]
  }
};

export default passoverCharacters;