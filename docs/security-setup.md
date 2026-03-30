# 安全配置指南

本文档说明如何配置速率限制和安全防护。

---

## 🔒 已实现的安全功能

### 1. 速率限制 (Rate Limiting)
- **限制**: 10 次请求 / 10 秒 per IP
- **实现**: 使用 Upstash Redis + @upstash/ratelimit
- **保护范围**: 所有 API 端点 (`/api/search`, `/api/datasets/[id]`)

### 2. 输入验证 (Input Validation)
- **搜索查询**: 最大 200 字符，过滤危险字符
- **分页参数**: 页码 1-1000，每页 1-100 条
- **排序字段**: 白名单验证（仅允许预定义字段）
- **筛选参数**: 任务类型、数据模态白名单验证
- **年份范围**: 1990 - 当前年份 +1
- **图像数量**: 0 - 1,000,000

### 3. 错误处理
- 统一的错误响应格式
- 不泄露内部错误详情
- 返回速率限制头信息

---

## 📋 配置步骤

### 步骤 1: 创建 Upstash Redis 数据库

1. 访问 [Upstash Console](https://console.upstash.com/)
2. 注册/登录账号
3. 点击 **"Create Database"**
4. 配置：
   - **Name**: `rs-data-hub-rate-limit`（或任意名称）
   - **Region**: 选择离你用户最近的区域（推荐 `asia-southeast-1` 新加坡）
   - **TLS**: ✅ 启用
   - **Eviction**: `noeviction`（默认）
5. 点击 **"Create"**

### 步骤 2: 获取 Redis 凭证

创建完成后，在数据库页面找到：
- **`UPSTASH_REDIS_REST_URL`**: REST API URL（类似 `https://xxx.upstash.io`）
- **`UPSTASH_REDIS_REST_TOKEN`**: 访问令牌

### 步骤 3: 配置环境变量

#### 本地开发 (.env.local)
```bash
# 复制示例文件
cp .env.local.example .env.local

# 编辑 .env.local，填入你的 Upstash 凭证
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

#### Vercel 生产环境

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目 `rs-data-hub`
3. 进入 **Settings** → **Environment Variables**
4. 添加以下变量：
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
5. 点击 **Save**
6. **重新部署项目**（环境变量需要重新部署才能生效）

### 步骤 4: 安装依赖

```bash
npm install
```

### 步骤 5: 测试

#### 本地测试
```bash
npm run dev
```

访问 `http://localhost:3000/api/search` 测试是否正常。

#### 速率限制测试
```bash
# 快速发送 15 次请求（应该在第 11 次被限制）
for i in {1..15}; do
  curl -i "http://localhost:3000/api/search?q=test&page=$i"
  echo ""
done
```

预期结果：
- 前 10 次请求：返回 `200 OK`
- 第 11 次开始：返回 `429 Too Many Requests`

---

## 📊 监控速率限制

### 查看 Upstash 仪表盘

1. 登录 [Upstash Console](https://console.upstash.com/)
2. 选择你的数据库
3. 查看 **Data Browser** → `ratelimit:*` 键
4. 查看 **Analytics** 了解请求模式

### Vercel 日志

在 Vercel Dashboard 查看实时日志：
```
Functions → Your Function → Logs
```

搜索 `[RateLimit]` 查看相关日志。

---

## 🔧 调整速率限制

如果默认限制（10 次/10 秒）不适合你的需求，可以修改：

**文件**: `src/lib/rateLimit.ts`

```typescript
// 修改这一行
limiter: Ratelimit.slidingWindow(10, '10 s'),

// 例如：改为 100 次/分钟
limiter: Ratelimit.slidingWindow(100, '60 s'),

// 或：改为 1000 次/小时
limiter: Ratelimit.slidingWindow(1000, '1 h'),
```

**建议配置**：
- **公开 API**: 10-20 次/分钟
- **需要登录**: 100 次/分钟
- **内部管理**: 1000 次/小时

---

## 🛡️ 其他安全建议

### 1. 启用 Supabase RLS（重要！）

参考 Supabase 官方文档配置 Row Level Security：
- https://supabase.com/docs/guides/auth/row-level-security

### 2. 配置 Cloudflare（可选）

如果担心 DDoS 攻击：
1. 将域名添加到 Cloudflare
2. 启用 **Under Attack Mode**（如有需要）
3. 配置 **WAF Rules** 阻止恶意请求

### 3. 监控告警

建议配置：
- **Vercel Analytics**: 监控流量异常
- **Supabase Logs**: 监控数据库查询
- **Upstash Metrics**: 监控 Redis 使用

---

## 🐛 故障排除

### 问题 1: "Missing UPSTASH_REDIS_REST_URL"

**原因**: 环境变量未配置

**解决**:
```bash
# 检查 .env.local 是否存在
cat .env.local

# 确认变量已设置
echo $UPSTASH_REDIS_REST_URL
```

### 问题 2: 开发环境报错

**原因**: 开发时未配置 Upstash

**解决**: 代码已处理，开发模式下会自动跳过速率限制（会输出警告日志）

### 问题 3: 生产环境速率限制不生效

**原因**: Vercel 环境变量未配置或未重新部署

**解决**:
1. 在 Vercel Dashboard 添加环境变量
2. **重新部署**项目（Redeploy）

---

## 📚 相关文件

- `src/lib/rateLimit.ts` - 速率限制实现
- `src/lib/validate.ts` - 输入验证实现
- `src/app/api/search/route.ts` - 搜索 API（已集成防护）
- `src/app/api/datasets/[id]/route.ts` - 详情 API（已集成防护）

---

**最后更新**: 2026-03-30  
**作者**: 小龙虾
