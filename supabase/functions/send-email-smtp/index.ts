import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface TrialClassData {
  nomeAtleta: string;
  idadeAtleta: string;
  email: string;
  telefone: string;
  interesse: string;
  nomeEncarregado?: string;
}

type EmailRequest = 
  | { type: "contact"; data: ContactData }
  | { type: "trial-class"; data: TrialClassData };

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = Deno.env.get("SMTP_PORT");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error("Missing SMTP configuration");
      return new Response(
        JSON.stringify({ error: "Configuração SMTP em falta" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Creating SMTP transporter with host:", smtpHost, "port:", smtpPort);

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const { type, data }: EmailRequest = await req.json();

    let subject: string;
    let html: string;

    if (type === "contact") {
      const contactData = data as ContactData;
      subject = `Nova mensagem de contacto - ${contactData.subject}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d4af37, #f4d03f); padding: 20px; border-radius: 8px 8px 0 0; }
            .header h1 { color: #1a1a1a; margin: 0; font-size: 24px; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; }
            .message-box { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #d4af37; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 Nova Mensagem de Contacto</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Nome:</div>
                <div class="value">${contactData.name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${contactData.email}">${contactData.email}</a></div>
              </div>
              <div class="field">
                <div class="label">Telefone:</div>
                <div class="value">${contactData.phone || "Não fornecido"}</div>
              </div>
              <div class="field">
                <div class="label">Assunto:</div>
                <div class="value">${contactData.subject}</div>
              </div>
              <div class="field">
                <div class="label">Mensagem:</div>
                <div class="message-box">${contactData.message.replace(/\n/g, "<br>")}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === "trial-class") {
      const trialData = data as TrialClassData;
      const interesseLabel = {
        "ginastica": "Ginástica",
        "aulas-grupo": "Aulas de grupo",
        "treino-personalizado": "Treino personalizado"
      }[trialData.interesse] || trialData.interesse;

      subject = `Novo pedido de Aula Experimental - ${trialData.nomeAtleta}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d4af37, #f4d03f); padding: 20px; border-radius: 8px 8px 0 0; }
            .header h1 { color: #1a1a1a; margin: 0; font-size: 24px; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; }
            .highlight { background: #fff3cd; padding: 10px; border-radius: 8px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Novo Pedido de Aula Experimental</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Nome do Atleta:</div>
                <div class="value">${trialData.nomeAtleta}</div>
              </div>
              <div class="field">
                <div class="label">Idade:</div>
                <div class="value">${trialData.idadeAtleta} anos</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${trialData.email}">${trialData.email}</a></div>
              </div>
              <div class="field">
                <div class="label">Telefone:</div>
                <div class="value">${trialData.telefone || "Não fornecido"}</div>
              </div>
              <div class="highlight">
                <div class="label">Interesse:</div>
                <div class="value"><strong>${interesseLabel}</strong></div>
              </div>
              ${trialData.nomeEncarregado ? `
              <div class="field" style="margin-top: 15px;">
                <div class="label">Encarregado de Educação:</div>
                <div class="value">${trialData.nomeEncarregado}</div>
              </div>
              ` : ""}
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      return new Response(
        JSON.stringify({ error: "Tipo de email inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Sending email with subject:", subject);

    const info = await transporter.sendMail({
      from: smtpUser,
      to: "info@movement-academy.pt",
      subject,
      html,
    });

    console.log("Email sent successfully:", info.messageId);

    return new Response(
      JSON.stringify({ success: true, messageId: info.messageId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro ao enviar email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
