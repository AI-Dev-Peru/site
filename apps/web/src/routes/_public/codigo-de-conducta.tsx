import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { animations } from '../../lib/design-system'

export const Route = createFileRoute('/_public/codigo-de-conducta')({
    component: CodeOfConductPage,
})

function CodeOfConductPage() {
    return (
        <main className="relative min-h-screen bg-deep-space selection:bg-electric-violet/30 selection:text-white overflow-x-hidden pt-20">
            <div className="absolute inset-0 mesh-gradient opacity-10 pointer-events-none fixed" />
            <div className="absolute inset-0 bg-grainy fixed" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 pb-32">

                <header className="mb-24 text-center">
                    <motion.div
                        variants={animations.fadeIn}
                        initial="initial"
                        animate="animate"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-electric-violet mb-8 uppercase tracking-wider"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-violet"></span>
                        </span>
                        Comunidad
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-7xl font-display font-bold leading-[1.1] tracking-tighter mb-8"
                    >
                        Código de Conducta
                    </motion.h1>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="prose prose-invert prose-lg max-w-none 
                    prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-6
                    prose-li:text-white/70 prose-li:marker:text-electric-violet
                    prose-a:text-white prose-a:font-medium prose-a:decoration-white/30 prose-a:underline-offset-4 hover:prose-a:text-electric-violet hover:prose-a:decoration-electric-violet prose-a:transition-colors"
                >
                    <p className="lead text-xl md:text-2xl text-white font-medium mb-16 max-w-3xl mx-auto text-center">
                        AI Dev Perú busca proporcionar una experiencia de comunidad libre de acoso para todos. Cualquier persona que participe en nuestros espacios debe respetar nuestro Código de Conducta.
                    </p>

                    <h2 id="purpose" className="text-3xl md:text-4xl font-display font-bold text-white mt-16 mb-8">Propósito de este documento</h2>
                    <p>
                        En nuestros eventos y canales digitales, queremos dar una experiencia libre de acoso para todos aquellos quienes participen, independientemente de su sexo, orientación sexual, discapacidad, apariencia física, tipo de cuerpo, etapa profesional, raza o religión.
                    </p>
                    <p>
                        No toleraremos el acoso de las y los participantes de la comunidad de ninguna forma. El lenguaje y las imágenes sexuales no son apropiadas durante ningún momento; incluyendo charlas, talleres, fiestas, y redes sociales.
                    </p>
                    <p>
                        Los participantes que violen estas reglas podrán ser expulsados del evento o comunidad a criterio de las y los organizadores.
                    </p>

                    <h2 id="harassment" className="text-3xl md:text-4xl font-display font-bold text-white mt-16 mb-8">Definición de Acoso</h2>
                    <ul className="list-disc pl-6 space-y-3 mb-8">
                        <li>Comentarios verbales o escritos que refuercen estructuras sociales de dominación relacionadas al género, identidad y expresión de género, orientación sexual, discapacidad, apariencia física, tipo de cuerpo, raza, edad o religión.</li>
                        <li>Imágenes sexuales en espacios públicos o digitales.</li>
                        <li>Intimidación deliberada, acoso o seguimiento.</li>
                        <li>Acoso con fotografías o videos.</li>
                        <li>Interrupciones constantes durante las conversaciones u otros eventos.</li>
                        <li>Contacto físico inapropiado.</li>
                        <li>Atención sexual no deseada.</li>
                        <li>Abogar por, o alentar a alguna de las conductas anteriormente mencionadas.</li>
                    </ul>

                    <h2 id="reporting" className="text-3xl md:text-4xl font-display font-bold text-white mt-16 mb-8">Reportes</h2>
                    <p>
                        Si alguien te hace sentir a ti o a alguien más inseguro o incómodo, por favor repórtalo tan pronto como te sea posible. Si ves u oyes a alguien hacer algo que viole este código de conducta, por favor háznoslo saber.
                    </p>
                    <p>
                        Puedes hacer tu reporte escribiendo directamente a nuestro correo oficial: <a href="mailto:ai.dev.peru@gmail.com">ai.dev.peru@gmail.com</a>
                    </p>

                    <h2 id="enforcement" className="text-3xl md:text-4xl font-display font-bold text-white mt-16 mb-8">Cumplimiento</h2>
                    <p>
                        Se espera que a las y los participantes que se les solicite detener cualquier comportamiento de acoso, lo hagan de inmediato.
                    </p>
                    <p>
                        Cualquiera que se involucre en conductas de acoso, las y los organizadores se reservan el derecho a tomar cualquier medida necesaria para mantener el ambiente seguro para todas y todos. Esto incluye advertencias o la expulsión definitiva de la comunidad y sus eventos futuros.
                    </p>


                    <div className="mt-20 p-8 rounded-3xl bg-white/5 border border-white/10">
                        <h2 className="text-2xl font-display font-bold text-white mt-0 mb-4">¿Necesitas ayuda?</h2>
                        <p className="mb-6 text-white/60">
                            El staff estará encantado de ayudar a los participantes a sentirse seguros.
                        </p>
                        <ul className="list-none pl-0 space-y-4 m-0">
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-electric-violet"></span>
                                <span className="text-white/80">Correo: <a href="mailto:ai.dev.peru@gmail.com" className="font-bold text-white">ai.dev.peru@gmail.com</a></span>
                            </li>
                        </ul>
                    </div>

                </motion.div>
            </div>
        </main>
    )
}
