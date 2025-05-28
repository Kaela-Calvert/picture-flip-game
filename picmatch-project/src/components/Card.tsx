// src/components/Card.tsx

import React from "react";
import { CardType } from "../types";

interface CardProps {
  card: CardType;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ card, onClick }) => {
  return (
    <div 
      className="card-container" 
      onClick={onClick}
    >
      <div className={`flip-card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}>
        <div className="flip-card-inner">
          {/* Front of card (question mark side - shown by default) */}
          <div className="flip-card-front bg-primary d-flex align-items-center justify-content-center rounded shadow">
            <span className="text-white display-4 fw-bold">?</span>
          </div>
          
          {/* Back of card (image side - shown when flipped) */}
          <div className="flip-card-back bg-white d-flex align-items-center justify-content-center rounded shadow">
            {card.isFlipped || card.isMatched ? (
              <img 
                src={card.image} 
                alt="Card" 
                className="w-100 h-100"
                style={{ 
                  objectFit: 'cover',
                  borderRadius: '0.375rem'
                }}
                onError={(e) => {
                  // If image fails to load, show a fallback
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.innerHTML = `
                      <div class="d-flex align-items-center justify-content-center w-100 h-100 bg-danger text-white">
                        <span class="fs-1">❌</span>
                      </div>
                    `;
                  }
                }}
              />
            ) : (
              <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center">
                <span className="text-white fs-4">Loading...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;