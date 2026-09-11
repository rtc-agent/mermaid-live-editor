#!/bin/sh
# 切换到 CDN 模式：使用 jsDelivr CDN 的 rtc-agent

echo "🔧 Switching to CDN rtc-agent mode..."

# 清理本地文件
if [ -d "static/rtc-agent-local" ]; then
    rm -rf static/rtc-agent-local
    echo "✅ Removed static/rtc-agent-local/"
fi

echo ""
echo "Next step: Update src/routes/+layout.svelte to use CDN mode:"
echo "  const RTC_AGENT_VERSION = 'x.y.z';  // 使用最新版本号"
echo "  const RTC_AGENT_CDN_URL = \`https://cdn.jsdelivr.net/npm/@rtc-agent/component@\${RTC_AGENT_VERSION}/dist/index.js\`;"
echo "  <script type=\"module\" src={RTC_AGENT_CDN_URL}></script>"
echo ""
echo "✅ Ready for push!"
