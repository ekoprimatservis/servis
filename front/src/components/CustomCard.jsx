import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { theme } from '../helper/theme'
import { useNavigate } from "react-router-dom";

export const CustomCard = ({ image, title, route }) => {
    const navigate = useNavigate()
    const onClick = () => {
        navigate(route)
    }
    return (
        <Button>
            <Card onClick={onClick} sx={{ width: '300px', margin: '1%', background: theme.primary, }}>
                <CardMedia
                    component="img"
                    height="140"
                    image={image}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary">
                    Chevrolet is an iconic American car brand known for its reliable,
                    dependable, and affordable vehicles. Founded in 1911, Chevy has
                    become one of the most recognizable car brands in the world.
                </Typography> */}
                </CardContent>
                {/* <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
            </CardActions> */}
            </Card>
        </Button>
    );
}