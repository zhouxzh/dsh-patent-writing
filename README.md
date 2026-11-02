# dsh-patent-writing

面向 DeepSeek Harness 的发明专利技术交底书技能插件。插件帮助发明人把技术问题、结构、公式、算法、数据流程、状态控制、实施方式、效果依据和创新差异整理成可供专业专利代理师使用的**填写前须知＋九段式正文＋附录**技术交底书。

插件不生成权利要求书、独立/从属权利要求、正式申请说明书、正式说明书摘要或请求书，也不判断授权概率。正式法律文本由专业专利代理师撰写。

## 保留技能

### `patent-disclosure`

唯一的专利技能入口，包含以下内部参考模块：

- `references/research-and-prior-art.md`：检索词、来源、对比文件和差异账本。
- `references/technical-writing-and-evidence.md`：技术建模、九段式写作、公式、效果和验证。
- `references/data-model-disclosure.md`：机器学习、强化学习、数据平稳化、训练和在线推理专项检查。
- `references/figures-and-delivery.md`：黑白附图、Word 结构和导出检查。
- `references/review-and-handoff.md`：技术审查、术语、可实现性和代理交接清单。

该技能默认持续完善技术交底；“继续、补全、优化、重写”不会自动进入权利要求或正式申请文件阶段。

### `diagram-design`

通用技术报告绘图支持，用于系统图、流程图、状态图和连接图，不是专利技能或法律文书生成器。

## 已移除技能

以下旧入口已从插件和安装器中移除：

- `patent-init`
- `patent-loop`
- `patent-research`
- `patent-experiment`
- `patent-chapters`
- `patent-writing-quality`
- `patent-de-ai`
- `patent-effect-contrast`
- `patent-figure-design`
- `patent-claims`
- `patent-application`
- `patent-review`
- `patent-services`

其中有用的检索、写作、效果论证、验证、附图和审查规则已经合并进 `patent-disclosure`，不再作为独立阶段或最终申请文件流程。

## 安装

```powershell
npm test
npm pack
dsh plugin --profile desktop add "file:D:/Github/dsh-patent-writing/dsh-plugin-patent-writing-0.3.1.tgz"
node scripts/install-skills.mjs
node scripts/install-skills.mjs --check
dsh --profile desktop --dump-config
```

技能安装到 `%USERPROFILE%/.dsh/skills`。安装器会移除旧版创建的上列废弃专利技能，只安装当前两个技能目录。首次安装或升级后完整重启 DeepSeek Harness。

## 设计原则

- 技术交底固定采用“填写前须知＋九段式正文＋附录”，不把论文或研究报告作为交付定位。
- 正文明确区分总体方案与具体实施方式，代理师先理解主链，再获得可复现细节。
- 术语、缩写、完整可实现性和充分公开均有明确检查门禁。
- 公式必须有变量、单位、假设和适用范围；算法必须说明输入、判据、状态和失败路径。
- 机器学习方案必须额外说明数据、标签、平稳化、训练、在线推理、版本和实验对照。
- 已实现、已确定设计、助手建议和待验证效果必须分开。
- 未完成的检索、测试和样机不阻止交底撰写，但不能被写成已完成结果。
- 参考其他专利时只借鉴版式，不复制其他发明的权利要求或正式申请内容。
- 一个插件只保留一个专利技能入口，内部参考文件不是独立阶段。

## 许可证与来源

本项目使用 MIT License。工作流组织参考了 Aurify 公共仓库，具体见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。技能文本为适配 DSH 0.2.x 和当前 Office/图表工具环境而重写。
