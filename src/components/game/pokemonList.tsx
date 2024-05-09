import { Button, Card, Modal, Tabs, TabsProps } from "antd";
import game from './game.module.css'
import { useEffect, useState } from "react";
import { PokemonBodyInterface, PokemonInterface, addPokemonToDB, deletePokemonFromDB, getUserPokemons, pokemonsCheker } from "@/API/pokemonsDbAPI";
import { BasePokemon, useGetPokemonsQuery, useSelectPokemonQuery } from "@/redux/pokemonsApi";;
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { UserDataInterface } from "@/API/userInfo";
import { setUser } from "@/redux/userSlice";



const PokemonList = () => {
  const dispatch = useDispatch();
    const [pokemonsData, setPokemonsData] = useState<[] | null>(null)
    const pokemons = pokemonsData? pokemonsData.map((pokemon: PokemonInterface) => (
        pokemon.body
    )) : []
    const user = useSelector((state: RootState) => state.userSlice) as unknown as UserDataInterface
    const [pokemonName, setPokemonName] = useState<string>('');
    const { data } = useGetPokemonsQuery({});
    const { data: selectedPokemonData } = useSelectPokemonQuery(pokemonName, {skip: !pokemonName});
   

    const [showMode, setShowMode] = useState(false);
    const [selectedPokemonchik, setSelectedPokemonchik] = useState<PokemonBodyInterface | null>(null)


    const getPokemons = async () => {
        const data = (await getUserPokemons())
        setPokemonsData(data)
    }

    const pokemonDelete = async () => {
      if(selectedPokemonchik) {
        try {
          const formatedPokemon = {name: selectedPokemonchik.name, url: ''} as BasePokemon
          await deletePokemonFromDB(formatedPokemon, user.id).then((res) => {
            getPokemons()
            setShowMode(false)
          })
          
        } catch {
  
        }
      }
    }
    
    const modalUse = (pokemon:PokemonBodyInterface) => {
      if (showMode) {
        setShowMode(false)
      } else setShowMode(true)
      setSelectedPokemonchik(pokemon)
    }


    useEffect(() => {
        getPokemons()
    }, [])


    
    useEffect(() => {
        if (data && user) {
          pokemonsCheker(user.id)
            .then((response) => {
              if (response !== true) {
                 
              }
            })
            .catch((error) => {
              console.log(pokemonName)
              const randomPokemonIndex = Math.floor(Math.random() * data.results.length)
              setPokemonName(data.results[randomPokemonIndex].name)
            });
        }
      }, [user, data]);
  
      useEffect(() => {
        if (user && selectedPokemonData) {
          pokemonsCheker(user.id)
          .catch(() => {
            addPokemonToDB(selectedPokemonData, user.id)
            getPokemons()
          })
        }
      }, [pokemonName, selectedPokemonData])

      const items: TabsProps['items'] = [
        {
          key: '1',
          label: 'Накормить',
          children: 'Кормить нельзя, он наказан',
        },
        {
          key: '2',
          label: 'Статистика',
          children: <Button onClick={() => pokemonDelete()} >Удалить</Button>,
        },
      ];
    return(
      <>
        {pokemons.length > 0? <div className={game.pokemon_list}>
            {pokemons.map((pokemon, index) => (
                <Card key={`${pokemon}${index}`} 
                title = {<div className={game.pokemon_font}>{pokemon.name.split('-').join(' ')}</div>}
                extra = {<div onClick={() => modalUse(pokemon)} className={game.pokemon_extra}></div>}
                bordered={false}
                styles={{body: {width: '10.5rem', height: '12.5rem', display: "flex", flex: '1', flexDirection: 'row', borderBottom: 'white', padding: '0 1rem'}, 
                header: {border:'none', justifyContent: 'space-between', minHeight:'2rem', maxHeight: '3rem', padding: '0 1rem' },
                title: {margin: '0', padding: '0'}}}>
                    <div>
                        <div className={game.pokemon_image} style={{backgroundImage: `url(${pokemon.sprites.front_default})`}}>

                        </div>
                        <p className={`${game.pokemon_info} ${game.pokemon_font}`}>
                            <span>Вес:</span> <span>{pokemon.weight} кг</span>
                        </p>
                        <p className={`${game.pokemon_info} ${game.pokemon_font}`}>
                            <span>Денег/сек:</span> <span>1</span> 
                        </p>
                    </div>
                </Card>
            ))}
            <Modal title={`Управление покемоном ${selectedPokemonchik? selectedPokemonchik.name :''}`}
            open={showMode}
            style={{borderRadius: '2px', border:'1px solid white', background: '#ffffff', boxShadow:'none'}}
            
            onCancel={() => setShowMode(false)}
            centered
            footer={<><Button onClick={() => setShowMode(false)} type="primary" style={{backgroundColor: 'rgba(54, 95, 172, 1)',border: '1px solid rgba(54, 95, 172, 1)', color:'white', borderRadius: '2px'}}>Скрыться с поля зрения</Button></>}
            >
              <Tabs centered defaultActiveKey="1" items={items} />
            </Modal>
        </div> :
        <div style={{height: '10rem', display:'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem'}}>
          <p>Секретное запретное заклинание, призывающе рандомного покемона:</p>
          <Button onClick={() => dispatch(setUser({...user}))} type="primary" style={{backgroundColor: 'rgba(54, 95, 172, 1)',border: '1px solid rgba(54, 95, 172, 1)', color:'white', borderRadius: '2px'}}>Авокадо кедавро</Button>
        </div>
        }
      </>
    )
}

export default PokemonList;