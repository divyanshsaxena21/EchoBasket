import VoiceInput from '../components/VoiceInput';
import ShoppingList from '../components/ShoppingList';
import Suggestions from '../components/Suggestions';

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #1f2937, #111827)',
        color: '#f3f4f6',
        fontFamily: "'Inter', sans-serif",
        margin: 0,
        padding: 0,
        userSelect: 'none',
      }}
    >
      {/* Header */}
      <header
        style={{
          width: '95%',
          height: '60px',
          backgroundColor: '#111827',
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <h1
          style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#6366f1',
            margin: 0,
            userSelect: 'none',
          }}
        >
          🗣️ Voice Shopping Assistant
        </h1>
      </header>

      {/* Main content */}
      <main
        style={{
          width: '100vw',
          height: 'calc(100vh - 60px)', // fill under header
          paddingTop: 60, // avoid header overlap
          boxSizing: 'border-box',
          backgroundColor: '#1f2937',
          overflowY: 'auto',
          userSelect: 'text',

          // Clear floats with after pseudo hack using React inline styles:
          // We'll use a div with style clear: 'both' after floated content instead
          position: 'relative',
        }}
      >
        {/* Container for floated elements */}
        <div
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          {/* VoiceInput */}
          <div
            style={{
              float: 'left',
              width: '40%', // approx 1/3rd
              marginLeft: '1.5%',
              marginRight: '1.5%',
              height: 'calc(100% - 3rem)',
              backgroundColor: '#2e3a59',
              borderRadius: 20,
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              boxSizing: 'border-box',
              overflowY: 'auto',
            }}
          >
            <VoiceInput />
          </div>

          {/* ShoppingList */}
          <div
            style={{
              float: 'left',
              width: '50%',
              marginLeft: '1.5%',
              marginRight: '1.5%',
              height: 'calc(100% - 3rem)',
              backgroundColor: '#23232a',
              borderRadius: 20,
              padding: '2rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              boxSizing: 'border-box',
              overflowY: 'auto',
            }}
          >
            <ShoppingList />
          </div>

          {/* Suggestions */}
          <div
            style={{
              // marginLeft: '1.5%',
              width: '50%',
              marginLeft: '30%',
              marginRight: '1.5%',
              height: 'calc(100% - 3rem)',
              backgroundColor: '#2e3a59',
              borderRadius: 20,
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              boxSizing: 'border-box',
              overflowY: 'auto',
            }}
          >
            <Suggestions />
          </div>

          {/* Clear floats */}
          <div style={{ clear: 'both' }} />
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          width: '100%',
          height: 40,
          backgroundColor: '#111827',
          color: '#9ca3af',
          textAlign: 'center',
          lineHeight: '40px',
          userSelect: 'none',
          fontSize: '0.85rem',
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        &copy; {new Date().getFullYear()} Grocery Voice Assistant
      </footer>
    </div>
  );
}
