// Report generation function
function generateReport(data) {
  let report = `Jenis Serangan: ${data.attack_type}\n`
  report += `Tags: ${data.tags}\n`
  report += `Severity: ${data.severity}\n`
  report += `Description: ${data.description}\n`
  report += `Action: ${data.action}\n`
  report += `Recommendations: ${data.recommendations}\n`
  report += `Details: ${data.details}\n`
  report += `\n\n\n`
  report += `Markdowns Preview\n\n`
  report += `# ${data.title}\n\n`
  report += `**Jenis Serangan**: ${data.attack_type}\n\n`
  report += `**Tags**: ${data.tags}\n\n`
  report += `**Severity**: ${data.severity}\n\n`
  report += `**Description**: ${data.description}\n\n`
  report += `**Action**: ${data.action}\n\n`
  report += `**Recommendations**: ${data.recommendations}\n\n`
  report += `**uuid**: ${data.uuid}\n\n`
  report += `**Search Query**: \`\`\` ${data.query} \`\`\`\n\n`
  report += `# Future Details\n`
  report += `\`\`\` ${data.details}\`\`\`\n`
  return report
}