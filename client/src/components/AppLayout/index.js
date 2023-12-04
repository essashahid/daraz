import React from "react";
import { AppShell, Group, rem } from "@mantine/core";
import ThemeSwitch from "../core/ThemeSwitch";
import { CartContext } from "../../contexts/cart";

export const AppLayout = ({ children }) => {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");

  const [cart, setCart] = React.useState([]);

  return (
    <>
      <CartContext.Provider
        value={{
          cart: cart,
          setCart: setCart,
        }}
      >
        <AppShell header={{ height: 60 }}>
          <AppShell.Header>
            <Group justify="space-between" px={20}>
              <p>
                Hello, {userName} ({userEmail})
              </p>
              <ThemeSwitch />
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
