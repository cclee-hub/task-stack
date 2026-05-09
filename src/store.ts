import fs from 'fs';
import path from 'path';
import os from 'os';

export interface Task {
  id: string;
  description: string;
  project?: string;
  type: 'work' | 'code';
  startedAt: string;
  notes: string[];
}

export interface Store {
  stack: Task[];
  projects: string[];
  history: Array<{ task: Task; poppedAt: string }>;
}

const DATA_DIR = path.join(os.homedir(), '.taskstack');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const DEFAULT_STORE: Store = {
  stack: [],
  projects: ['CCLHub', 'Analytics', 'rag-service', 'docs-site', 'AI DAG'],
  history: [],
};

export function loadStore(): Store {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_STORE, null, 2));
      return DEFAULT_STORE;
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return DEFAULT_STORE;
  }
}

export function saveStore(store: Store): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}
