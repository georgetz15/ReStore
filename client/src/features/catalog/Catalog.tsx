import LoadingComponent from "../../app/layout/LoadingComponent";
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore";
import ProductList from "./ProductList";
import {useEffect} from "react";
import {fetchFiltersAsync, fetchProductsAsync, productSelectors, setPageNumber, setProductParams} from "./catalogSlice";
import {
    Grid,
    Paper,
} from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import PaginationComponent from "../../app/components/PaginationComponent";

const sortOptions = [
    {value: 'name', label: 'Alphabetical'},
    {value: 'priceDesc', label: 'Price - High to Low'},
    {value: 'price', label: 'Price - Low to High'},
]

export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll);
    const {
        productsLoaded,
        filtersLoaded,
        brands,
        types,
        productParams,
        metaData,
    } = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!productsLoaded) dispatch(fetchProductsAsync());
    }, [productsLoaded, dispatch])

    useEffect(() => {
        if (!filtersLoaded) dispatch(fetchFiltersAsync());
    }, [filtersLoaded, dispatch])

    if (!filtersLoaded || !metaData) return <LoadingComponent message={'Loading products...'}/>

    return <>
        <Grid container columnSpacing={4}>
            <Grid item xs={3}>
                <Paper sx={{mb: 2}}>
                    <ProductSearch/>
                </Paper>
                <Paper sx={{mb: 2, p: 2}}>
                    <RadioButtonGroup
                        selectedValue={productParams.orderBy}
                        options={sortOptions}
                        onChangeEvent={(e: any) => dispatch(setProductParams({orderBy: e.target.value}))}
                    />
                </Paper>
                <Paper sx={{mb: 2, p: 2}}>
                    <CheckboxButtons
                        items={brands}
                        checked={productParams.brands ?? []}
                        onChange={(items: string[]) => dispatch(setProductParams({brands: items}))}/>
                </Paper>
                <Paper sx={{mb: 2, p: 2}}>
                    <CheckboxButtons
                        items={types}
                        checked={productParams.types ?? []}
                        onChange={(items: string[]) => dispatch(setProductParams({types: items}))}/>
                </Paper>
            </Grid>
            <Grid item xs={9}>
                <ProductList products={products}/>
            </Grid>

            <Grid item xs={3}/>
            <Grid item xs={9} sx={{mb: 2}}>
                {metaData &&
                    <PaginationComponent
                        metaData={metaData}
                        onPageChange={(page) => dispatch(setPageNumber({pageNumber: page}))}
                    />}
            </Grid>
        </Grid>
    </>;
}