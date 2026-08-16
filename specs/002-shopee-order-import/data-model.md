# Data Model: Shopee Order Import

This design refines, but does not override, `docs/data-model/`.

- `orders`: add final selling price, actual revenue and mapping version.
- `order_monetary_components`: one component per order/import batch with component code, amount, source column, source scope, aggregation method and revenue-inclusion flag.
- Original price and seller subsidy aggregate across lines; fixed, service and processing fees occur once per order; transport fees are non-revenue statistics.
