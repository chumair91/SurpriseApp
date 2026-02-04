import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const response = await resend.emails.send({
      from: "Surprise App <onboarding@resend.dev>",
      to: "contact.ahmadcineverse@gmail.com",
      subject: "🎁 Your Friend Said YES to Your Surprise! 🎁",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);"><div style="background: white; border-radius: 16px; padding: 30px; text-align: center;"><div style="font-size: 48px; margin-bottom: 20px;">🎉</div><h1 style="color: #333; font-size: 28px; margin: 0 0 15px 0;">They Said YES! 🎊</h1><p style="color: #666; font-size: 16px; line-height: 1.6; margin: 15px 0;">Your friend just accepted your surprise! They're excited and waiting to see what you have planned.</p><div style="background: #ffe0b2; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; text-align: left;"><p style="color: #333; margin: 0; font-size: 14px;"><strong>Next Steps:</strong> Time to surprise them with something amazing! Make it unforgettable. 🎁</p></div><p style="color: #999; font-size: 14px; margin-top: 25px; border-top: 1px solid #eee; padding-top: 15px;">This is your moment to impress them! Good luck with the surprise! 💪</p><div style="margin-top: 20px;"><p style="color: #ff9800; font-weight: bold; font-size: 14px;">Happy Surprising! 🚀</p></div></div></div>`,
    });

    if (response.error) {
      console.error("Resend error:", response.error);
      return NextResponse.json(
        { success: false, error: response.error },
        { status: 500 }
      );
    }

    console.log("Email sent successfully:", response.data);

    return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully!",
        messageId: response.data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
