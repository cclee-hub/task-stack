#!/usr/bin/env bash
set -euo pipefail

echo "📦 准备发版"

# 校验1：工作树干净
if [[ -n $(git status --porcelain) ]]; then
  echo "❌ 工作树有未提交的更改，请先 commit"
  git status --short
  exit 1
fi

# 校验2：package-lock.json 已被 track
if ! git ls-files --error-unmatch package-lock.json > /dev/null 2>&1; then
  echo "❌ package-lock.json 未被 git track，npm ci 会失败"
  exit 1
fi

# patch 版本递增
npm version patch --no-git-tag-version
VERSION=$(node -p "require('./package.json').version")
TAG="v${VERSION}"

# 校验3：tag 不已存在
if git rev-parse "$TAG" > /dev/null 2>&1; then
  echo "❌ Tag ${TAG} 已存在"
  exit 1
fi

# 校验4：build
npm run build

# 提交版本号变更、打 tag、推送
git add package.json package-lock.json
git commit -m "release: ${TAG}"
git tag "$TAG"
git push && git push origin "$TAG"

echo "✅ ${TAG} 已推送，CI 将自动发布到 npm"
