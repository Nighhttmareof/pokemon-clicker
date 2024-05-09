import { UserDataInterface, getUserData} from "@/API/userInfo";
import { CSSProperties, useEffect, useState } from "react";
import game from "./game/game.module.css";
import { Collapse, CollapseProps, Select } from "antd";
import PokemonList from "./game/pokemonList";
import { useSpendMoneyMutation } from "@/redux/userDataApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setUser } from "@/redux/userSlice";
import Shop from "./game/shop";
import Inventory from "./game/inventory";
import Hunt from "./game/hunt";


const moneyConverter = (money: number): string => {
    const moneyArray = money.toString().split("").reverse();
    let result = [];
    for (let i = 0; i < moneyArray.length; i += 3) {
        result.push(moneyArray.slice(i, i + 3).reverse().join(''));
    }

    return result.reverse().join(' ');
}

const Game = () => {
    const [spendMoney] = useSpendMoneyMutation();
    
    const dispatch = useDispatch();
    const user = useSelector((state:RootState) => state.userSlice) as UserDataInterface | null
    const items:(panelStyle:CSSProperties) =>CollapseProps['items'] = (panelStyle) => [
        {
            key: '1',
            label: <span className={game.poke_style}>My Pokemons</span>,
            children: <PokemonList />,
            
            style: panelStyle,
        },
        {
            key: '2',
            label: <span className={game.poke_style}>Garden</span>,
            collapsible: "disabled",
            style: panelStyle,
        },
        {
            key: '3',
            label: <span className={game.poke_style}>Hunt</span>,
            children: <Hunt />,
            style: panelStyle,
        },

    ]

    const panelStyle: React.CSSProperties = {
        marginBottom: 24,
        paddingLeft: '0rem',
        background: 'white',
        borderColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0px 0px 16px 0px rgba(58, 58, 58, 0.1)',
        
      };

    const handleSpendMoney = async (user:UserDataInterface, amount:number) => {
        try {
            const result = await spendMoney({ user, amount }).unwrap();
            if(result) {
                dispatch(setUser(result))
            }
        } catch (error) {}
    }


    return(
        <div className={game.game_page}>
            <header className={game.header}>
                <div className="logo"></div>
                <div className="money_container">
                    <span onClick={user? () => handleSpendMoney(user, user.money - 1) : () => console.log('test')} className={game.money}>
                        {user && user.money? moneyConverter(user.money) : 'Загрузка...'}  
                    </span>  
                </div>
            </header>
            <section className={game.game_section}>
                <Inventory />
                <div className={game.game_container}>
                <Collapse
                    bordered={false}
                    defaultActiveKey={['1']}
                    expandIcon={({ isActive }) => <div style={{height:'100%'}}><div className={`${game.arrow} ${isActive? game.rotated_arrow : ''}`}></div></div>}
                    style={{ background: 'white', padding: '0', maxWidth: '45rem'}}
                    items={items(panelStyle)}
                />
                </div>
                <Shop handleSpendMoney={handleSpendMoney} />
            </section>  
        </div>
    )
}

export default Game;