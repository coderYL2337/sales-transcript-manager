import React, { useRef } from 'react';
import './App.css';
import Transcript from './components/Transcript';

function App() {
  const transcriptRef = useRef<HTMLDivElement>(null);

  const scrollToTranscript = () => {
    transcriptRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rilla - The end of Ridealongs</h1>
        <button className="try-now-button" onClick={scrollToTranscript}>Try Now</button>
      </header>
      <div className="yellow-line"></div>
      <div ref={transcriptRef}>
        <Transcript />
      </div>
    </div>
  );
}

export default App;

