import './styles.css'
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Header from './Header';
import {useCallback, useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import LoadingComponent from './LoadingComponent';
import {useAppDispatch} from '../store/configureStore';
import {fetchBasketAsync} from '../../features/basket/basketSlice';
import {fetchCurrentUser} from '../../features/account/accountSlice';

function App() {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    const initApp = useCallback(async () => {
        try {
            dispatch(fetchCurrentUser());
            dispatch(fetchBasketAsync());
        } catch (error) {
            console.error(error)
        }
    }, [dispatch])

    useEffect(() => {
        initApp().then(() => setLoading(false));
    }, [initApp])

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
