// Report generation function
export function generateReport(req,res) {
  const data = req.body
  return res.json({
    message: "Report generated successfully",
    success: true,
    data: {
      reportID: `${data.uuid}`,
      title: `${data.title}`,
      tags: `${data.tags}`,
      severity: `${data.severity}`,
      attack_type: `${data.attack_type}`,
      description: `${data.description}`,
      action: `${data.action}`,
      details: `${data.details}`,
      recommendations: `${data.recommendations}`,
      query: `${data.query}`,
      uuid: `${data.uuid}`,
      imagePath: `${data.domain}/uploads/${req.file.filename}`,
    },
  })
}