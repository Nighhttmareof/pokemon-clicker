
import { useSelector } from 'react-redux';
import ItemBlock from '../itemBlock';
import game from './game.module.css'
import { RootState } from '@/redux/store/store';
import { UserDataInterface } from '@/API/userInfo';
import { FinalItem } from '@/redux/itemsApi';

const Inventory = () => {
    const user = useSelector((state: RootState) => state.userSlice) as unknown as UserDataInterface
    const inventorySize = 55;
    const emptyInventory = Array(inventorySize).fill('');
    const inventory = user? [...user.items, ...emptyInventory.slice(user.items.length, emptyInventory.length)] : emptyInventory as FinalItem[]
    return (
        <>
            <div className={game.inventory_container}>
                <span className={game.poke_style}>
                    Inventory
                </span>
                <div className={game.items}>
                    {inventory.map((item, index) => (
                        <ItemBlock key={`item-${index}-block`} itemData={item} index={index}/>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Inventory;