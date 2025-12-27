import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProposalPayload {
    type: 'INSERT';
    table: string;
    record: {
        id: string;
        full_name: string;
        email: string;
        phone: string;
        title: string;
        description: string;
        duration: '15' | '30';
        created_at: string;
    };
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload: ProposalPayload = await req.json()

        // Get configuration from environment
        const resendApiKey = Deno.env.get('RESEND_API_KEY');
        const notificationEmail = Deno.env.get('NOTIFICATION_EMAIL');

        if (!resendApiKey || !notificationEmail) {
            throw new Error('Missing configuration. Please set RESEND_API_KEY and NOTIFICATION_EMAIL secrets.');
        }

        const { record } = payload;

        // Format email content
        const emailBody = `
Nueva Propuesta de Charla Recibida

Detalles de la propuesta:

Nombre: ${record.full_name}
Email: ${record.email}
Teléfono: ${record.phone}

Título de la charla: ${record.title}

Descripción:
${record.description}

Duración: ${record.duration} minutos

---
Fecha de envío: ${new Date(record.created_at).toLocaleString('es-PE', { timeZone: 'America/Lima' })}

Para revisar esta propuesta, ingresa al panel de administración:
https://ai.devperu.org/internal/proposals
`;

        // Send email via Resend API
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'AI Dev Peru <notifications@resend.dev>',
                to: [notificationEmail],
                subject: `🎤 Nueva Propuesta: ${record.title}`,
                text: emailBody,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Resend API error: ${errorData}`);
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Email sent successfully' }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            },
        )
    } catch (error) {
        console.error('Error sending email:', error);

        return new Response(
            JSON.stringify({ success: false, error: (error as Error).message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
            },
        )
    }
})

