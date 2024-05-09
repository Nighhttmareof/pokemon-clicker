
import { LegacyRef, useCallback, useEffect, useRef, useState } from 'react';
import game  from './game.module.css'
import { BasePokemon, useGetPokemonsQuery } from '@/redux/pokemonsApi';
import { Button, Card } from 'antd';
import { PokemonBodyInterface } from '@/API/pokemonsDbAPI';

const Hunt = () => {
    const [hunting, setHunting] = useState(false)
    const [timer, setTimer] = useState(3)
    const [huntStart, setHuntStart] = useState(false)
    const huntCheker = useRef<HTMLDivElement>(null)
    const { data } = useGetPokemonsQuery({})
    const rerenderStyleArr = [game.hunt_timer, game.hunt_timer2, game.hunt_timer3, game.hunt_timer4, game.hunt_timer5]

    const [pokemonsToHunt, setPokemonsToHunt] = useState<PokemonBodyInterface[] | null>(null)
    const pokemonsStyles = [game.hunt_pokemon_choose, game.hunt_pokemon_choose2, game.hunt_pokemon_choose3]

    const [selectedHuntPokemon, setSelectedHuntPokemon] = useState<PokemonBodyInterface | null>(null)
    const [clicks, setClicks] = useState(0)
    const [huntTime, setHuntTime] = useState(60)

    const chance = (pokemon:PokemonBodyInterface) => {
        return Math.floor(clicks*100/pokemon.weight) > 100? 100 : Math.floor(clicks*100/pokemon.weight)
    }
    useEffect(() => {
        const updateTimer = () => {
            setTimer(prevTimer => (prevTimer >= 0 ? prevTimer - 1 : -1));
        };

        let interval:NodeJS.Timeout ;
        if (hunting && timer >= 0) {
            interval = setInterval(updateTimer, 1500);
        }

        return () => clearInterval(interval);
    }, [hunting]);

    useEffect(() => {
        if(huntCheker !== null) {
            if('Охота начинается!' === huntCheker.current?.innerHTML) {
                const timeout = setTimeout(() => {
                    setHuntStart(true)
                }, 3500);     
                return () => clearTimeout(timeout);
            }
        }   
    }, [timer, huntCheker])

    useEffect(() => {
        if(huntStart && data) { 
            let randmonIndexes = [];
            for (let i = 0; i < 3; i++) {
                const randomIndex = Math.floor(Math.random() * data.results.length);
                randmonIndexes.push(randomIndex);
            }
            const urls = randmonIndexes.map(index => data.results[index].url)
            const fetchPokemons = async () => {
                try {
                    const pokemons = await Promise.all(
                        urls.map(async (url) => {
                            const response = await fetch(url);
                            return response.json();
                        })
                    );
                    console.log(pokemons);
                    setPokemonsToHunt(pokemons)
                } catch (error) {
                    console.error("Ошибка при получении данных покемонов", error);
                }
            };
            fetchPokemons()
    
        }
    }, [huntStart])

    const reroll = () => {
        setHuntStart(false)
        setHunting(false)
        setTimer(3)
        setPokemonsToHunt(null)
    }

    useEffect(() => {
        if(selectedHuntPokemon) {
            const triggerArray = [10,20,30,40,50,60,70,80,90,100]

            for (let i = 0; i < triggerArray.length; i++) {
                if (chance(selectedHuntPokemon) === triggerArray[i]) {
                    const audioUrl = selectedHuntPokemon.cries.latest;
                    const audio = new Audio(audioUrl);
                    audio.play().catch(error => console.log("Ошибка воспроизведения аудио: ", error));

                }
            }
            
        }
    }, [clicks])


    useEffect(() => {
    
        let interval:NodeJS.Timeout;
    
        if (selectedHuntPokemon) {

          interval = setInterval(() => {

            setHuntTime(prevTimer => {
              if (prevTimer - 1 <= 0 || chance(selectedHuntPokemon) == 100) {
                clearInterval(interval);
                return huntTime;
              } else {
                return prevTimer - 1; 
              }
            });
          }, 1000);
        }

        return () => {
          if (interval) {
            clearInterval(interval);
          }
        };
      }, [selectedHuntPokemon]);

    return (
        <>
            <div className={game.hunt_field}>
                {!hunting? <button onClick={() => setHunting(true)}>
                    Начать охоту
                </button> :
                !huntStart? <div ref={huntCheker} className={rerenderStyleArr[timer+1]}>
                     {timer !== -1? timer : 'Охота начинается!' }
                </div>
                :
                !selectedHuntPokemon? <div className={game.hunt_pokemon_container}>
                    <div>
                        Поиск покемонов поблизости....
                    </div>
                    <div style={{display: 'flex', justifyContent:'center', gap: '1rem', height:'12rem'}}>
                        {pokemonsToHunt? pokemonsToHunt.map((pokemon, index) => (
                            <div style={{display:'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center'}} className = {pokemonsStyles[index]} key={`${pokemon.name}${index}`}>
                                <div onClick={() => setSelectedHuntPokemon(pokemon)} style={{backgroundImage: `url(${pokemon.sprites.front_default})`, backgroundSize:'cover', backgroundRepeat: 'no-repeat', width: '12rem', height: '12rem'}}>
                            
                                </div>
                                <div>
                                    Кликов: {pokemon.weight}
                                </div>
                            </div>
                        ))
                        :
                        <></>}
                    </div>
                    <Button onClick={reroll}>Бежать с охоты</Button>
                </div> 
                : //тут уже начинается сама охота
                <div className={game.hunt_battle}> 
                    <div style={{display:'flex', justifyContent: 'space-betwwen'}}>
                        <div>Сделано кликов:{clicks} </div>
                        <div>Шанс поймать:{chance(selectedHuntPokemon)}% </div>
                        <div>Время: {huntTime}</div>
                    </div>
                        
                    <div onClick={() => setClicks((prev) => prev+1)} style={{cursor:'pointer', position:'absolute',backgroundImage: `url(${selectedHuntPokemon?.sprites.front_default})`, backgroundSize:'cover', backgroundRepeat: 'no-repeat', width: '12rem', height: '12rem'}} className={game.hunt_selected_pokemon}>

                    </div>
                </div>
                }
            </div>
        </>
    )
}

export default Hunt;


