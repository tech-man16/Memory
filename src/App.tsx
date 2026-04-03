import React, { useState, useEffect, useCallback } from "react";

interface Card {
  id: number;
  value: string;
}

const INITIAL_VALUES: string[] = [
  "🍎",
  "🍎",
  "🚀",
  "🚀",
  "💎",
  "💎",
  "👻",
  "👻",
  "🌙",
  "🌙",
  "⭐",
  "⭐",
  "🧩",
  "🧩",
  "🔥",
  "🔥",
];

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);

  const initializeGame = useCallback(() => {
    const shuffledCards: Card[] = [...INITIAL_VALUES]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({ id: index, value }));
    setCards(shuffledCards);
    setMatched([]);
    setFlipped([]);
    setDisabled(false);
    setMoves(0);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleClick = (index: number): void => {
    if (disabled || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setDisabled(true);
      const [first, second] = newFlipped;

      if (cards[first].value === cards[second].value) {
        setMatched((prev) => [...prev, first, second]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-3 bg-slate-950 p-4 min-h-screen">
      <div className="gap-3 text-2xl"> Memory game </div>
      <div
        className="gap-4 grid grid-cols-4"
        style={{ perspective: "1000px" }} // Critical for 3D depth
      >
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index);
          const isMatched = matched.includes(index);
          const showBack = isFlipped || isMatched;

          return (
            <div
              key={card.id}
              onClick={() => handleClick(index)}
              className="w-20 sm:w-24 h-20 sm:h-24 cursor-pointer"
            >
              {/* INNER CONTAINER */}
              <div
                className="relative w-full h-full transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: isMatched ? "none" : "transform 0.5s", // Requirement: No animation if matched
                }}
              >
                {/* FRONT FACE (The "?" side) */}
                <div
                  className="absolute inset-0 flex justify-center items-center bg-slate-800 border-2 border-slate-700 rounded-xl w-full h-full"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <span className="font-bold text-slate-500 text-2xl">?</span>
                </div>

                {/* BACK FACE (The Emoji side) */}
                <div
                  className={`absolute inset-0 w-full h-full flex items-center justify-center text-4xl rounded-xl border-2 ${
                    isMatched
                      ? "bg-emerald-500 border-emerald-400"
                      : "bg-blue-600 border-blue-400"
                  }`}
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)", // Pre-rotate the back side
                  }}
                >
                  {card.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={initializeGame}
        className="bg-white hover:bg-blue-400 mt-8 px-6 py-2 rounded-full font-bold text-slate-900 transition-colors"
      >
        RESET
      </button>

      <div className="mt-4 text-white text-lg"> Moves: {moves}</div>
    </div>
  );
};

export default MemoryGame;
