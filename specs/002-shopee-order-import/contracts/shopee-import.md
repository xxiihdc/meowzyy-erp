# Shopee Import Contract

Input is one `.xlsx` export containing the `orders` sheet. Required fields include order code, product name, quantity, original price, total seller subsidy, fixed fee, service fee and processing fee.

Output reports total rows, created orders, updated orders, rejected rows and a reason for every rejected source row. Buyer, recipient, phone and address fields are ignored.
