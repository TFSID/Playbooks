import { prisma } from '../../../libs/prisma-client.js';

export async function createIncident(req, res) {
  const data = req.body

  const tags = data.tags
  console.log("tags received:", tags);
  try {
    const createIncident = await prisma.Incident.create({
            data: {
                title: `${data.title}`,
                tags: ["virus"],
                severity: `${data.severity}`,
                attack_type: `${data.attack_type}`,
                description: `${data.description}`,
                action: `${data.action}`,
                details: `${data.details}`,
                recommendations: `${data.recommendations}`,
                query: `${data.query}`,
                uuid: `${data.uuid}`,
                imagePath: `${data.domain}/uploads/${req.file.filename}`,
                userId: 1,
            }
        });
    // console.log('Incident created:', `${data}`);
    console.log('Incident created:', createIncident);
    return res.json({
        message: "Report generated successfully",
        success: true,
        data: {
          title: `${data.title}`,
          tags: ["virus"],
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
    } catch (error) {
      console.error("Error creating incident:", error);
      return res.status(500).json({
        message: "Failed to create incident",
        success: false,
        error: error.message,
      });
    }
}