import { Button, Card, Divider, Text, Title } from "@mantine/core";

export default function ProductCard({ product, addToCart }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section inheritPadding>
        <Title order={3}>{product.name}</Title>
      </Card.Section>
      <Divider />
      <Text>Rating: {product.rating}</Text>
      <Text>Price: ${product.price}</Text>
      <Text>{product.inStock ? "In Stock" : "Out of Stock"}</Text>
      <Button
        variant="primary"
        onClick={() => addToCart(product)}
        disabled={!product.inStock}
      >
        Add to Cart
      </Button>
    </Card>
  );
}
