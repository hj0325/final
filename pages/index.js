import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scaleRotation, setScaleRotation] = useState({ x: 0, y: 0 })
  const [activeLayer, setActiveLayer] = useState(null)
  const [leftSliderValue, setLeftSliderValue] = useState(0.5)
  const [rightSliderValue, setRightSliderValue] = useState(0.5)
  const [activeEmoji, setActiveEmoji] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalEmoji, setModalEmoji] = useState(null)
  const scaleRef = useRef(null)
  const leftSliderRef = useRef(null)
  const rightSliderRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [activeSlider, setActiveSlider] = useState(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Scale rotation
      const rotationX = 0;
      const rotationY = ((clientX - centerX) / centerX) * 20;
      setScaleRotation({ x: rotationX, y: rotationY });
      
      setMousePosition({ x: clientX, y: clientY });

      // 활성화된 레이어에 대한 3D 효과 조정
      if (scaleRef.current && activeLayer) {
        const layer = scaleRef.current.querySelector(`#layer_${activeLayer}`);
        if (layer) {
          const depth = activeLayer * 8;
          const translateX = (rotationY * depth) / 100;
          const translateY = 0;
          layer.style.transform = `translateZ(${depth}px) translateX(${translateX}px) translateY(${translateY}px)`;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [activeLayer]);

  const handleLayerClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const layerId = Math.floor((y / rect.height) * 11) + 1;
    setActiveLayer(activeLayer === layerId ? null : layerId);
  };

  const handleEmojiClick = (index) => {
    setActiveEmoji(activeEmoji === index ? null : index);
    setModalEmoji(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalEmoji(null);
  };

  useEffect(() => {
    const handleMouseDown = (e, isLeft) => {
      e.preventDefault();
      const sliderRef = isLeft ? leftSliderRef : rightSliderRef;
      const setSliderValue = isLeft ? setLeftSliderValue : setRightSliderValue;
      const slider = sliderRef.current;
      const track = slider.querySelector('.sliderTrack');
      const handle = slider.querySelector('.sliderHandle');

      const startY = e.clientY;
      const startTop = handle.offsetTop;

      const handleMouseMove = (e) => {
        const deltaY = e.clientY - startY;
        const trackHeight = track.offsetHeight;
        const handleHeight = handle.offsetHeight;
        
        let newTop = startTop + deltaY;
        newTop = Math.max(0, Math.min(newTop, trackHeight - handleHeight));
        
        const value = newTop / (trackHeight - handleHeight);
        setSliderValue(1 - value);
        
        handle.style.top = `${newTop}px`;
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const setupSlider = (sliderRef, isLeft) => {
      const handle = sliderRef.current?.querySelector('.sliderHandle');
      if (handle) {
        const handleMouseDown = (e) => handleMouseDown(e, isLeft);
        handle.addEventListener('mousedown', handleMouseDown);
        return () => handle.removeEventListener('mousedown', handleMouseDown);
      }
    };

    const cleanupLeft = setupSlider(leftSliderRef, true);
    const cleanupRight = setupSlider(rightSliderRef, false);

    return () => {
      cleanupLeft?.();
      cleanupRight?.();
    };
  }, []);

  return (
    <div className={styles.page}>
      <Head>
        <title>Interactive Scale</title>
        <meta name="description" content="Interactive 3D Scale" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.leftSlider} ref={leftSliderRef}>
        <div className={styles.sliderContent}>
          <div className={styles.sliderTrack} />
          <div 
            className={styles.sliderHandle}
            style={{ top: `${(1 - leftSliderValue) * 100}%` }}
          />
        </div>
      </div>
      <main className={styles.main}>
        <div className={styles.scaleContainer}>
          <div 
            className={styles.scaleWrapper}
            style={{
              transform: `rotateX(${scaleRotation.x}deg) rotateY(${scaleRotation.y}deg)`,
              transformOrigin: 'center center',
              transition: 'transform 0.1s ease-out'
            }}
          >
            <img 
              ref={scaleRef}
              src="/scale.svg" 
              alt="Balance Scale" 
              className={styles.scaleSvg}
              onClick={handleLayerClick}
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button 
            className={`${styles.emojiButton} ${activeEmoji === 0 ? styles.active : ''}`}
            onClick={() => handleEmojiClick(0)}
          >😊</button>
          <button 
            className={`${styles.emojiButton} ${activeEmoji === 1 ? styles.active : ''}`}
            onClick={() => handleEmojiClick(1)}
          >😮</button>
          <button 
            className={`${styles.emojiButton} ${activeEmoji === 2 ? styles.active : ''}`}
            onClick={() => handleEmojiClick(2)}
          >😕</button>
          <button 
            className={`${styles.emojiButton} ${activeEmoji === 3 ? styles.active : ''}`}
            onClick={() => handleEmojiClick(3)}
          >😢</button>
          <button 
            className={`${styles.emojiButton} ${activeEmoji === 4 ? styles.active : ''}`}
            onClick={() => handleEmojiClick(4)}
          >😡</button>
        </div>
      </main>
      <div className={styles.rightSlider} ref={rightSliderRef}>
        <div className={styles.sliderContent}>
          <div className={styles.sliderTrack} />
          <div 
            className={styles.sliderHandle}
            style={{ top: `${(1 - rightSliderValue) * 100}%` }}
          />
        </div>
      </div>

      {showModal && (
        <>
          <div className={styles.modalOverlay} onClick={closeModal} />
          <div className={styles.gameModal}>
            <h2 className={styles.gameModalTitle}>너의 감정을 찾았어!</h2>
            <div className={styles.gameModalContent}>
              {modalEmoji === 0 && "기분이 좋구나! 😊"}
              {modalEmoji === 1 && "깜짝 놀랐구나? 😮"}
              {modalEmoji === 2 && "무슨 일이야? 😕"}
              {modalEmoji === 3 && "슬퍼 보여... 😢"}
              {modalEmoji === 4 && "화가 났구나! 😡"}
            </div>
            <button className={styles.gameModalButton} onClick={closeModal}>
              닫기
            </button>
          </div>
        </>
      )}
    </div>
  );
}