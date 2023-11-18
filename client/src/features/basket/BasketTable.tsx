import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import {Add, Delete, Remove} from "@mui/icons-material";
import {BasketItem} from "../../app/models/basketItem";
import {LoadingButton} from "@mui/lab";
import {addBasketItemAsync, removeBasketItemAsync} from "./basketSlice";
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore";

interface Props {
    items: BasketItem[];
    isBasket?: boolean;
}

export default function BasketPage({items, isBasket = true}: Props) {
    const {status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    return <>
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}}>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        {isBasket &&
                            <TableCell align="right"></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item: BasketItem) => (
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
                                {isBasket &&
                                    <LoadingButton
                                        onClick={() => dispatch(removeBasketItemAsync({
                                            productId: item.productId,
                                            quantity: 1,
                                            name: 'rem'
                                        }))}
                                        loading={status === `pendingRemoveItem${item.productId}rem`}
                                        color={'secondary'}>
                                        <Remove/>
                                    </LoadingButton>}
                                {item.quantity}
                                {isBasket &&
                                    <LoadingButton
                                        onClick={() => dispatch(addBasketItemAsync({
                                            productId: item.productId,
                                            quantity: 1
                                        }))}
                                        loading={status === `pendingAddItem${item.productId}`}
                                        color={'secondary'}>
                                        <Add/>
                                    </LoadingButton>}
                            </TableCell>
                            <TableCell align="right">{(item.price / 100 * item.quantity).toFixed(2)}</TableCell>
                            {isBasket &&
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
                                </TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>
}