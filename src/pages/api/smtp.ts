import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import type { Attachment } from 'nodemailer/lib/mailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let formData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error('Error parsing form data:', error);
    return new Response(
      JSON.stringify({ 
        message: 'Error parsing form data',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  const attachments: Attachment[] = [];

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const message = formData.get('message') as string;

  try {
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('attachment') && value instanceof File) {
        const buffer = Buffer.from(await value.arrayBuffer());
        attachments.push({
          filename: value.name,
          content: buffer
        });
      }
    }
  } catch (error) {
    console.error('Error processing attachments:', error);
    return new Response(
      JSON.stringify({ 
        message: 'Error processing attachments',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'seg.smtp.business@gmail.com',
      pass: 'qzqlinuhkdcehlmx'
    },
  });

  try {
    await transporter.sendMail({
      from: '"SEG - Assessoria Veicular" <seg.smtp.business@gmail.com>',
      to: "gstvbeniniduarte@gmail.com",
      subject: "Nova Requisição de Orçamento",
      text: `
        Nome: ${name || 'N/A'}
        Email: ${email || 'N/A'}
        Contato: ${phone || 'N/A'}
        Mensagem: ${message || 'N/A'}
        ${attachments.length > 0 ? `\nAnexos: ${attachments.length} arquivo(s)` : ''}
      `,
      html: `
        <h1>Nova Requisição de Orçamento</h1>
        <p><strong>Nome:</strong> ${name || 'N/A'}</p>
        <p><strong>Email:</strong> ${email || 'N/A'}</p>
        <p><strong>Contato:</strong> ${phone || 'N/A'}</p>
        <p><strong>Mensagem:</strong> ${message || 'N/A'}</p>
        ${attachments.length > 0 ? `<p><strong>Anexos:</strong> ${attachments.length} arquivo(s)</p>` : ''}
      `,
      attachments: attachments
    });

    return new Response(
      JSON.stringify({ message: 'Email enviado com sucesso' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ 
        message: 'Error sending email',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};