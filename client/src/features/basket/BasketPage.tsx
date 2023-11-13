import {
    Box, Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {Add, Delete, Remove} from "@mui/icons-material";
import {BasketItem} from "../../app/models/basketItem";
import {LoadingButton} from "@mui/lab";
import BasketSummary from "./BasketSummary";
import {Link} from "react-router-dom";
import {addBasketItemAsync, removeBasketItemAsync} from "./basketSlice";
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore";

export default function BasketPage() {
    const {basket, status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    if (!basket) return <h3>Empty basket</h3>

    return <>
        <Typography variant={'h3'}>
            buyerId={basket.buyerId}
        </Typography>
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}}>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {basket.items.map((item: BasketItem) => (
                        <TableRow
                            key={item.productId}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                <Box display={'flex'} alignItems={'center'}>
                                    <img src={item.pictureUrl} alt={item.name}
                                         style={{height: 50, marginRight: 20}}/>
                                    <span>{item.name}</span>
                                </Box>
                            </TableCell>
                            <TableCell align="right">{(item.price / 100).toFixed(2)}</TableCell>
                            <TableCell align="center">
                                <LoadingButton
                                    onClick={() => dispatch(removeBasketItemAsync({
                                        productId: item.productId,
                                        quantity: 1,
                                        name: 'rem'
                                    }))}
                                    loading={status === `pendingRemoveItem${item.productId}rem`}
                                    color={'secondary'}>
                                    <Remove/>
                                </LoadingButton>
                                {item.quantity}
                                <LoadingButton
                                    onClick={() => dispatch(addBasketItemAsync({
                                        productId: item.productId,
                                        quantity: 1
                                    }))}
                                    loading={status === `pendingAddItem${item.productId}`}
                                    color={'secondary'}>
                                    <Add/>
                                </LoadingButton>
                            </TableCell>
                            <TableCell align="right">{(item.price / 100 * item.quantity).toFixed(2)}</TableCell>
                            <TableCell align="right">
                                <LoadingButton
                                    onClick={() => dispatch(removeBasketItemAsync({
                                        productId: item.productId,
                                        quantity: item.quantity,
                                        name: 'del'
                                    }))}
                                    loading={status === `pendingRemoveItem${item.productId}del`}
                                    color={'error'}
                                >
                                    <Delete/>
                                </LoadingButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Grid container>
            <Grid item xs={6}/>
            <Grid item xs={6}>
                <BasketSummary/>
                <Button
                    component={Link}
                    to={'/checkout'}
                >Checkout</Button>
            </Grid>
        </Grid>
    </>
}