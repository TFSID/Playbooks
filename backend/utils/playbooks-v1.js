// Report generation function
export function generateReport(req,res) {
  const data = req.body
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
  res.json({
    message: "Report generated successfully",
    success: true,
    data: {
      reportID: data.uuid,
      title: data.title,
      tags: data.tags,
      severity: data.severity,
      attack_type: data.attack_type,
      description: data.description,
      action: data.action,
      details: data.details,
      recommendations: data.recommendations,
      query: data.query,
      uuid: data.uuid,
      imagePath: `${data.domain}/uploads/${req.file.filename}`,
    },
  })
  return report

}