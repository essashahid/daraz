import { Rating, Group, Stack } from "@mantine/core";

export default function FeedbackRating({ value, onChange }) {
  return (
    <>
      <Stack>
        <Group>
          <Rating value={value} onChange={onChange} />
        </Group>
      </Stack>
    </>
  );
}
