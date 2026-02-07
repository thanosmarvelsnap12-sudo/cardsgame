# organizer.py
import os
import shutil
from pathlib import Path

# Configuration
IMAGE_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.webp', '.gif')

CATEGORIES = {
    'characters': {
        'keywords': ['thanos', 'proxima', 'ebony-maw', 'corvus', 'black-dwarf'],
        'title': 'Characters',
        'description': 'Thanos and members of the Black Order'
    },
    'stones': {
        'keywords': ['power', 'time', 'mind', 'reality', 'space', 'soul'],
        'title': 'Infinity Stones',
        'description': 'The six Infinity Stones in different resolutions'
    },
    'enemies': {
        'keywords': ['outriders'],
        'title': 'Enemies',
        'description': 'Thanos\' alien forces'
    }
}

def create_folders():
    """Create the folder structure"""
    for category in CATEGORIES.keys():
        Path(f'assets/{category}').mkdir(parents=True, exist_ok=True)
    Path('assets/misc').mkdir(parents=True, exist_ok=True)
    print("📁 Created folder structure")
    return True

def categorize_file(filename):
    """Determine which category a file belongs to"""
    filename_lower = filename.lower()
    
    for category, data in CATEGORIES.items():
        for keyword in data['keywords']:
            if keyword in filename_lower:
                return category
    
    return 'misc'

def organize_images():
    """Move images to appropriate folders"""
    print("🔄 Organizing images...")
    print("-" * 50)
    
    stats = {category: 0 for category in CATEGORIES.keys()}
    stats['misc'] = 0
    
    # Get all image files in current directory
    image_files = [f for f in os.listdir('.') 
                   if f.lower().endswith(IMAGE_EXTENSIONS)]
    
    for image in image_files:
        category = categorize_file(image)
        source = image
        destination = f'assets/{category}/{image}'
        
        # Handle duplicates
        if os.path.exists(destination):
            name, ext = os.path.splitext(image)
            counter = 1
            while os.path.exists(f'assets/{category}/{name}_{counter}{ext}'):
                counter += 1
            destination = f'assets/{category}/{name}_{counter}{ext}'
        
        # Move the file
        shutil.move(source, destination)
        stats[category] += 1
        
        # Get resolution info
        resolution = ""
        if '@' in image:
            res = image.split('@')[1].split('.')[0]
            resolution = f"@{res}"
        
        print(f"📦 {image:30} → assets/{category}/{resolution}")
    
    print("-" * 50)
    return stats

def main():
    print("=" * 50)
    print("📁 MARVEL ASSET ORGANIZER")
    print("=" * 50)
    
    create_folders()
    stats = organize_images()
    
    # Summary
    print("\n📊 SUMMARY:")
    for category, count in stats.items():
        if count > 0:
            print(f"   {category.title():15}: {count} images")
    
    print(f"\n✅ Total images organized: {sum(stats.values())}")
    print(f"📂 Files moved to 'assets/' folder")
    
    return stats

if __name__ == "__main__":
    main()
