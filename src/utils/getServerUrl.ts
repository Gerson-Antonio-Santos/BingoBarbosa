/**
 * Detecta automaticamente o IP local e a porta
 * Retorna URLs para acessar TelaPrincipal e CartelaJogador
 */

export interface ServerUrls {
  telaprincipal: string;
  cartelajogador: string;
  home: string;
  ip: string;
  port: string;
}

export function getServerUrls(): ServerUrls {
  // Pega hostname e porta do window.location
  const hostname = window.location.hostname;
  const port = window.location.port || '80';
  const protocol = window.location.protocol;

  const baseUrl = `${protocol}//${hostname}${port !== '80' && port !== '443' ? `:${port}` : ''}`;

  return {
    telaprincipal: `${baseUrl}/TelaPrincipal`,
    cartelajogador: `${baseUrl}/CartelaJogador`,
    home: `${baseUrl}/`,
    ip: hostname,
    port: port,
  };
}

/**
 * Função alternativa para gerar URLs usando endereço IP local
 * Útil para compartilhar URLs com QR Code
 */
export function getLocalNetworkUrls(): ServerUrls {
  const protocol = window.location.protocol;
  // Tenta detectar IPv4 da máquina
  const hostname = window.location.hostname;
  const port = window.location.port || (protocol === 'https:' ? '443' : '80');

  const baseUrl = `${protocol}//${hostname}${port !== '80' && port !== '443' ? `:${port}` : ''}`;

  return {
    telaprincipal: `${baseUrl}/TelaPrincipal`,
    cartelajogador: `${baseUrl}/CartelaJogador`,
    home: `${baseUrl}/`,
    ip: hostname,
    port: port,
  };
}
