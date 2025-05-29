// src/App.tsx

import React, { useEffect, useState } from "react";
import Card from './components/Card';
import { CardType } from "./types";
import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  // Game images - using simple emoji data URLs that will definitely work
  // const images = [
  //   "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23FF6B6B'/%3E%3Ctext x='50' y='55' text-anchor='middle' font-size='40' fill='white'%3E🥾%3C/text%3E%3C/svg%3E",
  //   "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%234ECDC4'/%3E%3Ctext x='50' y='55' text-anchor='middle' font-size='40' fill='white'%3E🧢%3C/text%3E%3C/svg%3E",
  //   "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%2345B7D1'/%3E%3Ctext x='50' y='55' text-anchor='middle' font-size='40' fill='white'%3E💡%3C/text%3E%3C/svg%3E",
  //   "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23FFA07A'/%3E%3Ctext x='50' y='55' text-anchor='middle' font-size='40' fill='white'%3E🍱%3C/text%3E%3C/svg%3E",
  // ];

  const images = [
    "/images/boots.jpeg",
    "/images/hat.png", 
    "/images/lamp.jpeg",
    "/images/lunch.png",
  ];

  // Game state
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Create and shuffle cards when game starts
  const createCards = (): CardType[] => {
    // Create pairs of each image
    const pairedImages = [...images, ...images];
    
    // Shuffle the cards randomly
    const shuffledCards = pairedImages
      .map((image, index) => ({
        id: index,
        image: image,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);
    
    return shuffledCards;
  };

  // Start new game
  const startNewGame = () => {
    setCards(createCards());
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
  };

  // Initialize game when component loads
  useEffect(() => {
    startNewGame();
  }, []);

  // Handle when a card is clicked
  const handleCardClick = (cardIndex: number) => {
    const clickedCard = cards[cardIndex];
    
    // Don't do anything if:
    // - Card is already flipped
    // - Card is already matched  
    // - Two cards are already flipped
    if (clickedCard.isFlipped || clickedCard.isMatched || flippedCards.length === 2) {
      return;
    }

    // Flip the clicked card
    const newCards = [...cards];
    newCards[cardIndex].isFlipped = true;
    setCards(newCards);

    // Add to flipped cards list
    const newFlippedCards = [...flippedCards, cardIndex];
    setFlippedCards(newFlippedCards);
    setMoves(moves + 1);

    // Check if two cards are flipped
    if (newFlippedCards.length === 2) {
      const [firstCardIndex, secondCardIndex] = newFlippedCards;
      const firstCard = newCards[firstCardIndex];
      const secondCard = newCards[secondCardIndex];

      // Check if cards match
      if (firstCard.image === secondCard.image) {
        // Cards match!
        firstCard.isMatched = true;
        secondCard.isMatched = true;
        
        const newMatches = matches + 1;
        setMatches(newMatches);
        
        // Clear flipped cards after short delay
        setTimeout(() => {
          setFlippedCards([]);
          
          // Check if game is won
          if (newMatches === images.length) {
            setGameWon(true);
          }
        }, 500);
      } else {
        // Cards don't match - flip them back
        setTimeout(() => {
          firstCard.isFlipped = false;
          secondCard.isFlipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        {/* Game Header */}
        <div className="text-center mb-4">
          <h1 className="display-4 fw-bold text-primary mb-3">
            🃏 Picture Flip Match Game
          </h1>
          
          {/* Game Stats */}
          <div className="row justify-content-center mb-3">
            <div className="col-auto">
              <div className="badge bg-info fs-6 me-3">
                Moves: {moves}
              </div>
              <div className="badge bg-success fs-6 me-3">
                Matches: {matches}/{images.length}
              </div>
            </div>
          </div>

          {/* New Game Button */}
          <button 
            className="btn btn-warning btn-lg fw-bold"
            onClick={startNewGame}
          >
            New Game
          </button>
        </div>

        {/* Game Board */}
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="row g-3">
              {cards.map((card, index) => (
                <div key={card.id} className="col-6 col-md-3">
                  <Card 
                    card={card} 
                    onClick={() => handleCardClick(index)} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Win Message */}
        {gameWon && (
          <div className="position-fixed top-50 start-50 translate-middle">
            <div className="card border-0 shadow-lg">
              <div className="card-body text-center bg-success text-white rounded">
                <h2 className="card-title">🎉 You Won!</h2>
                <p className="card-text fs-5">
                  Completed in {moves} moves!
                </p>
                <button 
                  className="btn btn-light btn-lg fw-bold"
                  onClick={startNewGame}
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .card-container {
          aspect-ratio: 1;
          perspective: 1000px;
          cursor: pointer;
        }

        .flip-card {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.6s ease-in-out;
        }

        .flip-card.flipped {
          transform: rotateY(180deg);
        }

        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border: 2px solid #dee2e6;
        }

        .flip-card-front {
          /* This side shows by default */
          transform: rotateY(0deg);
        }

        .flip-card-back {
          /* This side is hidden until flipped */
          transform: rotateY(180deg);
        }

        .card-container:hover {
          transform: scale(1.05);
          transition: transform 0.2s ease;
        }

        .flip-card-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

export default App;