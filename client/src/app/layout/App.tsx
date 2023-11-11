import './styles.css'
import Catalog from '../../features/catalog/Catalog';
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Header from './Header';
import {useState} from "react";

function App() {
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

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Header darkMode={darkMode} onChange={handleThemeChange}/>
                <Container>
                    <Catalog/>
                </Container>
            </ThemeProvider>
        </>
    )
}

export default App
