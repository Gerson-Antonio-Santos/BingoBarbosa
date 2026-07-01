import { QRCodeSVG } from 'qrcode.react';
import './ModalQrCode.css';

interface ModalQrCodeProps {
  isOpen: boolean;
  url: string;
  onClose: () => void;
}

export function ModalQrCode({ isOpen, url, onClose }: ModalQrCodeProps) {
  if (!isOpen) return null;

  return (
    <div className="qr-overlay" onClick={onClose}>
      <div className="qr-content" onClick={(e) => e.stopPropagation()}>
        <h2>Acesse a Cartela</h2>
        <p className="qr-url">{url}</p>
        <div className="qr-code-wrapper">
          <QRCodeSVG value={url} size={220} bgColor="#ffffff" fgColor="#0a0520" level="H" />
        </div>
        <p className="qr-hint">Escaneie com a câmera do celular</p>
        <button className="qr-close-btn" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}
