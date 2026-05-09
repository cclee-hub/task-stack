#!/usr/bin/env node
import { loadStore, saveStore, generateId } from './store.js';
import { renderStack, renderPopped, renderCurrent, renderError, renderSuccess } from './display.js';
import readline from 'readline';

const args = process.argv.slice(2);
const command = args[0];

async function promptProject(projects: string[]): Promise<string | undefined> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const list = projects.map((p, i) => `${i + 1}) ${p}`).join('  ');
    rl.question(`  项目 [${list}  回车跳过]: `, (answer) => {
      rl.close();
      const n = parseInt(answer);
      if (!isNaN(n) && n >= 1 && n <= projects.length) {
        resolve(projects[n - 1]);
      } else if (answer.trim()) {
        resolve(answer.trim());
      } else {
        resolve(undefined);
      }
    });
  });
}

async function main() {
  const store = loadStore();

  switch (command) {
    case 'push': {
      const description = args.slice(1).filter(a => !a.startsWith('--')).join(' ');
      const noteFlag = args.indexOf('--note');
      const note = noteFlag !== -1 ? args[noteFlag + 1] : undefined;

      if (!description) {
        renderError('请输入任务描述: task push "描述"');
        process.exit(1);
      }

      const project = await promptProject(store.projects);

      const task = {
        id: generateId(),
        description,
        project,
        type: (project && ['CCLHub', 'Analytics', 'rag-service', 'docs-site', 'AI DAG'].includes(project) ? 'code' : 'work') as 'work' | 'code',
        startedAt: new Date().toISOString(),
        notes: note ? [note] : [],
      };

      store.stack.push(task);
      saveStore(store);

      renderStack(store.stack);
      break;
    }

    case 'pop': {
      if (store.stack.length === 0) {
        renderError('栈为空');
        process.exit(1);
      }

      const task = store.stack.pop()!;
      const poppedAt = new Date().toISOString();
      store.history.push({ task, poppedAt });
      saveStore(store);

      renderPopped(task, poppedAt);

      if (store.stack.length > 0) {
        const prev = store.stack[store.stack.length - 1];
        console.log(`  返回到:`);
        renderCurrent(prev);
      } else {
        console.log(`  栈已清空\n`);
      }
      break;
    }

    case 'note': {
      const note = args.slice(1).join(' ');
      if (!note) {
        renderError('请输入备注: task note "内容"');
        process.exit(1);
      }
      if (store.stack.length === 0) {
        renderError('栈为空，先 task push 一个任务');
        process.exit(1);
      }

      store.stack[store.stack.length - 1].notes.push(note);
      saveStore(store);
      renderSuccess(`备注已记录: ${note}`);
      break;
    }

    case 'stack':
    case 'ls':
    case undefined: {
      renderStack(store.stack);
      break;
    }

    case 'clear': {
      store.stack = [];
      saveStore(store);
      renderSuccess('栈已清空');
      break;
    }

    case 'log': {
      const recent = store.history.slice(-10).reverse();
      if (recent.length === 0) {
        console.log(chalk_gray('\n  暂无历史记录\n'));
        break;
      }
      console.log('\n  最近完成:\n');
      recent.forEach(({ task, poppedAt }) => {
        const tag = task.project ? `[${task.project}]` : '[工作]';
        const time = new Date(poppedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
        console.log(`  ✓ ${tag} ${task.description}  ${time}`);
      });
      console.log('');
      break;
    }

    case 'projects': {
      const sub = args[1];
      if (sub === 'add') {
        const name = args[2];
        if (!name) { renderError('task projects add <名称>'); break; }
        if (!store.projects.includes(name)) {
          store.projects.push(name);
          saveStore(store);
          renderSuccess(`已添加项目: ${name}`);
        } else {
          renderError(`项目已存在: ${name}`);
        }
      } else {
        console.log('\n  项目列表:\n');
        store.projects.forEach(p => console.log(`    · ${p}`));
        console.log('\n  添加: task projects add <名称>\n');
      }
      break;
    }

    case 'help':
    default: {
      console.log(`
  task push "描述"        压栈，记录当前任务
  task pop                弹栈，返回上一个任务
  task note "内容"        给当前任务追加备注
  task stack              查看完整任务链路
  task log                查看今日完成记录
  task projects           查看/管理项目列表
  task projects add <名>  添加新项目
  task clear              清空栈
`);
    }
  }
}

function chalk_gray(s: string) {
  return `\x1b[90m${s}\x1b[0m`;
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
