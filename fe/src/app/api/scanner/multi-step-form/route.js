export async function POST(request) {
  try {
    // Ambil data dari request
    const formData = await request.formData();

    console.log("Form Data:", formData);

    // Kirim ke backend
    const backendResponse = await fetch(
      `${process.env.FETCH_DOMAIN_URL}/submit`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!backendResponse.ok) {
      throw new Error(`Backend error: ${backendResponse.statusText}`);
    }

    const data = await backendResponse.json();

    return Response.json({
      success: true,
      message: "Form submitted successfully",
      data: data,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
