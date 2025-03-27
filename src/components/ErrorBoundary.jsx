import React from 'react';

/**
 * רכיב לתפיסת שגיאות וטיפול בהן בצורה מכובדת
 * https://reactjs.org/docs/error-boundaries.html
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // עדכון המצב כך שהרנדור הבא ידע להציג ממשק שגיאה מתאים
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // ניתן להוסיף כאן קוד לרישום השגיאה למערכת ניטור
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // ניתן להתאים את ממשק השגיאה לפי הצורך
      const fallback = this.props.fallback || (
        <div className="p-8 max-w-lg mx-auto mt-8 bg-white rounded-lg shadow-lg text-center" dir="rtl">
          <h2 className="text-2xl font-bold text-red-500 mb-4">שגיאה בטעינת התוכן</h2>
          <p className="mb-4">אירעה שגיאה בלתי צפויה.</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            נסה שוב
          </button>
        </div>
      );
      
      return fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
