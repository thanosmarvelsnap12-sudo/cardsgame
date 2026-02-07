# organize.py
import os
import shutil
from pathlib import Path
import json

print("🎮 INFINITY GAUNTLET ORGANIZER")
print("=" * 50)

# Configuration for GitHub Pages
IMAGE_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.webp', '.gif')

CATEGORIES = {
    'characters': {
        'keywords': ['thanos', 'proxima', 'ebony', 'corvus', 'black-dwarf'],
        'title': 'Characters',
        'description': 'Thanos and the Black Order'
    },
    'stones': {
        'keywords': ['power', 'time', 'mind', 'reality', 'space', 'soul'],
        'title': 'Infinity Stones',
        'description': 'The six Infinity Stones'
    },
    'enemies': {
        'keywords': ['outriders'],
        'title': 'Enemies',
        'description': 'Thanos\' forces'
    }
}

def create_folder_structure():
    """Create the folder structure for GitHub Pages"""
    print("📁 Creating folder structure...")
    
    # Main folders
    folders = [
        'assets/characters',
        'assets/stones',
        'assets/enemies',
        'js',
        'css'
    ]
    
    for folder in folders:
        Path(folder).mkdir(parents=True, exist_ok=True)
        print(f"  Created: {folder}/")
    
    return True

def organize_images():
    """Organize images into correct folders"""
    print("\n🔄 Organizing images...")
    
    stats = {category: 0 for category in CATEGORIES.keys()}
    stats['other'] = 0
    
    # Get all image files
    image_files = []
    for ext in IMAGE_EXTENSIONS:
        image_files.extend([f for f in os.listdir('.') if f.lower().endswith(ext)])
    
    if not image_files:
        print("  No image files found in current directory")
        return stats
    
    print(f"  Found {len(image_files)} image file(s)")
    
    for filename in image_files:
        category_found = False
        
        # Check each category
        for category, data in CATEGORIES.items():
            for keyword in data['keywords']:
                if keyword in filename.lower():
                    # Move to category folder
                    source = filename
                    destination = f'assets/{category}/{filename}'
                    
                    # Handle duplicates
                    if os.path.exists(destination):
                        name, ext = os.path.splitext(filename)
                        counter = 1
                        while os.path.exists(f'assets/{category}/{name}_{counter}{ext}'):
                            counter += 1
                        destination = f'assets/{category}/{name}_{counter}{ext}'
                    
                    shutil.move(source, destination)
                    stats[category] += 1
                    print(f"  📦 {filename:25} → assets/{category}/")
                    category_found = True
                    break
            
            if category_found:
                break
        
        # If no category found, move to other
        if not category_found:
            # Keep in root if it might be important
            print(f"  ⚠️  {filename:25} → (kept in root - not categorized)")
            stats['other'] += 1
    
    return stats

def create_asset_manifest():
    """Create a JSON manifest of all assets for the game"""
    print("\n📝 Creating asset manifest...")
    
    manifest = {
        'characters': [],
        'stones': [],
        'enemies': [],
        'last_updated': None
    }
    
    import datetime
    from pathlib import Path
    
    # Scan assets folder
    for category in ['characters', 'stones', 'enemies']:
        folder_path = Path(f'assets/{category}')
        if folder_path.exists():
            for ext in IMAGE_EXTENSIONS:
                for file in folder_path.glob(f'*{ext}'):
                    file_info = {
                        'name': file.stem,
                        'filename': file.name,
                        'path': str(file).replace('\\', '/'),
                        'size': file.stat().st_size,
                        'category': category
                    }
                    manifest[category].append(file_info)
    
    manifest['last_updated'] = datetime.datetime.now().isoformat()
    
    # Save manifest
    with open('assets/manifest.json', 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"  ✅ Manifest created: assets/manifest.json")
    print(f"     - Characters: {len(manifest['characters'])}")
    print(f"     - Stones: {len(manifest['stones'])}")
    print(f"     - Enemies: {len(manifest['enemies'])}")
    
    return manifest

def create_css_file():
    """Create basic CSS file"""
    css_content = """/* Infinity Gauntlet Game Styles */
:root {
    --stone-power: #ff4757;
    --stone-space: #3742fa;
    --stone-reality: #ffa502;
    --stone-time: #2ed573;
    --stone-mind: #5352ed;
    --stone-soul: #ff7f50;
    
    --thanos-purple: #6c5ce7;
    --thanos-gold: #ffd700;
    --thanos-dark: #0a0a0a;
}

/* Stone colors for dynamic styling */
.stone-power { color: var(--stone-power); }
.stone-space { color: var(--stone-space); }
.stone-reality { color: var(--stone-reality); }
.stone-time { color: var(--stone-time); }
.stone-mind { color: var(--stone-mind); }
.stone-soul { color: var(--stone-soul); }
"""
    
    with open('css/style.css', 'w') as f:
        f.write(css_content)
    
    print("  ✅ CSS file created: css/style.css")

def create_github_pages_config():
    """Create GitHub Pages configuration"""
    config = """# GitHub Pages Configuration
# This site is built with GitHub Pages
# Source: https://p12-sudo.github.io/cardsgame/

permalink: pretty

# Enable syntax highlighting
highlighter: rouge

# Exclude from processing
exclude:
  - organize.py
  - README.md
  - .gitignore
  - node_modules/
  - venv/
"""
    
    with open('_config.yml', 'w') as f:
        f.write(config)
    
    # Create .nojekyll file to disable Jekyll processing
    with open('.nojekyll', 'w') as f:
        f.write('')
    
    print("  ✅ GitHub Pages configuration created")

def create_readme():
    """Create README.md file"""
    readme_content = """# Infinity Gauntlet - A Love Letter Game

A Marvel-themed adaptation of the Love Letter card game featuring Thanos and the Infinity Stones.

## 🎮 Game Features

- 2-3 player card game
- Infinity Stone mechanics
- Black Order characters
- Strategic gameplay

## 📁 Project Structure
