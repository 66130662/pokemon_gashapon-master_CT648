import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Collection.css";

interface ExternalPokemon {
  pok_id: number;
  pok_name: string;
  poke_type_card: string;
}

interface UserPokemon {
  pokemon_id: number;
}

interface Pokemon {
  pok_name: string;
  poke_type_card: string;
  image: string | null;
}

const Collection: React.FC = () => {
  const [collection, setCollection] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchPokemonImage = async (pokemonName: string) => {
    try {
      const response = await axios.get(
        `http://13.228.191.168:3001/api/pic_poke?pok_name=${encodeURIComponent(pokemonName.trim())}`
      );
      console.log(`Image data for ${pokemonName}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching image for ${pokemonName}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setIsLoading(true);
        const userId = localStorage.getItem("userId");
        
        const response = await axios.get(
          `http://localhost:3001/api/user-collection?user_id=${userId}`
        );
        console.log('Collection data:', response.data);
        
        // แปลงข้อมูลให้ตรงกับ interface Pokemon
        const pokemonCollection = response.data.map((pokemon: any) => ({
          pok_name: pokemon.pok_name,
          poke_type_card: pokemon.poke_type_card,
          image: pokemon.image
        }));
        
        setCollection(pokemonCollection);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load collection");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchCollection();
  }, []);

  // useEffect(() => {
  //   const fetchCollection = async () => {
  //     try {
  //       setIsLoading(true);
  //       const userId = localStorage.getItem("userId");
  //       console.log('Fetching for userId:', userId);

  //       if (!userId) {
  //         setError("User ID not found");
  //         return;
  //       }

  //       // ดึงข้อมูล Pokemon ที่ user มีจากฐานข้อมูล
  //       const userCollection = await axios.get(
  //         `http://localhost:3001/api/user-collection?user_id=${userId}`
  //       );
  //       console.log('User collection response:', userCollection.data);

  //       // ดึงข้อมูล Pokemon ทั้งหมดจาก API ภายนอก
  //       const allPokemon = await axios.get('http://13.228.191.168:3001/api/pokemon');
  //       console.log('All Pokemon data:', allPokemon.data);

  //       // สร้าง collection โดยการ map ข้อมูล
  //       const fullCollection = await Promise.all(
  //         userCollection.data.map(async (userPokemon: UserPokemon) => {
  //           const pokemonDetails = allPokemon.data.find(
  //             (p: ExternalPokemon) => p.pok_id === userPokemon.pokemon_id
  //           );
            
  //           if (pokemonDetails) {
  //             const imageData = await fetchPokemonImage(pokemonDetails.pok_name);
  //             return {
  //               pok_name: pokemonDetails.pok_name,
  //               poke_type_card: pokemonDetails.poke_type_card,
  //               image: imageData
  //             };
  //           }
  //           return null;
  //         })
  //       );

  //       const validCollection = fullCollection.filter((item): item is Pokemon => item !== null);
  //       console.log('Processed collection:', validCollection);
  //       setCollection(validCollection);
  //     } catch (error) {
  //       console.error("Error fetching collection:", error);
  //       setError("Failed to load collection");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchCollection();
  // }, []);

  const renderPokemonImage = (pokemon: Pokemon) => {
    if (!pokemon.image) {
      return "No Image";
    }
    return (
      <img 
        src={`data:image/png;base64,${pokemon.image}`}
        alt={pokemon.pok_name}
        width="50"
        height="50"
        style={{ objectFit: 'contain' }}
      />
    );
  };

  return (
    <div className="collection-container">
      {isLoading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!isLoading && !error && (
        <>
          <table className="collection-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {collection.length > 0 ? (
                collection.map((pokemon, index) => (
                  <tr key={index}>
                    <td>{pokemon.pok_name}</td>
                    <td>{pokemon.poke_type_card}</td>
                    <td>{renderPokemonImage(pokemon)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No Pokemon in collection</td>
                </tr>
              )}
            </tbody>
          </table>
          <button className="back-button" onClick={() => navigate("/game")}>
            Back to Game
          </button>
        </>
      )}
    </div>
  );
};

export default Collection;