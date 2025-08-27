def show_cart(self):
    if not self.items:
        print("Cart is empty.")
    else:
        print("Items in cart:")
        for idx, item in enumerate(self.items, 1):
            print(f"{idx}. {item}")
