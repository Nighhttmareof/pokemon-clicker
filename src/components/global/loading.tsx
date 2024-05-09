import global from './global.module.css'

const Loading = () => {
    return (
        <div className={global.page}>
            <svg className={global.spinner} viewBox="0 0 50 50">
                <circle className={global.path} stroke='hsl(210, 70, 75)' cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
            </svg>
        </div>
    )
}

export default Loading;