import { Select } from "antd"
import game from './game.module.css'
import { ItemFirstView, useLazyGetItemByUrlQuery, useGetItemsQuery, FinalItem } from "@/redux/itemsApi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { UserDataInterface } from "@/API/userInfo";
import { useLazyGetUserQuery, useSetItemsToUserMutation, useSetUserMutation, useSpendMoneyMutation } from "@/redux/userDataApi";
import { setUser } from "@/redux/userSlice";


const Shop = ({handleSpendMoney}: {handleSpendMoney:(user:UserDataInterface, amount:number) => void}) => {
    const dispatch = useDispatch();
    const [getUserData, {data: userData}] = useLazyGetUserQuery();
    const {data: shopItems} = useGetItemsQuery([])
    const [getItemByUrl,{data: itemByUrl}] = useLazyGetItemByUrlQuery({});
    const [finalItems, setFinalItems] = useState<FinalItem[] | []>([])
    const [setUserToDB] = useSetUserMutation();
    const user = useSelector((state:RootState) => state.userSlice) as unknown as UserDataInterface

    useEffect(() => {
        const fetchItems = async () => {
            if (shopItems) {
                const items = (await Promise.all(shopItems.results.
                    map((item:ItemFirstView) => getItemByUrl(item.name)))).map((item) => item.data).
                    map((item:FinalItem) => ({...item, cost: item.cost < 100? 100 : item.cost*3})). //манипулирую ценник на более приемлимый
                    sort((a, b) => a.cost - b.cost) as FinalItem[];
                setFinalItems(items);
                
            }
        }
        fetchItems()
    }, [shopItems])

    const buyItem = async (item:FinalItem) => {
        const money = (user.money - item.cost) as number
        const items = [...user.items, item] as FinalItem[]
        try {
            await setUserToDB({user, money, items}).then(() => dispatch(setUser({ ...user, money: user.money - item.cost, items: items })))
        } catch (error) {
            console.error('Failed to buy item:', error);
        }
    }



    return (
        <>
            <div className={game.shop_container}>
                <div className={game.shop_container_block}>
                    <span className={game.poke_style}>
                        Shop
                    </span>
                    <Select
                        mode="tags"
                        style={{ width: '100%', marginTop: '1rem', borderRadius: '2px', border: '1px solid rgba(217, 217, 217, 1)'}}
                        suffixIcon={null}
                        placeholder="Не работает, сейчас в отпуске"
                        variant={"borderless"}
                        //onChange={handleChange}
                        options={[{value: 'Ягоды'}, {value: 'Покеболы'}]}
                    />
                    <div className={game.shop_items}>
                        {finalItems? finalItems.map((item, index:number) => (
                            <div className={game.shop_item} key={`${item.name}${index}`}>
                                <div className={game.item_container}>
                                    <div>
                                        <div className={game.item_image}>
                                            <img src={item.sprites.default} alt="" />
                                        </div>
                                        <div className={game.item_info}>
                                            <h3>
                                                {item.name.split('-').join(' ')}
                                            </h3>
                                            <p>
                                                {item.flavor_text_entries.find((entry) => entry.language.name === 'en')?.text.split('').splice(0,46).join('')}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <button onClick={() => buyItem(item)}>
                                            Купить за {item.cost}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )): <></>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Shop;