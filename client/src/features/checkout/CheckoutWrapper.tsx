import {Elements} from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import {loadStripe} from "@stripe/stripe-js";
import {useAppDispatch} from "../../app/store/configureStore";
import {useEffect, useState} from "react";
import agent from "../../app/api/agent";
import {setBasket} from "../basket/basketSlice";
import LoadingComponent from "../../app/layout/LoadingComponent";

// See https://stripe.com/docs/stripe-js/react for setting up stripe on client
const stripePromise = loadStripe("pk_test_51OEEn7CPTnLdrO5aXGKowwoleCtBCz9Yth2Zx4UJmq0yLZaPQgSdjvaqsgAPTrWpvtRmhK3v9S41xP9a6YD9732i00qod3aAt6")

export default function CheckoutWrapper() {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Payments.createPaymentIntent()
            .then(basket => dispatch(setBasket(basket)))
            .catch(error => console.error(error))
            .finally(() => setLoading(false))
    }, [dispatch])

    if (loading) return <LoadingComponent message={'Loading checkout...'}/>

    return <>
        <Elements stripe={stripePromise}>
            <CheckoutPage/>
        </Elements>
    </>
};