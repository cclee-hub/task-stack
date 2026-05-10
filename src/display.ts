import chalk from 'chalk';
import { Task } from './store.js';

function formatDuration(from: string): string {
  const ms = Date.now() - new Date(from).getTime();
  const mins = Math.floor(ms / 60000);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) return `${hrs}h${mins % 60}m`;
  if (mins > 0) return `${mins}m`;
  return '刚刚';
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
  if (isToday) return time;
  const date = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return `${date} ${time}`;
}

function projectColor(project?: string): (s: string) => string {
  if (!project) return chalk.gray;
  const colors = [chalk.cyan, chalk.yellow, chalk.magenta, chalk.green, chalk.blue, chalk.red];
  let hash = 0;
  for (const c of project) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return colors[hash % colors.length];
}

export function renderStack(stack: Task[]): void {
  if (stack.length === 0) {
    console.log(chalk.gray('\n  栈为空，用 task push "描述" 开始\n'));
    return;
  }

  console.log('');
  stack.forEach((task, i) => {
    const isTop = i === stack.length - 1;
    const indent = '  '.repeat(i);
    const connector = i === 0 ? '' : `${indent.slice(2)}└─ `;
    const dot = isTop ? chalk.greenBright('●') : chalk.gray('●');
    const color = projectColor(task.project);
    const tag = task.project ? color(`[${task.project}]`) : chalk.gray('[工作]');
    const desc = isTop ? chalk.white.bold(task.description) : chalk.gray(task.description);
    const time = chalk.gray(formatTime(task.startedAt));
    const duration = isTop ? chalk.greenBright(` (${formatDuration(task.startedAt)})`) : '';
    const cursor = isTop ? chalk.greenBright('  ← 你在这里') : '';

    console.log(`  ${indent}${connector}${dot} ${tag} ${desc}  ${time}${duration}${cursor}`);

    if (isTop && task.notes.length > 0) {
      const lastNote = task.notes[task.notes.length - 1];
      console.log(`  ${'  '.repeat(i + 1)}${chalk.gray('↳')} ${chalk.yellow(lastNote)}`);
    }
  });

  console.log('');
}

export function renderPopped(task: Task, poppedAt: string): void {
  const duration = formatDuration(task.startedAt);
  console.log('');
  console.log(chalk.gray('  ── 已完成 ──'));
  console.log(`  ${chalk.greenBright('✓')} ${chalk.white(task.description)}  ${chalk.gray(`(用时 ${duration})`)}`);
  if (task.notes.length > 0) {
    console.log(`  ${chalk.gray('最后记录:')} ${chalk.yellow(task.notes[task.notes.length - 1])}`);
  }
  console.log('');
}

export function renderCurrent(task: Task): void {
  const color = projectColor(task.project);
  const tag = task.project ? color(`[${task.project}]`) : chalk.gray('[工作]');
  console.log('');
  console.log(`  ${chalk.greenBright('▶')} ${tag} ${chalk.white.bold(task.description)}`);
  console.log(`  ${chalk.gray('开始于')} ${chalk.gray(formatTime(task.startedAt))}  ${chalk.gray(formatDuration(task.startedAt) + ' 前')}`);
  if (task.notes.length > 0) {
    console.log(`  ${chalk.gray('记录:')}`);
    task.notes.forEach(n => console.log(`    ${chalk.gray('·')} ${chalk.yellow(n)}`));
  }
  console.log('');
}

export function renderError(msg: string): void {
  console.log(`\n  ${chalk.red('✗')} ${chalk.red(msg)}\n`);
}

export function renderSuccess(msg: string): void {
  console.log(`\n  ${chalk.greenBright('✓')} ${chalk.white(msg)}\n`);
}
