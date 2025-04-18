import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scaleRotation, setScaleRotation] = useState({ x: 0, y: 0 });
  const scaleRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const rotationX = ((clientY - centerY) / centerY) * 10;
      const rotationY = ((clientX - centerX) / centerX) * 15;
      
      setScaleRotation({ x: rotationX, y: rotationY });
      setMousePosition({ x: clientX, y: clientY });

      if (scaleRef.current) {
        const layers = scaleRef.current.querySelectorAll('.layer');
        layers.forEach((layer, index) => {
          const depth = index * 5;
          const translateX = (rotationY * depth) / 100;
          const translateY = (rotationX * depth) / 100;
          layer.style.transform = `translateZ(${depth}px) translateX(${translateX}px) translateY(${translateY}px)`;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <Head>
        <title>3D Balance Scale</title>
        <meta name="description" content="Interactive 3D Balance Scale" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.page}>
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
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
