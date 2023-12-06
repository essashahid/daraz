import React from "react";
import { AppShell, Group, ActionIcon, useMantineTheme, rem } from "@mantine/core";
import { Home } from 'tabler-icons-react'; // Example icon, replace with your Daraz icon
// path to desktop
import { useNavigate } from 'react-router-dom';

import ThemeSwitch from "../core/ThemeSwitch";
import { CartContext } from "../../contexts/cart";

export const AppLayout = ({ children }) => {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();
  const theme = useMantineTheme();

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
              <div>
                <ThemeSwitch />
                <ActionIcon 
                  variant="outline" 
                  color={theme.primaryColor} 
                  onClick={() => navigate('/')}
                  size="lg"
                  style={{ marginLeft: '10px' }} // Adjust margin as needed
                >
                  <Home size={20} /> 
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