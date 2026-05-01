const fs = require('fs');
let file = fs.readFileSync('src/pages/GspApplicationPage.tsx', 'utf8');

// Add states
file = file.replace('const [saving, setSaving] = React.useState(false);', 'const [saving, setSaving] = React.useState(false);\n  const [showErrors, setShowErrors] = React.useState(false);\n  const getErrClass = (val: any) => showErrors && !val ? \'border-red-500 ring-1 ring-red-500\' : \'\';');

// Add setShowErrors logic
file = file.replace('if (!next[currentSecKey]) {', 'if (!next[currentSecKey]) {\n                        setShowErrors(true);');
file = file.replace('setActiveSection(s)}', '{ setActiveSection(s); setShowErrors(false); }}');
file = file.replace('setActiveSection(sections[currentIndex + 1]);', 'setActiveSection(sections[currentIndex + 1]); setShowErrors(false);');
file = file.replace('setActiveSection(10);', 'setActiveSection(10); setShowErrors(false);');

// Apply to inputs
file = file.replace(/<Input value=\{data\.(\w+)\}/g, '<Input className={getErrClass(data.$1)} value={data.$1}');
file = file.replace(/<Input className="([^\"]+)" value=\{data\.(\w+)\}/g, '<Input className={`$1 ${getErrClass(data.$2)}`} value={data.$2}');
file = file.replace(/<Input type="([^"]+)" value=\{data\.(\w+)\}/g, '<Input type="$1" className={getErrClass(data.$2)} value={data.$2}');

// Apply to Textarea
file = file.replace(/<Textarea value=\{data\.(\w+)\}/g, '<Textarea className={getErrClass(data.$1)} value={data.$1}');
file = file.replace(/<Textarea className="([^"]+)" value=\{data\.(\w+)\}/g, '<Textarea className={`$1 ${getErrClass(data.$2)}`} value={data.$2}');

// Apply to SelectTrigger
file = file.replace(/<Select value=\{data\.(\w+)\}[\s\S]*?<SelectTrigger>/g, match => {
  const field = match.match(/data\.(\w+)/)[1];
  return match.replace('<SelectTrigger>', `<SelectTrigger className={getErrClass(data.${field})}>`);
});
file = file.replace(/<Select value=\{data\.(\w+)\}[\s\S]*?<SelectTrigger className="([^"]+)">/g, match => {
  const field = match.match(/data\.(\w+)/)[1];
  return match.replace(/<SelectTrigger className="([^"]+)">/, `<SelectTrigger className={\`$1 \${getErrClass(data.${field})}\`}>`);
});

fs.writeFileSync('src/pages/GspApplicationPage.tsx', file);
console.log('Done');
