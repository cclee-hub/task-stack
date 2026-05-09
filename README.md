# task-stack

单人多项目工作时的任务上下文栈管理工具。

当你频繁在多个项目间切换时，`task-stack` 帮你记录"正在做什么、从哪里来、要回到哪里去"。

## 安装

```bash
npm install
npm run build
```

## 使用

```bash
task push "写登录页"       # 压栈，记录当前任务
task pop                   # 弹栈，返回上一个任务
task note "需要改接口"     # 给当前任务追加备注
task stack                 # 查看任务链路
task log                   # 查看完成记录
task projects              # 查看/管理项目列表
task projects add <名称>   # 添加新项目
task clear                 # 清空栈
```

## Claude Code 集成

可注册为 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill，通过自然语言调用：

> "task push 写登录页"

## 数据存储

任务数据保存在 `~/.task-stack.json`。

## About the Author

- English Site: https://aidevhub.ai/about
- Upwork: https://www.upwork.com/freelancers/~010ab5ec29d8f4ff3f
- LinkedIn: https://www.linkedin.com/in/cc-lee-9b0b113bb/
