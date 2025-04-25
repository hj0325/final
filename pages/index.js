import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useState, useEffect, useRef } from 'react'

const emojis = ['😊', '😮', '😐', '😢', '😡'];

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
      if (!scaleRef.current) return;
      
      const rect = scaleRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate distance from center
      const distanceFromCenter = Math.abs(x - centerX);
      const maxDistance = rect.width / 2;
      const opacity = Math.min(distanceFromCenter / (maxDistance / 2), 1);
      
      // Update CSS variable for opacity only
      scaleRef.current.style.setProperty('--light-line-opacity', opacity);
      
      setMousePosition({ x, y });
      
      // Calculate rotation based on mouse position (only horizontal)
      const rotationY = ((centerX - x) / centerX) * 35;
      setScaleRotation({ x: 0, y: rotationY });
    };

    const scaleContainer = scaleRef.current;
    if (scaleContainer) {
      scaleContainer.addEventListener('mousemove', handleMouseMove);
      return () => scaleContainer.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleLayerClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const layerId = Math.floor((y / rect.height) * 11) + 1;
    setActiveLayer(activeLayer === layerId ? null : layerId);
  };

  const handleEmojiClick = (emoji) => {
    setActiveEmoji(emoji);
    setModalEmoji(emoji);
    setShowModal(true);
  };

  const handleCloseModal = (e) => {
    e.stopPropagation();
    setShowModal(false);
    setActiveEmoji(null);
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
          {emojis.map((emoji) => (
            <button
              key={emoji}
              className={`${styles.emojiButton} ${
                activeEmoji === emoji ? styles.active : ''
              }`}
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
            </button>
          ))}
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
        <div className={styles.gameModal}>
          <div className={styles.gameModalContent}>
            <h2 className={styles.gameModalTitle}>오늘은 어떤 기분이니?</h2>
            <p>
              {modalEmoji === '😊' && "기분이 좋구나! 😊"}
              {modalEmoji === '😮' && "깜짝 놀랐구나? 😮"}
              {modalEmoji === '😐' && "무슨 일이야? 😕"}
              {modalEmoji === '😢' && "슬퍼 보여... 😢"}
              {modalEmoji === '😡' && "화가 났구나! 😡"}
            </p>
            <button className={styles.gameModalButton} onClick={handleCloseModal}>
              선택
            </button>
          </div>
        </div>
      )}
    </div>
  );
}