import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styled from "styled-components";

const SliderWrapper = styled(Box)`
  position: relative;
  width: 100%;
  height: 440px;
  
  @media (max-width: 600px) {
    height: 300px;
  }
  
  overflow: hidden;
  border-radius: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  background: #0f172a;
`;

const SlideImage = styled(motion.img)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Controls = styled(Box)`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 10;
  pointer-events: none;
`;

const NavButton = styled(IconButton)`
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(12px);
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  width: 54px;
  height: 54px;
  pointer-events: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15) !important;
    border-color: #0066FF !important;
    color: #0066FF !important;
    transform: scale(1.1);
  }

  @media (max-width: 600px) {
    width: 42px;
    height: 42px;
  }
`;


const Indicators = styled(Box)`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 16px;
  border-radius: 100px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const Dot = styled(Box)`
  width: ${props => props.active ? "32px" : "8px"};
  height: 8px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.active ? "100%" : "0%"};
    background: #0066FF;
    transition: ${props => props.active ? "width 6s linear" : "none"};
  }

  ${props => props.active && `
    box-shadow: 0 0 15px rgba(0, 102, 255, 0.3);
  `}

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;


const OverLay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%);
  z-index: 2;
  pointer-events: none;
`;

const HeroSwiper = ({ images = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        if (!images || images.length === 0) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(timer);
    }, [currentIndex, images?.length]);

    const nextSlide = () => {
        if (!images || images.length === 0) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        if (!images || images.length === 0) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!images || images.length === 0) return null;

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 1.2
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1.1, // Slight zoom-in effect while active
            transition: {
                scale: { duration: 10, ease: "linear" } // Ken Burns effect
            }
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? '50%' : '-50%',
            opacity: 0,
            scale: 1,
            transition: { duration: 0.5 }
        })
    };

    return (
        <SliderWrapper>
            <AnimatePresence initial={false} custom={direction}>
                <SlideImage
                    key={currentIndex}
                    src={images[currentIndex]}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 200, damping: 25 },
                        opacity: { duration: 0.4 },
                        scale: { duration: 0.6 }
                    }}
                />
            </AnimatePresence>

            <OverLay />

            <Controls>
                <NavButton onClick={prevSlide}>
                    <ChevronLeft size={28} />
                </NavButton>
                <NavButton onClick={nextSlide}>
                    <ChevronRight size={28} />
                </NavButton>
            </Controls>


            <Indicators>
                {images.map((_, index) => (
                    <Dot
                        key={index}
                        active={index === currentIndex}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                    />
                ))}
            </Indicators>
        </SliderWrapper>
    );
};

export default HeroSwiper;
