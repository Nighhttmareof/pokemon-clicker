import { BasePokemon } from "@/redux/pokemonsApi";

export interface PokemonBodyInterface {
    name:string,
    weight: number,
    sprites: {
        [key: string]: string,
    },
    cries: {
        latest: string,
    }
        //и полно другого дерьма
}

export interface PokemonInterface {
    body: PokemonBodyInterface;
}




export const pokemonsCheker = async (id:number) => {
    const response = await fetch(`http://localhost:9999/pokemons/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (response.ok) {
        return true;
    } else throw new Error()
}


export const pokemonsFromDB = async () => {
    const response = await fetch(`http://localhost:9999/pokemons/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const getUserPokemons = async () => {
    const token = localStorage.getItem('token') as string
    const response = fetch(`http://localhost:9999/pokemons`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    return (await response).json();
}


export const addPokemonToDB = async (pokemon:BasePokemon, id:number) => {
    const token = localStorage.getItem('token') as string
    fetch(`http://localhost:9999/pokemons`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            id: id,
            body: pokemon
        })
    })

}


export const deletePokemonFromDB = async (pokemon:BasePokemon, id:number) => {
    const token = localStorage.getItem('token') as string
    fetch(`http://localhost:9999/pokemons/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            id: id,
            body: pokemon
        })
    })

}