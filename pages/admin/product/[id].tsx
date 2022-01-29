import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import {
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  TextField,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { getError } from "@/utils/error";
import Layout from "@/components/Layout";
import useStyles from "@/utils/style";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useCart } from "@/components/cart/hooks/useCart";
import AdminSideMenu from "@/components/AdminSideMenu";

function ProductEdit({ params }) {
  const productId = params.id;
  const { cartState, cartDispatch } = useCart();
  const router = useRouter();
  const { loading, error, loadingUpdate, loadingUpload, product, userInfo } =
    cartState;
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();
  const [isFeatured, setIsFeatured] = useState(false);
  useEffect(() => {
    if (!userInfo) {
      return router.push("/login");
    } else {
      const fetchData = async () => {
        try {
          cartDispatch({ type: "PRODUCT_FETCH_REQUEST", payload: null });
          const { data } = await axios.get(`/api/admin/products/${productId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          cartDispatch({ type: "PRODUCT_FETCH_SUCCESS", payload: data });

          if (product) {
            setValue("name", data.name);
            setIsFeatured(product.isFeatured);

            setValue("slug", product.slug);
            setValue("price", product.price);
            setValue("imageUrl", product.imageUrl);
            setValue("countInStock", product.countInStock);
            setValue("description", product.description);
          }
        } catch (err) {
          cartDispatch({ type: "PRODUCT_FETCH_FAIL", payload: getError(err) });
        }
      };
      if (productId > 0) fetchData();
    }
  }, [productId]);

  const uploadHandler = async (e, imageField = "image") => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      cartDispatch({ type: "PRODUCT_UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/admin/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      cartDispatch({ type: "PRODUCT_IMAGE_UPLOAD_SUCCESS", payload: null });
      setValue(imageField, data.secure_url);
      enqueueSnackbar("File uploaded successfully", { variant: "success" });
    } catch (err) {
      cartDispatch({
        type: "PRODUCT_IMAGE_UPLOAD_FAIL",
        payload: getError(err),
      });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    featuredImage,
    brand,
    countInStock,
    description,
  }: {
    name: string;
    slug: string;
    price: number;
    category: string;
    image: string;
    featuredImage: string;
    brand: string;
    countInStock: string;
    description: string;
  }) => {
    const data = {
      name,
      slug,
      price,
      category,
      image,
      isFeatured,
      featuredImage,
      brand,
      countInStock,
      description,
    };
    closeSnackbar();
    console.log("Product form submitted");
    try {
      cartDispatch({ type: "PRODUCT_UPDATE_REQUEST" });
      if (productId > 0) {
        await axios.put(`/api/admin/products/${productId}`, data, {
          headers: { authorization: `Bearer ${userInfo?.token}` },
        });
      } else {
        console.log();
        await axios.post("/api/admin/products", data, {
          headers: { authorization: `Bearer ${userInfo?.token}` },
        });
      }

      cartDispatch({ type: "PRODUCT_UPDATE_SUCCESS" });
      if (productId > 0) {
        enqueueSnackbar("Product updated successfully", { variant: "success" });
      } else {
        enqueueSnackbar("Product created successfully", { variant: "success" });
      }
      router.push("/admin/products");
    } catch (err) {
      cartDispatch({ type: "PRODUCT_UPDATE_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <Layout
      title={productId > 0 ? `Edit Product ${productId}` : "Create Product"}
    >
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <AdminSideMenu></AdminSideMenu>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h5" variant="h5">
                  {productId > 0
                    ? `Edit Product ${productId}`
                    : "Create Product"}
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress></CircularProgress>}
                {error && (
                  <Typography className={classes.error}>{error}</Typography>
                )}
              </ListItem>
              <ListItem>
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  className={classes.form}
                >
                  <List>
                    <ListItem>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Name"
                            error={Boolean(errors.name)}
                            helperText={errors.name ? "Name is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="slug"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="slug"
                            label="Slug"
                            error={Boolean(errors.slug)}
                            helperText={errors.slug ? "Slug is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="price"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="price"
                            label="Price"
                            error={Boolean(errors.price)}
                            helperText={errors.price ? "Price is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="imageUrl"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="imageUrl"
                            label="Image"
                            error={Boolean(errors.image)}
                            helperText={errors.image ? "Image is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Button variant="contained" component="label">
                        Upload File
                        <input type="file" onChange={uploadHandler} hidden />
                      </Button>
                      {loadingUpload && <CircularProgress />}
                    </ListItem>
                    <ListItem>
                      <FormControlLabel
                        label="Is Featured"
                        control={
                          <Checkbox
                            onClick={(e) => setIsFeatured(e.target.checked)}
                            checked={isFeatured}
                            name="isFeatured"
                          />
                        }
                      ></FormControlLabel>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="featuredImage"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="featuredImage"
                            label="Featured Image"
                            error={Boolean(errors.image)}
                            helperText={
                              errors.image ? "Featured Image is required" : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Button variant="contained" component="label">
                        Upload File
                        <input
                          type="file"
                          onChange={(e) => uploadHandler(e, "featuredImage")}
                          hidden
                        />
                      </Button>
                      {loadingUpload && <CircularProgress />}
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="category"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="category"
                            label="Category"
                            error={Boolean(errors.category)}
                            helperText={
                              errors.category ? "Category is required" : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="countInStock"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="countInStock"
                            label="Count in stock"
                            error={Boolean(errors.countInStock)}
                            helperText={
                              errors.countInStock
                                ? "Count in stock is required"
                                : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="description"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            id="description"
                            label="Description"
                            error={Boolean(errors.description)}
                            helperText={
                              errors.description
                                ? "Description is required"
                                : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        color="primary"
                      >
                        {productId > 0 ? "Update" : "Create"}
                      </Button>
                      {loadingUpdate && <CircularProgress />}
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
