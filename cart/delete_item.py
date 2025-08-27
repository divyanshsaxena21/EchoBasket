def delete_item(self, item_name, quantity):
    for item in self.items:
        if item.name == item_name and item.quantity == quantity:
            self.items.remove(item)
            print(f"Deleted '{item_name}' (x{quantity}) from cart.")
            return
    print(f"Item '{item_name}' (x{quantity}) not found in cart.")
