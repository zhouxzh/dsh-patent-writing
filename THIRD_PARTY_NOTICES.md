# Third-Party Notices

The workflow organization and several quality-control concepts in this plugin
were informed by the public Aurify repository:

- Repository: https://github.com/ai-tools-mtl/Aurify
- Reference commit: `d34173d3a042b1b37211de0367b004d460a7b4de`
- Aurify package metadata declares the MIT license.

This plugin is a lightweight clean-room adaptation for DSH 0.2.x. It does not
bundle Aurify's MCP service, TypeScript runtime packages, web client, or fixed
`patent_review`/`patent_loop` tools. The skill text here was rewritten to use
ordinary DSH file, search, image, and Office capabilities.

If future contributors copy substantial source code or assets from Aurify or
from the vendored `diagram-design` skill, they must preserve the corresponding
license and attribution notices.
