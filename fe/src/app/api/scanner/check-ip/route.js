export async function GET() {
  try {
    const backendResponse = await fetch(
      `${process.env.FETCH_DOMAIN_URL}/check-ip`
    );
    const data = await backendResponse.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
