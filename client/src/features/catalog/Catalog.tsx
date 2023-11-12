import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {Product} from "../../app/models/product"
import ProductList from "./ProductList";
import {useEffect, useState} from "react";

export default function Catalog() {
    var [products, setProducts] =
        useState<Product[]>([]);
    var [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Catalog.list()
            .then(products => setProducts(products))
            .catch(error => console.error(`Error fetching list of products: ${error}`))
            .finally(()=>setLoading(false))
    }, [])
    
    if (loading) return <LoadingComponent message={'Loading products...'}/>

    return <>
        <ProductList products={products}/>
    </>
}