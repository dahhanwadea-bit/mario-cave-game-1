import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Game() {
  const [rockX, setRockX] = useState(800);
  const [rockY, setRockY] = useState(200);
  const [playerY, setPlayerY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [rockDirection, setRockDirection] = useState(-10);
  const [enemyHealth, setEnemyHealth] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setRockX((prev) => {
        let next = prev + rockDirection;
        if (next < 50) {
          setRockDirection(10);
        } else if (next > 800) {
          setRockDirection(-10);
        }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [rockDirection]);

  useEffect(() => {
    let jumpInterval;
    if (isJumping) {
      let velocity = 15;
      jumpInterval = setInterval(() => {
        setPlayerY((prev) => {
          const next = prev + velocity;
          velocity -= 1.2;
          if (next <= 0) {
            clearInterval(jumpInterval);
            setIsJumping(false);
            return 0;
          }
          return next;
        });
      }, 30);
    }
    return () => clearInterval(jumpInterval);
  }, [isJumping]);

  const handleJump = () => {
    if (!isJumping) setIsJumping(true);
  };

  const hitRock = () => {
    if (rockX < 120 && rockX > 80 && playerY < 50) {
      setRockDirection(10);
      setEnemyHealth((prev) => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex items-end justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(60,60,60,1)_0%,rgba(0,0,0,1)_100%)]" />

      {enemyHealth > 0 && (
        <div className="absolute top-32 right-16 w-20 h-20 bg-purple-700 rounded-full flex items-center justify-center text-white font-bold">
          👹
        </div>
      )}

      <motion.div
        animate={{ bottom: playerY + 96 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="absolute left-20 w-16 h-16 bg-blue-500 rounded-md shadow-xl flex items-center justify-center"
      >
        🙂
      </motion.div>

      {enemyHealth > 0 && (
        <motion.div
          animate={{ x: rockX, y: rockY }}
          transition={{ ease: "linear", duration: 0.05 }}
          className="absolute bottom-24 w-12 h-12 bg-gray-400 rounded-full shadow-lg"
        />
      )}

      <div className="absolute bottom-4 right-4 flex gap-4">
        <button
          onClick={handleJump}
          className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-xl shadow-md font-bold"
        >
          Jump
        </button>
        <button
          onClick={hitRock}
          className="bg-red-400 hover:bg-red-500 px-4 py-2 rounded-xl shadow-md font-bold"
        >
          Hit
        </button>
      </div>

      <div className="absolute top-4 left-4 text-white font-bold text-lg">
        Enemy Health: {enemyHealth}
      </div>
    </div>
  );
}