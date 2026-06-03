import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServerUrls } from '../utils/getServerUrl';
import './Home.css';

export function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState(getServerUrls());
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showUrlInfo, setShowUrlInfo] = useState(false);

  useEffect(() => {
    // Atualiza as URLs ao montar o componente
    const serverUrls = getServerUrls();
    setUrls(serverUrls);
  }, []);

  const handleNavigate = (path: string) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  const handleCopyUrl = (url: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(label);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>🎰 Bingo Família Barbosa 🎰</h1>
        <p className="subtitle">Bem-vindo! Escolha como você quer participar:</p>

        <div className="screen-selector">
          <button
            className="screen-button principal-button"
            onClick={() => handleNavigate('/TelaPrincipal')}
            disabled={loading}
          >
            <div className="button-icon">🎲</div>
            <div className="button-title">Tela Principal</div>
            <div className="button-description">Sortear números</div>
          </button>

          <button
            className="screen-button cartela-button"
            onClick={() => handleNavigate('/CartelaJogador')}
            disabled={loading}
          >
            <div className="button-icon">🎫</div>
            <div className="button-title">Sua Cartela</div>
            <div className="button-description">Marcar números sorteados</div>
          </button>
        </div>

        <div className="urls-section">
          <button 
            className="toggle-urls-button"
            onClick={() => setShowUrlInfo(!showUrlInfo)}
          >
            {showUrlInfo ? '🔽 Ocultar URLs' : '🔗 Ver URLs & Compartilhar'}
          </button>

          {showUrlInfo && (
            <div className="urls-info">
              <div className="ip-display">
                <span>📍 IP Detectado: <strong>{urls.ip}</strong> : <strong>{urls.port}</strong></span>
              </div>

              <div className="url-box">
                <h4>🎲 Tela Principal</h4>
                <div className="url-item">
                  <code>{urls.telaprincipal}</code>
                  <button 
                    className="copy-button"
                    onClick={() => handleCopyUrl(urls.telaprincipal, 'principal')}
                    title="Copiar URL"
                  >
                    {copiedUrl === 'principal' ? '✓ Copiado!' : '📋 Copiar'}
                  </button>
                </div>
              </div>

              <div className="url-box">
                <h4>🎫 Cartela Jogador</h4>
                <div className="url-item">
                  <code>{urls.cartelajogador}</code>
                  <button 
                    className="copy-button"
                    onClick={() => handleCopyUrl(urls.cartelajogador, 'cartela')}
                    title="Copiar URL"
                  >
                    {copiedUrl === 'cartela' ? '✓ Copiado!' : '📋 Copiar'}
                  </button>
                </div>
              </div>

              <div className="instructions">
                <h4>📋 Como usar:</h4>
                <ul>
                  <li>👉 Copie a URL acima e compartilhe com outros dispositivos</li>
                  <li>💻 Abra a <strong>Tela Principal</strong> em um computador/TV</li>
                  <li>📱 Abra <strong>Cartela Jogador</strong> em smartphones/tablets</li>
                  <li>🔄 Tudo sincroniza automaticamente em tempo real!</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="info-box">
          <h3>ℹ️ Sobre:</h3>
          <ul>
            <li><strong>Tela Principal:</strong> Sorteie números de 1 a 80 e acompanhe todos sorteados</li>
            <li><strong>Sua Cartela:</strong> Receba uma cartela 5x5, selecione números e marque os sorteados</li>
            <li>Abra as duas telas em dispositivos diferentes para sincronizar!</li>
            <li>Digite seu nome na cartela para aparecer na lista de jogadores</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
