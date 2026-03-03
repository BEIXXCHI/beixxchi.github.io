/**
 * parseFrontmatter
 * 轻量级 frontmatter 解析器，无需第三方依赖
 *
 * 支持的 YAML 类型：string / number / boolean
 *
 * 示例 .md 文件格式：
 * ---
 * title: 我的文章
 * date: 2025-02-18
 * featured: true
 * ---
 * 正文内容...
 */
export function parseFrontmatter(raw) {
  const DELIMITER = '---';

  if (!raw.trimStart().startsWith(DELIMITER)) {
    return { data: {}, content: raw };
  }

  const start = raw.indexOf(DELIMITER) + 3;
  const end = raw.indexOf(DELIMITER, start);

  if (end === -1) {
    return { data: {}, content: raw };
  }

  const yamlBlock = raw.slice(start, end).trim();
  const content = raw.slice(end + 3).trim();

  const data = {};

  for (const line of yamlBlock.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    const raw_val = line.slice(colonIdx + 1).trim();

    if (!key) continue;

    // Boolean
    if (raw_val === 'true') { data[key] = true; continue; }
    if (raw_val === 'false') { data[key] = false; continue; }

    // Number
    if (raw_val !== '' && !isNaN(Number(raw_val))) {
      data[key] = Number(raw_val);
      continue;
    }

    // String（去掉可选的引号）
    data[key] = raw_val.replace(/^['"]|['"]$/g, '');
  }

  return { data, content };
}
