from pathlib import Path
from PIL import Image

# 📁 Directories
kid_master_dir = Path("assets/images_master/kid_mode")
adult_master_dir = Path("assets/images_master/adult_mode")
kid_web_dir = Path("public/images/kid_mode")
adult_web_dir = Path("public/images/adult_mode")

# Create output folders if they don’t exist
kid_web_dir.mkdir(parents=True, exist_ok=True)
adult_web_dir.mkdir(parents=True, exist_ok=True)

# 📐 Target size
TARGET_SIZE = (128, 128)

def resize_and_save(input_path, output_path):
    try:
        with Image.open(input_path) as img:
            img = img.resize(TARGET_SIZE, Image.LANCZOS)
            img.save(output_path, format="PNG", optimize=True)
        print(f"✅ Resized & saved: {output_path}")
    except Exception as e:
        print(f"❌ Error processing {input_path}: {e}")

def process_folder(input_dir, output_dir):
    for file in input_dir.glob("*.png"):
        output_path = output_dir / file.name
        resize_and_save(file, output_path)

def main():
    print("✨ Starting image resizing…\n")
    print(f"Target size: {TARGET_SIZE[0]}×{TARGET_SIZE[1]}")

    print("\n📂 Kid Mode:")
    process_folder(kid_master_dir, kid_web_dir)

    print("\n📂 Adult Mode:")
    process_folder(adult_master_dir, adult_web_dir)

    print("\n🎉 All images resized & saved!")

if __name__ == "__main__":
    main()
