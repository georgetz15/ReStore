import {
    Alert,
    AlertTitle,
    Button,
    ButtonGroup,
    Container,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";
import agent from "../../app/api/agent";
import {useState} from "react";

export default function AboutPage() {
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    function getValidationErrors() {
        agent.Buggy.getValidationError()
            .then(_ => console.log('Should not succed on getting validation errors!'))
            .catch(error => setValidationErrors(error))
    }

    return <>
        <Container>
            <Typography gutterBottom variant='h2'>
                Errors for testing
            </Typography>
            <ButtonGroup fullWidth>
                <Button
                    variant='contained'
                    onClick={() => agent.Buggy.get400Error().catch(error => console.log(error))}>
                    400 Error
                </Button>
                <Button
                    variant='contained'
                    onClick={() => agent.Buggy.get401Error().catch(error => console.log(error))}>
                    401 Error
                </Button>
                <Button
                    variant='contained'
                    onClick={() => agent.Buggy.get404Error().catch(error => console.log(error))}>
                    404 Error
                </Button>
                <Button
                    variant='contained'
                    onClick={() => agent.Buggy.get500Error().catch(error => console.log(error))}>
                    500 Error
                </Button>
                <Button
                    variant='contained'
                    onClick={getValidationErrors}>
                    Validation Error
                </Button>
            </ButtonGroup>

            {validationErrors.length > 0 &&
                <Alert severity='error'>
                    <AlertTitle>
                        Validation Errors
                    </AlertTitle>
                    <List>
                        {validationErrors.map(error =>
                            <ListItem key={error}>
                                <ListItemText>{error}</ListItemText>
                            </ListItem>)}
                    </List>
                </Alert>}

        </Container>
    </>
}