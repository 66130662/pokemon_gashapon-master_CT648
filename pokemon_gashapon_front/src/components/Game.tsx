import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Game.css";
import backgroundImage from "../assets/images/Group1.png";
import PokemonEgg from "../assets/images/Pokemon.jpg";
import loadingSound from "../assets/sounds/loadingSound.mp3";
import gashaponMachine from "../assets/images/gashaponMachine.png";
import hoverSound from "../assets/sounds/hoverSound.mp3";
import { useNavigate, useLocation } from "react-router-dom";
import Group5 from "../assets/images/Group5.png";

interface GameProps {
  username: string;
  onLogout: () => void;
}

interface PokemonCard {
  id: number;
  name: string;
  type: string;
  hp_base: number;
  attack_base: number;
  defense_base: number;
  image: string;
}

const Game: React.FC<GameProps> = ({ username, onLogout }) => {
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const [isCracking, setIsCracking] = useState<boolean>(false);
  const [randomCard, setRandomCard] = useState<PokemonCard | null>(null);
  const [showPokemon, setShowPokemon] = useState<boolean>(false);
  const [history, setHistory] = useState<PokemonCard[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: string | null }>({ id: null });
  const [dropRates, setDropRates] = useState<{ [key: string]: number }>({});
  const [consecutivePulls, setConsecutivePulls] = useState<number>(0);
  const [powerUpPoints, setPowerUpPoints] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [backgroundAudio] = useState(new Audio(loadingSound));

  useEffect(() => {
    const storedMuted = localStorage.getItem("isMuted");
    const storedVolume = localStorage.getItem("volume");

    setIsMuted(storedMuted === "true");
    setVolume(storedVolume ? parseFloat(storedVolume) : 0.5);

    backgroundAudio.loop = true;
    backgroundAudio.volume =
      storedMuted === "true" ? 0 : parseFloat(storedVolume || "0.5");

    if (isGameStarted && storedMuted !== "true") {
      backgroundAudio.play().catch((error) => {
        console.error("Audio play failed:", error);
      });
    }

    return () => {
      backgroundAudio.pause();
      backgroundAudio.currentTime = 0;
    };
  }, [isGameStarted, backgroundAudio]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/user?username=${username}`
        );
        setUser({ id: response.data.user_id });
        setConsecutivePulls(response.data.consecutive_pulls);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchDropRates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/drop-rates"
        );
        setDropRates(response.data);
      } catch (error) {
        console.error("Error fetching drop rates:", error);
      }
    };

    fetchUserData();
    fetchDropRates();

    return () => {
      backgroundAudio.pause();
      backgroundAudio.currentTime = 0;
    };
  }, [username, backgroundAudio]);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    localStorage.setItem("isMuted", JSON.stringify(newMuteState));
    backgroundAudio.volume = newMuteState ? 0 : volume;
  };
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    localStorage.setItem("volume", JSON.stringify(newVolume));

    if (newVolume === 0) {
      setIsMuted(true);
      localStorage.setItem("isMuted", JSON.stringify(true));
    } else {
      setIsMuted(false);
      localStorage.setItem("isMuted", JSON.stringify(false));
    }

    backgroundAudio.volume = isMuted ? 0 : newVolume;
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return "🔇"; // ปิดเสียง
    if (volume > 0.5) return "🔊"; // เสียงดัง
    return "🔉"; // เสียงเบา
  };

  const handleMachineClick = () => {
    setIsGameStarted(true);
    setTimeout(() => setIsCracking(false), 500);
  };

  const handleEggClick = async () => {
    if (isCracking || !user.id) return;
    setIsCracking(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/random-pokemon?user_id=${user.id}`
      );
      console.log("API Response:", response.data);

      if (response.data && response.data.pok_name) {
        // ดึงรูปภาพจาก API ภายนอก
        const imageResponse = await axios.get(
          `http://13.228.191.168:3001/api/pic_poke?pok_name=${encodeURIComponent(
            response.data.pok_name.trim()
          )}`
        );

        const randomPokemon: PokemonCard = {
          id: response.data.pok_id,
          name: response.data.pok_name.trim(),
          type: response.data.poke_type.trim(),
          hp_base: response.data.hp_base,
          attack_base: response.data.attack_base,
          defense_base: response.data.defense_base,
          image: imageResponse.data,
        };

        setTimeout(() => {
          setRandomCard(randomPokemon);
          setHistory((prevHistory) => [...prevHistory, randomPokemon]);
          setShowPokemon(true);
          setIsCracking(false);
          setConsecutivePulls((prev) => prev + 1);
          handlePokemonObtained(randomPokemon.id);
        }, 3000);
      }
    } catch (error) {
      console.error("Error fetching random Pokemon:", error);
      alert("Failed to fetch Pokemon. Please try again.");
      setIsCracking(false);
    }
  };

  const handlePokemonObtained = async (pokemonId: number) => {
    if (!user.id) {
      console.error("User ID is not available");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3001/api/duplicate-pokemon",
        {
          userId: user.id,
          pokemonId: pokemonId,
        }
      );
      alert(response.data.message);

      const pointsResponse = await axios.get(
        `http://localhost:3001/api/user-pokemon-points?user_id=${user.id}&pokemon_id=${pokemonId}`
      );
      setPowerUpPoints(pointsResponse.data.power_up_points);
    } catch (error) {
      console.error("Error handling obtained Pokemon:", error);
    }
  };

  const handleClear = () => {
    setRandomCard(null);
    setShowPokemon(false);
    setIsGameStarted(false);
    setPowerUpPoints(0);
  };

  const toggleHistoryModal = () => {
    setShowHistoryModal(!showHistoryModal);
  };

  const playHoverSound = () => {
    if (!isMuted) {
      const audio = new Audio(hoverSound);
      audio.play();
    }
  };

  const isActive = (path: string) => currentLocation.pathname === path;

  return (
    <div
      className="game-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="navbar">
        <div className="navbar-left">
          <button
            className={`nav-button ${isActive("/AboutMe") ? "active" : ""}`}
            onClick={() => navigate("/AboutMe")}
          >
            About Me
          </button>
          <button
            className={`nav-button ${isActive("/Rules") ? "active" : ""}`}
            onClick={() => navigate("/Rules")}
          >
            Rules
          </button>
          <button
            className={`nav-button ${isActive("/collection") ? "active" : ""}`}
            onClick={() => navigate("/collection")}
          >
            View Collection
          </button>
          <div className="navbar-right">
            <button onClick={onLogout}>Logout</button>
          </div>
        </div>
      </div>

      {!isGameStarted ? (
        <div
          className="start-container"
          onClick={handleMachineClick}
          onMouseEnter={playHoverSound}
        >
          <h1 className="welcome-message">
            Welcome {username} to the Gashapon Machine!
          </h1>
          <img
            src={gashaponMachine}
            alt="Gashapon Machine"
            className="gashapon-image"
            style={{ width: "600px", height: "auto" }}
          />
        </div>
      ) : (
        <>
          {!showPokemon && (
            <div className="egg-grid">
              <div
                className={`egg ${isCracking ? "cracking" : ""}`}
                onClick={handleEggClick}
              >
                <img
                  src={PokemonEgg}
                  alt="Pokémon Egg"
                  className={`egg-image ${isGameStarted ? "zoom-in" : ""}`}
                />
              </div>
            </div>
          )}

          {showPokemon && randomCard && (
            <div className="pokemon-card-container">
              <div
                className="pokemon-card"
                style={{ backgroundImage: `url(${Group5})` }}
              >
                <button
                  className="close-button"
                  onClick={() => {
                    setShowPokemon(false);
                    setRandomCard(null);
                  }}
                >
                  ✕
                </button>
                <h3 className="pokemon-name">{randomCard.name}</h3>
                <div className="pokemon-image-container">
                  {randomCard.image ? (
                    <img
                      src={`data:image/png;base64,${randomCard.image}`}
                      alt={randomCard.name}
                      className="pokemon-image"
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                </div>
                <div className="pokemon-info">
                  <p>Type: {randomCard.type}</p>
                  <p>HP: {randomCard.hp_base}</p>
                  <p>Attack: {randomCard.attack_base}</p>
                  <p>Defense: {randomCard.defense_base}</p>
                </div>
                <div className="rarity-stars">
                  {randomCard.type === "rare" && <div>⭐⭐⭐</div>}
                  {randomCard.type === "uncommon" && <div>⭐⭐</div>}
                  {randomCard.type === "common" && <div>⭐</div>}
                </div>
              </div>
            </div>
          )}

          <div className="drop-rates">
            <h3>Drop Rates:</h3>
            {Object.entries(dropRates).map(([type, rate]) => (
              <p key={type}>
                {type}: {rate}%
              </p>
            ))}
            <p>Power-up Points for this Pokémon: {powerUpPoints}</p>
          </div>

          <div className="consecutive-pulls">
            <p>Consecutive Pulls: {consecutivePulls}</p>
          </div>
        </>
      )}
      <div className="volume-control_game">
        <span
          onClick={toggleMute}
          style={{ cursor: "pointer", fontSize: "24px" }}
        >
          {getVolumeIcon()}
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          disabled={isMuted}
          style={{
            width: "100px",
            cursor: "pointer",
            appearance: "none",
            backgroundColor: "#ddd",
            height: "10px",
            borderRadius: "5px",
          }}
        />
        <span>{Math.round(volume * 100)}%</span>
        <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
      </div>
    </div>
  );
};

export default Game;
