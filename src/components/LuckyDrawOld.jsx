import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import './LuckyDraw.css';

const LuckyDraw = () => {
  const CELL_HEIGHT = 120;
  const VISIBLE_CELLS = 5;
  
  // States
  const [totalNumbers, setTotalNumbers] = useState(80);
  const [showConfigModal, setShowConfigModal] = useState(true); // Hiện modal khi vào lần đầu
  const [inputNumber, setInputNumber] = useState('80');
  const INITIAL_OFFSET = -(totalNumbers * CELL_HEIGHT);
  
  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  const [numbers, setNumbers] = useState([]);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [nextResult, setNextResult] = useState(null);
  
  const wheelRef = useRef(null);
  const backgroundAudioRef = useRef(null);
  const clapAudioRef = useRef(null);
  const winnerTimerRef = useRef(null);
  const clapTimerRef = useRef(null);
  
  // Bắt đầu game với số lượng số đã config
  const startGame = () => {
    const num = parseInt(inputNumber, 10);
    if (isNaN(num) || num < 1 || num > 1000) {
      alert('Vui lòng nhập số từ 1 đến 1000');
      return;
    }
    setTotalNumbers(num);
    setNumbers(shuffleArray(Array.from({ length: num }, (_, i) => i + 1)));
    setDrawnNumbers([]);
    setShowConfigModal(false);
    
    // Start background music khi user click (browser policy)
    setTimeout(() => {
      if (backgroundAudioRef.current && !isMuted) {
        try {
          backgroundAudioRef.current.play().then(() => {
            console.log('Playing background audio');
          }).catch(error => {
            console.error('Error playing background:', error);
          });
        } catch (error) {
          console.error('Error starting background:', error);
        }
      }
    }, 500);
    
    // Reset wheel position sau khi setup
    setTimeout(() => {
      if (wheelRef.current) {
        gsap.set(wheelRef.current, { y: -(num * CELL_HEIGHT) });
      }
    }, 0);
  };
  
  // Khởi tạo HTML5 Audio
  useEffect(() => {
    // Background music
    backgroundAudioRef.current = new Audio();
    backgroundAudioRef.current.loop = true;
    backgroundAudioRef.current.volume = 0.5;
    backgroundAudioRef.current.src = '/audio/background.mp3';
    backgroundAudioRef.current.preload = 'auto';
    
    backgroundAudioRef.current.addEventListener('error', (e) => {
      console.error('Background audio error:', e);
    });
    
    // Clap sound
    clapAudioRef.current = new Audio();
    clapAudioRef.current.loop = false; // KHÔNG loop, chỉ phát 1 lần!
    clapAudioRef.current.volume = 0.7;
    clapAudioRef.current.src = '/audio/clap.mp3';
    clapAudioRef.current.preload = 'auto';
    clapAudioRef.current.load(); // Force load immediately
    
    clapAudioRef.current.addEventListener('error', (e) => {
      console.error('Clap audio error:', e);
    });
    
    console.log('Audio initialized');
    
    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current = null;
      }
      if (clapAudioRef.current) {
        clapAudioRef.current.pause();
        clapAudioRef.current = null;
      }
    };
  }, []);
  
  // Lấy kết quả từ API cheat
  const fetchCheatResult = async () => {
    try {
      const response = await fetch('https://web.ozovn.com/api/v1/cheat');
      if (response.ok) {
        const data = await response.json();
        if (data && data.number) {
          // Convert sang number nếu API trả về string
          const num = typeof data.number === 'string' ? parseInt(data.number, 10) : data.number;
          if (num >= 1 && num <= TOTAL_NUMBERS) {
            setNextResult(num);
          }
        }
      }
    } catch (error) {
      console.log('Đang random');
    }
  };
  
  // Trigger confetti
  const triggerConfetti = () => {
    const duration = 5 * 1000; // 5 giây
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#FF69B4']
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#FF69B4']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };
  
  // Play clap sound
  const playWinSound = () => {
    if (isMuted) return;
    
    console.log('🔊 playWinSound called, clearing old timer...');
    
    // CRITICAL: Clear timer cũ TRƯỚC để tránh nó pause audio mới
    if (clapTimerRef.current) {
      clearTimeout(clapTimerRef.current);
      clapTimerRef.current = null;
      console.log('✓ Cleared old timer');
    }
    
    try {
      // Giảm volume background xuống thấp thay vì pause
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.volume = 0.1;
        console.log('Lowered background volume to 0.1');
      }
      
      // TẠO MỚI Audio element mỗi lần thay vì reuse (như nút TEST)
      console.log('🔊 Creating NEW clap audio...');
      const newClap = new Audio('/audio/clap.mp3');
      newClap.volume = 0.8;
      
      newClap.play().then(() => {
        console.log('✅ NEW CLAP IS PLAYING! Volume:', newClap.volume);
      }).catch(error => {
        console.error('❌ Error playing NEW clap:', error);
      });
      
      // Sau 5 giây, khôi phục volume background
      console.log('⏱️ Setting new 5-second timer...');
      clapTimerRef.current = setTimeout(() => {
        console.log('⏰ 5 seconds elapsed! Cleaning up...');
        try {
          newClap.pause();
          console.log('Paused new clap after 5s');
          
          if (backgroundAudioRef.current && !isMuted) {
            backgroundAudioRef.current.volume = 0.5; // Restore original volume
            console.log('Restored background volume after 5s');
          }
        } catch (error) {
          console.log('Error in timer:', error);
        }
      }, 5000);
    } catch (error) {
      console.log('Error playing clap sound:', error);
    }
  };
  
  // Start spinning
  const startSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setWinner(null);
    
    const initialOffset = -(totalNumbers * CELL_HEIGHT);
    
    // Reset position về INITIAL_OFFSET
    if (wheelRef.current) {
      gsap.set(wheelRef.current, { y: initialOffset });
    }
    
    // Tăng tốc và quay liên tục
    gsap.to(wheelRef.current, {
      y: `-=${totalNumbers * CELL_HEIGHT * 3}`,
      duration: 3,
      ease: 'none',
      repeat: -1,
      modifiers: {
        y: (y) => {
          const maxY = totalNumbers * CELL_HEIGHT;
          const normalized = (parseFloat(y) - initialOffset) % maxY;
          return `${normalized + initialOffset}px`;
        }
      }
    });
  };
  
  // Stop spinning
  const stopSpin = () => {
    if (!isSpinning) return;
    
    // Lấy danh sách số còn lại (chưa trúng)
    const availableNumbers = numbers.filter(num => !drawnNumbers.includes(num));
    
    if (availableNumbers.length === 0) {
      alert('Đã hết số! Vui lòng Reset để bắt đầu lại.');
      setIsSpinning(false);
      return;
    }
    
    // Chọn số trúng từ danh sách còn lại
    let winningNumber;
    if (nextResult && availableNumbers.includes(nextResult)) {
      winningNumber = nextResult;
      setNextResult(null);
    } else if (nextResult && !availableNumbers.includes(nextResult)) {
      // Nếu nextResult đã trúng rồi, bỏ qua và random
      setNextResult(null);
      winningNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    } else {
      winningNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    }
    
    // Tìm vị trí (index) của số trúng trong mảng numbers
    const winningIndex = numbers.indexOf(winningNumber);
    const initialOffset = -(totalNumbers * CELL_HEIGHT);
    const targetY = initialOffset - (winningIndex * CELL_HEIGHT);
    
    // Giảm tốc và dừng
    gsap.killTweensOf(wheelRef.current);
    gsap.to(wheelRef.current, {
      y: targetY,
      duration: 2,
      ease: 'power3.out',
      onComplete: () => {
        console.log('🎯 GSAP onComplete triggered!');
        setIsSpinning(false);
        setWinner(winningNumber);
        
        // Thêm số vào danh sách đã trúng
        setDrawnNumbers(prev => [...prev, winningNumber]);
        
        console.log('🎊 Calling triggerConfetti...');
        triggerConfetti();
        
        console.log('🔊 Calling playWinSound...');
        playWinSound();
        
        // Auto-close winner display sau 10 giây
        winnerTimerRef.current = setTimeout(() => {
          setWinner(null);
        }, 10000);
        
        // Gọi API để lấy kết quả cho lượt sau
        fetchCheatResult();
      }
    });
  };
  
  // Close winner display
  const closeWinner = () => {
    if (winnerTimerRef.current) {
      clearTimeout(winnerTimerRef.current);
      winnerTimerRef.current = null;
    }
    setWinner(null);
  };
  
  // Test clap audio
  const testClapAudio = () => {
    console.log('🧪 TESTING CLAP AUDIO DIRECTLY...');
    const clap = clapAudioRef.current;
    console.log('Clap state:', {
      readyState: clap.readyState,
      volume: clap.volume,
      duration: clap.duration,
      src: clap.src,
      paused: clap.paused,
      muted: clap.muted
    });
    
    clap.currentTime = 0;
    clap.play().then(() => {
      console.log('✅ TEST CLAP PLAYING!');
    }).catch(error => {
      console.error('❌ TEST CLAP ERROR:', error);
    });
  };
  
  // Reset
  const reset = () => {
    gsap.killTweensOf(wheelRef.current);
    setIsSpinning(false);
    closeWinner();
    setNextResult(null);
    
    // Hiện modal để config lại
    setShowConfigModal(true);
  };
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isSpinning) {
          stopSpin();
        } else {
          startSpin();
        }
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        reset();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        setIsMuted(prev => {
          const newMuted = !prev;
          // Control Audio
          try {
            if (newMuted) {
              if (backgroundAudioRef.current) {
                backgroundAudioRef.current.pause();
              }
              if (clapAudioRef.current) {
                clapAudioRef.current.pause();
              }
            } else {
              if (backgroundAudioRef.current) {
                backgroundAudioRef.current.play().catch(e => console.log('Play error:', e));
              }
            }
          } catch (error) {
            console.log('Error controlling audio:', error);
          }
          return newMuted;
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSpinning]);
  
  return (
    <div className="lucky-draw-container">
      {/* Config Modal */}
      {showConfigModal && (
        <div className="config-modal">
          <div className="config-content">
            <h2>CẤU HÌNH VÒNG QUAY</h2>
            <p>Nhập số lượng số (1-1000)</p>
            <input
              type="number"
              min="1"
              max="1000"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  startGame();
                }
              }}
              autoFocus
            />
            <button className="btn btn-primary" onClick={startGame}>
              BẮT ĐẦU
            </button>
          </div>
        </div>
      )}
      
      <div className="wheel-container">
        {/* Pointer */}
        <div className="pointer"></div>
        
        {/* Wheel */}
        <div className="wheel-wrapper">
          <div className="wheel" ref={wheelRef}>
            {[...numbers, ...numbers, ...numbers].map((num, idx) => (
              <div 
                key={idx} 
                className={`wheel-cell ${drawnNumbers.includes(num) ? 'drawn' : ''}`}
              >
                <span className="number">{num}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Winner Display */}
      {winner && (
        <div className="winner-display">
          <button className="close-winner-btn" onClick={closeWinner}>
            ✕
          </button>
          <div className="winner-text">Chúc Mừng!</div>
          <div className="winner-number">Số Trúng Thưởng: {winner}</div>
          <div className="clap-icon">👏</div>
        </div>
      )}
      
      {/* Controls */}
      <div className="controls">
        <button 
          className="btn btn-primary"
          onClick={isSpinning ? stopSpin : startSpin}
        >
          {isSpinning ? 'DỪNG (Space)' : 'BẮT ĐẦU QUAY (Space)'}
        </button>
        <button 
          className="btn btn-secondary"
          onClick={reset}
        >
          RESET (R)
        </button>
        <button 
          className="btn btn-secondary"
          onClick={testClapAudio}
          style={{marginLeft: '10px', backgroundColor: '#ff6347'}}
        >
          🔊 TEST CLAP
        </button>
      </div>
      
      {/* Số còn lại */}
      <div className="remaining-info">
        Còn lại: {totalNumbers - drawnNumbers.length}/{totalNumbers}
      </div>
    </div>
  );
};

export default LuckyDraw;
