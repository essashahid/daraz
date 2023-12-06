import React from "react";
import {
  AppShell,
  Group,
  ActionIcon,
  useMantineTheme,
  rem,
  Burger,
} from "@mantine/core";

import { useNavigate } from "react-router-dom";

import ThemeSwitch from "../core/ThemeSwitch";
import { CartContext } from "../../contexts/cart";
import { IconHome } from "@tabler/icons-react";
import CartDrawer from "../core/Drawer";
import { useDisclosure } from "@mantine/hooks";

export const AppLayout = ({ children }) => {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const [cart, setCartState] = React.useState(() => {
    const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart")) || [];
    return cartFromLocalStorage;
  });

  React.useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function setCart(updatedCart) {
    setCartState(updatedCart);
  }

  const [opened, { open, close }] = useDisclosure(false);

  const addToCart = (product) => {
    open();

    const existingProduct = cart.find((item) => item.productID === product._id);
    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.productID === product._id
          ? {
              ...item,
              quantity: item.quantity + 1,
              price: item.price + product.price,
            }
          : item
      );
      setCart(updatedCart);
    } else {
      const newCart = [
        ...cart,
        {
          productID: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
      setCart(newCart);
    }
  };

  const removeFromCart = (productID) => {
    const updatedCart = cart.filter((item) => item.productID !== productID);
    setCart(updatedCart);
  };

  return (
    <>
      <CartContext.Provider
        value={{
          cart,
          setCart,
          addToCart,
        }}
      >
        <CartDrawer
          cart={cart}
          opened={opened}
          close={close}
          removeFromCart={removeFromCart}
        />

        <AppShell header={{ height: 60 }}>
          <AppShell.Header>
            <Group justify="space-between" px={20}>
              <>
                <Burger opened={opened} onClick={open} />

                <p>
                  Hello, {userName} ({userEmail})
                </p>
              </>
              <div>
                <ThemeSwitch />
                <ActionIcon
                  variant="outline"
                  color={theme.primaryColor}
                  onClick={() => navigate("/")}
                  size="lg"
                  style={{ marginLeft: "10px" }} // Adjust margin as needed
                >
                  <IconHome size={20} />
                </ActionIcon>
              </div>
            </Group>
          </AppShell.Header>
          <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>
            {children}
          </AppShell.Main>
        </AppShell>
      </CartContext.Provider>
    </>
  );
};

export default AppLayout;
