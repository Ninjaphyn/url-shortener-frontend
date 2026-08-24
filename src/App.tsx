import { useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:3000';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setCopied(false);

    try {
      const res = await fetch(`${API_URL}/urls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl }),
      });

      if (!res.ok) {
        throw new Error('Не удалось создать ссылку');
      }

      const data = await res.json();
      setShortUrl(`${API_URL}/${data.shortCode}`);
    } catch (err) {
      setError('Ошибка: проверь, что ссылка валидная');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <p className="subtitle">Сократи длинную ссылку за секунду</p>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Вставь длинную ссылку..."
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="input"
        />
        <button type="submit" className="button">
          Сократить
        </button>
      </form>

      {shortUrl && (
        <div className="result">
          <a href={shortUrl} target="_blank" rel="noreferrer" className="short-link">
            {shortUrl}
          </a>
          <button onClick={handleCopy} className="copy-button">
            {copied ? '✓ Скопировано' : 'Копировать'}
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;