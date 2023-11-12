import './styles.css'
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Header from './Header';
import {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import {useStoreContext} from '../context/StoreContext';
import agent from '../api/agent';
import {getCookie} from '../util/util';
import LoadingComponent from './LoadingComponent';

function App() {
    const {setBasket} = useStoreContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const buyerId = getCookie('buyerId')
        if (buyerId) {
            agent.Basket.get()
                .then(basket => setBasket(basket))
                .catch(error => console.error(error))
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [setBasket])

    var [darkMode, setDarkMode] = useState(false);

    var theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            background: {
                default: darkMode ? '#121212' : '#eaeaea'
            }
        }
    })

    const handleThemeChange = () => {
        setDarkMode(!darkMode);
    };

    if (loading) <LoadingComponent message={'Loading ReStore...'}/>

    return (
        <>
            <ThemeProvider theme={theme}>
                <ToastContainer position='bottom-right' hideProgressBar theme='colored'/>
                <CssBaseline/>
                <Header darkMode={darkMode} onChange={handleThemeChange}/>
                <Container>
                    <Outlet/>
                </Container>
            </ThemeProvider>
        </>
    )
}

export default App
