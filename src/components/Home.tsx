import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServerUrls } from '../utils/getServerUrl';
import {
  listarSessoes,
  deletarSessaoComJogadores,
} from '../api/sessaoController';
import type { SessaoPrincipal } from '../api/sessaoController';
import logoJB from '../assets/images/Logo_JB_Joice_Bingo_Azul.png';
import './Home.css';

export function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState(getServerUrls());
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showUrlInfo, setShowUrlInfo] = useState(false);

  // Lista de sessões ativas
  const [sessoes, setSessoes] = useState<SessaoPrincipal[]>([]);
  const [carregandoSessoes, setCarregandoSessoes] = useState(false);
  const [deletandoSessao, setDeletandoSessao] = useState<number | null>(null);

  useEffect(() => {
    const serverUrls = getServerUrls();
    setUrls(serverUrls);
    carregarSessoes();
  }, []);

  const carregarSessoes = async () => {
    setCarregandoSessoes(true);
    try {
      const lista = await listarSessoes();
      setSessoes(lista);
    } finally {
      setCarregandoSessoes(false);
    }
  };

  const handleDeletarSessao = async (sessaoCodigo: number) => {
    setDeletandoSessao(sessaoCodigo);
    try {
      await deletarSessaoComJogadores(sessaoCodigo);
      await carregarSessoes();
    } finally {
      setDeletandoSessao(null);
    }
  };

  const handleNavigate = (path: string) => {
    setLoading(true);
    setTimeout(() => navigate(path), 300);
  };

  const handleCopyUrl = (url: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(label);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatarData = (iso: string) => {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-logo-area">
          <img src={logoJB} alt="JB - Joice's Bingo" className="home-logo" />
          <div className="home-title-area">
            <h1>🎰 Bingo Família Barbosa 🎰</h1>
            <p className="subtitle">Escolha como você quer participar</p>
          </div>
        </div>

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

        {/* Sessões Ativas */}
        <div className="sessoes-section">
          <div className="sessoes-header">
            <h3>🎮 Jogos Ativos</h3>
            <button className="btn-refresh-sessoes" onClick={carregarSessoes} disabled={carregandoSessoes}>
              {carregandoSessoes ? '⏳' : '🔄'}
            </button>
          </div>

          {carregandoSessoes && sessoes.length === 0 ? (
            <p className="sessoes-vazio">Carregando...</p>
          ) : sessoes.length === 0 ? (
            <p className="sessoes-vazio">Nenhum jogo ativo. Crie um na Tela Principal.</p>
          ) : (
            <div className="sessoes-lista">
              {sessoes.map((s) => (
                <div key={s.id} className="sessao-item">
                  <div className="sessao-info">
                    <span className="sessao-codigo">Sessão #{s.sessao}</span>
                    <span className="sessao-data">{formatarData(s.data_criacao)}</span>
                  </div>
                  <button
                    className="btn-deletar-sessao"
                    onClick={() => handleDeletarSessao(s.sessao)}
                    disabled={deletandoSessao === s.sessao}
                    title="Excluir sessão e todos os jogadores"
                  >
                    {deletandoSessao === s.sessao ? '⏳' : '🗑️ Excluir'}
                  </button>
                </div>
              ))}
            </div>
          )}
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
          <div className="info-item"><span className="info-icon">💻</span><span><strong>Tela Principal</strong> — abra no computador ou TV para sortear os números</span></div>
          <div className="info-item"><span className="info-icon">📱</span><span><strong>Sua Cartela</strong> — abra no celular, receba uma cartela 5×5 e marque os números</span></div>
          <div className="info-item"><span className="info-icon">🔄</span><span>Tudo sincroniza em tempo real entre os dispositivos</span></div>
        </div>
      </div>
    </div>
  );
}
