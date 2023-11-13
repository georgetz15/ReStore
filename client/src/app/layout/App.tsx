import './styles.css'
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Header from './Header';
import {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import agent from '../api/agent';
import {getCookie} from '../util/util';
import LoadingComponent from './LoadingComponent';
import { useAppDispatch } from '../store/configureStore';
import { setBasket } from '../../features/basket/basketSlice';

function App() {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const buyerId = getCookie('buyerId')
        if (buyerId) {
            agent.Basket.get()
                .then(basket => dispatch(setBasket(basket)))
                .catch(error => console.error(error))
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [dispatch])

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
