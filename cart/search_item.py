def search_item(self, query):
    results = [item for item in self.items if query.lower() in item.name.lower()]
    if results:
        print(f"Search results for '{query}':")
        for idx, item in enumerate(results, 1):
            print(f"{idx}. {item}")
    else:
        print(f"No items found matching '{query}'.")
