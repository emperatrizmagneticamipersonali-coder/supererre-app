import { getUsuarios } from "@/lib/admin/data";
import { UsuariosClient } from "@/components/admin/UsuariosClient";

export default async function AdminUsuariosPage() {
  const usuarios = await getUsuarios();
  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-txt-primary">
        Usuarios
      </h1>
      <p className="mt-1 text-sm text-txt-secondary">
        {usuarios.length === 0
          ? "Todavía no hay ningún usuario real registrado."
          : `${usuarios.length} usuario${usuarios.length === 1 ? "" : "s"} en total.`}
      </p>
      <UsuariosClient usuarios={usuarios} />
    </div>
  );
}
