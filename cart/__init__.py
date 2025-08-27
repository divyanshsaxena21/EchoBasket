from .add_item import add_item
from .delete_item import delete_item
from .show_cart import show_cart
from .search_item import search_item
from .item import Item

class Cart:
    def __init__(self):
        self.items = []

    add_item = add_item
    delete_item = delete_item
    show_cart = show_cart
    search_item = search_item
