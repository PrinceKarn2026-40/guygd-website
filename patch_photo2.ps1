[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$file = 'client\src\pages\dashboard\admin.html'
$text = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

$old = '          <div style="flex:1;">
            <div style="font-size:1rem;font-weight:800;margin-bottom:4px;">${c.memberName}</div>
            ${c.showRole ? `<div style="font-size:0.72rem;background:${c.accent};color:#000;display:inline-block;padding:2px 10px;border-radius:20px;font-weight:700;margin-bottom:8px;">${c.memberRole}</div>` : ''}
            ${c.showId     ? `<div style="font-size:0.7rem;opacity:0.75;">ID: <strong>${c.memberId}</strong></div>` : ''}
            ${c.showExpiry ? `<div style="font-size:0.7rem;opacity:0.75;">Expires: <strong>${expiry.toLocaleDateString()}</strong></div>` : ''}
          </div>'

$new = '          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
              ${c.showPhoto ? (c.memberPhoto ? `<img src="${c.memberPhoto}" style="width:44px;height:44px;border-radius:8px;object-fit:cover;border:2px solid ${c.accent};flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.35);"/>` : `<div style="width:44px;height:44px;border-radius:8px;background:rgba(255,255,255,0.15);border:2px solid ${c.accent};display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">&#128100;</div>`) : ''}
              <div style="font-size:1rem;font-weight:800;">${c.memberName}</div>
            </div>
            ${c.showRole ? `<div style="font-size:0.72rem;background:${c.accent};color:#000;display:inline-block;padding:2px 10px;border-radius:20px;font-weight:700;margin-bottom:8px;">${c.memberRole}</div>` : ''}
            ${c.showId     ? `<div style="font-size:0.7rem;opacity:0.75;">ID: <strong>${c.memberId}</strong></div>` : ''}
            ${c.showExpiry ? `<div style="font-size:0.7rem;opacity:0.75;">Expires: <strong>${expiry.toLocaleDateString()}</strong></div>` : ''}
          </div>'

$text = $text.Replace($old, $new)
[Console]::WriteLine('Patched: ' + $text.Contains('align-items:center;gap:10px;margin-bottom:6px'))

[System.IO.File]::WriteAllText($file, $text, [System.Text.Encoding]::UTF8)
[Console]::WriteLine('Done.')
