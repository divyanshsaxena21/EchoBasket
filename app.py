from cart import Cart

def main():
	cart = Cart()
	while True:
		print("\nOptions: add, delete, show, search, exit")
		choice = input("Enter option: ").strip().lower()
		if choice == "add":
			item_name = input("Enter item name to add: ")
			quantity = input("Enter quantity: ")
			try:
				quantity = int(quantity)
			except ValueError:
				print("Invalid quantity. Must be a number.")
				continue
			cart.add_item(item_name, quantity)
		elif choice == "delete":
			item_name = input("Enter item name to delete: ")
			quantity = input("Enter quantity: ")
			try:
				quantity = int(quantity)
			except ValueError:
				print("Invalid quantity. Must be a number.")
				continue
			cart.delete_item(item_name, quantity)
		elif choice == "show":
			cart.show_cart()
		elif choice == "search":
			query = input("Enter search query: ")
			cart.search_item(query)
		elif choice == "exit":
			print("Exiting...")
			break
		else:
			print("Invalid option. Try again.")

if __name__ == "__main__":
	main()
