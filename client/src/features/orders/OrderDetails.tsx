import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {BasketItem} from "../../app/models/basketItem";
import agent from "../../app/api/agent";
import {Order} from "../../app/models/order";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {Button, Grid, Typography} from "@mui/material";
import BasketTable from "../basket/BasketTable";
import BasketSummary from "../basket/BasketSummary";

export default function OrderDetails() {
    const {id} = useParams<{ id: string }>();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true)
        agent.Orders.fetch(parseInt(id!))
            .then((res: Order) => setOrder(res))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false))
    }, []);

    if (loading) return <LoadingComponent message={'Loading orders...'}/>

    return <>
        <Typography variant={'h6'}>
            Order #{order?.id}: {order?.orderStatus}
        </Typography>
        <BasketTable items={order?.orderItems as BasketItem[] || []} isBasket={false}/>
        <Grid container>
            <Grid item xs={6}/>
            <Grid item xs={6}>
                <BasketSummary subtotal={order?.subtotal || 0}/>
                <Button
                    component={Link}
                    to={'/orders'}
                    variant='contained'
                    size='large'
                    fullWidth
                >All orders</Button>
            </Grid>
        </Grid>
    </>
}