// Create this file at: app/api/cloudinary/delete/route.js
// (If using Pages Router, create at: pages/api/cloudinary/delete.js instead)

import crypto from 'crypto';

export async function POST(request) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return Response.json(
        { success: false, error: 'Public ID is required' },
        { status: 400 }
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary credentials');
      return Response.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Generate timestamp
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Create signature
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash('sha256')
      .update(stringToSign)
      .digest('hex');

    // Make delete request to Cloudinary
    const formData = new URLSearchParams();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp);
    formData.append('api_key', apiKey);
    formData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (data.result === 'ok') {
      return Response.json({ success: true });
    } else {
      console.error('Cloudinary delete failed:', data);
      return Response.json(
        { success: false, error: data.result || 'Delete failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Delete API error:', error);
    return Response.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// For Pages Router (pages/api/cloudinary/delete.js)
// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ success: false, error: 'Method not allowed' });
//   }
//
//   try {
//     const { publicId } = req.body;
//     // ... rest of the logic same as above
//     // return res.json({ success: true });
//   } catch (error) {
//     return res.status(500).json({ success: false, error: error.message });
//   }
// }