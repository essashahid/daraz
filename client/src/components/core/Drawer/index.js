import { Button, Card, Center, Drawer, Text, Title } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { fetchOrdersKey, placeOrder, placeOrderKey } from "../../../api/orders";

export default function CartDrawer({ cart, opened, close, removeFromCart }) {
  const queryClient = useQueryClient();

  const { mutate: createOrder, isPending } = useMutation({
    mutationKey: placeOrderKey,
    mutationFn: placeOrder,
    onSuccess: (createdOrder) => {
      localStorage.setItem("cart", JSON.stringify([]));
      queryClient.setQueryData([fetchOrdersKey], (oldOrders) => {
        return [createdOrder, ...oldOrders];
      });
      close();
    },
  });

  return (
    <Drawer opened={opened} onClose={close} title="Cart">
      {cart.length === 0 ? (
        <Center>
          <Title>Cart is empty</Title>
        </Center>
      ) : (
        <>
          {cart?.length > 0 && (
            <div>
              {cart.map((item) => (
                <Card key={item._id} withBorder m={"lg"}>
                  <Card.Section inheritPadding p={"lg"}>
                    <Text>{item.name}</Text>
                    <Text>Pice: ${item.price}</Text>
                    <Text>Quantity: {item.quantity}</Text>
                    <Button
                      size="xs"
                      mt={10}
                      variant="danger"
                      onClick={() => removeFromCart(item.productID)}
                    >
                      Remove from Cart
                    </Button>
                  </Card.Section>
                </Card>
              ))}

              <Button
                m={"lg"}
                className="place-order-btn mt-3"
                variant="success"
                loading={isPending}
                onClick={() => {
                  createOrder();
                }}
              >
                Place Order
              </Button>
            </div>
          )}
        </>
      )}
    </Drawer>
  );
}
