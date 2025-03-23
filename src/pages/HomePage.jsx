import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoggerService } from '../services';

// ייבוא ThemeProvider
import { ThemeProvider } from '../design-system/ThemeProvider';

// ייבוא רכיבי מערכת העיצוב
import { 
  Button, 
  Card, 
  Heading,
  LoadingIndicator
} from '../design-system/components';

/**
 * דף הנחיתה - עמוד הבית של המערכת
 */
export function HomePage() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // טעינת משחקים זמינים
  useEffect(() => {
    async function loadGames() {
      setIsLoading(true);
      
      try {
        // טעינת המשחקים מהמודול או שימוש בנתוני ברירת מחדל
        const gamesModule = await import('../games/index.js')
          .catch(() => ({ availableGames: [] }));
          
        const availableGames = gamesModule.availableGames || [];
        
        // משחקי ברירת מחדל במקרה שאין מספיק משחקים
        const defaultGames = [
          {
            id: 'passover',
            name: 'המסע לחירות',
            description: 'משחק אינטראקטיבי בנושא פסח ויציאת מצרים',
            thumbnail: '/assets/games/passover/backgrounds/thumbnail.jpg',
            active: true,
            theme: 'passover'
          },
          {
            id: 'tubishvat',
            name: 'חגיגת ט"ו בשבט',
            description: 'משחק מרתק בנושא ט"ו בשבט ושבעת המינים',
            thumbnail: '/assets/games/tubishvat/backgrounds/thumbnail.jpg',
            active: true,
            theme: 'tubishvat'
          },
          {
            id: 'shavuot',
            name: 'מתן תורה',
            description: 'משחק לימודי בנושא חג השבועות ומתן תורה',
            thumbnail: '/assets/shared/placeholders/background_placeholder.svg',
            active: false,
            theme: 'default'
          }
        ];
        
        // שילוב המשחקים - אם אין מה שנטען, השתמש בברירות מחדל
        const combinedGames = availableGames.length > 0
          ? availableGames
          : defaultGames;
        
        setGames(combinedGames);
        setError(null);
      } catch (err) {
        LoggerService.error('שגיאה בטעינת משחקים:', err);
        setError('לא ניתן לטעון את רשימת המשחקים');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadGames();
  }, []);

  return (
    <ThemeProvider theme="default">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* רקע דקורטיבי */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-amber-200 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* כותרת ראשית */}
          <header className="text-center mb-16">
            <Heading 
              level={1} 
              className="text-5xl md:text-6xl font-bold text-indigo-800 mb-3"
            >
              מסע הדעת
            </Heading>
            
            <p className="text-xl md:text-2xl text-indigo-700 mb-6 opacity-80">
              פעילויות לימודיות אינטראקטיביות בנושאי יהדות
            </p>
            
            {/* קו מעוטר */}
            <div className="flex items-center justify-center mx-auto my-6 max-w-lg">
              <div className="h-[1px] flex-grow bg-indigo-200"></div>
              <div className="px-4 text-indigo-400">✦</div>
              <div className="h-[1px] flex-grow bg-indigo-200"></div>
            </div>
            
            <h2 className="text-2xl text-indigo-600 mt-8">
              בחרו משחק להתחיל
            </h2>
          </header>
          
          {/* תוכן ראשי - רשימת משחקים */}
          <main>
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingIndicator 
                  type="pulse" 
                  size="large" 
                  color="primary"
                />
              </div>
            ) : error ? (
              <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="text-red-500 text-xl mb-4">שגיאה</div>
                <p className="text-gray-700 mb-6">{error}</p>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="secondary"
                >
                  נסה שנית
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {games.map(game => (
                  <GameCard 
                    key={game.id} 
                    game={game}
                  />
                ))}
                
                {/* כרטיס משחק עתידי */}
                <FutureGameCard />
              </div>
            )}
          </main>
          
          {/* פוטר */}
          <footer className="text-center py-8 mt-20">
            <div className="text-sm text-indigo-600 opacity-75">
              &copy; מערכת מסע הדעת | כל הזכויות שמורות
            </div>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}

/**
 * כרטיס משחק
 */
function GameCard({ game }) {
  // האם המשחק פעיל
  const isActive = game.active !== false;
  
  // טיפול בשגיאות טעינת תמונה
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/assets/shared/placeholders/background_placeholder.svg';
  };
  
  // כרטיס ללא קישור אם המשחק לא פעיל
  if (!isActive) {
    return (
      <Card
        shadow="medium"
        className="h-full overflow-hidden rounded-xl border border-gray-200 bg-white opacity-75"
      >
        <div className="relative h-44 overflow-hidden bg-gray-100">
          <img
            src={game.thumbnail}
            alt={game.name}
            className="h-full w-full object-cover transition-transform"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
          
          {/* תווית "בקרוב" */}
          <div className="absolute top-3 right-3 bg-gray-800/80 px-3 py-1 rounded-full text-sm text-white">
            בקרוב
          </div>
        </div>
        
        <div className="p-6">
          <Heading level={2} className="text-2xl font-bold text-gray-700 mb-2">
            {game.name}
          </Heading>
          
          <p className="text-gray-600 mb-6">
            {game.description}
          </p>
          
          <Button
            variant="outline"
            className="w-full opacity-70 cursor-not-allowed"
            disabled
          >
            בקרוב
          </Button>
        </div>
      </Card>
    );
  }
  
  // וריאנט צבע לפי הנושא
  const getThemeVariant = (themeId) => {
    const themeMap = {
      'passover': 'primary',
      'tubishvat': 'secondary',
      'shavuot': 'accent'
    };
    
    return themeMap[themeId] || 'primary';
  };
  
  // כרטיס משחק פעיל
  return (
    <Card
      shadow="large"
      className="h-full overflow-hidden rounded-xl bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={game.thumbnail}
          alt={game.name}
          className="h-full w-full object-cover transition-transform hover:scale-105 duration-700"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      <div className="p-6">
        <Heading level={2} className="text-2xl font-bold text-gray-800 mb-2">
          {game.name}
        </Heading>
        
        <p className="text-gray-600 mb-6">
          {game.description}
        </p>
        
        <Link to={`/game/${game.id}`} className="block">
          <Button
            variant={getThemeVariant(game.theme || game.id)}
            className="w-full"
          >
            התחל מסע
            <span className="mr-2">›</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}

/**
 * כרטיס משחק עתידי (החלפה ל-ComingSoonCard)
 */
function FutureGameCard() {
  return (
    <Card 
      shadow="small"
      className="h-full rounded-xl bg-gradient-to-br from-white to-indigo-50 border border-indigo-100"
    >
      <div className="flex flex-col justify-center items-center h-full p-10 text-center">
        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-10 w-10 text-indigo-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M13 10V3L4 14h7v7l9-11h-7z" 
            />
          </svg>
        </div>
        
        <Heading level={2} className="text-2xl font-bold text-indigo-700 mb-3">
          משחקים נוספים בדרך
        </Heading>
        
        <p className="text-indigo-600 opacity-80 mb-8">
          צוות הפיתוח שלנו עובד על חוויות למידה חדשות
        </p>
        
        <Button 
          variant="outline" 
          className="border-indigo-200 text-indigo-500" 
          disabled
        >
          בקרוב...
        </Button>
      </div>
    </Card>
  );
}

export default HomePage;