import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VirtualizationConcepts } from './virtualization-concepts'
import { SegmentationConcepts } from './segmentation-concepts'
import { MemoryProtectionConcepts } from './protection-concepts'
import { ConsistencyModels } from './consistency-models'
import { MemoryOptimizationConcepts } from './optimization-concepts'
import { MemoryCompressionConcepts } from './compression-concepts'
import { SideChannelConcepts } from './side-channel-concepts'
import { MemoryEncryptionConcepts } from './encryption-concepts'
import { ControlFlowIntegrityConcepts } from './control-flow-integrity'
import { MemoryMappingConcepts } from './mapping-concepts'
import { MemoryBarrierConcepts } from './barrier-concepts'
import { NUMAConcepts } from './numa-concepts'
import { MemoryBandwidthConcepts } from './bandwidth-concepts'
import { PrefetchingConcepts } from './prefetching-concepts'
import { CacheReplacementConcepts } from './replacement-concepts'
import { SideChannelAttacks } from './side-channel-attacks'
import { SpectreMeltdownConcepts } from './spectre-meltdown-concepts'
import { RowhammerConcepts } from './rowhammer-concepts'
import { AnimatedHomePage } from './animated-home-page'

interface MemoryConceptProps {
  concept: string
}

export function MemoryConcept({ concept }: MemoryConceptProps) {
  const renderConcept = () => {
    switch (concept) {
      case 'virtualization':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VirtualizationConcepts
              concepts={[
                {
                  technique: "paging",
                  name: "Paginación",
                  description: "La paginación es una técnica que divide la memoria en bloques fijos llamados páginas. Es como dividir un libro en capítulos de igual longitud. Esto facilita la gestión de la memoria y permite que los programas usen más memoria de la disponible físicamente.",
                  benefits: [
                    "Permite usar más memoria virtual que física",
                    "Simplifica la gestión de memoria",
                    "Protege programas entre sí",
                    "Facilita el intercambio de memoria (swapping)"
                  ],
                  challenges: [
                    "Sobrecarga de traducción de direcciones",
                    "Fragmentación de memoria",
                    "Complejidad en sistemas grandes",
                    "Penalización por fallos de página"
                  ],
                  technicalDetails: "La paginación utiliza una unidad de gestión de memoria (MMU) para traducir direcciones virtuales en físicas mediante tablas de páginas. Cada entrada en la tabla contiene información como el marco físico, bits de presencia, permisos de acceso y bits de control. La jerarquía de tablas permite manejar espacios de direcciones grandes con bajo overhead de memoria.",
                  examples: [
                    "Sistemas operativos modernos como Linux y Windows utilizan paginación de 4KB",
                    "Las páginas pueden tener diferentes tamaños (4KB, 2MB, 1GB) para optimizar el uso de memoria",
                    "Las páginas grandes (huge pages) reducen la sobrecarga de TLB en aplicaciones intensivas en memoria"
                  ]
                },
                {
                  technique: "segmentation",
                  name: "Segmentación",
                  description: "La segmentación divide la memoria en segmentos de diferentes tamaños según su propósito (código, datos, pila). Es como tener diferentes secciones en una biblioteca: una para ficción, otra para no ficción, etc.",
                  benefits: [
                    "Refleja la estructura lógica de los programas",
                    "Permite compartir segmentos entre procesos",
                    "Protección basada en segmentos",
                    "Facilita el crecimiento dinámico"
                  ],
                  challenges: [
                    "Fragmentación externa",
                    "Complejidad en la gestión",
                    "Dificultad para compartir memoria",
                    "Requiere más registros de hardware"
                  ],
                  technicalDetails: "Cada segmento tiene un descriptor que incluye la dirección base, límite, tipo (código/datos), permisos (lectura/escritura/ejecución) y bits de presencia. El procesador verifica que las direcciones estén dentro de los límites del segmento y que los accesos sean válidos según los permisos.",
                  examples: [
                    "Arquitectura x86 históricamente utilizaba segmentación en modo real",
                    "Los sistemas operativos pueden usar segmentación para proteger diferentes secciones de código",
                    "La segmentación facilita el compartir bibliotecas entre procesos"
                  ]
                },
                {
                  technique: "translation",
                  name: "Traducción de Direcciones",
                  description: "La traducción de direcciones convierte direcciones virtuales (usadas por los programas) en direcciones físicas (reales en la memoria). Es como tener una guía telefónica que convierte nombres en números de teléfono.",
                  benefits: [
                    "Permite direcciones virtuales más simples",
                    "Protección entre procesos",
                    "Uso eficiente de memoria física",
                    "Soporte para memoria virtual"
                  ],
                  challenges: [
                    "Tiempo de traducción adicional",
                    "Complejidad del mecanismo",
                    "Requiere estructuras de datos especiales",
                    "Posibles fallos de traducción"
                  ],
                  technicalDetails: "La traducción involucra la MMU, TLB (Translation Lookaside Buffer) y tablas de páginas. Las direcciones virtuales se dividen en campos que indexan diferentes niveles de tablas de páginas. El TLB almacena las traducciones más recientes para acelerar el acceso. Las fallas de página ocurren cuando una página no está en memoria física.",
                  examples: [
                    "En arquitecturas x86-64, la traducción puede requerir hasta 5 niveles de tablas de páginas",
                    "El TLB puede contener cientos o miles de entradas para acelerar la traducción",
                    "Las fallas de página permiten implementar memoria virtual y swapping"
                  ]
                },
                {
                  technique: "protection",
                  name: "Protección de Memoria",
                  description: "La protección de memoria evita que un programa acceda a la memoria de otro programa o del sistema operativo. Es como tener cerraduras en las puertas de habitaciones de hotel para que los huéspedes no entren donde no deben.",
                  benefits: [
                    "Seguridad entre procesos",
                    "Prevención de fallos del sistema",
                    "Protección de datos sensibles",
                    "Estabilidad del sistema"
                  ],
                  challenges: [
                    "Sobrecarga de verificación",
                    "Complejidad en implementación",
                    "Posibles falsos positivos",
                    "Impacto en el rendimiento"
                  ],
                  technicalDetails: "Los bits de protección en las tablas de páginas controlan permisos de lectura, escritura y ejecución. El modo de CPU (usuario/kernel) determina qué operaciones están permitidas. Mecanismos como NX (No-eXecute) previenen la ejecución de código en regiones de datos. Las violaciones de protección generan excepciones que el sistema operativo maneja.",
                  examples: [
                    "El bit NX en procesadores modernos previene la ejecución de código en la pila",
                    "ASLR (Address Space Layout Randomization) dificulta explotar vulnerabilidades",
                    "Stack canaries detectan desbordamientos de búfer antes de que causen daño"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      case 'segmentation':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SegmentationConcepts
              concepts={[
                {
                  technique: "baseLimit",
                  name: "Segmentos Base-Límite",
                  description: "Cada segmento tiene una dirección base (inicio) y un límite (tamaño). Es como definir una habitación diciendo 'comienza en el metro 10 y tiene 20 metros de largo'.",
                  implementation: "Se usan registros de procesador para almacenar base y límite de cada segmento",
                  advantages: [
                    "Protección simple y eficiente",
                    "Facilidad para cambiar el tamaño",
                    "Compartir segmentos entre procesos",
                    "Soporte para crecimiento dinámico"
                  ],
                  disadvantages: [
                    "Fragmentación externa",
                    "Dificultad para encontrar espacio libre",
                    "Complejidad en la gestión",
                    "Requiere compactación periódica"
                  ],
                  technicalDetails: "Los descriptores de segmento contienen campos para base (dirección física de inicio), límite (tamaño del segmento), tipo (código/datos), permisos (lectura/escritura/ejecución), y bits de presencia. El procesador verifica que cada acceso esté dentro de los límites del segmento antes de permitirlo.",
                  examples: [
                    "En arquitectura x86, los descriptores de segmento se almacenan en la GDT (Global Descriptor Table)",
                    "Los segmentos pueden crecer dinámicamente hasta su límite máximo",
                    "Los segmentos pueden tener diferentes permisos (RO, RW, RX) para seguridad"
                  ]
                },
                {
                  technique: "shared",
                  name: "Segmentos Compartidos",
                  description: "Varios procesos pueden acceder al mismo segmento de memoria. Es como compartir una biblioteca común entre varios vecinos.",
                  implementation: "Se asigna el mismo base-límite a múltiples procesos",
                  advantages: [
                    "Ahorro de memoria",
                    "Comunicación eficiente entre procesos",
                    "Actualizaciones globales",
                    "Reducción de duplicados"
                  ],
                  disadvantages: [
                    "Problemas de sincronización",
                    "Riesgo de corrupción de datos",
                    "Dificultad en la gestión de permisos",
                    "Posibles condiciones de carrera"
                  ],
                  technicalDetails: "Los segmentos compartidos requieren mecanismos de sincronización como semáforos o mutex para coordinar el acceso concurrente. Los permisos deben configurarse cuidadosamente para permitir acceso compartido sin comprometer la seguridad. El sistema operativo gestiona la asignación y liberación de segmentos compartidos.",
                  examples: [
                    "Bibliotecas compartidas (DLLs/.so) se implementan con segmentos compartidos",
                    "Memoria compartida entre procesos para comunicación eficiente",
                    "Segmentos de código compartido entre múltiples instancias de un programa"
                  ]
                },
                {
                  technique: "protected",
                  name: "Segmentos Protegidos",
                  description: "Cada segmento tiene permisos específicos (lectura, escritura, ejecución). Es como tener una caja fuerte con diferentes niveles de acceso para diferentes personas.",
                  implementation: "Bits de permisos asociados a cada descriptor de segmento",
                  advantages: [
                    "Seguridad mejorada",
                    "Prevención de errores de programación",
                    "Protección contra malware",
                    "Control fino del acceso"
                  ],
                  disadvantages: [
                    "Complejidad adicional",
                    "Sobrecarga de verificación",
                    "Dificultad en depuración",
                    "Impacto en rendimiento"
                  ],
                  technicalDetails: "Los bits de permiso incluyen R (lectura), W (escritura), X (ejecución), y D (dirección creciente). El procesador verifica estos bits en cada acceso a memoria. Violaciones generan excepciones que el sistema operativo maneja. El modo CPU (usuario/kernel) también afecta los permisos disponibles.",
                  examples: [
                    "La pila típicamente tiene permisos RW pero no X para prevenir ejecución de código",
                    "El código tiene permisos RX pero no W para prevenir modificación",
                    "Los datos tienen permisos RW pero no X para prevenir ejecución accidental"
                  ]
                },
                {
                  technique: "dynamic",
                  name: "Segmentación Dinámica",
                  description: "Los segmentos pueden crecer o encogerse durante la ejecución. Es como una cartera elástica que se adapta al contenido que llevas.",
                  implementation: "Mecanismos de ajuste dinámico con reubicación",
                  advantages: [
                    "Uso eficiente de memoria",
                    "Adaptación a necesidades cambiantes",
                    "Soporte para estructuras de datos dinámicas",
                    "Reducción de fragmentación"
                  ],
                  disadvantages: [
                    "Complejidad de implementación",
                    "Sobrecarga de reubicación",
                    "Posibles interrupciones en ejecución",
                    "Requiere gestión cuidadosa"
                  ],
                  technicalDetails: "La reubicación dinámica requiere actualizar punteros cuando se mueven segmentos. Los segmentos pueden crecer hasta un límite máximo especificado en el descriptor. El sistema operativo puede compactar la memoria para reducir fragmentación externa, aunque esto requiere pausar procesos durante la reubicación.",
                  examples: [
                    "El heap puede crecer dinámicamente según las necesidades del programa",
                    "La pila puede expandirse cuando se necesitan más variables locales",
                    "Arrays dinámicos pueden requerir reubicación cuando crecen más allá del tamaño inicial"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      case 'protection':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MemoryProtectionConcepts
              mechanisms={[
                {
                  mechanism: "nx",
                  name: "Bit No-Ejecutable (NX)",
                  description: "Marca ciertas áreas de memoria como no ejecutables, previniendo que se ejecuten instrucciones en ellas.",
                  howItWorks: "El procesador verifica este bit antes de ejecutar código. Si está activo en una página que se intenta ejecutar, se genera una excepción.",
                  effectiveness: 85,
                  implementation: "Se configura en los descriptores de página del procesador",
                  technicalDetails: "El bit NX (No-eXecute) o XD (eXecute Disable) es un bit en las entradas de la tabla de páginas. Cuando una página está marcada como no ejecutable, cualquier intento de ejecutar código en esa página genera una excepción de violación general de protección. Esto previene ataques que inyectan y ejecutan código shellcode.",
                  examples: [
                    "La pila se marca típicamente como no ejecutable para prevenir desbordamientos de búfer",
                    "Las áreas de datos se marcan como no ejecutables para evitar ejecución accidental",
                    "Los sistemas operativos modernos habilitan NX por defecto para todas las páginas que no contienen código"
                  ]
                },
                {
                  mechanism: "aslr",
                  name: "Aleatorización del Diseño del Espacio de Direcciones (ASLR)",
                  description: "Coloca bibliotecas y segmentos en direcciones aleatorias cada vez que se ejecuta un programa.",
                  howItWorks: "El sistema operativo asigna direcciones de inicio aleatorias para diferentes partes del programa al cargarlo.",
                  effectiveness: 70,
                  implementation: "Realizada por el sistema operativo durante la carga del programa",
                  technicalDetails: "ASLR aleatoriza las direcciones base de la pila, heap, bibliotecas compartidas y código ejecutable. La entropía (grado de aleatorización) varía según la implementación. Los atacantes que dependen de conocer direcciones específicas de memoria encuentran difícil explotar vulnerabilidades.",
                  examples: [
                    "En Linux, ASLR se controla con /proc/sys/kernel/randomize_va_space",
                    "Windows implementa ASLR desde Vista/Server 2008",
                    "Las bibliotecas posicionadas independientemente (PIE) trabajan con ASLR para mayor protección"
                  ]
                },
                {
                  mechanism: "stackCanary",
                  name: "Valores Centinela en Pila (Stack Canary)",
                  description: "Coloca valores especiales en la pila para detectar intentos de desbordamiento.",
                  howItWorks: "Antes de funciones críticas, se colocan valores conocidos. Si cambian al finalizar la función, se detecta un desbordamiento.",
                  effectiveness: 90,
                  implementation: "Insertado automáticamente por el compilador",
                  technicalDetails: "Los stack canaries son valores aleatorios colocados entre las variables locales y la dirección de retorno en la pila. Antes de retornar de una función, se verifica que el canary no haya sido modificado. Si se detecta una modificación, se aborta el programa para prevenir la explotación del desbordamiento.",
                  examples: [
                    "GCC implementa stack canaries con la opción -fstack-protector",
                    "Los valores canary se generan al inicio del programa y se almacenan en una ubicación segura",
                    "Cuando se detecta corrupción, se llama a __stack_chk_fail() que normalmente aborta el programa"
                  ]
                },
                {
                  mechanism: "dep",
                  name: "Prevención de Ejecución de Datos (DEP)",
                  description: "Técnica general que marca áreas de memoria como no ejecutables para prevenir ciertos tipos de ataques.",
                  howItWorks: "Combina hardware (bit NX) y software para marcar regiones de memoria como datos puros.",
                  effectiveness: 80,
                  implementation: "Soportado por el procesador y habilitado por el sistema operativo",
                  technicalDetails: "DEP (Data Execution Prevention) es la implementación de Microsoft del bit NX. Utiliza el bit NX del procesador para marcar páginas como no ejecutables. Las aplicaciones deben compilarse con soporte DEP para beneficiarse completamente. El sistema operativo puede configurar políticas DEP para todo el sistema o por aplicación.",
                  examples: [
                    "Windows XP SP2 introdujo DEP como característica de seguridad",
                    "Las aplicaciones pueden optar por DEP obligatorio o preferencial",
                    "DEP complementa otras técnicas como ASLR y stack canaries"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      case 'consistency':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ConsistencyModels
              models={[
                {
                  model: "SC",
                  name: "Consistencia Secuencial",
                  description: "Las operaciones parecen ejecutarse en un orden global secuencial, como si hubiera un solo procesador ejecutando todo.",
                  characteristics: [
                    "Todas las operaciones de todos los procesadores parecen ejecutarse en un orden secuencial",
                    "El orden de ejecución respeta el orden del programa en cada procesador",
                    "Proporciona la ilusión de una memoria global instantánea",
                    "Más fácil de razonar pero puede limitar el rendimiento"
                  ],
                  color: "#3b82f6",
                  technicalDetails: "En consistencia secuencial, existe un orden total de todas las operaciones de memoria que es consistente con el orden del programa en cada procesador. Esto significa que los resultados de cualquier ejecución deben ser los mismos que si las operaciones se ejecutaran en algún orden secuencial, con las operaciones de cada procesador apareciendo en ese orden secuencial en el orden especificado por su programa.",
                  examples: [
                    "La memoria principal en sistemas uniprocesador ofrece consistencia secuencial natural",
                    "Muchos algoritmos de sincronización asumen consistencia secuencial para su corrección",
                    "Las primitivas de sincronización como mutex implementan consistencia secuencial"
                  ]
                },
                {
                  model: "TSO",
                  name: "Ordenamiento Total de Almacenamiento",
                  description: "Las operaciones de almacenamiento se ven en orden global, pero las de carga pueden reordenarse.",
                  characteristics: [
                    "Las operaciones de carga pueden reordenarse antes de las operaciones de almacenamiento",
                    "Las operaciones de almacenamiento se ven en orden global",
                    "Usado en arquitecturas x86",
                    "Mejor rendimiento que consistencia secuencial"
                  ],
                  color: "#10b981",
                  technicalDetails: "TSO (Total Store Ordering) permite que las lecturas puedan completarse antes que escrituras anteriores en el orden del programa, pero mantiene el orden de escrituras del mismo procesador. Esto mejora el rendimiento al permitir que las lecturas no bloqueen las escrituras posteriores, mientras aún garantiza que las escrituras sean visibles en orden a otros procesadores.",
                  examples: [
                    "Arquitectura x86 implementa TSO como su modelo de memoria predeterminado",
                    "Las instrucciones de barrera de memoria (mfence) pueden usarse para reforzar la consistencia",
                    "Los compiladores deben tener en cuenta TSO al optimizar código"
                  ]
                },
                {
                  model: "RC",
                  name: "Consistencia de Liberación",
                  description: "Requiere primitivas de sincronización explícitas para ordenar operaciones.",
                  characteristics: [
                    "Requiere primitivas de sincronización explícitas (barreras)",
                    "Las operaciones de adquisición ven todas las operaciones de liberación anteriores",
                    "Permite más reordenamiento para mejor rendimiento",
                    "Más complejo de programar pero muy eficiente"
                  ],
                  color: "#8b5cf6",
                  technicalDetails: "Release Consistency distingue entre operaciones de adquisición (acquire) y liberación (release) de secciones críticas. Solo garantiza que las operaciones de adquisición vean todas las operaciones de liberación anteriores. Esto permite más reordenamiento que otros modelos, mejorando el rendimiento a costa de mayor complejidad en la programación.",
                  examples: [
                    "Las primitivas lock/unlock implementan consistencia de liberación",
                    "Los lenguajes como C++11 ofrecen operaciones con semántica acquire/release",
                    "Los sistemas de paso de mensajes pueden basarse en consistencia de liberación"
                  ]
                },
                {
                  model: "PC",
                  name: "Consistencia de Procesador",
                  description: "Cada procesador ve sus propias operaciones en orden, pero otras pueden verlas en diferente orden.",
                  characteristics: [
                    "Cada procesador ve sus propias operaciones en orden de programa",
                    "Operaciones de otros procesadores pueden verse en cualquier orden",
                    "Máximo paralelismo posible",
                    "Más difícil de programar correctamente"
                  ],
                  color: "#f59e0b",
                  technicalDetails: "Processor Consistency mantiene el orden entre escrituras al mismo lugar de memoria para todos los procesadores, y el orden de programa dentro de cada procesador, pero permite reordenamiento de escrituras a diferentes lugares de memoria. Esto ofrece el máximo paralelismo posible, pero requiere cuidado extremo en la programación para mantener la corrección.",
                  examples: [
                    "Algunas arquitecturas RISC relajan el orden de escrituras para mejor rendimiento",
                    "Los programadores deben usar barreras explícitas para garantizar orden cuando sea necesario",
                    "Algoritmos lock-free deben considerar el modelo de consistencia subyacente"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      case 'optimization':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MemoryOptimizationConcepts
              techniques={[
                {
                  technique: "loopInterchange",
                  name: "Intercambio de Bucles",
                  description: "Cambiar el orden de bucles anidados para mejorar la localidad de datos.",
                  whenToUse: "Cuando se accede a matrices multidimensionales en un orden que no coincide con su almacenamiento en memoria.",
                  example: `// En lugar de:
for (int i = 0; i < rows; i++)
  for (int j = 0; j < cols; j++)
    a[j][i] = 0;

// Usar:
for (int j = 0; j < cols; j++)
  for (int i = 0; i < rows; i++)
    a[j][i] = 0;`,
                  benefit: "Mejora significativamente la tasa de aciertos en caché, especialmente para matrices grandes.",
                  technicalDetails: "El intercambio de bucles cambia el orden de iteración para coincidir con el orden de almacenamiento en memoria (fila-mayor o columna-mayor). Esto mejora la localidad espacial al acceder a elementos contiguos en memoria. El compilador puede realizar esta optimización automáticamente en algunos casos, pero a menudo requiere intervención del programador.",
                  examples: [
                    "En matrices C/C++ almacenadas en orden fila-mayor, iterar por filas es más eficiente",
                    "Las bibliotecas BLAS optimizan el acceso a matrices mediante reordenamiento de bucles",
                    "Los compiladores modernos como GCC y Clang pueden intercambiar bucles automáticamente con optimización -O3"
                  ]
                },
                {
                  technique: "loopTiling",
                  name: "Baldosas de Bucle (Loop Tiling)",
                  description: "Dividir bucles grandes en baldosas más pequeñas que caben en la caché.",
                  whenToUse: "Cuando se procesan grandes conjuntos de datos que no caben completamente en la caché.",
                  example: `// En lugar de:
for (int i = 0; i < N; i++)
  for (int j = 0; j < M; j++)
    c[i][j] = a[i][j] + b[i][j];

// Usar:
for (int ii = 0; ii < N; ii += TILE_SIZE)
  for (int jj = 0; jj < M; jj += TILE_SIZE)
    for (int i = ii; i < Math.min(ii + TILE_SIZE, N); i++)
      for (int j = jj; j < Math.min(jj + TILE_SIZE, M); j++)
        c[i][j] = a[i][j] + b[i][j];`,
                  benefit: "Reduce fallos de caché al procesar datos en bloques que caben en la caché.",
                  technicalDetails: "Loop tiling (también llamado blocking) divide iteraciones en bloques que caben en la caché L1 o L2. Esto mejora la localidad temporal al reutilizar datos mientras están en caché. El tamaño óptimo del bloque depende del tamaño de la caché y el patrón de acceso a datos.",
                  examples: [
                    "Las bibliotecas de álgebra lineal como ATLAS usan tiling para optimizar operaciones matriciales",
                    "Los compiladores pueden aplicar tiling automático con directivas como #pragma omp tile",
                    "El tamaño de bloque óptimo depende de la arquitectura y puede determinarse experimentalmente"
                  ]
                },
                {
                  technique: "dataPacking",
                  name: "Empaquetado de Datos",
                  description: "Organizar datos de manera más densa para usar mejor la memoria y caché.",
                  whenToUse: "Cuando se tienen estructuras con campos de diferentes tamaños que causan relleno (padding).",
                  example: `// En lugar de:
struct {
  char a;      // 1 byte
  int b;       // 4 bytes (precedido por 3 bytes de relleno)
  char c;      // 1 byte (seguido por 3 bytes de relleno)
}; // 12 bytes total

// Usar:
struct {
  char a, c;   // 2 bytes
  int b;       // 4 bytes
}; // 8 bytes total`,
                  benefit: "Reduce el uso de memoria y mejora la localidad de datos.",
                  technicalDetails: "El empaquetado de datos reorganiza estructuras para minimizar el relleno (padding) introducido por alineación. Los compiladores alinean campos en direcciones que son múltiplos de su tamaño para mejorar el rendimiento de acceso. Reordenar campos por tamaño (mayor a menor) minimiza el relleno total.",
                  examples: [
                    "Los compiladores pueden usar #pragma pack para controlar el empaquetado de estructuras",
                    "Las estructuras de datos usadas en redes a menudo requieren empaquetado específico",
                    "Las bases de datos columnares se benefician del empaquetado para mejorar la densidad de datos"
                  ]
                },
                {
                  technique: "prefetching",
                  name: "Prefetching",
                  description: "Cargar datos en la caché antes de que se necesiten.",
                  whenToUse: "Cuando se puede predecir qué datos se necesitarán en el futuro.",
                  example: `// Prefetching de software
for (int i = 0; i < n; i++) {
  __builtin_prefetch(&data[i+10]); // Cargar datos futuros
  process(data[i]);
}`,
                  benefit: "Reduce la latencia de acceso a memoria al anticipar necesidades.",
                  technicalDetails: "El prefetching puede ser por hardware (automático) o software (explícito). El prefetching por hardware detecta patrones de acceso secuencial y carga datos anticipadamente. El prefetching por software usa instrucciones especiales para solicitar la carga de datos específicos. Ambos tipos intentan ocultar la latencia de acceso a memoria principal.",
                  examples: [
                    "Las CPU modernas tienen prefetchers de flujo que detectan acceso secuencial",
                    "Las bibliotecas de procesamiento de datos usan prefetching para mejorar el rendimiento",
                    "Los compiladores pueden insertar prefetching automático con optimización agresiva"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      case 'compression':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MemoryCompressionConcepts
              techniques={[
                {
                  technique: "lz",
                  name: "Compresión LZ (Lempel-Ziv)",
                  description: "Algoritmo que encuentra patrones repetidos en los datos y los reemplaza con referencias.",
                  compressionRatio: 2.5,
                  speed: "medium",
                  useCases: [
                    "Compresión general de datos en memoria",
                    "Almacenamiento de páginas inactivas",
                    "Reducción de uso de memoria en sistemas con poca RAM"
                  ],
                  technicalDetails: "Los algoritmos LZ (Lempel-Ziv) mantienen un diccionario dinámico de secuencias vistas previamente. Cuando encuentran una secuencia repetida, la reemplazan con una referencia al diccionario. LZ77 y LZ78 son variantes fundamentales. LZ4 y LZO son implementaciones modernas optimizadas para velocidad.",
                  examples: [
                    "Linux usa LZ4 en zram y zswap para comprimir páginas de memoria",
                    "Los navegadores web comprimen datos HTTP con algoritmos LZ",
                    "Las bases de datos usan compresión LZ para reducir el uso de almacenamiento"
                  ]
                },
                {
                  technique: "huffman",
                  name: "Codificación Huffman",
                  description: "Asigna códigos más cortos a los datos más frecuentes, similar a usar abreviaturas para palabras comunes.",
                  compressionRatio: 1.8,
                  speed: "fast",
                  useCases: [
                    "Compresión de datos con distribución de frecuencia conocida",
                    "Compresión de texto en memoria",
                    "Aplicaciones donde la velocidad es crítica"
                  ],
                  technicalDetails: "La codificación Huffman construye un árbol binario basado en la frecuencia de símbolos. Los símbolos más frecuentes reciben códigos más cortos. La compresión requiere dos pasadas: una para calcular frecuencias y otra para codificar. La descompresión usa una tabla de códigos preconstruida.",
                  examples: [
                    "JPEG usa codificación Huffman como etapa final de compresión",
                    "Los archivos ZIP pueden usar Huffman para comprimir datos",
                    "Las implementaciones modernas combinan Huffman con otras técnicas para mejor rendimiento"
                  ]
                },
                {
                  technique: "delta",
                  name: "Compresión Delta",
                  description: "Almacena solo las diferencias entre datos similares, como guardar solo los cambios en un documento.",
                  compressionRatio: 5,
                  speed: "fast",
                  useCases: [
                    "Versiones de datos similares",
                    "Snapshots de memoria",
                    "Sistemas de control de versiones"
                  ],
                  technicalDetails: "La compresión delta compara datos con una referencia base y almacena solo las diferencias. Es especialmente efectiva para datos que evolucionan poco entre versiones. Puede usar algoritmos como VCDIFF o implementaciones personalizadas. La eficiencia depende de la similitud entre datos base y objetivo.",
                  examples: [
                    "Git usa compresión delta para almacenar versiones de archivos",
                    "Las bases de datos usan delta compression para transacciones y logs",
                    "Los sistemas de backup incremental usan delta para reducir almacenamiento"
                  ]
                },
                {
                  technique: "dictionary",
                  name: "Compresión por Diccionario",
                  description: "Reemplaza patrones frecuentes con códigos cortos basados en un diccionario predefinido.",
                  compressionRatio: 3,
                  speed: "medium",
                  useCases: [
                    "Datos con patrones repetitivos conocidos",
                    "Compresión de datos específicos de aplicación",
                    "Entornos donde se conocen los tipos de datos"
                  ],
                  technicalDetails: "La compresión por diccionario usa un conjunto predefinido de frases o patrones. Durante la compresión, busca coincidencias en el diccionario y reemplaza con índices. El diccionario puede ser estático (predefinido) o dinámico (construido durante la compresión). Es efectiva cuando los datos contienen muchos patrones conocidos.",
                  examples: [
                    "La compresión de archivos ejecutables puede usar diccionarios de instrucciones comunes",
                    "Los protocolos de red usan diccionarios para comprimir encabezados repetitivos",
                    "Las aplicaciones científicas usan diccionarios de patrones de datos específicos"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      case 'sidechannel':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SideChannelConcepts
              concepts={[
                {
                  concept: "cache",
                  name: "Ataques de Canal Lateral por Caché",
                  description: "Explotan la variación en el tiempo de acceso a la caché para obtener información secreta.",
                  examples: [
                    "Medir tiempos de acceso a arrays para deducir claves criptográficas",
                    "Detectar qué páginas de memoria se acceden durante operaciones sensibles",
                    "Usar tiempos de ejecución para inferir datos protegidos"
                  ],
                  mitigation: [
                    "Aleatorizar tiempos de acceso a memoria",
                    "Usar algoritmos de tiempo constante",
                    "Implementar barreras de memoria",
                    "Evitar compartir caché entre procesos no confiables"
                  ],
                  technicalDetails: "Los ataques de canal lateral por caché explotan el hecho de que el acceso a datos en caché es mucho más rápido que el acceso a memoria principal. Al medir tiempos de acceso cuidadosamente, un atacante puede determinar si ciertos datos están en caché, lo que puede revelar información sobre operaciones secretas. La caché es compartida entre procesos en el mismo núcleo, facilitando estos ataques.",
                  realWorldExamples: [
                    "El ataque Flush+Reload explota la compartición de TLB entre procesos",
                    "Los ataques Prime+Probe usan la competencia por entradas de caché",
                    "Spectre y Meltdown usan canales laterales de caché para exfiltrar datos"
                  ]
                },
                {
                  concept: "timing",
                  name: "Ataques de Canal Lateral por Tiempo",
                  description: "Analizan las variaciones en el tiempo de ejecución para extraer información secreta.",
                  examples: [
                    "Comparar tiempos de ejecución de operaciones criptográficas",
                    "Medir diferencias en tiempos de acceso a estructuras de datos",
                    "Observar variaciones en tiempos de respuesta de sistemas"
                  ],
                  mitigation: [
                    "Implementar algoritmos de tiempo constante",
                    "Agregar ruido aleatorio a tiempos de ejecución",
                    "Usar técnicas de ofuscación temporal",
                    "Normalizar tiempos de respuesta"
                  ],
                  technicalDetails: "Los ataques de tiempo analizan las variaciones en el tiempo de ejecución de operaciones para inferir información secreta. Las implementaciones que toman diferentes cantidades de tiempo según los datos de entrada son vulnerables. Por ejemplo, una comparación de cadenas que retorna inmediatamente en el primer carácter diferente puede revelar cuántos caracteres coinciden.",
                  realWorldExamples: [
                    "Ataques contra implementaciones RSA que dependen del valor de bits secretos",
                    "Ataques de tiempo contra funciones de hash como bcrypt",
                    "Ataques contra sistemas de autenticación que comparan contraseñas ineficientemente"
                  ]
                },
                {
                  concept: "power",
                  name: "Ataques de Canal Lateral por Consumo",
                  description: "Miden el consumo de energía para inferir operaciones internas y datos sensibles.",
                  examples: [
                    "Analizar picos de consumo durante operaciones criptográficas",
                    "Detectar diferencias en consumo al procesar datos diferentes",
                    "Usar osciloscopios para medir consumo de chips"
                  ],
                  mitigation: [
                    "Implementar balanceo de carga en circuitos",
                    "Usar algoritmos con consumo uniforme",
                    "Agregar ruido al consumo eléctrico",
                    "Diseñar circuitos con consumo predecible"
                  ],
                  technicalDetails: "Los ataques de consumo miden la energía utilizada por un dispositivo durante operaciones criptográficas. Operaciones diferentes o el mismo algoritmo procesando datos diferentes pueden consumir cantidades distintas de energía. Analizando estas variaciones, los atacantes pueden inferir información sobre claves secretas o datos internos.",
                  realWorldExamples: [
                    "DPA (Differential Power Analysis) usa estadísticas para extraer claves de tarjetas inteligentes",
                    "Los atacantes han extraído claves AES de implementaciones sin protección",
                    "Los dispositivos embebidos son especialmente vulnerables debido a su proximidad física"
                  ]
                },
                {
                  concept: "electromagnetic",
                  name: "Ataques de Canal Lateral Electromagnéticos",
                  description: "Capturan emisiones electromagnéticas para obtener información sobre operaciones internas.",
                  examples: [
                    "Capturar señales de radio de CPUs durante operaciones",
                    "Analizar emisiones de componentes electrónicos",
                    "Usar antenas para recolectar datos de dispositivos cercanos"
                  ],
                  mitigation: [
                    "Implementar apantallamiento electromagnético",
                    "Usar circuitos con emisiones controladas",
                    "Agregar ruido a señales electromagnéticas",
                    "Diseñar hardware con bajo perfil electromagnético"
                  ],
                  technicalDetails: "Los componentes electrónicos generan emisiones electromagnéticas durante su operación. Estas emisiones pueden contener información sobre las operaciones internas. Con equipos especializados, los atacantes pueden capturar y analizar estas señales para extraer datos sensibles. Las emisiones pueden ser capturadas a distancias que varían desde centímetros hasta varios metros.",
                  realWorldExamples: [
                    "TEMPEST es un programa de EE.UU. para estudiar y prevenir emisiones no deseadas",
                    "Se han extraído claves RSA midiendo emisiones de computadoras portátiles",
                    "Los ataques pueden realizarse a través de muros y otras barreras físicas"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      case 'encryption':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MemoryEncryptionConcepts
              techniques={[
                {
                  technique: "aes",
                  name: "AES (Advanced Encryption Standard)",
                  description: "Algoritmo de cifrado simétrico ampliamente utilizado para proteger datos en memoria.",
                  securityLevel: "high",
                  performance: "fast",
                  useCases: [
                    "Cifrado de datos sensibles en aplicaciones",
                    "Protección de memoria en sistemas seguros",
                    "Cifrado de datos en tránsito",
                    "Almacenamiento seguro de información"
                  ],
                  technicalDetails: "AES es un cifrado por bloques que opera en bloques de 128 bits con claves de 128, 192 o 256 bits. Utiliza una serie de rondas que incluyen sustituciones no lineales, permutaciones lineales y mezclas algebraicas. Procesadores modernos incluyen instrucciones AES-NI para acelerar las operaciones. AES es resistente a todos los ataques criptoanalíticos conocidos.",
                  examples: [
                    "Windows usa AES para BitLocker y EFS",
                    "Los procesadores Intel y AMD incluyen aceleración AES por hardware",
                    "TLS 1.2 y 1.3 usan AES para cifrado de conexiones seguras"
                  ]
                },
                {
                  technique: "rsa",
                  name: "RSA",
                  description: "Algoritmo de cifrado asimétrico que usa un par de claves pública/privada.",
                  securityLevel: "high",
                  performance: "slow",
                  useCases: [
                    "Intercambio seguro de claves",
                    "Firmas digitales",
                    "Autenticación de sistemas",
                    "Cifrado de pequeñas cantidades de datos"
                  ],
                  technicalDetails: "RSA se basa en la dificultad de factorizar números grandes que son producto de dos primos. La seguridad depende del tamaño de la clave; 2048 bits es el mínimo recomendado actualmente. RSA es más lento que cifrados simétricos y se usa principalmente para cifrar claves simétricas o firmas digitales. El algoritmo requiere números primos grandes generados de forma segura.",
                  examples: [
                    "SSH usa RSA para autenticación de servidores y clientes",
                    "Los certificados SSL/TLS a menudo usan RSA para firma de claves",
                    "PGP/GPG usa RSA para cifrado híbrido de correos electrónicos"
                  ]
                },
                {
                  technique: "ecc",
                  name: "Criptografía de Curva Elíptica (ECC)",
                  description: "Técnica de cifrado asimétrico basada en matemáticas de curvas elípticas.",
                  securityLevel: "high",
                  performance: "medium",
                  useCases: [
                    "Dispositivos con recursos limitados",
                    "Firmas digitales eficientes",
                    "Intercambio de claves seguro",
                    "Aplicaciones móviles y IoT"
                  ],
                  technicalDetails: "ECC ofrece seguridad equivalente a RSA con claves mucho más cortas. Una clave ECC de 256 bits proporciona seguridad similar a una clave RSA de 3072 bits. Esto resulta en menor consumo de CPU, memoria y ancho de banda. Se basa en el problema del logaritmo discreto en curvas elípticas sobre campos finitos.",
                  examples: [
                    "Bitcoin y Ethereum usan ECC para firmas digitales",
                    "Los dispositivos móviles prefieren ECC por su eficiencia",
                    "Las conexiones TLS modernas usan ECDHE para intercambio de claves"
                  ]
                },
                {
                  technique: "chaCha20",
                  name: "ChaCha20",
                  description: "Algoritmo de cifrado de flujo diseñado para ser rápido y seguro en software.",
                  securityLevel: "high",
                  performance: "fast",
                  useCases: [
                    "Cifrado de comunicaciones en tiempo real",
                    "Sistemas con procesadores sin instrucciones AES",
                    "Aplicaciones de alto rendimiento",
                    "Entornos donde AES no está disponible"
                  ],
                  technicalDetails: "ChaCha20 es un cifrado de flujo que genera una secuencia seudorrandómica que se combina con los datos mediante XOR. Opera en rondas que mezclan el estado interno usando operaciones simples como suma, rotación y XOR. Es especialmente rápido en arquitecturas sin aceleración AES por hardware y es resistente a ataques de tiempo.",
                  examples: [
                    "TLS 1.3 permite ChaCha20-Poly1305 como suite criptográfica",
                    "Google usa ChaCha20 en sus servicios para dispositivos móviles",
                    "Los sistemas embebidos a menudo prefieren ChaCha20 por su simplicidad"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      case 'controlflow':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ControlFlowIntegrityConcepts
              techniques={[
                {
                  technique: "controlFlowGraph",
                  name: "Grafos de Flujo de Control",
                  description: "Representan todos los caminos posibles de ejecución en un programa como un grafo.",
                  protection: "Detectan desvíos del flujo normal de ejecución que podrían indicar ataques.",
                  implementation: "Compiladores generan grafos durante la compilación y sistemas de ejecución los verifican",
                  limitations: [
                    "Sobrecarga de verificación en tiempo de ejecución",
                    "Dificultad para manejar código dinámico",
                    "Posibles falsos positivos",
                    "Complejidad en programas grandes"
                  ],
                  technicalDetails: "Un grafo de flujo de control (CFG) representa todos los caminos posibles de ejecución en un programa. Los nodos representan bloques básicos (secuencias de instrucciones sin ramificaciones), y las aristas representan saltos entre bloques. CFI verifica que los saltos en tiempo de ejecución sigan caminos válidos en el CFG original.",
                  examples: [
                    "Clang/LLVM implementa CFI con la opción -fsanitize=cfi",
                    "Los navegadores web usan CFI para proteger contra exploits de JavaScript",
                    "Los sistemas operativos modernos aplican CFI a módulos críticos"
                  ]
                },
                {
                  technique: "shadowStack",
                  name: "Pila Sombra",
                  description: "Mantiene una copia separada de las direcciones de retorno para verificar integridad.",
                  protection: "Previenen ataques de desbordamiento de pila que modifican direcciones de retorno.",
                  implementation: "Hardware especializado o software que duplica información de la pila",
                  limitations: [
                    "Requiere soporte de hardware o software especializado",
                    "Consumo adicional de memoria",
                    "Posible impacto en rendimiento",
                    "Complejidad en manejo de excepciones"
                  ],
                  technicalDetails: "La pila sombra es una estructura de datos separada que almacena copias de las direcciones de retorno de la pila principal. Al retornar de funciones, se comparan las direcciones en ambas pilas. Si no coinciden, se detecta una modificación potencialmente maliciosa. Intel CET (Control-flow Enforcement Technology) implementa pila sombra en hardware.",
                  examples: [
                    "Intel CET incluye pila sombra y punteros de protección de retorno",
                    "Windows 10/11 soporta pila sombra en procesadores compatibles",
                    "Los compiladores pueden insertar verificaciones de pila sombra"
                  ]
                },
                {
                  technique: "codeSigning",
                  name: "Firmas de Código",
                  description: "Firman digitalmente el código para verificar su autenticidad e integridad.",
                  protection: "Previenen la ejecución de código modificado o malicioso.",
                  implementation: "Herramientas de desarrollo firman código y sistemas operativos verifican firmas",
                  limitations: [
                    "Dependencia de infraestructura de clave pública",
                    "Posible impacto en proceso de desarrollo",
                    "Dificultad en actualizaciones dinámicas",
                    "Requiere gestión de certificados"
                  ],
                  technicalDetails: "La firma de código usa criptografía asimétrica para garantizar que el código no ha sido modificado desde que fue firmado. El desarrollador firma el código con su clave privada y los sistemas verifican la firma con la clave pública. Las firmas pueden incluir información sobre el editor, fecha de firma y permisos requeridos.",
                  examples: [
                    "Windows requiere firma de controladores en modo kernel",
                    "iOS y Android verifican firmas de aplicaciones antes de instalación",
                    "Las distribuciones Linux verifican firmas de paquetes con herramientas como GPG"
                  ]
                },
                {
                  technique: "randomization",
                  name: "Aleatorización",
                  description: "Coloca código y datos en ubicaciones aleatorias para dificultar ataques.",
                  protection: "Hace difícil para atacantes predecir ubicaciones de código vulnerable.",
                  implementation: "Sistemas operativos asignan direcciones aleatorias al cargar programas",
                  limitations: [
                    "No protege contra todos los tipos de ataques",
                    "Puede afectar rendimiento de aplicaciones",
                    "Dificultad en depuración de programas",
                    "Requiere soporte del sistema operativo"
                  ],
                  technicalDetails: "ASLR (Address Space Layout Randomization) aleatoriza las direcciones base de segmentos de memoria como pila, heap y bibliotecas. PIE (Position Independent Executable) permite que el código se ejecute en cualquier dirección. Estas técnicas combinadas dificultan que los atacantes predigan direcciones necesarias para construir exploits.",
                  examples: [
                    "Linux habilita ASLR por defecto desde kernel 2.6.12",
                    "Windows implementa ASLR desde Vista/Server 2008",
                    "Las bibliotecas PIE permiten aleatorización completa del espacio de direcciones"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      case 'mapping':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MemoryMappingConcepts
              concepts={[
                {
                  concept: "virtual",
                  name: "Memoria Virtual",
                  description: "Sistema que permite a los programas usar más memoria de la disponible físicamente.",
                  advantages: [
                    "Permite programas más grandes que la memoria física",
                    "Protección entre procesos",
                    "Uso eficiente de memoria",
                    "Facilita el intercambio (swapping)"
                  ],
                  disadvantages: [
                    "Sobrecarga de traducción de direcciones",
                    "Posibles fallos de página",
                    "Complejidad del sistema",
                    "Impacto en rendimiento"
                  ],
                  technicalDetails: "La memoria virtual crea una abstracción que permite a cada proceso tener su propio espacio de direcciones independiente. Las direcciones virtuales se traducen a físicas mediante tablas de páginas gestionadas por la MMU. Las páginas pueden moverse entre RAM y almacenamiento secundario según su uso. Esto permite ejecutar programas más grandes que la RAM disponible.",
                  examples: [
                    "Linux usa memoria virtual para ejecutar múltiples procesos simultáneamente",
                    "Los archivos mapeados en memoria usan el sistema de memoria virtual",
                    "La memoria virtual permite implementar características como copy-on-write"
                  ]
                },
                {
                  concept: "physical",
                  name: "Memoria Física",
                  description: "La memoria RAM real instalada en el sistema.",
                  advantages: [
                    "Acceso directo y rápido",
                    "Sin sobrecarga de traducción",
                    "Más predecible en rendimiento",
                    "Menos complejidad"
                  ],
                  disadvantages: [
                    "Limitada por hardware",
                    "Sin aislamiento entre procesos",
                    "Difícil de gestionar",
                    "No permite memoria virtual"
                  ],
                  technicalDetails: "La memoria física es el hardware real de almacenamiento en el sistema, como módulos DRAM. Cada byte tiene una dirección física única. Los sistemas operativos y firmware pueden acceder directamente a estas direcciones. La gestión de memoria física implica asignar y liberar bloques de memoria para procesos y kernel.",
                  examples: [
                    "El kernel del sistema operativo maneja la asignación de memoria física",
                    "Los dispositivos de E/S usan direcciones físicas directamente",
                    "Las aplicaciones raras acceden a memoria física directamente para alto rendimiento"
                  ]
                },
                {
                  concept: "paging",
                  name: "Paginación",
                  description: "División de memoria en bloques fijos llamados páginas.",
                  advantages: [
                    "Elimina fragmentación externa",
                    "Permite memoria virtual eficiente",
                    "Simplifica gestión de memoria",
                    "Soporte para swapping"
                  ],
                  disadvantages: [
                    "Fragmentación interna",
                    "Sobrecarga de tablas de páginas",
                    "Complejidad en sistemas grandes",
                    "Penalización por fallos de página"
                  ],
                  technicalDetails: "La paginación divide la memoria virtual y física en bloques de tamaño fijo llamados páginas (típicamente 4KB) y marcos de página respectivamente. La MMU usa tablas de páginas para mapear direcciones virtuales a físicas. Las páginas pueden cargarse y descargarse según su uso, permitiendo memoria virtual. Jerarquías de tablas reducen el overhead de memoria.",
                  examples: [
                    "x86-64 usa paginación con tablas de 4 niveles para espacios de 48 bits",
                    "Las páginas grandes (2MB/1GB) reducen sobrecarga de TLB",
                    "Los sistemas operativos modernos usan paginación como base de gestión de memoria"
                  ]
                },
                {
                  concept: "segmentation",
                  name: "Segmentación",
                  description: "División de memoria en segmentos lógicos de diferentes tamaños.",
                  advantages: [
                    "Refleja estructura lógica de programas",
                    "Permite compartir segmentos",
                    "Protección basada en segmentos",
                    "Crecimiento dinámico"
                  ],
                  disadvantages: [
                    "Fragmentación externa",
                    "Complejidad en gestión",
                    "Dificultad para compartir",
                    "Requiere más hardware"
                  ],
                  technicalDetails: "La segmentación divide la memoria en segmentos de tamaño variable según la estructura lógica del programa (código, datos, pila). Cada segmento tiene una dirección base y límite. Las direcciones lógicas constan de un selector de segmento y un desplazamiento. El hardware verifica que los desplazamientos estén dentro de los límites del segmento.",
                  examples: [
                    "Arquitectura x86 históricamente usó segmentación en modo real",
                    "Algunos sistemas operativos combinan segmentación con paginación",
                    "La segmentación facilita compartir bibliotecas y datos entre procesos"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      case 'barriers':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MemoryBarrierConcepts
              barriers={[
                {
                  barrier: "memory",
                  name: "Barreras de Memoria",
                  description: "Instrucciones que aseguran el orden de ejecución de operaciones de memoria.",
                  purpose: "Prevenir que el procesador o compilador reordenen operaciones críticas de memoria.",
                  implementation: "instrucción mfence (x86) o equivalentes en otros procesadores",
                  useCases: [
                    "Sincronización en programación concurrente",
                    "Acceso a dispositivos de E/S",
                    "Implementación de primitivas de sincronización",
                    "Protección de secciones críticas"
                  ],
                  technicalDetails: "Las barreras de memoria son instrucciones que fuerzan el orden de operaciones de lectura y escritura en memoria. Previenen que el procesador o compilador reordenen operaciones antes y después de la barrera. En sistemas multiprocesador, también aseguran que las operaciones sean visibles a otros procesadores en el orden especificado.",
                  examples: [
                    "x86 tiene instrucciones lfence, sfence y mfence para diferentes tipos de barreras",
                    "ARM usa instrucciones dmb (data memory barrier) para sincronización",
                    "Las bibliotecas de concurrencia usan barreras para implementar mutex y semáforos"
                  ]
                },
                {
                  barrier: "compiler",
                  name: "Barreras de Compilador",
                  description: "Directivas que previenen que el compilador reordene código.",
                  purpose: "Mantener el orden de operaciones según la lógica del programador.",
                  implementation: "volatile keywords, barriers intrínsecos, o directivas específicas",
                  useCases: [
                    "Acceso a registros de hardware",
                    "Variables modificadas por interrupciones",
                    "Implementación de estructuras lock-free",
                    "Comunicación con código ensamblador"
                  ],
                  technicalDetails: "Las barreras de compilador impiden que el compilador reordene instrucciones durante la optimización. Se implementan con palabras clave como 'volatile' o funciones intrínsecas. A diferencia de las barreras de CPU, no afectan la ejecución del procesador, solo la generación de código por parte del compilador.",
                  examples: [
                    "En C/C++, la palabra clave volatile indica que una variable puede cambiar externamente",
                    "Compiladores ofrecen intrínsecos como __sync_synchronize() para barreras",
                    "Los drivers de dispositivo usan barreras para acceder a registros de hardware"
                  ]
                },
                {
                  barrier: "cpu",
                  name: "Barreras de CPU",
                  description: "Instrucciones que previenen reordenamiento por el procesador.",
                  purpose: "Garantizar orden de operaciones en sistemas multiprocesador.",
                  implementation: "instrucciones especiales como lfence, sfence, mfence (x86)",
                  useCases: [
                    "Sincronización entre núcleos de CPU",
                    "Implementación de locks",
                    "Operaciones de adquisición/liberación",
                    "Programación de sistemas en tiempo real"
                  ],
                  technicalDetails: "Las barreras de CPU son instrucciones que previenen el reordenamiento de operaciones de memoria por parte del procesador. En arquitecturas con ejecución especulativa, garantizan que las operaciones sean completadas en el orden especificado antes de continuar. Diferentes tipos de barreras afectan lecturas, escrituras o ambas.",
                  examples: [
                    "En x86, mfence garantiza orden total de operaciones de memoria",
                    "ARM tiene instrucciones dmb para diferentes dominios de memoria",
                    "Las primitivas de sincronización como mutex usan barreras de CPU"
                  ]
                },
                {
                  barrier: "sequential",
                  name: "Consistencia Secuencial",
                  description: "Modelo de memoria que garantiza orden total de operaciones.",
                  purpose: "Simplificar razonamiento sobre programas concurrentes.",
                  implementation: "Combinación de barreras hardware y software",
                  useCases: [
                    "Programas donde la corrección es más importante que el rendimiento",
                    "Sistemas críticos donde los errores no son aceptables",
                    "Algoritmos donde el orden es fundamental para la corrección",
                    "Debugging y verificación de sistemas concurrentes"
                  ],
                  technicalDetails: "La consistencia secuencial es el modelo más fuerte de consistencia de memoria donde todas las operaciones parecen ocurrir en un orden global consistente con el orden del programa. Requiere que todas las operaciones de memoria sean visibles a todos los procesadores en el mismo orden. Se implementa con barreras completas entre todas las operaciones de memoria.",
                  examples: [
                    "Algoritmos de consenso distribuido requieren consistencia secuencial",
                    "Bases de datos transaccionales usan consistencia secuencial para ACID",
                    "Los verificadores formales asumen consistencia secuencial para simplicidad"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      case 'numa':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NUMAConcepts
              concepts={[
                {
                  concept: "nodes",
                  name: "Nodos NUMA",
                  description: "En NUMA, el sistema se divide en nodos, cada uno con sus propios procesadores y memoria local.",
                  importance: "Permite escalar sistemas a muchos núcleos manteniendo un buen rendimiento de memoria.",
                  optimization: [
                    "Asignar procesos al nodo con el que tienen afinidad",
                    "Minimizar el acceso a memoria remota",
                    "Usar herramientas de afinidad como numactl",
                    "Diseñar aplicaciones conscientes de topología"
                  ],
                  technicalDetails: "Un nodo NUMA contiene uno o más procesadores, memoria local y otros recursos. Los procesadores en el mismo nodo pueden acceder a su memoria local con latencia baja, mientras que el acceso a memoria de otros nodos es más lento. La interconexión entre nodos puede ser mediante buses, redes de interconexión o enlaces punto a punto.",
                  examples: [
                    "Servidores de alto rendimiento usan arquitecturas NUMA con decenas de núcleos",
                    "Las bases de datos optimizan la colocación de datos para NUMA",
                    "Los sistemas HPC (computación de alto rendimiento) dependen de NUMA para escalar"
                  ]
                },
                {
                  concept: "latency",
                  name: "Latencia de Acceso",
                  description: "El tiempo que toma acceder a memoria local es menor que acceder a memoria remota.",
                  importance: "La diferencia de latencia puede ser significativa (2x o más) afectando el rendimiento.",
                  optimization: [
                    "Usar memoria local siempre que sea posible",
                    "Evitar migración de procesos entre nodos",
                    "Preasignar memoria en el nodo local",
                    "Minimizar estructuras de datos compartidas"
                  ],
                  technicalDetails: "La latencia de acceso a memoria local típicamente está en el rango de 50-100 nanosegundos, mientras que el acceso remoto puede tomar 150-300 nanosegundos o más. Esta diferencia se debe a que el acceso local no requiere travesía de interconexión. Los sistemas operativos modernos intentan mantener procesos y sus datos en el mismo nodo para minimizar latencia.",
                  examples: [
                    "Aplicaciones intensivas en memoria pueden ver degradación de 20-50% con acceso remoto",
                    "Los perfiles de rendimiento muestran diferencias claras entre accesos locales y remotos",
                    "Los optimizadores automático de NUMA intentan migrar procesos hacia sus datos"
                  ]
                },
                {
                  concept: "bandwidth",
                  name: "Ancho de Banda",
                  description: "Cada nodo tiene su propio ancho de banda de memoria, que puede saturarse independientemente.",
                  importance: "Permite mayor ancho de banda total del sistema al tener múltiples controladores de memoria.",
                  optimization: [
                    "Distribuir carga de memoria entre nodos",
                    "Evitar cuellos de botella en interconexión",
                    "Usar acceso concurrente a diferentes nodos",
                    "Monitorear uso de ancho de banda por nodo"
                  ],
                  technicalDetails: "Cada nodo NUMA tiene su propio controlador de memoria y canales de memoria, proporcionando ancho de banda independiente. El ancho de banda total del sistema es la suma del ancho de banda de todos los nodos. Sin embargo, el ancho de banda de interconexión entre nodos es típicamente menor que el ancho de banda de memoria local, creando posibles cuellos de botella.",
                  examples: [
                    "Un sistema con 4 nodos puede tener 4 veces el ancho de banda de memoria de un nodo individual",
                    "Las aplicaciones deben distribuir su uso de memoria para aprovechar todo el ancho de banda",
                    "Los cuellos de botella en interconexión pueden limitar el rendimiento de acceso remoto"
                  ]
                },
                {
                  concept: "locality",
                  name: "Localidad de Datos",
                  description: "Rendimiento óptimo se logra cuando los procesos acceden principalmente a su memoria local.",
                  importance: "La localidad es el factor más importante para obtener buen rendimiento en sistemas NUMA.",
                  optimization: [
                    "Diseñar estructuras de datos para localidad",
                    "Usar asignación de memoria consciente de NUMA",
                    "Minimizar comunicación entre nodos",
                    "Perfilado para identificar accesos remotos"
                  ],
                  technicalDetails: "La localidad de datos se refiere a que los procesos accedan principalmente a datos almacenados en su nodo local. Los sistemas operativos usan políticas de asignación de memoria y migración de procesos para maximizar la localidad. Las aplicaciones pueden mejorar el rendimiento usando APIs conscientes de NUMA para asignar memoria en nodos específicos.",
                  examples: [
                    "Las bases de datos particionan datos para mantener la localidad en sistemas NUMA",
                    "Las aplicaciones HPC usan bibliotecas como numactl para controlar la colocación de memoria",
                    "Los perfiles de rendimiento muestran el porcentaje de accesos locales vs remotos"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      case 'bandwidth':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MemoryBandwidthConcepts
              concepts={[
                {
                  concept: "peak",
                  name: "Ancho de Banda Pico",
                  description: "Máximo ancho de banda teórico que puede alcanzar el sistema en condiciones ideales.",
                  factors: [
                    "Frecuencia del bus de memoria",
                    "Número de canales de memoria",
                    "Ancho de palabras de memoria",
                    "Tiempos de acceso de la memoria"
                  ],
                  optimization: [
                    "Usar memorias más rápidas",
                    "Aumentar número de canales",
                    "Optimizar tiempos de acceso",
                    "Usar perfiles de memoria agresivos"
                  ],
                  technicalDetails: "El ancho de banda pico se calcula multiplicando la frecuencia de reloj de la memoria por el número de transferencias por ciclo y el ancho del bus. Por ejemplo, DDR4-3200 en dual channel (128 bits) tiene ancho de banda pico de 51.2 GB/s. Este valor representa el límite teórico que rara vez se alcanza en condiciones reales debido a latencias, conflictos y otros factores.",
                  examples: [
                    "DDR4-3200 dual channel ofrece ~51 GB/s de ancho de banda pico",
                    "DDR5 duplica el ancho de banda pico comparado con DDR4",
                    "Los servidores de alto rendimiento usan 8 o más canales de memoria"
                  ]
                },
                {
                  concept: "sustained",
                  name: "Ancho de Banda Sostenido",
                  description: "Ancho de banda real que puede mantenerse durante períodos prolongados de operación.",
                  factors: [
                    "Patrones de acceso a memoria",
                    "Eficiencia del controlador de memoria",
                    "Interferencia de otros subsistemas",
                    "Temperatura y condiciones térmicas"
                  ],
                  optimization: [
                    "Mejorar localidad de datos",
                    "Reducir accesos aleatorios",
                    "Usar acceso secuencial cuando sea posible",
                    "Optimizar tamaño de transferencias"
                  ],
                  technicalDetails: "El ancho de banda sostenido es la velocidad real de transferencia de datos que puede mantenerse durante períodos prolongados. Es significativamente menor que el ancho de banda pico debido a factores como latencias de acceso, conflictos de memoria y sobrecarga de protocolo. Se mide típicamente con benchmarks como STREAM que copian grandes bloques de datos.",
                  examples: [
                    "Aplicaciones reales rara vez alcanzan más del 70% del ancho de banda pico",
                    "STREAM benchmark mide ancho de banda sostenido con operaciones simples",
                    "Las aplicaciones intensivas en memoria muestran cuellos de botella en ancho de banda"
                  ]
                },
                {
                  concept: "sequential",
                  name: "Acceso Secuencial",
                  description: "Acceso a datos en orden consecutivo, que permite mayor eficiencia en transferencias.",
                  factors: [
                    "Patrones de recorrido de matrices",
                    "Organización de estructuras de datos",
                    "Uso de prefetching",
                    "Alineación de datos"
                  ],
                  optimization: [
                    "Recorrer matrices en orden natural",
                    "Usar estructuras de datos contiguas",
                    "Implementar prefetching adecuado",
                    "Alinear datos a límites de caché"
                  ],
                  technicalDetails: "El acceso secuencial es altamente eficiente porque permite el uso completo de líneas de caché y aprovecha el prefetching por hardware. Cuando se accede a datos en orden, el sistema puede predecir y cargar datos futuros anticipadamente. Esto maximiza el uso del ancho de banda disponible y minimiza latencias de acceso.",
                  examples: [
                    "Recorrer matrices por filas (en C) es más eficiente que por columnas",
                    "Las operaciones de copia de memoria grandes son secuenciales por naturaleza",
                    "Los algoritmos optimizados para caché usan acceso secuencial cuando es posible"
                  ]
                },
                {
                  concept: "random",
                  name: "Acceso Aleatorio",
                  description: "Acceso a datos en ubicaciones no consecutivas, que típicamente reduce el ancho de banda efectivo.",
                  factors: [
                    "Patrones de acceso dispersos",
                    "Indices calculados dinámicamente",
                    "Estructuras de datos enlazadas",
                    "Tablas de hash mal distribuidas"
                  ],
                  optimization: [
                    "Reducir saltos aleatorios",
                    "Usar prefetching predictivo",
                    "Reorganizar datos para mejor localidad",
                    "Implementar estructuras de datos cache-friendly"
                  ],
                  technicalDetails: "El acceso aleatorio es ineficiente porque no permite el prefetching efectivo y causa fallos frecuentes de caché. Cada acceso puede requerir una nueva línea de caché, y los datos solicitados pueden no estar contiguos en memoria. Esto resulta en un uso subóptimo del ancho de banda disponible y mayor latencia promedio de acceso.",
                  examples: [
                    "Acceder a elementos de una lista enlazada puede ser aleatorio en memoria",
                    "Las tablas de hash mal distribuidas causan accesos dispersos",
                    "Los índices de bases de datos mal optimizados generan accesos aleatorios"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      case 'prefetching':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PrefetchingConcepts
              concepts={[
                {
                  concept: "hardware",
                  name: "Prefetching de Hardware",
                  description: "Circuitos especializados en el procesador que detectan patrones y cargan datos anticipadamente.",
                  advantages: [
                    "Transparente para el programador",
                    "Bajo impacto en rendimiento",
                    "Detección automática de patrones",
                    "Mejora general en aplicaciones"
                  ],
                  disadvantages: [
                    "Limitado a patrones simples",
                    "No puede predecir todo tipo de acceso",
                    "Posibles prefetches innecesarios",
                    "Dificultad para desactivar cuando no ayuda"
                  ],
                  technicalDetails: "El prefetching de hardware utiliza circuitos dedicados en la CPU que monitorean los patrones de acceso a memoria. Detectan secuencias como acceso lineal, acceso con saltos regulares, y acceso a estructuras de datos comunes. Cuando identifican un patrón, cargan datos anticipadamente en la caché. Los prefetchers modernos pueden detectar patrones complejos en múltiples dimensiones.",
                  examples: [
                    "Los prefetchers de flujo detectan acceso secuencial y cargan líneas de caché consecutivas",
                    "Los prefetchers de saltos identifican patrones con intervalos regulares",
                    "Intel y AMD implementan prefetchers sofisticados en sus procesadores modernos"
                  ]
                },
                {
                  concept: "software",
                  name: "Prefetching de Software",
                  description: "Instrucciones explícitas en el código para cargar datos anticipadamente.",
                  advantages: [
                    "Control preciso del programador",
                    "Puede anticipar patrones complejos",
                    "Se puede adaptar a la aplicación específica",
                    "Posibilidad de prefetching selectivo"
                  ],
                  disadvantages: [
                    "Requiere modificaciones de código",
                    "Sobrecarga de instrucciones adicionales",
                    "Dificultad para determinar momento óptimo",
                    "Posible prefetching innecesario"
                  ],
                  technicalDetails: "El prefetching de software usa instrucciones especiales como __builtin_prefetch() en GCC o _mm_prefetch() en intrínsecos Intel. El programador inserta estas instrucciones para solicitar la carga de datos específicos. La efectividad depende de la precisión en la predicción de datos futuros y el momento adecuado para el prefetching.",
                  examples: [
                    "GCC ofrece __builtin_prefetch() para prefetching explícito",
                    "Las bibliotecas científicas usan prefetching para optimizar bucles intensivos",
                    "Los compiladores pueden insertar prefetching automático con optimización agresiva"
                  ]
                },
                {
                  concept: "stream",
                  name: "Prefetching de Flujo",
                  description: "Detecta accesos secuenciales y carga líneas de caché consecutivas.",
                  advantages: [
                    "Muy efectivo para acceso secuencial",
                    "Bajo costo de implementación",
                    "Alta tasa de aciertos",
                    "Mejora significativa en ciertos patrones"
                  ],
                  disadvantages: [
                    "Solo ayuda con patrones secuenciales",
                    "Puede cargar datos innecesarios",
                    "Dificultad para ajustar distancia de prefetch",
                    "Posible interferencia con otros accesos"
                  ],
                  technicalDetails: "El prefetching de flujo detecta cuando un programa accede a direcciones de memoria en orden secuencial. Una vez identificado el patrón, carga automáticamente líneas de caché adicionales en la dirección del flujo. Es especialmente efectivo para recorridos de matrices y procesamiento de datos secuenciales grandes.",
                  examples: [
                    "Los procesadores Intel tienen streamers prefetchers que detectan acceso lineal",
                    "Las operaciones de copia de memoria se benefician del prefetching de flujo",
                    "Los algoritmos de procesamiento de imágenes usan acceso secuencial predecible"
                  ]
                },
                {
                  concept: "stride",
                  name: "Prefetching por Saltos",
                  description: "Detecta patrones de acceso con saltos regulares (como cada N elementos).",
                  advantages: [
                    "Detecta patrones con saltos regulares",
                    "Muy efectivo para ciertos algoritmos",
                    "Puede adaptarse a diferentes tamaños de salto",
                    "Mejora rendimiento en matrices multidimensionales"
                  ],
                  disadvantages: [
                    "Más complejo que prefetching secuencial",
                    "Puede equivocarse en patrones irregulares",
                    "Requiere más estado para seguimiento",
                    "Posible sobrecarga en detección"
                  ],
                  technicalDetails: "El prefetching por saltos identifica cuando los accesos a memoria siguen un patrón con intervalo regular. Por ejemplo, acceder a cada 8 elementos en una matriz. Una vez detectado el patrón, predice y carga los elementos futuros con el mismo intervalo. Es útil para recorridos de matrices con saltos o acceso a estructuras de datos con tamaño fijo.",
                  examples: [
                    "Recorrer cada N filas de una matriz grande beneficia del prefetching por saltos",
                    "Los algoritmos de procesamiento de señales usan patrones de acceso predecibles",
                    "Las estructuras de datos como árboles pueden tener patrones de acceso identificables"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      case 'replacement':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CacheReplacementConcepts
              concepts={[
                {
                  concept: "lru",
                  name: "LRU (Least Recently Used)",
                  description: "Reemplaza el bloque que ha estado sin usarse por más tiempo.",
                  howItWorks: "Mantiene un registro del orden de uso de los bloques y elimina el más antiguo.",
                  advantages: [
                    "Buena efectividad general",
                    "Simple de entender",
                    "Funciona bien con localidad temporal",
                    "Ampliamente utilizado en sistemas reales"
                  ],
                  disadvantages: [
                    "Costoso de implementar perfectamente",
                    "Requiere hardware adicional",
                    "Puede ser engañado por ciertos patrones",
                    "Complejidad crece con tamaño de caché"
                  ],
                  technicalDetails: "LRU mantiene un registro del orden de uso de los bloques en caché. Cuando se necesita espacio, elimina el bloque que ha estado sin usarse por más tiempo. La implementación perfecta requiere comparadores para cada par de bloques, lo que es costoso. Las implementaciones prácticas usan aproximaciones como bits de referencia o pseudo-LRU.",
                  examples: [
                    "Las cachés L1 y L2 de procesadores modernos usan variantes de LRU",
                    "Los sistemas de almacenamiento en caché de bases de datos implementan LRU",
                    "Los navegadores web usan LRU para caché de páginas web"
                  ]
                },
                {
                  concept: "lfu",
                  name: "LFU (Least Frequently Used)",
                  description: "Reemplaza el bloque que se ha usado con menor frecuencia.",
                  howItWorks: "Mantiene un contador de accesos para cada bloque y elimina el de menor conteo.",
                  advantages: [
                    "Funciona bien con datos de acceso uniforme",
                    "Apropiado para datos con patrones estables",
                    "Buena para datos con acceso frecuente",
                    "Simple concepto de frecuencia"
                  ],
                  disadvantages: [
                    "No responde bien a cambios en patrones de uso",
                    "Requiere mantener contadores",
                    "Puede mantener datos antiguos innecesariamente",
                    "Dificultad para inicializar contadores"
                  ],
                  technicalDetails: "LFU mantiene un contador de accesos para cada bloque en caché. Cuando se necesita espacio, elimina el bloque con el contador más bajo. Los contadores pueden ser incrementados en cada acceso o decaer con el tiempo. LFU es efectivo para datos con patrones de acceso estables pero puede ser ineficaz cuando los patrones cambian rápidamente.",
                  examples: [
                    "Algunas cachés de aplicaciones web usan LFU para contenido popular",
                    "Los sistemas de recomendación pueden usar LFU para elementos relevantes",
                    "Las implementaciones combinan LFU con otros algoritmos para mejor adaptabilidad"
                  ]
                },
                {
                  concept: "fifo",
                  name: "FIFO (First In, First Out)",
                  description: "Reemplaza el bloque que ha estado en caché por más tiempo.",
                  howItWorks: "Mantiene una cola circular y elimina el elemento más antiguo.",
                  advantages: [
                    "Muy simple de implementar",
                    "Bajo costo de hardware",
                    "Predecible en comportamiento",
                    "No requiere seguimiento de uso"
                  ],
                  disadvantages: [
                    "Puede eliminar datos recientemente usados",
                    "Ignora patrones de acceso",
                    "Mala efectividad en general",
                    "No considera importancia de datos"
                  ],
                  technicalDetails: "FIFO reemplaza el bloque que ha estado en caché por más tiempo, independientemente de su uso reciente. Se implementa con una cola circular donde nuevos bloques se agregan al final y se eliminan del frente cuando se necesita espacio. Es simple pero puede ser ineficaz si los bloques antiguos aún son relevantes.",
                  examples: [
                    "Algunas cachés simples en sistemas embebidos usan FIFO por su simplicidad",
                    "Los buffers circulares pueden implementar FIFO naturalmente",
                    "FIFO se usa cuando la complejidad de otros algoritmos no es justificable"
                  ]
                },
                {
                  concept: "random",
                  name: "Aleatorio",
                  description: "Reemplaza un bloque seleccionado al azar.",
                  howItWorks: "Usa un generador de números aleatorios para seleccionar bloque a reemplazar.",
                  advantages: [
                    "Extremadamente simple de implementar",
                    "Sin estado adicional requerido",
                    "Imposible de predecir por atacantes",
                    "Costo mínimo de hardware"
                  ],
                  disadvantages: [
                    "Efectividad potencialmente baja",
                    "No considera patrones de uso",
                    "Resultados inconsistentes",
                    "No aprovecha localidad de datos"
                  ],
                  technicalDetails: "El reemplazo aleatorio selecciona un bloque al azar para reemplazo. No requiere mantener información de uso o edad de bloques. Aunque parece ineficiente, puede funcionar razonablemente bien en algunas situaciones y es impredecible para atacantes que intentan explotar patrones de reemplazo conocidos.",
                  examples: [
                    "Algunas cachés pequeñas usan reemplazo aleatorio por simplicidad",
                    "En seguridad, el reemplazo aleatorio puede prevenir ciertos tipos de ataques",
                    "Los estudios teóricos comparan algoritmos contra reemplazo aleatorio como baseline"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      case 'attacks':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SideChannelAttacks
              attacks={[
                {
                  attack: "cache",
                  name: "Ataques de Canal Lateral por Caché",
                  description: "Explotan tiempos de acceso a caché para obtener información secreta.",
                  difficulty: "Media",
                  mitigation: "Aleatorización de tiempos y algoritmos de tiempo constante",
                  example: "Medir tiempos de acceso a un array para deducir bits de una clave criptográfica",
                  technicalDetails: "Los atacantes miden cuidadosamente los tiempos de acceso a memoria para determinar si ciertos datos están en caché. Al correlacionar estos tiempos con operaciones secretas, pueden inferir información sobre claves criptográficas u otros datos sensibles. Los ataques pueden ser entre procesos en el mismo sistema o incluso a través de la red en sistemas virtualizados.",
                  realWorldExamples: [
                    "El ataque Flush+Reload permitió extraer claves RSA de GnuPG",
                    "Spectre usó canales laterales de caché para leer datos protegidos",
                    "Los ataques en cloud computing han usado cache side-channels para robar datos entre VMs"
                  ]
                },
                {
                  attack: "timing",
                  name: "Ataques de Canal Lateral por Tiempo",
                  description: "Analizan variaciones en tiempos de ejecución para extraer información.",
                  difficulty: "Baja",
                  mitigation: "Algoritmos de tiempo constante y adición de ruido temporal",
                  example: "Comparar tiempos de ejecución de operaciones RSA con diferentes claves",
                  technicalDetails: "Estos ataques se basan en que las implementaciones de algoritmos toman diferentes cantidades de tiempo según los datos de entrada. Por ejemplo, una comparación de contraseñas que retorna inmediatamente en el primer carácter diferente puede revelar cuántos caracteres coinciden. Los atacantes miden estos tiempos para inferir información secreta.",
                  realWorldExamples: [
                    "Ataques contra implementaciones de Diffie-Hellman han extraído claves privadas",
                    "Las implementaciones vulnerables de OpenSSL han sido explotadas mediante análisis de tiempo",
                    "Los sistemas de autenticación mal implementados son vulnerables a ataques de tiempo"
                  ]
                },
                {
                  attack: "power",
                  name: "Ataques de Canal Lateral por Consumo",
                  description: "Miden consumo de energía para inferir operaciones internas.",
                  difficulty: "Alta",
                  mitigation: "Balanceo de carga y adición de ruido al consumo",
                  example: "Analizar picos de consumo durante operaciones AES para deducir claves",
                  technicalDetails: "Los circuitos electrónicos consumen diferentes cantidades de energía según las operaciones que realizan. Al medir cuidadosamente este consumo, los atacantes pueden inferir información sobre datos internos. Los ataques más sofisticados usan análisis estadístico como DPA (Differential Power Analysis) para extraer claves de dispositivos seguros.",
                  realWorldExamples: [
                    "DPA ha sido usado para extraer claves de tarjetas inteligentes y dispositivos HSM",
                    "Investigadores han extraído claves AES de implementaciones sin protección física",
                    "Los dispositivos embebidos en IoT son particularmente vulnerables debido a su accesibilidad"
                  ]
                },
                {
                  attack: "electromagnetic",
                  name: "Ataques Electromagnéticos",
                  description: "Capturan emisiones electromagnéticas para obtener información.",
                  difficulty: "Alta",
                  mitigation: "Apantallamiento y circuitos con emisiones controladas",
                  example: "Usar antenas para capturar señales de CPU durante operaciones criptográficas",
                  technicalDetails: "Los componentes electrónicos generan emisiones electromagnéticas durante su operación. Estas emisiones pueden contener información sobre las operaciones internas. Con equipos especializados, los atacantes pueden capturar y analizar estas señales para extraer datos sensibles. Las emisiones pueden ser capturadas a distancias que varían desde centímetros hasta varios metros.",
                  realWorldExamples: [
                    "TEMPEST es un programa de EE.UU. para estudiar y prevenir emisiones no deseadas",
                    "Se han extraído claves RSA midiendo emisiones de computadoras portátiles",
                    "Los ataques pueden realizarse a través de muros y otras barreras físicas"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      case 'spectre':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SpectreMeltdownConcepts
              variants={[
                {
                  variant: "spectre",
                  name: "Spectre",
                  description: "Permite que un programa acceda a datos arbitrarios en la memoria de otro programa.",
                  explanation: "Spectre engaña a los procesadores para que ejecuten instrucciones erróneas usando predicción de ramas. Es como un mago que te convence de que mires en la dirección equivocada mientras roba tu cartera.",
                  protection: "Se mitiga con instrucciones especiales que limitan la predicción de ramas y mejoras en compiladores.",
                  mitigation: [
                    "Instrucciones de mitigación de predicción (IBRS, STIBP, IBPB)",
                    "Parches en compiladores para insertar barreras",
                    "Actualizaciones de microcódigo de procesadores",
                    "Modificaciones en código para evitar vulnerabilidades"
                  ],
                  technicalDetails: "Spectre explota la predicción de ramas y ejecución especulativa para acceder a datos protegidos. Un atacante entrena el predictor de ramas para seguir un camino específico, luego ejecuta código que verifica condiciones secretas usando accesos a memoria. Aunque la ejecución especulativa se deshace, deja rastros en la caché que pueden ser medidos.",
                  realWorldImpact: [
                    "Afecta prácticamente todos los procesadores modernos (Intel, AMD, ARM)",
                    "Requiere actualizaciones de microcódigo y software para mitigar completamente",
                    "Impacto en rendimiento de sistemas mitigados (5-15% en algunos casos)",
                    "Navegadores web implementaron mitigaciones que afectaron JavaScript"
                  ]
                },
                {
                  variant: "meltdown",
                  name: "Meltdown",
                  description: "Permite que un programa acceda a datos protegidos del kernel en la memoria.",
                  explanation: "Meltdown rompe la barrera entre memoria de usuario y kernel, permitiendo que programas de usuario lean información privilegiada. Es como si pudieras leer cartas en una oficina cerrada solo porque están en el mismo edificio.",
                  protection: "Se mitiga con cambios en cómo se maneja la memoria virtual, especialmente separando espacios de memoria de kernel y usuario.",
                  mitigation: [
                    "KPTI (Kernel Page Table Isolation) - separa tablas de página de kernel y usuario",
                    "Actualizaciones de sistemas operativos",
                    "Parches de microcódigo de procesadores",
                    "Cambios en mecanismos de gestión de memoria"
                  ],
                  technicalDetails: "Meltdown explota una vulnerabilidad en la ejecución especulativa de procesadores Intel. Permite a código de usuario leer cualquier dirección de memoria, incluyendo áreas protegidas del kernel. Durante la ejecución especulativa, las verificaciones de privilegios se omiten temporalmente, permitiendo el acceso a datos protegidos que luego pueden ser leídos mediante canales laterales.",
                  realWorldImpact: [
                    "Afecta principalmente procesadores Intel (algunos ARM también)",
                    "Requiere KPTI que puede impactar rendimiento en 5-30%",
                    "Todos los sistemas operativos principales lanzaron parches de emergencia",
                    "Cloud providers tuvieron que actualizar infraestructura completa"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      case 'rowhammer':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RowhammerConcepts
              concepts={[
                {
                  concept: "mechanism",
                  name: "Mecanismo de Rowhammer",
                  description: "El efecto Rowhammer ocurre cuando acceder repetidamente a una fila de memoria puede alterar bits en filas adyacentes.",
                  technicalDetails: "En DRAM moderna, las celdas están muy cerca. Accesos repetidos a una fila pueden causar interferencia electromagnética que cambia bits en filas vecinas.",
                  examples: [
                    "Acceder a direcciones de memoria 0x100000 y 0x300000 repetidamente",
                    "Provocar cambios en bits de dirección 0x200000 (fila intermedia)",
                    "Usar acceso a arrays grandes para activar el efecto"
                  ],
                  realWorldCases: [
                    "Primeros experimentos académicos demostraron flipping de bits en 2012",
                    "Google Project Zero ha documentado múltiples variantes de ataques",
                    "Los ataques han sido demostrados en sistemas Linux, Windows y Mac"
                  ]
                },
                {
                  concept: "exploitation",
                  name: "Explotación de Rowhammer",
                  description: "Atacantes pueden usar Rowhammer para cambiar bits críticos en estructuras de datos de control.",
                  technicalDetails: "Al cambiar bits específicos en descriptores de página o estructuras de control, se pueden obtener privilegios elevados o eludir protecciones.",
                  examples: [
                    "Cambiar bit de privilegio en descriptores de página",
                    "Modificar bits de control de memoria",
                    "Alterar estructuras de datos del kernel",
                    "Cambiar bits de validación en estructuras de memoria"
                  ],
                  realWorldCases: [
                    "El ataque 'DRAMMER' en Android obtuvo root sin interacción del usuario",
                    "Se han demostrado exploits que eluden sandboxing de navegadores",
                    "Los atacantes han usado Rowhammer para escalar privilegios en sistemas Linux"
                  ]
                },
                {
                  concept: "mitigation",
                  name: "Mitigaciones de Rowhammer",
                  description: "Varias técnicas pueden prevenir o detectar efectos de Rowhammer.",
                  technicalDetails: "Las mitigaciones incluyen refresco de filas adicionales, detección de acceso agresivo, y aislamiento de procesos sensibles.",
                  examples: [
                    "Refresh más frecuente de filas de memoria (TRR)",
                    "Monitoreo de patrones de acceso agresivo",
                    "Aislamiento de procesos con diferentes privilegios",
                    "Uso de memoria ECC para detección de errores"
                  ],
                  realWorldCases: [
                    "Intel introdujo mitigaciones de hardware en procesadores modernos",
                    "Los sistemas operativos implementaron detección de patrones agresivos",
                    "Los fabricantes de memoria mejoraron diseño para reducir vulnerabilidad"
                  ]
                },
                {
                  concept: "impact",
                  name: "Impacto de Rowhammer",
                  description: "Rowhammer puede comprometer la seguridad del sistema completo.",
                  technicalDetails: "Permite escalación de privilegios, elusión de sandboxing, y acceso no autorizado a datos sensibles.",
                  examples: [
                    "Elevación de privilegios de procesos de usuario",
                    "Escape de máquinas virtuales",
                    "Acceso a datos de otros procesos",
                    "Elusión de mecanismos de seguridad del sistema"
                  ],
                  realWorldCases: [
                    "CVE-2015-8543 en kernel Linux permitió escalación de privilegios",
                    "Vulnerabilidades en browsers permitieron ejecución remota de código",
                    "Sistemas de cloud computing han tenido que mitigar riesgos de VM-to-VM"
                  ]
                }
              ]}
            />
          </motion.div>
        )
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatedHomePage />
          </motion.div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {renderConcept()}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-600">
              <span className="mr-2">ℹ️</span>
              ¿Cómo usar esta guía?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded">
                <div className="font-semibold text-blue-800 mb-1">1. Explora</div>
                <div className="text-sm text-blue-700">
                  Navega por los diferentes conceptos usando el menú lateral
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="font-semibold text-green-800 mb-1">2. Aprende</div>
                <div className="text-sm text-green-700">
                  Lee las explicaciones detalladas con ejemplos prácticos
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="font-semibold text-purple-800 mb-1">3. Entiende</div>
                <div className="text-sm text-purple-700">
                  Usa las visualizaciones para comprender mejor los conceptos
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}