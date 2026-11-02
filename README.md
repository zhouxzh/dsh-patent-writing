# dsh-patent-writing

面向 DeepSeek Harness 的自包含专利写作技能插件，覆盖从技术点子、现有技术检索、技术交底书、附图、权利要求到申请文件准备和审查的完整写作流程。

本仓库不依赖 Aurify 的 MCP 服务、Docker 镜像或固定评分后端；技能使用 DSH 现有的文件、网页、Office 和图像工具。

## 包含技能

- `patent-init`：技术事实、技术问题、方案和效果的五方对齐
- `patent-loop`：单件专利阶段推进
- `patent-research`：专利、论文和产品资料检索
- `patent-experiment`：设计计算、仿真和实验对照计划
- `patent-chapters`：八章技术交底书
- `patent-writing-quality`：术语、单位和事实边界
- `patent-de-ai`：去除模板腔和 AI 写作痕迹
- `patent-effect-contrast`：有益效果因果链
- `patent-figure-design`：黑白专利附图规划与验收
- `patent-claims`：权利要求结构和说明书支持检查
- `patent-application`：说明书和摘要准备
- `patent-review`：技术、形式、图文、效果和创造性风险审查
- `patent-services`：Word/PDF 导入、生成和渲染检查
- `diagram-design`：Graphviz、Mermaid 和 HTML 技术图

## 本地安装

```powershell
dsh plugin --profile desktop add "file:D:/Github/dsh-patent-writing/dsh-plugin-patent-writing-0.1.0.tgz"
node scripts/install-skills.mjs
dsh --profile desktop --dump-config
```

从源码仓库开发时，先运行：

```powershell
npm test
npm pack
node scripts/install-skills.mjs
node scripts/install-skills.mjs --check
```

技能默认安装到 `%USERPROFILE%/.dsh/skills`。首次安装或更新后完整重启 DeepSeek Harness 桌面版。

## 设计原则

- 技术交底书可以在样机完成前申请，但设计方案必须具体到本领域技术人员能够实施。
- 未实现设计、理论推导、仿真、台架测试和实测结果分开表述。
- 检索不到的公开号不写进背景技术；不能用模型评分代替专利授权结论。
- 一个主案可以包含多个创新点，但独立权利要求只保留不可拆分的核心技术组合。
- 本插件不构成法律意见，正式申请由申请人和专业专利代理师确认。

## 许可证与来源

本项目使用 MIT License。工作流组织参考了 Aurify 公共仓库，具体见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。本仓库的技能文本为适配 DSH 0.2.x 和当前工具环境而重写。
