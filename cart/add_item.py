from .item import Item

def add_item(self, item_name, quantity):
    item = Item(item_name, quantity)
    self.items.append(item)
    print(f"Added '{item_name}' (x{quantity}) to cart.")
