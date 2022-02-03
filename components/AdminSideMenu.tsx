import useStyles from "@/utils/style";
import {
  List,
  ListItem,
  Card,
  ListItemText,
} from "@mui/material";
import NextLink from 'next/link';
export default function AdminSideMenu() {
  const classes = useStyles();
  return (
    <Card className={classes.section}>
      <List>
        <NextLink href="/admin/dashboard" passHref>
          <ListItem button component="a">
            <ListItemText primary="Admin Dashboard"></ListItemText>
          </ListItem>
        </NextLink>
        <NextLink href="/admin/orders" passHref>
          <ListItem selected button component="a">
            <ListItemText primary="Orders"></ListItemText>
          </ListItem>
        </NextLink>
        <NextLink href="/admin/products" passHref>
          <ListItem button component="a">
            <ListItemText primary="Products"></ListItemText>
          </ListItem>
        </NextLink>
        <NextLink href="/admin/users" passHref>
          <ListItem button component="a">
            <ListItemText primary="Users"></ListItemText>
          </ListItem>
        </NextLink>
      </List>
    </Card>
  );
}
