import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { animations } from '../../lib/design-system'

export const Route = createFileRoute('/_public/privacy-policy')({
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen bg-deep-space selection:bg-electric-violet/30 selection:text-white overflow-x-hidden pt-20">
      <div className="absolute inset-0 mesh-gradient opacity-10 pointer-events-none fixed" />
      <div className="absolute inset-0 bg-grainy fixed" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 pb-32">

        <header className="mb-20 text-center">
          <motion.div
            variants={animations.fadeIn}
            initial="initial"
            animate="animate"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-electric-violet mb-8 uppercase tracking-wider"
          >
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-violet"></span>
            </span>
            Legal
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-display font-bold leading-[1.1] tracking-tighter mb-8"
          >
            Política de Privacidad
          </motion.h1>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-electric-violet prose-a:no-underline hover:prose-a:underline"
        >
          <p className="lead text-xl text-white/60">
            AI Dev Peru es una comunidad sin fines de lucro. Los datos que recolectemos no serán utilizados con fines lucrativos.
          </p><br />

          <p>
            Este aviso de privacidad le informa qué esperar cuando recopilamos información personal. Se aplica a la información que recopilamos sobre:
          </p><br />
          <ul className="list-disc pl-6 space-y-2 marker:text-electric-violet">
            <li><a href="#website" className="text-white hover:text-electric-violet transition-colors underline decoration-white/20 hover:decoration-electric-violet underline-offset-4">Visitantes a nuestros sitios web</a></li>
            <li><a href="#attendees" className="text-white hover:text-electric-violet transition-colors underline decoration-white/20 hover:decoration-electric-violet underline-offset-4">Personas que se registran y asisten a nuestros eventos</a></li>
            <li><a href="#speakers" className="text-white hover:text-electric-violet transition-colors underline decoration-white/20 hover:decoration-electric-violet underline-offset-4">Personas que dan charlas en uno de nuestros eventos</a></li>
            <li><a href="#sponsors" className="text-white hover:text-electric-violet transition-colors underline decoration-white/20 hover:decoration-electric-violet underline-offset-4">Personas que son socios o patrocinadores</a></li>
          </ul>

          <h2 id="website" className="scroll-mt-32 text-3xl text-white mt-16 mb-6"><span className="font-bold text-electric-violet">▮</span> Visitantes a nuestros sitios web</h2>
          <p>
            Cuando alguien visita uno de nuestros sitios web, almacenamos información del registro del servidor web, que incluye información como la dirección IP desde la que se conectó, el agente de usuario de su navegador y la página que solicitó. Utilizamos esta información para monitorear la seguridad, el rendimiento y la salud de nuestros sistemas. Todos nuestros sitios web están protegidos por TLS. Esto significa que su conexión a nuestros sitios web está encriptada.
          </p>

          <h2 id="attendees" className="scroll-mt-32 text-3xl text-white mt-16 mb-6"><span className="font-bold text-electric-violet">▮</span> Personas que se registran y asisten a nuestros eventos</h2>
          <p>
            Si se ha registrado para nuestros eventos, almacenamos la información personal sobre usted, que fue proporcionada por usted o por alguien de su organización que nos dio permiso para proporcionarnos esta información.
          </p>
          <p>
            Esta información incluye su nombre completo, dirección de correo electrónico, y documento de identidad, que requerimos para otorgarle acceso a los eventos. Se puede solicitar información adicional asociada con su boleto, pero no es obligatorio. Esto incluye el cargo, el nombre de la empresa, entre otros. Solicitamos la información adicional opcional porque nos ayuda a comprender mejor el perfil de nuestros asistentes y garantizar que la experiencia general del evento sea relevante para nuestra audiencia.
          </p>
          <p>
            También podemos usar su información de contacto, incluido el correo electrónico y el número de teléfono, para comunicarnos con usted con información importante relacionada con el evento o en caso de emergencias.
          </p>
          <p>
            Es posible que se tome su fotografía durante el evento y se publique en nuestras redes sociales y canales de marketing. Hágale saber al equipo organizador si no desea que le tomen una foto durante el evento.
          </p>

          <h2 id="speakers" className="scroll-mt-32 text-3xl text-white mt-16 mb-6"><span className="font-bold text-electric-violet">▮</span> Personas que dan charlas en uno de nuestros eventos</h2>
          <p>
            Cuando habla en uno de nuestros eventos, necesitamos cierta información personal para comunicarnos con usted, organizar viajes y alojamiento o garantizar otros detalles prácticos relacionados con su participación en nuestro evento.
          </p>
          <p>
            Esta información incluye su nombre completo, correo electrónico, número de teléfono y país de residencia. Podemos compartir esta información con terceros cuando sea necesario para cumplir con nuestro acuerdo con usted (ej. hoteles).
          </p>
          <p>
            También necesitamos información para publicar y promocionar su charla en nuestro sitio web. Esta información incluye su nombre, nombre de la empresa, foto de perfil, biografía, enlaces a redes sociales, así como el título y la descripción de la charla.
          </p>
          <p>
            Si la logística lo permite, también podemos grabar su charla y recopilar sus diapositivas para publicarlas en nuestro sitio web o canal de YouTube.
          </p>

          <h2 id="sponsors" className="scroll-mt-32 text-3xl text-white mt-16 mb-6"><span className="font-bold text-electric-violet">▮</span> Personas que son socios o patrocinadores</h2>
          <p>
            Cuando firma como socio o patrocinador de nuestros eventos, recopilamos información en forma de datos de facturación para emitir su factura según los términos del acuerdo de asociación. Esta información incluye nombre, correo electrónico, nombre de la empresa, dirección de la empresa, número de teléfono y RUC.
          </p>

          <div className="mt-20 p-8 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-2xl text-white mt-0 mb-6">Sus derechos</h2>
            <h3 className="text-xl text-white/80 mb-4">Quejas o consultas</h3>
            <p>
              Estamos comprometidos a utilizar las mejores prácticas para garantizar nuestra responsabilidad al recopilar y utilizar información personal. Si cree que nuestra recopilación y uso de datos es injusto, engañoso o inapropiado, lo alentamos a comunicarse con nosotros.
            </p>

            <h3 className="text-xl text-white/80 mt-8 mb-4">Acceso a sus datos</h3>
            <p>
              Tiene derecho a saber qué información almacenamos y procesamos sobre usted, de dónde proviene, para qué la usamos y con quién la compartimos. Tiene derecho a que se corrija o elimine la información incorrecta o incompleta sobre usted.
            </p>
          </div>

        </motion.div>
      </div>
    </main>
  )
}
