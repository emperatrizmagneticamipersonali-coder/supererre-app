# CERTIFICADO DE PUBLICACION — SuperErre

> Evidencia operativa sin secretos. Estado permitido: `PASS`, `BLOCKED`, `NOT_APPLICABLE`.
> Alcance de este certificado: conexión GitHub → Vercel (publicación automática) y esquema base de Supabase. NO cubre venta real (no hay dominio propio, Auth de la app sin conectar al código, sin Hotmart, sin Resend) — ver Veredicto.

## Identidad

| Campo | Valor no sensible | Estado | Evidencia |
|---|---|---|---|
| Local root | `C:\Users\doran\.claude\PRONUNCIACION DE LA R\superrre-app` | PASS | repo local verificado |
| GitHub owner/repo | `emperatrizmagneticamipersonali-coder/supererre-app` (privado) | PASS | `git remote -v` |
| Git remote origin | `https://github.com/emperatrizmagneticamipersonali-coder/supererre-app.git` | PASS | `git remote -v` |
| Default branch | `master` | PASS | `git log` / push exitoso a `master` |
| Vercel scope/project | equipo `anni11` / proyecto `Supererre-app` | PASS | confirmado por el usuario en el dashboard |
| Vercel connected repository | `emperatrizmagneticamipersonali-coder/supererre-app` | PASS | GitHub App de Vercel instalada, deploys automáticos confirmados |
| Vercel production branch | `master` | PASS | los 3 pushes a `master` dispararon deploy de producción |
| Vercel root directory | `superrre-app` | PASS | corregido de `/` a `superrre-app` durante el setup; Framework Preset pasó de "Other" a "Next.js" |
| Supabase Production project-ref | `tpjvjlzrigxnvluhpzep` (proyecto único `supererre`) | PASS | URL `https://tpjvjlzrigxnvluhpzep.supabase.co` confirmada por el usuario |
| Supabase Preview/Dev project-ref | — | NOT_APPLICABLE | no se creó un segundo proyecto de dev/preview; solo existe producción |
| Production domain | `https://supererre-app.vercel.app` | PASS | verificado por mí navegando la URL: landing real cargó completa |

## Cadena de publicación

| Gate | Estado | Evidencia |
|---|---|---|
| P0 inventario coincide | PASS | 3 cuentas creadas desde cero (GitHub, Supabase, Vercel), documentadas en ESTADO.md |
| P1 preflight/GitHub | PASS | push inicial exitoso, SHA local=remoto (`6b37445`), token de grano fino repo-scoped guardado por el usuario en Windows Credential Manager (nunca pasó por el chat) |
| P2 GitHub -> Vercel persistente | PASS | GitHub App de Vercel instalada y autorizada por el usuario en su propio navegador; deploys automáticos confirmados 3 veces seguidas |
| P3 Supabase target + dry-run + history | PASS | esquema (`parents`/`children`/`exercise_progress`/`purchases`) y 6 políticas RLS creadas por el usuario a mano en el SQL Editor, verificadas por CSV (`information_schema.columns` + `pg_policies`) |
| P4 variables aisladas por ambiente | NOT_APPLICABLE | el código de la app todavía NO llama a Supabase (sigue usando localStorage) — no hay ninguna variable de entorno que configurar todavía; queda pendiente para cuando se conecte el backend real |
| P5 Preview automático desde Git | PASS | commit canario (`bbcafc7`, bump de versión 0.1.0→0.1.1) publicado solo, confirmado visualmente por el usuario en Vercel → Deployments |
| P6 dominio/Auth/callbacks | BLOCKED | no hay dominio propio comprado todavía (se usa el subdominio gratis `.vercel.app`); Supabase Auth no está conectado al código de la app |
| P7 Production automático + SHA | PASS | los 3 commits (`bbcafc7`, `c454e7f`, `7a9164b`) dispararon deploy de producción automático cada uno, confirmado por el usuario en el dashboard con estado "Ready" |
| P8 segunda publicación + reversión automáticas | PASS | segundo commit canario (`c454e7f`, bump a 0.1.2) publicado solo, luego reversión (`7a9164b`, vuelta a 0.1.0) también publicada sola — ambos confirmados "Ready" por el usuario |

## Evidencia de commits

```text
production_git_sha: 7a9164b (revert final, HEAD de master)
vercel_git_sha: no verificado por mí de forma directa (sin acceso a la sesión de Vercel del usuario) — coincidencia confirmada de forma indirecta: el usuario reportó ver el mensaje de commit exacto de cada push como deployment "Ready" en Vercel, en el mismo orden que los pushes
api_version_sha: NOT_APPLICABLE — no existe endpoint /api/version en la app
production_deployment_id: no capturado (el usuario no tiene por qué copiar IDs internos de Vercel; no es sensible pero no se pidió)
preview_canary_sha: bbcafc7
production_canary_sha: c454e7f
revert_canary_sha: 7a9164b
automatic_updates_verified: true
production_sha_match: true (por mensaje de commit + orden, no por comparación literal de hash en la UI de Vercel)
```

## Variables por ambiente

No escribir valores. Registrar solo nombre, clasificación y presencia verificada.

| Nombre | Pública/secreta | Development | Preview | Production | Redeploy verificado |
|---|---|---:|---:|---:|---:|
| — | — | — | — | — | — |

> Ninguna variable configurada todavía: el código de la app aún no consume Supabase ni ningún otro servicio externo (usa localStorage). Se completará esta tabla cuando se conecte el backend real.

```text
secrets_shared_in_chat: false
production_secrets_in_preview: false
secret_scan_local: NOT_APPLICABLE (sin variables/secretos en el código todavía)
secret_scan_ci_or_provider: NOT_APPLICABLE
rotation_required: false
```

## Dependencias de URL

| Sistema | Configuración | URL/patrón no sensible | Prueba |
|---|---|---|---|
| Vercel | dominio/SSL | `supererre-app.vercel.app` (HTTPS automático de Vercel) | cargado y verificado por mí |
| App | site/base URL | `https://supererre-app.vercel.app` | landing real confirmada |
| Supabase Auth | Site URL | no configurado | BLOCKED — Auth no conectado al código todavía |
| Supabase Auth | redirect allowlist | no configurado | BLOCKED |
| OAuth | callback/origin | NOT_APPLICABLE | no hay login social planeado por ahora |
| Resend | dominio/enlaces | no configurado | pendiente, fuera de alcance de esta sesión |
| Pagos | return/cancel URL | no configurado | pendiente (Hotmart), fuera de alcance de esta sesión |
| Webhooks | endpoint | no configurado | pendiente (Hotmart), fuera de alcance de esta sesión |
| Analytics | dominio/origen | no configurado | pendiente |

## Supabase

```text
supabase_target_verified: true
migration_list_match: NOT_APPLICABLE (esquema creado a mano por el usuario en el SQL Editor, no vía CLI/migraciones versionadas)
db_push_dry_run_reviewed: NOT_APPLICABLE
production_remote_reset_used: false
production_seed_used: false
rls_idor_test: BLOCKED — no se probó porque el código de la app todavía no hace ninguna llamada real a Supabase (no hay endpoint que atacar todavía)
advisors: no corrido (requiere acceso al proyecto que el usuario no compartió como token; se puede correr en otra sesión si se conecta el MCP de Supabase)
```

## Pruebas en URL final

| Flujo | Estado | Evidencia |
|---|---|---|
| Landing/onboarding/paywall | PASS (landing) / NOT_APPLICABLE (onboarding/paywall corren dentro de la SPA local, no dependen de infra externa) | landing real cargó en `supererre-app.vercel.app`, texto confirmado |
| Registro/login/logout/reset | NOT_APPLICABLE | la app usa login local (localStorage), no Supabase Auth todavía |
| Acción core | NOT_APPLICABLE | no depende de backend externo todavía |
| Pago/webhook/entitlement | BLOCKED | Hotmart no integrado |
| Email transaccional | BLOCKED | Resend no integrado |
| Analytics/backoffice | BLOCKED | no configurado |
| Error/rollback | PASS | el revert (`7a9164b`) demostró que un rollback vía commit se publica automático igual que un cambio normal |

## Rollback y operación

```text
last_known_good_deployment: commit 7a9164b (master, "chore: revertir cambios de prueba, version vuelve a 0.1.0")
code_rollback_tested: true
db_expand_contract_compatible: NOT_APPLICABLE (esquema nuevo, sin datos de producción reales todavía)
owner_runbook_location: ESTADO.md (checkpoints con las 2 trampas de GitHub en español documentadas)
recertification_triggers_documented: true — recertificar cuando se conecte Auth/datos reales de Supabase, se compre dominio propio, o se integre Hotmart/Resend
```

## Veredicto

```text
VEREDICTO: APTO (solo para el alcance certificado: publicación continua GitHub→Vercel + esquema base Supabase)
             NO APTO PARA VENDER TODAVÍA — faltan Auth real conectado al código, dominio propio, Hotmart y Resend
Bloqueantes: P6 (dominio/Auth), integración de pagos (Hotmart), email transaccional (Resend), RLS sin probar en uso real
Riesgos residuales: vercel_git_sha no verificado por comparación literal de hash (solo por mensaje de commit + orden, ya que no tengo acceso a la sesión de Vercel del usuario); Supabase advisors no corrido
Responsable: usuario (dueño del proyecto) + asistente (ejecución técnica)
Fecha UTC: 2026-08-17
```
