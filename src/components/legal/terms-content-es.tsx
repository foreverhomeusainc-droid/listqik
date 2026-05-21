import Link from "next/link";

/** Términos y condiciones de uso del sitio web de ListQik.com */
export function TermsContentEs() {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-white/85">
      <p className="text-muted">
        Estos Términos y condiciones de uso del sitio web (&ldquo;Términos&rdquo;) rigen su acceso y
        uso de ListQik.com (el &ldquo;Sitio&rdquo;), operado en conexión con servicios de publicación
        de viviendas de tarifa plana proporcionados a través de{" "}
        <strong className="text-white/90">Resolution Realty Group</strong> y su corretaje afiliado
        en Texas, <strong className="text-white/90">Central Metro Realty</strong>. Al acceder o
        usar el Sitio, usted acepta estos Términos y todas las leyes y regulaciones federales,
        estatales y locales aplicables. Si no está de acuerdo, no use el Sitio.
      </p>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">1. Aceptación de los términos</h2>
        <p>
          Al visitar el Sitio, crear una cuenta, comprar un plan, cargar contenido o usar cualquier
          panel o herramienta de publicación, usted declara que tiene al menos 18 años y capacidad
          legal para aceptar estos Términos. Estos Términos se aplican a todos los visitantes,
          vendedores y usuarios autorizados del Sitio.
        </p>
        <p>
          También pueden aplicarse acuerdos separados a su transacción, incluido el{" "}
          <Link href="/listing-agreement" className="text-emerald-300 underline underline-offset-2">
            Acuerdo de usuario de ListQik
          </Link>
          , reconocimientos de configuración del listado, divulgaciones de corretaje de Texas y
          reglas de MLS. Si hay conflicto entre estos Términos y un acuerdo firmado de corretaje o
          de listado, el acuerdo firmado controla para esa transacción.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">2. Naturaleza del servicio</h2>
        <p>
          ListQik.com proporciona herramientas de marketing, tecnología y flujo de trabajo para
          ayudar a los vendedores de viviendas en Texas a trabajar con un corretaje de bienes raíces
          con licencia. ListQik.com no es en sí un corretaje de bienes raíces. Los servicios de
          corretaje, cuando se proporcionan, son ofrecidos por Central Metro Realty y licenciatarios
          afiliados de conformidad con la ley de Texas y las reglas de MLS aplicables.
        </p>
        <p>
          La información en el Sitio es para fines educativos y operativos generales. No constituye
          asesoría legal, fiscal o de inversión. Usted es responsable de la exactitud de la
          información que envía y del cumplimiento de los requisitos de TREC, reglas de MLS, leyes
          de vivienda justa y ordenanzas locales.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">3. Licencia limitada de uso del sitio</h2>
        <p>
          Le otorgamos una licencia limitada, no exclusiva, intransferible y revocable para
          acceder y usar el Sitio para su uso personal o comercial interno en conexión con una
          publicación o compra legítima a través de nuestra plataforma. Esta licencia no transfiere
          la propiedad de ningún material del Sitio. Bajo esta licencia, usted no puede:
        </p>
        <ul className="list-disc space-y-1 pl-5 text-white/80 marker:text-emerald-300/70">
          <li>
            Copiar, modificar, distribuir o crear obras derivadas del contenido del Sitio, salvo lo
            expresamente permitido;
          </li>
          <li>
            Usar el Sitio o sus materiales para cualquier fin ilícito o en violación de reglas de
            MLS o del corretaje;
          </li>
          <li>
            Extraer, rastrear o recolectar datos del Sitio por medios automatizados sin nuestro
            consentimiento por escrito;
          </li>
          <li>
            Intentar descompilar, realizar ingeniería inversa o extraer código fuente de cualquier
            software del Sitio;
          </li>
          <li>Eliminar avisos de derechos de autor, marcas u otros avisos de propiedad;</li>
          <li>
            Transferir credenciales de acceso o reflejar el contenido del Sitio en otro servidor sin
            autorización.
          </li>
        </ul>
        <p>
          Esta licencia termina automáticamente si viola estas restricciones y puede ser terminada
          por nosotros en cualquier momento. Tras la terminación, debe dejar de usar el Sitio y
          destruir cualquier material descargado en violación de estos Términos.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">4. Cuentas y seguridad</h2>
        <p>
          Usted es responsable de mantener la confidencialidad de sus credenciales de acceso y de
          toda la actividad bajo su cuenta. Notifíquenos de inmediato a{" "}
          <a
            href="mailto:concierge@listqik.com"
            className="text-emerald-300 underline underline-offset-2"
          >
            concierge@listqik.com
          </a>{" "}
          si sospecha acceso no autorizado. Podemos suspender o terminar cuentas que parezcan
          comprometidas, fraudulentas o en violación de estos Términos.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">
          5. Contenido del usuario y cargas de fotos
        </h2>
        <p>
          Usted conserva la propiedad de fotos, documentos y otro contenido que cargue
          (&ldquo;Contenido del usuario&rdquo;). Al cargar Contenido del usuario, otorga a
          ListQik.com, Resolution Realty Group y Central Metro Realty una licencia no exclusiva para
          alojar, mostrar, reproducir y distribuir ese contenido según sea necesario para operar su
          listado, sindicar a plataformas permitidas y cumplir con requisitos de MLS y del
          corretaje.
        </p>
        <p>Usted declara y garantiza que su Contenido del usuario:</p>
        <ul className="list-disc space-y-1 pl-5 text-white/80 marker:text-emerald-300/70">
          <li>Es exacto y tiene derecho a usarlo y publicarlo;</li>
          <li>No infringe derechos de propiedad intelectual o privacidad de terceros;</li>
          <li>
            Cumple con la ley de Texas, reglas de fotos de MLS y nuestros requisitos de configuración
            del listado (incluidas fotos exteriores primero, sin personas/mascotas en fotos de
            marketing cuando se requiera, y sin marcas no autorizadas);
          </li>
          <li>No contiene material ilícito, engañoso, discriminatorio u ofensivo.</li>
        </ul>
        <p>
          Nos reservamos el derecho de eliminar, rechazar o editar cualquier imagen o archivo que
          sea inapropiado, no cumpla con requisitos estatales o de MLS, esté mal etiquetado o sea
          necesario para proteger a usuarios, al corretaje o a la plataforma. La eliminación de
          contenido no le da derecho a reembolso, salvo lo exigido por la ley aplicable o sus
          términos de compra.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">6. Pagos y servicios de terceros</h2>
        <p>
          Las tarifas de planes, mejoras y cargos relacionados se procesan a través de proveedores
          de pago externos. Su uso de esos servicios puede estar sujeto a los términos del
          proveedor. No almacenamos números completos de tarjetas de pago en nuestros servidores.
          Las políticas de reembolso y cancelación, si las hay, se describen al pagar o en su
          confirmación de pedido.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">7. Exención de garantías</h2>
        <p>
          EL SITIO Y TODOS LOS MATERIALES SE PROPORCIONAN &ldquo;TAL CUAL&rdquo; Y &ldquo;SEGÚN
          DISPONIBILIDAD&rdquo;. EN LA máxima medida permitida por la ley, LISTQIK.COM, RESOLUTION
          REALTY GROUP, CENTRAL METRO REALTY Y SUS FUNCIONARIOS, AGENTES Y PROVEEDORES RENUNCIAN A
          TODAS LAS GARANTÍAS, EXPRESAS O IMPLÍCITAS, INCLUIDAS COMERCIABILIDAD, IDONEIDAD PARA UN
          FIN PARTICULAR Y NO INFRACCIÓN.
        </p>
        <p>
          No garantizamos que el Sitio sea ininterrumpido, libre de errores o de componentes
          dañinos, ni que los resultados del listado, visitas, ofertas o resultados de venta
          cumplan sus expectativas. La participación en MLS, tiempos de sindicación y condiciones
          del mercado están fuera de nuestro control.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">8. Limitación de responsabilidad</h2>
        <p>
          EN LA máxima medida permitida por la ley, NI LISTQIK.COM, RESOLUTION REALTY GROUP,
          CENTRAL METRO REALTY NI SUS PROVEEDORES SERÁN RESPONSABLES POR DAÑOS INDIRECTOS,
          INCIDENTALES, ESPECIALES, CONSECUENTES O PUNITIVOS, NI POR PÉRDIDA DE GANANCIAS, DATOS,
          BUENA VOLUNTAD O INTERRUPCIÓN DEL NEGOCIO, DERIVADOS DE SU USO O INCAPACIDAD DE USAR EL
          SITIO, INCLUSO SI HEMOS SIDO ADVERTIDOS DE LA POSIBILIDAD DE DICHOS DAÑOS.
        </p>
        <p>
          NUESTRA RESPONSABILIDAD TOTAL POR CUALQUIER RECLAMACIÓN DERIVADA DE ESTOS TÉRMINOS O SU USO
          DEL SITIO NO EXCEDERÁ EL MAYOR DE (A) LOS MONTOS QUE USTED NOS PAGÓ POR EL SERVICIO QUE
          DIO LUGAR AL RECLAMO EN LOS DOCE (12) MESES ANTERIORES AL RECLAMO, O (B) CIEN DÓLARES
          ESTADOUNIDENSES ($100).
        </p>
        <p className="text-white/70">
          Algunas jurisdicciones no permiten ciertas exenciones de garantía o limitaciones de
          responsabilidad; en esas jurisdicciones, nuestra responsabilidad se limita al máximo
          permitido por la ley.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">9. Revisiones y erratas</h2>
        <p>
          Los materiales del Sitio pueden incluir errores técnicos, tipográficos o fotográficos.
          Podemos cambiar el contenido, las funciones o los precios del Sitio en cualquier momento
          sin previo aviso. No nos comprometemos a actualizar todos los materiales en un calendario
          particular, pero podemos revisar estos Términos de vez en cuando publicando una versión
          actualizada en esta página.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">10. Enlaces a otros sitios</h2>
        <p>
          El Sitio puede enlazar a sitios web de terceros (incluidos portales MLS, procesadores de
          pago y herramientas de socios). No hemos revisado todos los sitios enlazados y no somos
          responsables de su contenido o prácticas. La inclusión de un enlace no implica respaldo.
          Su uso de sitios enlazados es bajo su propio riesgo.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">11. Modificaciones a estos Términos</h2>
        <p>
          Podemos revisar estos Términos en cualquier momento publicando la versión actualizada en
          esta página y actualizando la fecha de &ldquo;Actualizado&rdquo; arriba. Su uso
          continuado del Sitio después de que los cambios entren en vigor constituye la aceptación
          de los Términos revisados.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">12. Ley aplicable</h2>
        <p>
          Estos Términos se rigen por las leyes del Estado de Texas, sin considerar principios de
          conflicto de leyes. Usted acepta que el foro exclusivo para disputas derivadas de estos
          Términos o del Sitio serán los tribunales estatales o federales ubicados en Texas, y
          consiente la jurisdicción personal en esos tribunales.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">13. Privacidad</h2>
        <p>
          Nuestra recopilación y uso de información personal se describe en nuestra{" "}
          <Link
            href="/resources/legal/privacy?lang=es"
            className="text-emerald-300 underline underline-offset-2"
          >
            Política de privacidad
          </Link>
          , incorporada a estos Términos por referencia.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">14. Contacto</h2>
        <p>
          Las preguntas sobre estos Términos pueden dirigirse a{" "}
          <a
            href="mailto:concierge@listqik.com"
            className="text-emerald-300 underline underline-offset-2"
          >
            concierge@listqik.com
          </a>
          .
        </p>
      </section>

      <p className="border-t border-white/10 pt-4 text-xs text-white/50">
        Este documento se proporciona para transparencia operativa. No sustituye el asesoramiento de
        su abogado. Consulte a su asesor legal antes de confiar en él para decisiones de
        cumplimiento.
      </p>
    </div>
  );
}
