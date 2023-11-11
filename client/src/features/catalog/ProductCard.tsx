import {Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography} from "@mui/material";
import {Product} from "../../app/models/product";

interface Props {
    product: Product
}

export default function ProductCard({product}: Props) {
    return <>
        <Card>
            <CardHeader
                avatar={
                    <Avatar sx={{bgcolor: 'secondary.main'}}>
                        {product.name.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={product.name}
                titleTypographyProps={{
                    sx: {
                        fontWeight: 'bold',
                        color: 'primary.main'
                    }
                }}
            >
            </CardHeader>
            <CardMedia
                sx={{
                    height: 140,
                    backgroundSize: 'contain',  // Don't crop image, fit to size
                    bgcolor: 'primary.light'
                }}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" color='secondary'>
                    €{(product.price / 100).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.brand} / {product.type}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    </>
}