import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("TabeebPedia Runtime Error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b1d3a',
          padding: '24px',
          fontFamily: "'Segoe UI', Tahoma, sans-serif",
          direction: 'rtl',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            background: 'white',
            color: '#0f172a',
            padding: '36px 32px',
            borderRadius: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            maxWidth: '520px',
            width: '100%'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌿</div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>
              طبیب پیڈیا - پورٹل ریکوری
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: '1.8' }}>
              براؤزر کا کیشے اور پرانا ڈیٹا صاف کر کے صفحہ کو درست حالت میں کھولنے کے لیے نیچے دیے گئے بٹن پر کلک کریں۔
            </p>
            {this.state.error && (
              <div style={{
                background: '#fef2f2',
                color: '#991b1b',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '11px',
                textAlign: 'left',
                direction: 'ltr',
                marginBottom: '20px',
                maxHeight: '120px',
                overflowY: 'auto',
                fontFamily: 'monospace'
              }}>
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={this.handleReset}
              style={{
                background: 'linear-gradient(to right, #0284c7, #2563eb)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '16px',
                fontWeight: 'bold',
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
                width: '100%'
              }}
            >
              🔄 کیشے صاف کریں اور صفحہ دوبارہ لوڈ کریں
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
