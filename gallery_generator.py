# gallery_generator.py
import os
from pathlib import Path
import datetime

# Configuration
IMAGE_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.webp', '.gif')

CATEGORIES = {
    'characters': {
        'title': 'Characters',
        'description': 'Thanos and members of the Black Order'
    },
    'stones': {
        'title': 'Infinity Stones', 
        'description': 'The six Infinity Stones in different resolutions'
    },
    'enemies': {
        'title': 'Enemies',
        'description': 'Thanos\' alien forces'
    }
}

HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Marvel Infinity War Assets</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
            color: #f0f0f0;
            line-height: 1.6;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 30px;
        }
        
        header {
            text-align: center;
            padding: 50px 0;
            margin-bottom: 40px;
            background: rgba(20, 20, 35, 0.9);
            border-radius: 20px;
            border: 2px solid #f0131e;
            box-shadow: 0 10px 30px rgba(240, 19, 30, 0.2);
        }
        
        h1 {
            font-size: 3.5em;
            background: linear-gradient(90deg, #f0131e, #ffd700, #00b5e2);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 20px;
            text-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        }
        
        .subtitle {
            color: #aaa;
            font-size: 1.3em;
            max-width: 800px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .stats-bar {
            background: rgba(30, 30, 46, 0.8);
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 20px;
            border: 1px solid #333;
        }
        
        .stat-item {
            text-align: center;
            padding: 15px;
            min-width: 150px;
        }
        
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            color: #ffd700;
            display: block;
        }
        
        .stat-label {
            color: #bbb;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .category {
            margin-bottom: 70px;
            background: rgba(25, 25, 40, 0.9);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
            border: 1px solid #333;
            transition: transform 0.3s ease;
        }
        
        .category:hover {
            transform: translateY(-5px);
            border-color: #444;
        }
        
        .category-header {
            display: flex;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #333;
        }
        
        .category-title {
            font-size: 2.2em;
            color: #ffd700;
            flex-grow: 1;
        }
        
        .category-count {
            background: #f0131e;
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 1.2em;
        }
        
        .category-description {
            color: #ccc;
            font-size: 1.1em;
            margin-bottom: 30px;
            line-height: 1.8;
        }
        
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 25px;
        }
        
        .gallery-item {
            background: rgba(40, 40, 60, 0.95);
            border-radius: 15px;
            overflow: hidden;
            transition: all 0.3s ease;
            border: 1px solid #444;
            position: relative;
        }
        
        .gallery-item:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 20px 40px rgba(240, 19, 30, 0.3);
            border-color: #f0131e;
            z-index: 10;
        }
        
        .gallery-img-container {
            width: 100%;
            height: 220px;
            overflow: hidden;
            position: relative;
        }
        
        .gallery-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
        
        .gallery-item:hover .gallery-img {
            transform: scale(1.1);
        }
        
        .gallery-info {
            padding: 20px;
        }
        
        .gallery-name {
            font-weight: bold;
            color: #fff;
            font-size: 1.2em;
            margin-bottom: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .gallery-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
        }
        
        .gallery-size {
            color: #888;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        
        .resolution-badge {
            background: linear-gradient(45deg, #00b5e2, #0088cc);
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: bold;
            letter-spacing: 1px;
        }
        
        footer {
            text-align: center;
            padding: 40px;
            color: #888;
            margin-top: 60px;
            border-top: 1px solid #333;
            font-size: 0.9em;
        }
        
        .update-time {
            color: #00b5e2;
            font-weight: bold;
        }
        
        @media (max-width: 768px) {
            .gallery {
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            }
            
            h1 {
                font-size: 2.2em;
            }
            
            .stats-bar {
                flex-direction: column;
                align-items: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Infinity War Asset Gallery</h1>
            <p class="subtitle">Organized collection of Marvel assets • {total_images} images across {category_count} categories</p>
        </header>
        
        <div class="stats-bar">
            {stats_html}
        </div>
        
        {categories_html}
        
        <footer>
            <p>🎬 Generated automatically • <span class="update-time">{timestamp}</span></p>
            <p>Marvel Infinity War fan project • All assets are property of Marvel Studios</p>
        </footer>
    </div>
    
    <script>
        // Add simple interactivity
        document.addEventListener('DOMContentLoaded', function() {
            // Add click to view larger image
            const images = document.querySelectorAll('.gallery-img');
            images.forEach(img => {
                img.addEventListener('click', function() {
                    const src = this.src;
                    const overlay = document.createElement('div');
                    overlay.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.9);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                        cursor: pointer;
                    `;
                    
                    const largeImg = document.createElement('img');
                    largeImg.src = src;
                    largeImg.style.cssText = `
                        max-width: 90%;
                        max-height: 90%;
                        object-fit: contain;
                        border: 3px solid #f0131e;
                        border-radius: 10px;
                    `;
                    
                    overlay.appendChild(largeImg);
                    document.body.appendChild(overlay);
                    
                    overlay.addEventListener('click', () => {
                        document.body.removeChild(overlay);
                    });
                });
            });
            
            // Update year in footer
            document.getElementById('current-year').textContent = new Date().getFullYear();
        });
    </script>
</body>
</html>'''

def get_image_info(filepath):
    """Get information about an image file"""
    name = os.path.basename(filepath)
    size = os.path.getsize(filepath)
    
    # Format size
    if size < 1024:
        size_str = f"{size} B"
    elif size < 1024 * 1024:
        size_str = f"{size/1024:.1f} KB"
    else:
        size_str = f"{size/(1024*1024):.1f} MB"
    
    # Get resolution info
    resolution = ""
    if '@' in name:
        res = name.split('@')[1].split('.')[0]
        resolution = res
    
    # Format display name
    display_name = name.replace('-', ' ').replace('_', ' ').replace('@', ' ').replace('.png', '').replace('.jpg', '').title()
    
    return {
        'name': name,
        'path': filepath.replace('\\', '/'),  # Fix path for web
        'size': size_str,
        'resolution': resolution,
        'display_name': display_name
    }

def generate_html_gallery():
    """Generate an HTML file displaying all images"""
    print("🎨 Generating HTML gallery...")
    
    categories_html = ""
    stats_html = ""
    total_images = 0
    
    for category_name, category_data in CATEGORIES.items():
        category_path = f'assets/{category_name}'
        
        if not os.path.exists(category_path):
            continue
        
        # Get all images in this category
        images = []
        for ext in IMAGE_EXTENSIONS:
            images.extend(list(Path(category_path).glob(f'*{ext}')))
            images.extend(list(Path(category_path).glob(f'*{ext.upper()}')))
        
        if not images:
            continue
        
        # Sort images by name
        images.sort()
        
        # Update total
        total_images += len(images)
        
        # Generate gallery items for this category
        gallery_items = ""
        for img_path in images:
            info = get_image_info(str(img_path))
            
            resolution_badge = ""
            if info['resolution']:
                resolution_badge = f'<div class="resolution-badge">{info["resolution"]}</div>'
            
            gallery_items += f'''
            <div class="gallery-item">
                <div class="gallery-img-container">
                    <img src="{info['path']}" alt="{info['display_name']}" class="gallery-img" title="Click to enlarge">
                </div>
                <div class="gallery-info">
                    <div class="gallery-name" title="{info['display_name']}">{info['display_name']}</div>
                    <div class="gallery-meta">
                        <div class="gallery-size">{info['size']}</div>
                        {resolution_badge}
                    </div>
                </div>
            </div>
            '''
        
        # Add category section
        categories_html += f'''
        <section class="category">
            <div class="category-header">
                <h2 class="category-title">{category_data['title']}</h2>
                <div class="category-count">{len(images)} images</div>
            </div>
            <p class="category-description">{category_data['description']}</p>
            <div class="gallery">
                {gallery_items}
            </div>
        </section>
        '''
        
        # Add to stats
        stats_html += f'''
        <div class="stat-item">
            <span class="stat-number">{len(images)}</span>
            <span class="stat-label">{category_data['title']}</span>
        </div>
        '''
    
    # Add total to stats
    stats_html = f'''
    <div class="stat-item">
        <span class="stat-number">{total_images}</span>
        <span class="stat-label">Total Images</span>
    </div>
    ''' + stats_html
    
    # Generate final HTML
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d at %H:%M:%S")
    
    html_content = HTML_TEMPLATE.format(
        total_images=total_images,
        category_count=len([c for c in CATEGORIES if os.path.exists(f'assets/{c}')]),
        stats_html=stats_html,
        categories_html=categories_html,
        timestamp=timestamp
    )
    
    # Write HTML file
    with open('gallery.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"✅ HTML gallery generated: gallery.html ({total_images} images)")
    print("👉 Open gallery.html in your browser to view!")

def main():
    print("=" * 50)
    print("🎨 MARVEL GALLERY GENERATOR")
    print("=" * 50)
    
    # Check if assets folder exists
    if not os.path.exists('assets'):
        print("❌ Error: 'assets' folder not found!")
        print("👉 Please run organizer.py first to organize your images")
        return
    
    generate_html_gallery()

if __name__ == "__main__":
    main()
