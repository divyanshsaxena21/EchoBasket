import pyttsx3
import speech_recognition as sr
import nltk
from nltk.tokenize import word_tokenize
nltk.download('punkt', quiet=True)
from cart import Cart

def main():
	engine = pyttsx3.init()
	recognizer = sr.Recognizer()

	def speak(text):
		engine.say(text)
		engine.runAndWait()

	def listen():
		with sr.Microphone() as source:
			print("Listening...")
			audio = recognizer.listen(source)
		try:
			text = recognizer.recognize_google(audio)
			print(f"You said: {text}")
			return text
		except sr.UnknownValueError:
			print("Could not understand audio.")
			speak("Could not understand audio. Please type your response.")
			return input("Type your response: ")
		except sr.RequestError as e:
			print(f"Error with speech recognition service: {e}")
			speak("Speech recognition service error. Please type your response.")
			return input("Type your response: ")
	cart = Cart()
	while True:
		print("\nOptions: add, delete, show, search, exit")
		speak("What would you like to do? You can say add, delete, show, search, or exit.")
		choice = listen().strip().lower()
		tokens = word_tokenize(choice)
		if "add" in tokens:
			speak("Say the item name to add.")
			item_name = listen()
			speak("Say the quantity.")
			quantity = listen()
			try:
				quantity = int(quantity)
			except ValueError:
				speak("Invalid quantity. Must be a number.")
				continue
			cart.add_item(item_name, quantity)
			speak(f"Added {item_name} {quantity} to cart.")
		elif "delete" in tokens:
			speak("Say the item name to delete.")
			item_name = listen()
			speak("Say the quantity.")
			quantity = listen()
			try:
				quantity = int(quantity)
			except ValueError:
				speak("Invalid quantity. Must be a number.")
				continue
			cart.delete_item(item_name, quantity)
			speak(f"Deleted {item_name} {quantity} from cart.")
		elif "show" in tokens:
			cart.show_cart()
			speak("Showing cart.")
		elif "search" in tokens:
			speak("Say your search query.")
			query = listen()
			cart.search_item(query)
		elif "exit" in tokens:
			speak("Exiting.")
			print("Exiting...")
			break
		else:
			speak("Invalid option. Try again.")

if __name__ == "__main__":
	main()
