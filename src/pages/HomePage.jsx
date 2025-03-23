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
        const gamesModule = await import('../games/index.js').catch(() => ({ availableGames: [] }));
        const games = gamesModule.availableGames || [];
        
        // משחקים קבועים לדוגמה (במידה ואין מספיק משחקים)
        const defaultGames = [
          {
            id: 'passover',
            name: 'המסע לחירות',
            description: 'משחק פסח אינטראקטיבי על מסע יציאת מצרים',
            thumbnail: '/assets/games/passover/backgrounds/thumbnail.jpg',
            active: true,
            theme: 'passover'
          },
          {
            id: 'tubishvat',
            name: 'חגיגת ט\\\"ו בשבט',
            description: 'משחק בנושא ט\\\"ו בשבט ושבעת המינים',
            thumbnail: '/assets/games/tubishvat/backgrounds/thumbnail.jpg',
            active: false,
            theme: 'tubishvat'
          }
        ];
        
        // שילוב של המשחקים מהמערכת והמשחקים הקבועים
        const allGames = games.length > 0 ? games : defaultGames;
        
        // הוספת נתיבים מלאים לתמונות ממוזערות
        const gamesWithThumbnails = allGames.map(game => {
          // נתיב ברירת מחדל לתמונה ממוזערת
          let thumbnailPath = game.thumbnail || `/assets/games/${game.id}/backgrounds/thumbnail.jpg`;
          
          LoggerService.debug(`Setting thumbnail path for ${game.id}: ${thumbnailPath}`);
          
          return {
            ...game,
            thumbnail: thumbnailPath
          };
        });
        
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
    <ThemeProvider theme="default">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 overflow-hidden relative">
        {/* אלמנטים דקורטיביים ברקע - מעודנים יותר */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-200/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
        
        {/* כותרת עליונה - שיפור מרווחים וגדלים */}
        <div className="container mx-auto px-4 py-12">
          <header className="text-center relative z-10 mb-16">
            <Heading level={1} className="text-5xl md:text-6xl font-bold text-indigo-800 mb-4">
              מסע הדעת
            </Heading>
            <p className="text-xl md:text-2xl text-indigo-600 mb-6">
              פעילויות לימודיות אינטראקטיביות בנושאי יהדות
            </p>
            
            {/* קו מעוטר עדין יותר */}
            <div className="flex items-center justify-center my-8">
              <div className="h-0.5 w-16 bg-amber-400/60 rounded"></div>
              <div className="mx-4 text-amber-400">✦</div>
              <div className="h-0.5 w-32 bg-amber-400/80 rounded"></div>
              <div className="mx-4 text-amber-400">✦</div>
              <div className="h-0.5 w-16 bg-amber-400/60 rounded"></div>
            </div>
            
            <h2 className="text-2xl md:text-3xl text-indigo-600 mt-8">בחרו משחק להתחיל</h2>
          </header>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
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
              
              {/* כרטיס "בקרוב" מעוצב מחדש */}
              <ComingSoonCard />
            </div>
          )}
        </div>
        
        {/* פוטר מעוצב יותר */}
        <footer className="text-center py-4 mt-16 text-indigo-700 text-opacity-70 text-sm relative z-10">
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
    const validVariants = ['default', 'primary', 'secondary', 'accent', 'passover', 'tubishvat'];
    return validVariants.includes(theme) ? theme : 'default';
  };
  
  if (!active) {
    return (
      <Card 
        variant={getValidVariant(gameTheme)}
        shadow="medium"
        className="h-full flex flex-col overflow-hidden border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300 opacity-60"
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
        
        <div className="p-6 flex-grow bg-white">
          <Heading level={2} className="text-2xl mb-2 font-bold text-gray-700">
            {game.name}
          </Heading>
          <p className="text-gray-600 mb-4">
            {game.description}
          </p>
        </div>
        
        <div className="p-6 pt-0 mt-auto bg-white">
          <Button variant="outline" className="w-full opacity-70 cursor-not-allowed">
            בקרוב
          </Button>
        </div>
        
        {/* תווית בקרוב */}
        <div className="absolute top-3 right-3 bg-gray-800/70 px-3 py-1 rounded-full text-sm text-white shadow">
          בקרוב
        </div>
      </Card>
    );
  }
  
  return (
    <Card 
      variant={getValidVariant(gameTheme)}
      shadow="lg"
      className="h-full flex flex-col overflow-hidden rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
      hoverable={true}
    >
      <div className="h-48 overflow-hidden relative">
        <img 
          src={game.thumbnail} 
          alt={game.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            console.log(`Error loading image: ${e.target.src}`);
            e.target.onerror = null; 
            e.target.src = '/assets/shared/placeholders/background_placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>
      
      <div className="p-6 flex-grow bg-white">
        <Heading level={2} className={`text-2xl mb-2 font-bold ${
          gameTheme === 'passover' ? 'text-indigo-700' : 'text-emerald-700'
        }`}>
          {game.name}
        </Heading>
        <p className={`${
          gameTheme === 'passover' ? 'text-indigo-600' : 'text-emerald-600'
        } mb-4`}>
          {game.description}
        </p>
      </div>
      
      <div className="p-6 pt-0 mt-auto bg-white">
        <Link to={`/game/${game.id}`} className="w-full block">
          <Button 
            variant={gameTheme === 'passover' ? 'primary' : 'secondary'} 
            className="w-full"
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
 * כרטיס "בקרוב" למשחקים עתידיים - מעוצב מחדש
 */
function ComingSoonCard() {
  return (
    <Card
      variant="default"
      shadow="sm"
      className="h-full flex flex-col justify-center items-center p-8 text-center border border-indigo-100 rounded-xl bg-gradient-to-b from-white to-blue-50"
    >
      <div className="mb-8 text-indigo-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <Heading level={2} className="text-2xl mb-4 text-indigo-700">
        משחק חדש בפיתוח
      </Heading>
      
      <p className="text-indigo-600 mb-8 opacity-80">
        עקבו אחר העדכונים שלנו!
      </p>
      
      <div className="mt-auto">
        <Button 
          variant="outline" 
          className="border-indigo-300 text-indigo-500 hover:bg-indigo-50"
          disabled
        >
          בקרוב...
        </Button>
      </div>
    </Card>
  );
}

export default HomePage;