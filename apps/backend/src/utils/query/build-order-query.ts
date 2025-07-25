import { Order } from "sequelize";

export default function buildOrderQuery(
  orderValues?: Record<string, "asc" | "desc">,
): Order | undefined {
  if (!orderValues) {
    return undefined;
  }

  const orderQuery: Order = Object.entries(orderValues).map(([key, value]) => [
    key,
    value.toUpperCase(),
  ]);

  return orderQuery;
}
