import os
import shutil
import re

# More specific mapping
CATEGORIES = {
    'characters': {
        'keywords': ['thanos', 'proxima', 'ebony', 'corvus', 'black-dwarf'],
        'description': 'Thanos and Black Order members'
    },
    'stones': {
        'keywords': ['power', 'time', 'mind', 'reality', 'space', 'soul'],
        'description': 'Infinity Stones'
    },
    'enemies': {
        'keywords': ['outriders'],
        'description': 'Enemy units'
    }
}

def get_category(filename):
    """Determine which category a file belongs to"""
    filename_lower = filename.lower()
    
    for category, data in CATEGORIES.items():
        for keyword in data['keywords']:
            if keyword in filename_lower:
                return category
    
    return 'misc'

def organize_assets():
    # Create all folders
    for category in CATEGORIES.keys():
        os.makedirs(f'assets/{category}', exist_ok=True)
    os.makedirs('assets/misc', exist_ok=True)
    
    # Get all image files
    image_files = [f for f in os.listdir('.') 
                   if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.gif'))]
    
    moved_count = 0
    
    for image in image_files:
        category = get_category(image)
        destination = f'assets/{category}/{image}'
        
        # Handle duplicates
        if os.path.exists(destination):
            name, ext = os.path.splitext(image)
            # Check if it has @1x, @3x notation
            if '@' in name:
                base_name = name.split('@')[0]
                suffix = name.split('@')[1]
                counter = 1
                while os.path.exists(f'assets/{category}/{base_name}@{suffix}_{counter}{ext}'):
                    counter += 1
                destination = f'assets/{category}/{base_name}@{suffix}_{counter}{ext}'
            else:
                counter = 1
                while os.path.exists(f'assets/{category}/{name}_{counter}{ext}'):
                    counter += 1
                destination = f'assets/{category}/{name}_{counter}{ext}'
        
        shutil.move(image, destination)
        print(f"📦 {image:30} → assets/{category}/")
        moved_count += 1
    
    # Create README in assets folder
    with open('assets/README.md', 'w') as f:
        f.write("# Assets Directory\n\n")
        f.write("Automatically organized Marvel Infinity War assets.\n\n")
        for category, data in CATEGORIES.items():
            f.write(f"## {category.title()}\n")
            f.write(f"{data['description']}\n\n")
    
    return moved_count

if __name__ == "__main__":
    print("🔄 Organizing Marvel assets...")
    print("-" * 50)
    
    count = organize_assets()
    
    print("-" * 50)
    print(f"✅ Done! Moved {count} files.")
    print("📁 Folder structure created:")
    print("""
    assets/
    ├── characters/   # Thanos & Black Order
    ├── stones/       # Infinity Stones
    ├── enemies/      # Outriders
    └── README.md
    """)
