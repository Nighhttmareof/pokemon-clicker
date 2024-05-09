import { FinalItem } from '@/redux/itemsApi';
import item from './itemBlock/itemBlock.module.css'

const ItemBlock = ({itemData, index}: {itemData:FinalItem, index:number}) => {
    return(
        <>
            <div className={item.item}>
                <div style={{backgroundImage: `url(${itemData.sprites?.default})`}}></div>
            </div>
        </>
    )
}

export default ItemBlock;