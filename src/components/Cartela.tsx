import { useState, useEffect } from 'react';
import { useBingo } from '../context/BingoContext';
import './Cartela.css';

interface CarteleNumber {
  id: string;
  number: number;
  isSelected: boolean;
  isDrawn: boolean;
}

export function Cartela() {
  const { numbersDrawn } = useBingo();
  const [cartelaNumbers, setCartelaNumbers] = useState<CarteleNumber[]>([]);

  // Gerar cartela aleatória 5x5
  useEffect(() => {
    const generateCartela = () => {
      const allNumbers = Array.from({ length: 80 }, (_, i) => i + 1);
      const shuffled = allNumbers.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 25);

      const cartela: CarteleNumber[] = selected.map((num, idx) => ({
        id: `${idx}`,
        number: num,
        isSelected: false,
        isDrawn: numbersDrawn.includes(num),
      }));

      setCartelaNumbers(cartela);
    };

    generateCartela();
  }, []);

  // Atualizar quando números são sorteados
  useEffect(() => {
    setCartelaNumbers((prev) =>
      prev.map((item) => ({
        ...item,
        isDrawn: numbersDrawn.includes(item.number),
      }))
    );
  }, [numbersDrawn]);

  const toggleSelect = (id: string) => {
    setCartelaNumbers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const resetCartela = () => {
    const allNumbers = Array.from({ length: 80 }, (_, i) => i + 1);
    const shuffled = allNumbers.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 25);

    const cartela: CarteleNumber[] = selected.map((num, idx) => ({
      id: `${idx}`,
      number: num,
      isSelected: false,
      isDrawn: numbersDrawn.includes(num),
    }));

    setCartelaNumbers(cartela);
  };

  return (
    <div className="cartela-container">
      <h1>Sua Cartela</h1>

      <div className="cartela-grid">
        {cartelaNumbers.map((item) => (
          <div
            key={item.id}
            className={`cartela-number ${item.isSelected ? 'selected' : ''} ${
              item.isDrawn ? 'drawn' : ''
            }`}
            onClick={() => toggleSelect(item.id)}
          >
            <span>{item.number}</span>
            {item.isDrawn && <div className="draw-mark">✓</div>}
          </div>
        ))}
      </div>

      <button onClick={resetCartela} className="reset-button">
        Nova Cartela
      </button>

      <div className="cartela-legend">
        <div className="legend-item">
          <div className="legend-box selected"></div>
          <span>Selecionado</span>
        </div>
        <div className="legend-item">
          <div className="legend-box drawn"></div>
          <span>Sorteado</span>
        </div>
      </div>
    </div>
  );
}
