import bgMusicFile from '../assets/background.mp3';
import { useEffect } from 'react';
import { Howl } from 'howler';
import bgImage from '../assets/bg.jpg';
import roletaSound from '../assets/roleta.mp3';
import winSound from '../assets/win.mp3';
import { useBingo } from '../context/BingoContext';
import './PrincipalScreen.css';

const allNumbers = Array.from({ length: 80 }, (_, i) => i + 1);

export function PrincipalScreen() {
  const {
    numbersDrawn,
    currentNumber,
    isRolling,
    setNumbersDrawn,
    setCurrentNumber,
    setIsRolling,
  } = useBingo();

  const playSound = (soundFile: string) => {
    const sound = new Howl({ src: [soundFile] });
    sound.play();
  };

  const win = new Howl({
    src: [winSound],
    volume: 1,
  });

  const drawNumber = () => {
    if (numbersDrawn.length >= 80 || isRolling) return;

    setIsRolling(true);
    playSound(roletaSound);

    setTimeout(() => {
      const available = allNumbers.filter((n) => !numbersDrawn.includes(n));
      const newNumber = available[Math.floor(Math.random() * available.length)];
      setCurrentNumber(newNumber);
      setNumbersDrawn([...numbersDrawn, newNumber]);
      setIsRolling(false);
    }, 1000);
  };

  const restart = () => {
    setNumbersDrawn([]);
    setCurrentNumber(null);
  };

  const bingou = () => {
    win.play();
    playSound(winSound);
  };

  useEffect(() => {
    const bgMusic = new Howl({
      src: [bgMusicFile],
      autoplay: true,
      loop: true,
      volume: 0.1,
    });

    bgMusic.play();

    return () => {
      bgMusic.stop();
    };
  }, []);

  return (
    <div className="App" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="overlay">
        <h1>Bingo Família Barbosa</h1>

        <div className="current-number">
          {isRolling ? <div className="rolling-ball"></div> : currentNumber ?? '--'}
        </div>

        <div className="buttons">
          <button onClick={drawNumber} disabled={isRolling}>
            Sortear
          </button>
          <button onClick={bingou}>Bingou!</button>
          <button onClick={restart}>Reiniciar</button>
        </div>

        <div className="drawn-numbers">
          <h3>Números Sorteados:</h3>
          <div className="numbers-grid">
            {numbersDrawn.map((n) => (
              <span key={n} className="number-ball">
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
