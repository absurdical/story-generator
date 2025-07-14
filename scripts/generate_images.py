import os
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI
import time
import requests

# 📌 Load .env and get API key
load_dotenv()
if not os.getenv("OPENAI_API_KEY"):
    raise RuntimeError("❌ OPENAI_API_KEY not found in .env file.")

client = OpenAI()

# 📁 Output directories
kid_master_dir = Path("assets/images_master/kid_mode")
adult_master_dir = Path("assets/images_master/adult_mode")
kid_master_dir.mkdir(parents=True, exist_ok=True)
adult_master_dir.mkdir(parents=True, exist_ok=True)

# 🎨 Prompt template
prompt_template = (
    "A whimsical, colorful illustration of a {subject}, "
    "in the style of a watercolor children’s storybook. "
    "Square aspect ratio, centered composition, minimal background, "
    "soft textures, cheerful colors."
)

# 📋 Lists
people_kid = [
    "Princess", "Fireman", "Police Officer", "Doctor", "Mom", "Dad", "Girl", "Boy",
    "Astronaut", "Bank Robber", "Ballerina", "Mermaid", "Farmer", "Construction Worker",
    "Pilot", "Wizard", "Alien", "Pirate", "Superhero", "Giant"
]

places_kid = [
    "Castle", "Spaceship", "Pirate Ship", "Forest", "Desert", "North Pole", "Underwater City",
    "Jungle", "Volcano", "Moon Base", "Candy Land", "Mountain Peak", "Hidden Cave", "Farm",
    "Busy City Street", "Amusement Park", "Magic School", "Haunted House", "Train Station", "Floating Island"
]

things_kid = [
    "Sword", "Fairy Wand", "Phone", "Car", "Helicopter", "Motorcycle", "Submarine", "Toaster",
    "Magic Book", "Backpack", "Time Machine", "Robot", "Giant Key", "Treasure Chest", "Bubble Blower",
    "Pizza", "Invisible Cloak", "Boomerang", "Rubber Duck", "Jetpack"
]

people_adult = [
    "Accountant", "HR Rep", "Cult Leader", "Ex-boyfriend", "Disgraced Politician", "Ghost of Steve Jobs",
    "Barista", "Failed Reality TV Star", "Private Investigator", "Evil Twin"
]

places_adult = [
    "Corporate Boardroom", "Dive Bar Bathroom", "Vegas Chapel", "Apocalypse Bunker", "IKEA Showroom",
    "Crime Scene", "Rooftop at Midnight", "HR Department", "Speakeasy", "Therapist’s Office"
]

things_adult = [
    "Flask of Whiskey", "NDA", "Divorce Papers", "Chainsaw", "Crypto Wallet", "Espresso Machine",
    "A Very Large Check", "Unread Email", "Mascot Costume", "Shovel"
]

# 🔁 Helper function
def generate_image(subject, mode):
    out_dir = kid_master_dir if mode == "kid" else adult_master_dir
    filename = out_dir / f"{subject.lower().replace(' ', '_')}.png"
    prompt = prompt_template.format(subject=subject)

    print(f"🎨 Generating: {subject} ({mode})")
    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )

        image_url = response.data[0].url

        # download the image
        img_data = requests.get(image_url).content
        with open(filename, "wb") as f:
            f.write(img_data)

        print(f"✅ Saved: {filename}")
        time.sleep(1.2)  # polite delay
    except Exception as e:
        print(f"❌ Error generating {subject}: {e}")

# 🚀 Main
def main():
    print("✨ Starting image generation…\n")

    # Kid Mode
    for subject in people_kid + places_kid + things_kid:
        generate_image(subject, mode="kid")

    # Adult Mode
    for subject in people_adult + places_adult + things_adult:
        generate_image(subject, mode="adult")

    print("\n🎉 All images generated!")

if __name__ == "__main__":
    main()
