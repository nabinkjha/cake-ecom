import React, { useEffect, useState } from "react";
import {
  Grid,
  Link,
  List,
  ListItem,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useCart } from "./cart/hooks/useCart";
import { Rating } from "@material-ui/lab";
import { useSnackbar } from "notistack";
import useStyles from "@/utils/style";
import { getError } from "@/utils/error";
import { Review } from "@prisma/client";

function ProductReview() {
  const { cartState,cartDispatch } = useCart();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const {product, userInfo } = cartState;
  const existReview = product.reviews.find( (item) => item.reviewerId === userInfo?.id )||{};

  const [reviews, setReviews] = useState(product.reviews);
  const [rating, setRating] = useState(existReview.rating);
  const [content, setContent] = useState(existReview.content);
  const [name, setName] = useState(existReview.name);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
     const {data} = await axios.post(
        `/api/products/${product.id}/reviews`,
        {
            name,
            rating,
            content,
          },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      setLoading(false);
      setReviews(data.product.reviews);
      enqueueSnackbar("Review submitted successfully", { variant: "success" });
      cartDispatch({ type: 'PRODUCT_REVIEW_UPDATED', payload: data });
    } catch (err) {
        setLoading(false);
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  useEffect(() => {
    
  }, []);

  return (
    <List>
      <ListItem>
        <Typography name="reviews" id="reviews" variant="h2">
          Customer Reviews
        </Typography>
      </ListItem>
      {reviews === undefined && <ListItem>No review</ListItem>}
      {reviews.length > 0 &&
        reviews.map((review: Review) => (
          <ListItem key={review.id}>
            <Grid container>
              <Grid item className={classes.reviewItem}>
                <Typography>
                  <strong>{review.name}</strong>
                </Typography>
                <Typography>{review.createdAt.substring(0, 10)}</Typography>
              </Grid>
              <Grid item>
                <Rating value={review.rating} readOnly></Rating>
                <Typography>{review.content}</Typography>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      <ListItem>
        {userInfo ? (
          <form onSubmit={submitHandler} className={classes.reviewForm}>
            <List>
              <ListItem>
                <Typography variant="h2">Leave your review</Typography>
              </ListItem>
              <ListItem>
                <TextField
                  variant="outlined"
                  fullWidth
                  name="name"
                  label="Add a headline"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </ListItem>
              <ListItem>
                <TextField
                  multiline
                  variant="outlined"
                  fullWidth
                  name="content"
                  label="Write your review"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </ListItem>
              <ListItem>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
              </ListItem>
              <ListItem>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>

                {loading && <CircularProgress></CircularProgress>}
              </ListItem>
            </List>
          </form>
        ) : (
          <Typography variant="h2">
            Please{" "}
            <Link href={`/login?redirect=/product/${product.slug}`}>login</Link>{" "}
            to write a review
          </Typography>
        )}
      </ListItem>
    </List>
  );
}

export default ProductReview;
