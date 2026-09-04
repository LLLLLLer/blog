---
title: 想做全栈产品架构工程师，先补哪八项、再走哪十二周
description: 给 0-2 年经验、每周能投 5-10 小时的人：一份带出处的能力自检表，和一条每周都有产出物的 12 周路线。
pubDate: 2026-09-04
tags: [架构, 学习路线, AI 应用]
draft: true
---

这份东西的用法：先用第一部分的八条自检，量出自己现在到哪；再照第二部分的 12 周走，
每周留下一个能跑的东西或一篇有结论的笔记。**每条结论后面都挂了出处和我打开它的日期，
你可以随手抽一条去核。**没有出处、纯属我个人判断的，我会明写「未经来源支持」。

方向限定在「全栈产品架构工程师（AI 应用方向）」：既要能把一个产品从前端到后端搭起来，
又要能对「这里该不该上模型、上了之后怎么算钱、怎么知道它变好了」负责。

---

## 一 · 八项能力自检

每项配一个**具体自检**：做得到就算过了，做不到就是你的下一个学习目标。
不写「沟通能力」「学习能力」这种放到任何岗位上都成立的条目 —— 它们量不出来，也就指导不了这周干什么。

### 1. 把「做得好」翻译成能量的数字

架构师和高级开发的第一道分水岭：需求方说「要快、要稳」，你能不能把它变成一组带数值的指标。
Google SRE 的定义是：SLI 是「对服务某方面的精确量化测量」，SLO 是「基于 SLI 制定的目标值」，
SLA 是「包含未达成后果的对外契约」。书里还有一条反直觉的提醒：内部 SLO 要比对外承诺更严，
而且不要长期大幅超额兑现 —— 用户会按你的实际表现建立依赖，Chubby 就是这么被迫做计划性停机的。

前端这一半有现成的数字可用：INP（Interaction to Next Paint）衡量页面对**所有**交互的响应，
第 75 百分位 ≤ 200 毫秒算「良好」，200-500 毫秒需改进。

> **自检**：为你手上正在做的一个功能，写出 3 个 SLI 和对应 SLO（至少含一个前端、一个后端），
> 并说得出「错误预算烧完时，第一个砍掉的是什么功能」。
>
> 来源：[Google SRE Book · Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)（2026-09-04 访问）；
> [web.dev · Interaction to Next Paint](https://web.dev/articles/inp)（页面标注 2022 年 5 月发布、2025 年 9 月更新，2026-09-04 访问）

### 2. 让决策留下痕迹，而不是留在脑子里

架构决策记录（ADR，Architecture Decision Record）就是一页纸：记一个决定、它的理由、
它的权衡和后果。adr.github.io 对它的定义是「捕捉单个架构决策及其理由」。
这件事看着像文书工作，实际是架构师最省事的杠杆 —— 半年后没人记得为什么当初选了 A，
而没有 ADR 的团队会把这个决定重新吵一遍。

> **自检**：翻出你过去三个月做过的一个技术决定，补写一份 ADR，写清「当时还有哪两个选项、
> 为什么没选、选了之后会付出什么代价」。写不出「代价」那一栏，说明当时那不是决策，是默认。
>
> 来源：[adr.github.io](https://adr.github.io/)（2026-09-04 访问）

### 3. 先把边界看清楚，再谈拆不拆

Martin Fowler 在 2015 年那篇 MonolithFirst 里的论点，十年后仍然是新手最该先听的一条：
即使你确信系统最终会受益于微服务，新项目也该从单体开始。理由有三 ——
早期你不确定这东西有没有市场（YAGNI）；即使是有经验的架构师也很难在项目初期切对边界；
而单体内部的重构成本远低于跨服务重构。他自己也承认这些结论「仍是初步的」。

在 AI 应用上这条同样成立：把「模型调用」当成一个尚未拆出去的模块，先把它的输入输出边界画清楚，
比一上来就搞独立的推理服务更有用。

> **自检**：指出你项目里两个模块之间的那条接口，说清「现在把它拆成两个服务，你要多付出哪三样东西」
> （网络失败处理、数据一致性、部署与排查成本，能各举一个具体例子才算过）。
>
> 来源：[Martin Fowler · MonolithFirst](https://martinfowler.com/bliki/MonolithFirst.html)（2015-06-03 发布，2026-09-04 访问）

### 4. 有一张固定的清单去审自己的设计

架构师和「写得快的开发」的区别，很大程度上是有没有一张不靠灵感的检查清单。
AWS Well-Architected Framework 提供的就是这个：一组基础问题，用来判断某个架构是否符合最佳实践。
官方明确说它「是建设性的架构讨论，不是审计工具」。六个支柱是卓越运营、安全性、可靠性、
性能效率、成本优化、可持续性。

> **自检**：拿你自己写过的一个功能，逐支柱各写一条「这里最可能出的问题」和一条「最小修复」。
> 六条里如果有三条以上你写不具体，说明那个支柱是你的盲区。
>
> 来源：[AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
> （文档标注发布日期 2024-11-06，2026-09-04 访问）；六支柱名称同时见于
> [Migration Lens · The pillars of the Framework](https://docs.aws.amazon.com/wellarchitected/latest/migration-lens/well-architected-framework-pillars.html)（2026-09-04 访问）

### 5. 知道什么时候**不**该上 agent

这是 AI 应用方向最值钱的一条判断力，也是最容易做反的一条。Anthropic 的工程文章把它讲得很直白：
最成功的实现没有用复杂框架，而是建立在简单、可组合的模式上；「找到最简单的可行方案，
仅当需要时才增加复杂性 —— 这可能意味着根本不构建智能体系统」。
它区分两个词：**工作流**是由预定义代码路径编排 LLM 与工具，**agent** 是 LLM 自己动态决定流程。
agent 用更高的延迟和成本换性能，这笔交易要主动算，而不是默认接受。

> **自检**：拿一个真实需求，说清它属于「单次调用 / 工作流 / agent」里的哪一档，
> 并给出你把它降一档会失去什么。降一档说不出损失的，就该降。
>
> 来源：[Anthropic · Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)（2024-12-19 发布，2026-09-04 访问）

### 6. 成本是设计出来的，不是省出来的

AI 产品的账单结构和传统服务不一样：它跟你怎么组织上下文直接相关。
以 Claude 的 prompt caching 为例，机制是**前缀匹配** —— 缓存命中要求提示片段 100% 一致，
前缀里任何一个字节变了（时间戳、工具定义顺序、图片）哈希就不同，缓存全部失效。
价格上，5 分钟缓存写入是基础输入价的 1.25 倍、1 小时是 2 倍，而**缓存读取是 0.1 倍**；
默认 TTL 是 5 分钟。验证有没有命中不靠猜，看响应 `usage.cache_read_input_tokens` 是不是大于 0。

这条能力的本质不是「会调一个参数」，而是：你能把「把不变的放前面、把变的放后面」
这种约束，在设计阶段就写进系统结构里。

> **自检**：算得出你某个功能单次请求的 token 成本；再说出「如果缓存命中率是 0，
> 最可能是我在前缀里放了什么」。
>
> 来源：[Claude Docs · Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)（2026-09-04 访问）

### 7. 没有评测集，你就只能靠感觉迭代

这是 AI 应用区别于传统开发最硬的一条：改完 prompt 之后「感觉变好了」不是结论。
Anthropic 文档给的成功标准四要素是具体、可衡量、可实现、相关，
并给了正反例 —— 「模型应该很好地分类情感」是坏标准，
「在 10000 条推文的保留测试集上 F1 ≥ 0.85」是好标准。
评测集的设计原则有三条：贴合真实分布并覆盖边界情况、尽量自动判分、
**宁可数量多而判分信号弱一点，也不要少量高质量手工评分**。
判分方式分精确匹配、向量相似度、ROUGE-L、LLM 判分几类。

规模上不用等攒够几百条 —— Anthropic 另一篇讲 agent 评测的文章说，
「从真实失败案例中提取的 20-50 条简单任务就是很好的起点」，并把评分器分成代码评分、
模型评分、人工评分三类，还建议给多组分任务打部分分而不是非黑即白。

> **自检**：你手上有一个 ≥20 条的评测集，改一次 prompt 能跑出改前改后两个数字。
>
> 来源：[Claude Docs · Define success criteria](https://platform.claude.com/docs/en/test-and-evaluate/define-success)（2026-09-04 访问）；
> [Claude Docs · Create strong empirical evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)（2026-09-04 访问）；
> [Anthropic · Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)（2026-01-09 发布，2026-09-04 访问）

### 8. 知道自己的攻击面在哪、坏了谁会发现

两件事其实是一件：你得能说出系统会怎么坏，以及坏了之后谁会知道。

攻击面这半边有现成的清单。OWASP Top 10 for LLM Applications（2025 版）十条是：
提示注入、敏感信息泄露、供应链、数据与模型投毒、输出处理不当、过度授权（Excessive Agency）、
系统提示泄露、向量与嵌入弱点、错误信息、无限制消耗。对做产品的人来说，
第 1、6、10 条是最先会咬到你的：注入的入口、你给 agent 的权限上限、以及有人把你的 token 烧光。

「坏了谁会知道」这半边，OpenTelemetry 已经把 GenAI 的语义约定拆到了单独的仓库，
定义 GenAI 客户端、MCP 和各家 provider 的 span、metric 与 event。
（注意：我打开时该仓库没有明确标注稳定性等级，README 里还留着 Schema URL 的 TODO —— 
**当作正在演进的规范用，别当成冻结标准**。）

> **自检**：指出你 demo 里哪一步是提示注入的入口；说出你给模型/agent 的权限最大能造成多大损失；
> 以及一次线上请求出问题时，你能不能在 5 分钟内说清它卡在哪一环、烧了多少 token。
>
> 来源：[OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)（2025 版，2026-09-04 访问）；
> [OpenTelemetry GenAI Semantic Conventions](https://github.com/open-telemetry/semantic-conventions-genai)（2026-09-04 访问）

---

## 二 · 12 周路线

规则：每周一格，控制在 5 小时以内；**每格必须留下一个能跑的东西或一篇有结论的笔记**。
「读了 X」「了解了 Y」不算产出物 —— 读完没留下东西，三个月后等于没读。

前两周刻意从你已经有的项目起步，不碰任何新技术：先把「看自己写过的代码」这件事练出架构视角，
再往上加东西。（这个排序是我的判断，未经来源支持；但它对应上面第 1、2 条能力，
而那两条是后面每一周都要反复用到的。）

| 周 | 主题 | 动手产出物 | 自检问题 |
| --- | --- | --- | --- |
| 1 | 给现有功能定指标 | 一张表：3 个 SLI + SLO，含一个前端 INP 目标和一个后端延迟目标 | 错误预算烧完，我先砍哪个功能？ |
| 2 | 补写决策记录 | 1 份 ADR（补记一个过去的决定）+ 1 张系统图 | 「代价」那一栏我写具体了吗？ |
| 3 | 六支柱自审 | 6 条「最可能出的问题」+ 6 条最小修复，挑最狠的一条当场改掉 | 哪个支柱我写不具体？ |
| 4 | 做最笨的那版 AI 功能 | 一个能跑的脚本：单次模型调用完成一个真实任务（不做聊天界面） | 它解决的具体问题是什么？不上模型能不能做？ |
| 5 | 给它建评测集 | `evals.jsonl`（≥20 条，来自真实失败）+ 一个自动判分脚本，能输出一个分数 | 我的边界用例覆盖了「不该发生」的情况吗？ |
| 6 | 用评测集做一次 A/B | 改前 / 改后两个分数 + 一句结论（含「这次改动没用」也算完成） | 分数变化是真的，还是评测集太松？ |
| 7 | 把成本算出来再压下去 | 一张「改造前后每次请求的 token 与成本」对比，且 `cache_read_input_tokens > 0` | 命中率为 0 时，我的前缀里放了什么会变的东西？ |
| 8 | 升级成工作流（还不是 agent） | 一个由你的代码控制流程、模型只做单点判断的工作流 | 为什么这里还不需要 agent？说不出就别上。 |
| 9 | 接一个外部系统 | 跑通一个 MCP 连接（用现成 server 或写个最小的）+ 一张「什么数据出了进程」的边界图 | 哪些数据本来不该离开我这台机器？ |
| 10 | 攻击你自己 | 按 OWASP 挑 3 条（注入 / 过度授权 / 无限制消耗）各打一次，留 3 份攻击记录 + 修复 | 我给它的权限，最大能造成多大损失？ |
| 11 | 让故障能被发现 | 每次请求带上 trace（耗时、token、失败原因）；**故意制造一次失败，确认自己能在 5 分钟内定位** | 这里坏了谁会知道？答「没人」就还没做完。 |
| 12 | 合成一份设计文档 | 一份写给「假想的新同事」的设计文档，把前 11 周的产出串成一个系统；再量一次自己的交付节奏 | 新同事照这份文档能独立改动它吗？ |

第 12 周量交付节奏时注意一件事：DORA 的指标已经从最初的四个变成**五个**了 ——
吞吐量三条（变更前置时间、部署频率、失败部署恢复时间）加稳定性两条（变更失败率、部署返工率），
原来的 MTTR 已被「失败部署恢复时间」替代。个人项目量不全没关系，能量到的先量。

**每周来源**（都在 2026-09-04 打开过）：
第 1 周 [SRE Book · SLO](https://sre.google/sre-book/service-level-objectives/)、[web.dev · INP](https://web.dev/articles/inp)；
第 2 周 [adr.github.io](https://adr.github.io/)；
第 3 周 [AWS Well-Architected](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)；
第 4、8 周 [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)；
第 5 周 [Define success criteria](https://platform.claude.com/docs/en/test-and-evaluate/define-success)、[Create strong empirical evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)；
第 6 周 [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)；
第 7 周 [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)；
第 9 周 [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)；
第 10 周 [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)；
第 11 周 [OpenTelemetry GenAI 语义约定](https://github.com/open-telemetry/semantic-conventions-genai)；
第 12 周 [DORA metrics](https://dora.dev/guides/dora-metrics-four-keys/)（页面标注最后更新 2026-01-05）。

---

## 三 · 关于「写自己的笔记」

这份路线之所以每周都要求一个产出物，是因为笔记的价值几乎全在**你自己做过**那部分。
抄下来的定义半年后一文不值，写下来的「我以为 A，结果是 B」半年后还在替你省时间。

仓库里的 `src/content/posts/_note-template.md` 就是配套的模板，四段固定结构，
复制一份改文件名就能写。别追求写得好看 —— 第三段（踩了什么坑）和第四段（还没搞懂的）
才是这套笔记真正值钱的地方。
