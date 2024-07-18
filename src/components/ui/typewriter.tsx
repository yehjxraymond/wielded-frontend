"use client";

import React, { useEffect, useState } from "react";

interface TypewriterProps {
  words: string[];
  className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({ words, className }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayWord, setDisplayWord] = useState("");

  useEffect(() => {
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseDuration = 3000;
    let interval: NodeJS.Timeout;

    if (isDeleting) {
      interval = setInterval(() => {
        setDisplayWord((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      }, deleteSpeed);
    } else {
      interval = setInterval(() => {
        setDisplayWord((prev) =>
          words[currentWordIndex].slice(0, prev.length + 1),
        );
        setCharIndex((prev) => prev + 1);
      }, typeSpeed);
    }

    const currentWord = words[currentWordIndex];
    if (!isDeleting && charIndex === currentWord.length) {
      clearInterval(interval);

      setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }

    return () => {
      clearInterval(interval);
    };
  }, [charIndex, currentWordIndex, isDeleting, words]);

  return <span className={className}>{displayWord}</span>;
};
