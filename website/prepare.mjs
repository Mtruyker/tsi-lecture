import {readdir,readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
const files=(await readdir('..')).filter(f=>/^\d+_лекция\.md$/.test(f)).sort((a,b)=>parseInt(a)-parseInt(b));
if(!files.length)throw new Error('В корне репозитория не найдены лекции');
await mkdir('public/lectures',{recursive:true}); await mkdir('src',{recursive:true});
const data=[];
for(const file of files){const content=await readFile('../'+file,'utf8');const id=parseInt(file);const title=content.split('\n')[0].replace(/^# Лекция \d+\. /,'');const description=content.split(/\n\s*\n/).slice(1).find(b=>b.trim()&&!b.startsWith('#'))||'';data.push({id,title,description,content,minutes:Math.max(1,Math.round(content.split(/\s+/).length/180)),file});await copyFile('../'+file,'public/lectures/'+file);}
await writeFile('src/lectures.json',JSON.stringify(data));console.log(`Подготовлено ${data.length} лекций`);
