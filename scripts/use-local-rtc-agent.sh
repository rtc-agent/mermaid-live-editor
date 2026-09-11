#!/bin/sh
# 切换到本地开发模式：使用本地编译的 rtc-agent

echo "🔧 Switching to local rtc-agent mode..."

# 确保 rtc-agent 已经编译
if [ ! -f "../web-components/packages/component/dist/index.js" ]; then
    echo "❌ Error: Local rtc-agent not found at ../web-components/packages/component/dist/"
    echo "Please build it first: cd ../web-components && pnpm build"
    exit 1
fi

# 创建本地 rtc-agent 目录
mkdir -p static/rtc-agent-local

# 复制编译产物
cp -r ../web-components/packages/component/dist/* static/rtc-agent-local/

echo "✅ Local rtc-agent copied to static/rtc-agent-local/"
echo ""
echo "Next step: Update src/routes/+layout.svelte to use local mode:"
echo "  const RTC_AGENT_LOCAL_URL = '/rtc-agent-local/index.js';"
echo "  <script type=\"module\" src={RTC_AGENT_LOCAL_URL}></script>"
echo ""
echo "⚠️  Remember to switch back to CDN mode before pushing!"
