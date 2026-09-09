import os
import fitz

os.makedirs('assets/logo', exist_ok=True)

doc = fitz.open(r'C:\Users\favaz\Downloads\Telegram Desktop\TFG Logo.pdf')
page = doc[0]
drawings = page.get_drawings()
top_drawings = [d for d in drawings if d['rect'].y1 < 500]

def export_custom_svg(is_dark=True, badge_only=False, outfile=''):
    if badge_only:
        selected = [d for d in top_drawings if d['rect'].y1 < 310]
    else:
        selected = top_drawings

    min_x = min(d['rect'].x0 for d in selected)
    min_y = min(d['rect'].y0 for d in selected)
    max_x = max(d['rect'].x1 for d in selected)
    max_y = max(d['rect'].y1 for d in selected)
    
    pad = 6
    vx = min_x - pad
    vy = min_y - pad
    vw = (max_x - min_x) + pad * 2
    vh = (max_y - min_y) + pad * 2
    
    svg_parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vx:.2f} {vy:.2f} {vw:.2f} {vh:.2f}" width="{vw:.2f}" height="{vh:.2f}">'
    ]
    
    for d in selected:
        fill = d.get('fill')
        if fill is None:
            continue
        # Check if red
        if fill[0] > 0.5:
            color_hex = '#E31E24'
        else:
            color_hex = '#F7F7F5' if is_dark else '#111111'
            
        # Build path data
        path_data = []
        for item in d['items']:
            cmd = item[0]
            if cmd == 'l':
                path_data.append(f'M {item[1].x:.2f} {item[1].y:.2f} L {item[2].x:.2f} {item[2].y:.2f}')
            elif cmd == 'c':
                path_data.append(f'M {item[1].x:.2f} {item[1].y:.2f} C {item[2].x:.2f} {item[2].y:.2f} {item[3].x:.2f} {item[3].y:.2f} {item[4].x:.2f} {item[4].y:.2f}')
            elif cmd == 're':
                r = item[1]
                path_data.append(f'M {r.x0:.2f} {r.y0:.2f} H {r.x1:.2f} V {r.y1:.2f} H {r.x0:.2f} Z')
            elif cmd == 'qu':
                q = item[1]
                path_data.append(f'M {q.ul.x:.2f} {q.ul.y:.2f} L {q.ur.x:.2f} {q.ur.y:.2f} L {q.lr.x:.2f} {q.lr.y:.2f} L {q.ll.x:.2f} {q.ll.y:.2f} Z')
        
        d_str = ' '.join(path_data)
        if d_str:
            svg_parts.append(f'  <path d="{d_str}" fill="{color_hex}" fill-rule="evenodd"/>')
            
    svg_parts.append('</svg>')
    
    with open(outfile, 'w', encoding='utf-8') as f:
        f.write('\n'.join(svg_parts))
    print(f'Wrote {outfile}')

if __name__ == '__main__':
    export_custom_svg(is_dark=True, badge_only=False, outfile='assets/logo/tfg-logo-white.svg')
    export_custom_svg(is_dark=False, badge_only=False, outfile='assets/logo/tfg-logo-dark.svg')
    export_custom_svg(is_dark=True, badge_only=True, outfile='assets/logo/tfg-badge-white.svg')
    export_custom_svg(is_dark=False, badge_only=True, outfile='assets/logo/tfg-badge-dark.svg')
