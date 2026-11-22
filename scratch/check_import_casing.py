import os
import re

src_dir = r"c:\Users\AKASH\progaming\Stitchlyn\frontend\src"

def check_and_fix():
    # Regex to match relative imports: from './...' or from '../...' or import './...' or import '../...'
    pattern = re.compile(r"""(from\s+['"](\.[^'"]+)['"]|import\s+['"](\.[^'"]+)['"])""")
    
    fixed_count = 0
    for root, dirs, files in os.walk(src_dir):
        for f in files:
            if not f.endswith(('.jsx', '.js', '.css')):
                continue
            fpath = os.path.join(root, f)
            with open(fpath, 'r', encoding='utf-8') as fp:
                content = fp.read()
            
            new_content = content
            lines = content.splitlines(keepends=True)
            new_lines = []
            
            for line in lines:
                m = pattern.search(line)
                if m:
                    rel_path = m.group(2) or m.group(3)
                    # Resolve relative path from root
                    resolved_dir = os.path.normpath(os.path.join(root, os.path.dirname(rel_path)))
                    target_name = os.path.basename(rel_path)
                    
                    # Check matching file in resolved_dir
                    if os.path.exists(resolved_dir):
                        candidates = os.listdir(resolved_dir)
                        # Find case-insensitive match
                        matched = None
                        for c in candidates:
                            # if target_name has no extension, test with c stripped
                            c_name_no_ext, _ = os.path.splitext(c)
                            if c.lower() == target_name.lower():
                                matched = c
                                break
                            elif c_name_no_ext.lower() == target_name.lower():
                                matched = c_name_no_ext
                                break
                        
                        if matched and matched != target_name:
                            print(f"File {fpath}:")
                            print(f"  Replacing '{target_name}' with '{matched}' in line: {line.strip()}")
                            # Replace in line
                            old_rel = rel_path
                            new_rel = rel_path[:len(rel_path) - len(target_name)] + matched
                            line = line.replace(old_rel, new_rel)
                            fixed_count += 1
                new_lines.append(line)
            
            with open(fpath, 'w', encoding='utf-8') as fp:
                fp.writelines(new_lines)
                
    print(f"Completed! Total fixed imports: {fixed_count}")

if __name__ == '__main__':
    check_and_fix()
