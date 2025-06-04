// src/components/Card.tsx
import React from "react";
import { CardType } from "../types";

interface CardProps {
  card: CardType;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ card, onClick }) => {
  return (
    <div className="card-container" onClick={onClick}>
      <div className={`flip-card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}>
        <div className="flip-card-inner">
          {/* Front of card (question mark side - shown by default) */}
          <div className="flip-card-front">
            <span>?</span>
          </div>
          
          {/* Back of card (image side - shown when flipped) */}
          <div className="flip-card-back">
            <img
              src={card.image}
              alt="Card"
              onError={(e) => {
                // If image fails to load, show a fallback
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background-color: #dc3545; color: white; border-radius: 0.375rem;">
                      <span style="font-size: 2rem;">❌</span>
                    </div>
                  `;
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;