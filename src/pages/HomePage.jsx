import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoggerService } from '../services';
import { AssetManager } from '../services/assetManager';

// ייבוא ThemeProvider החדש 
import { ThemeProvider } from '../design-system/ThemeProvider';

// ייבוא רכיבי מערכת העיצוב
import { 
  Button, 
  Card, 
  GlassCard,
  Heading 
} from '../design-system/components';

export function HomePage() {
  const [availableGames, setAvailableGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function loadAvailableGames() {
      setIsLoading(true);
      setError(null);
      
      try {
        // טעינת רשימת המשחקים הזמינים
        const gamesModule = await import('../games/index.js');
        const games = gamesModule.availableGames || [];
        
        // משחקים קבועים לדוגמה (במידה ואין מספיק משחקים)
        const defaultGames = [
          {
            id: 'passover',
            name: 'המסע לחירות',
            description: 'משחק פסח אינטראקטיבי על מסע יציאת מצרים',
            thumbnail: '/assets/games/passover/backgrounds/thumbnail.svg',
            active: true,
            theme: 'passover'
          },
          {
            id: 'tubishvat',
            name: 'חגיגת ט\\"ו בשבט',
            description: 'משחק בנושא ט\\"ו בשבט ושבעת המינים',
            thumbnail: '/assets/games/tubishvat/backgrounds/thumbnail.svg',
            active: false,
            theme: 'tubishvat'
          }
        ];
        
        // שילוב של המשחקים מהמערכת והמשחקים הקבועים
        const allGames = games.length > 0 ? games : defaultGames;
        
        // הוספת נתיבים מלאים לתמונות ממוזערות
        const gamesWithThumbnails = allGames.map(game => ({
          ...game,
          thumbnail: game.thumbnail || `/assets/games/${game.id}/backgrounds/thumbnail.svg`
        }));
        
        setAvailableGames(gamesWithThumbnails);
      } catch (err) {
        LoggerService.error('Error loading available games:', err);
        setError('שגיאה בטעינת רשימת המשחקים');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadAvailableGames();
  }, []);
  
  return (
    <ThemeProvider theme="base">
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden relative">
        {/* אלמנטים דקורטיביים ברקע */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
        
        {/* כותרת עליונה */}
        <div className="container mx-auto px-4 py-10">
          <header className="text-center relative z-10 mb-12">
            <Heading level={1} className="text-4xl md:text-5xl font-bold text-amber-300 mb-3 tracking-wider animate-pulse-soft">
              מסע הדעת
            </Heading>
            <p className="text-lg md:text-xl text-blue-100 mb-4">
              פעילויות לימודיות אינטראקטיביות בנושאי יהדות
            </p>
            
            {/* קו מעוטר */}
            <div className="flex items-center justify-center my-6">
              <div className="h-0.5 w-12 bg-amber-300/50 rounded"></div>
              <div className="mx-4 text-amber-300">✦</div>
              <div className="h-0.5 w-24 bg-amber-300/70 rounded"></div>
              <div className="mx-4 text-amber-300">✦</div>
              <div className="h-0.5 w-12 bg-amber-300/50 rounded"></div>
            </div>
            
            <h2 className="text-xl md:text-2xl text-amber-100 mt-6">בחרו משחק להתחיל</h2>
          </header>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-16 h-16 border-t-4 border-b-4 border-amber-300 border-solid rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <GlassCard className="max-w-lg mx-auto p-6 text-center">
              <p className="text-red-500 font-bold text-lg mb-2">שגיאה</p>
              <p className="text-gray-700">{error}</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
              {availableGames.map((game) => (
                <GameCard 
                  key={game.id}
                  game={game}
                  active={game.active !== false}
                />
              ))}
              
              {/* כרטיס "בקרוב" */}
              <ComingSoonCard />
            </div>
          )}
        </div>
        
        {/* פוטר */}
        <footer className="text-center py-4 mt-16 text-blue-200 text-opacity-70 text-sm relative z-10">
          <p>© מערכת מסע הדעת | כל הזכויות שמורות</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

/**
 * כרטיסיית משחק
 */
function GameCard({ game, active = true }) {
  // עיצוב מותאם לפי משחק
  const gameTheme = game.theme || game.id;
  
  // המרת וריאנטים לא תקינים לברירת מחדל 
  const getValidVariant = (theme) => {
    const validVariants = ['default', 'primary', 'secondary', 'accent', 'translucent', 'passover', 'tubishvat'];
    return validVariants.includes(theme) ? theme : 'default';
  };
  
  if (!active) {
    return (
      <Card 
        variant={getValidVariant(gameTheme)}
        shadow="medium"
        className="h-full flex flex-col overflow-hidden border hover:shadow-xl transition-all duration-300 filter grayscale opacity-60"
      >
        <div className="h-48 overflow-hidden relative">
          <img 
            src={game.thumbnail} 
            alt={game.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = '/assets/shared/placeholders/background_placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
        
        <div className="p-6 flex-grow">
          <Heading level={2} className="text-2xl mb-2 font-bold">
            {game.name}
          </Heading>
          <p className="text-gray-600 mb-4">
            {game.description}
          </p>
        </div>
        
        <div className="p-6 pt-0 mt-auto">
          <Button variant="outline" className="w-full opacity-60 cursor-not-allowed">
            בקרוב
          </Button>
        </div>
        
        {/* תווית בקרוב */}
        <div className="absolute top-3 left-3 bg-gray-800/80 px-3 py-1 rounded-full text-sm text-gray-300 shadow">
          בקרוב
        </div>
      </Card>
    );
  }
  
  return (
    <Card 
      variant={getValidVariant(gameTheme)}
      shadow="large"
      className="h-full flex flex-col overflow-hidden border-2 transition-all duration-300 transform hover:scale-105"
      hoverable={true}
    >
      <div className="h-48 overflow-hidden relative">
        <img 
          src={game.thumbnail} 
          alt={game.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = '/assets/shared/placeholders/background_placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>
      
      <div className="p-6 flex-grow relative">
        <Heading level={2} className={`text-2xl mb-2 font-bold text-${gameTheme === 'passover' ? 'indigo' : 'emerald'}-800`}>
          {game.name}
        </Heading>
        <p className={`text-${gameTheme === 'passover' ? 'indigo' : 'emerald'}-700 mb-4 opacity-90`}>
          {game.description}
        </p>
      </div>
      
      <div className="p-6 pt-0 mt-auto">
        <Link to={`/game/${game.id}`} className="w-full block">
          <Button 
            variant={gameTheme === 'passover' ? 'primary' : 'secondary'} 
            className={`w-full transform transition-all hover:shadow-lg bg-${gameTheme === 'passover' ? 'indigo' : 'emerald'}-600 hover:bg-${gameTheme === 'passover' ? 'indigo' : 'emerald'}-700 text-white`}
          >
            התחל מסע
            <span className="mr-2">≫</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}

/**
 * כרטיס "בקרוב" למשחקים עתידיים
 */
function ComingSoonCard() {
  return (
    <GlassCard
      className="h-full flex flex-col justify-center items-center p-6 text-center border border-white/20"
      opacity={20}
      blur={3}
    >
      <div className="bg-white/20 rounded-full p-8 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      
      <Heading level={2} className="text-2xl mb-4 text-white">
        משחק חדש
      </Heading>
      
      <p className="text-blue-100 mb-6">
        משחק חדש יתווסף בקרוב!
      </p>
      
      <div className="mt-auto">
        <Button 
          variant="outline" 
          className="border-white/30 text-white/80 hover:bg-white/10 cursor-default"
          disabled
        >
          בקרוב...
        </Button>
      </div>
    </GlassCard>
  );
}

export default HomePage;