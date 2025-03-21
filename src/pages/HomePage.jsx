import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoggerService, AssetManager } from '../services';
import { ThemeProvider } from '../contexts/ThemeContext';
import { defaultTheme } from '../themes/defaultTheme';

// ייבוא רכיבי מערכת העיצוב
import { Button, Card, Heading, PageContainer } from '../design-system/components';

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
        
        // הוספת נתיבים לתמונות ממוזערות
        const gamesWithThumbnails = games.map(game => ({
          ...game,
          thumbnail: `/assets/games/${game.id}/backgrounds/thumbnail.jpg`
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
    <ThemeProvider initialTheme={defaultTheme}>
      <PageContainer className="min-h-screen py-10 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        {/* צורות דקורטיביות ברקע */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl"></div>
        
        <header className="text-center relative z-10 mb-12">
          <Heading level={1} className="text-5xl font-bold text-amber-300 mb-3 tracking-wider animate-pulse-soft">
            מסע הדעת
          </Heading>
          <p className="text-xl text-blue-100">
            פעילויות לימודיות אינטראקטיביות בנושאי יהדות
          </p>
          
          {/* קו מעוטר */}
          <div className="flex items-center justify-center my-6">
            <div className="h-0.5 w-12 bg-amber-300 rounded"></div>
            <div className="mx-4 text-amber-300">✦</div>
            <div className="h-0.5 w-24 bg-amber-300 rounded"></div>
            <div className="mx-4 text-amber-300">✦</div>
            <div className="h-0.5 w-12 bg-amber-300 rounded"></div>
          </div>
        </header>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            <GameCard 
              game={{
                id: 'passover',
                name: 'המסע לחירות',
                description: 'משחק פסח אינטראקטיבי על מסע יציאת מצרים',
                thumbnail: '/assets/games/passover/backgrounds/thumbnail.jpg'
              }}
              active={true}
            />
            
            <GameCard 
              game={{
                id: 'tubishvat',
                name: 'חגיגת ט\\\"ו בשבט',
                description: 'משחק בנושא ט"ו בשבט ושבעת המינים',
                thumbnail: '/assets/games/tubishvat/backgrounds/thumbnail.jpg'
              }}
              active={false}
            />
          </div>
        )}
      </PageContainer>
    </ThemeProvider>
  );
}

// כרטיסיית משחק
function GameCard({ game, active = true }) {
  // בחירת הצבעים לפי נושא המשחק
  let cardStyle = {};
  let buttonVariant = "primary";
  
  switch (game.id) {
    case 'passover':
      cardStyle = {
        backgroundImage: 'linear-gradient(135deg, #4338CA11 0%, #0284C722 100%)',
        borderColor: '#4338CA33'
      };
      buttonVariant = "passover";
      break;
    case 'tubishvat':
      cardStyle = {
        backgroundImage: 'linear-gradient(135deg, #16A34A11 0%, #65A30D22 100%)',
        borderColor: '#16A34A33'
      };
      buttonVariant = "tubishvat";
      break;
    default:
      cardStyle = {
        backgroundImage: 'linear-gradient(135deg, #1E3A8A11 0%, #2563EB22 100%)',
        borderColor: '#1E3A8A33'
      };
  }
  
  if (!active) {
    return (
      <Card 
        className="h-full flex flex-col overflow-hidden border hover:shadow-xl transition-all duration-300 filter grayscale opacity-60" 
        style={cardStyle}
      >
        <div className="h-48 overflow-hidden">
          <img 
            src={game.thumbnail} 
            alt={game.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/shared/ui/default-thumbnail.jpg';
            }}
          />
        </div>
        
        <div className="p-6 flex-grow">
          <Heading level={2} className="text-2xl mb-2">
            {game.name}
          </Heading>
          <p className="text-gray-600 mb-4">
            {game.description}
          </p>
        </div>
        
        <div className="p-6 pt-0 mt-auto">
          <Button variant="disabled" className="w-full">
            בקרוב
          </Button>
        </div>
        
        {/* תווית בקרוב */}
        <div className="absolute top-3 left-3 bg-gray-800/80 px-2 py-1 rounded text-xs text-gray-300">
          בקרוב
        </div>
      </Card>
    );
  }
  
  return (
    <Card 
      className="h-full flex flex-col overflow-hidden border hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:rotate-1" 
      style={cardStyle}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={game.thumbnail} 
          alt={game.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/shared/ui/default-thumbnail.jpg';
          }}
        />
      </div>
      
      <div className="p-6 flex-grow">
        <Heading level={2} className="text-2xl mb-2 text-amber-500">
          {game.name}
        </Heading>
        <p className="text-blue-800 mb-4">
          {game.description}
        </p>
      </div>
      
      <div className="p-6 pt-0 mt-auto">
        <Link to={`/game/${game.id}`}>
          <Button variant={buttonVariant} className="w-full transform transition-all hover:shadow-lg">
            התחל מסע
          </Button>
        </Link>
      </div>
      
      {/* איקון חץ */}
      <div className="absolute bottom-3 left-3 text-amber-300/70 group-hover:text-amber-300 transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </Card>
  );
}

export default HomePage;