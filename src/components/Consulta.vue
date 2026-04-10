<template>
  <div class="consulta">
    <!-- Buscador -->
    <div class="consulta__search">
      <v-text-field
        v-model="idBusqueda"
        label="Buscar por ID Tarifa"
        type="number"
        variant="outlined"
        density="compact"
        clearable
        hide-details
        class="consulta__search-input"
        @keyup.enter="buscar"
      />
      <button class="consulta__search-btn" @click="buscar">
        <v-icon size="18">mdi-magnify</v-icon>
        Buscar
      </button>
    </div>

    <!-- Instrucción -->
    <p v-if="!tarifas.length" class="consulta__hint">
      Ingresa un ID de tarifa y presiona Buscar para ver los resultados.
    </p>

    <!-- Tabla -->
    <div v-if="tarifas.length" class="consulta__table-wrapper">
      <v-data-table
        :headers="headers"
        :items="tarifas"
        item-value="idTarifa"
        show-expand
        hide-default-footer
        :items-per-page="-1"
        class="consulta__table"
      >
        <template #expanded-row="{ columns, item }">
          <tr class="consulta__expanded-row">
            <td :colspan="columns.length" class="consulta__expanded-cell">
              <p class="consulta__aplicativos-title">Aplicativos</p>
              <table class="consulta__aplicativos-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Aplicativo</th>
                    <th>Cuota</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ap in item.aplicativos" :key="ap.idAplicativo">
                    <td>{{ ap.idAplicativo }}</td>
                    <td>{{ ap.aplicativo }}</td>
                    <td>{{ ap.cuotaAplicativo }}</td>
                  </tr>
                  <tr v-if="!item.aplicativos?.length">
                    <td colspan="3" class="consulta__aplicativos-empty">
                      Sin aplicativos
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "@/plugins/axios";
import Swal from "@/plugins/sweetalert2";

const idBusqueda = ref(null);
const tarifas = ref([]);

const headers = [
  { title: "ID", key: "idTarifa" },
  { title: "Tarifa", key: "tarifa" },
  { title: "Concepto", key: "concepto" },
  { title: "Estatus", key: "estatus" },
  { title: "Tipo Documento", key: "tipoDocumento" },
  { title: "Día Inicio", key: "diaInicio" },
  { title: "Día Fin", key: "diaFin" },
  { title: "Importe", key: "importe" },
  { title: "Última Modificación", key: "fh_ultima_modificacion" },
];

const formatDate = (fecha) => {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const mapTarifa = (t) => ({
  idTarifa: t.idTarifa,
  tarifa: t.tarifa ?? "—",
  concepto: t.concepto ?? "—",
  estatus: t.estatus?.descripcion ?? "—",
  tipoDocumento: t.tipoDocumento?.descripcion ?? "—",
  diaInicio: t.diaInicio ?? "—",
  diaFin: t.diaFin ?? "—",
  importe: t.importe ? `$${t.importe}` : "—",
  fh_ultima_modificacion: formatDate(t.fh_ultima_modificacion),
  aplicativos: t.aplicativos ?? [],
});

const mapTarifaLocal = (t) => ({
  idTarifa: t.idTarifa,
  tarifa: t.tarifa ?? "—",
  concepto: t.concepto ?? "—",
  estatus: t.estatus?.label ?? t.estatus ?? "—",
  tipoDocumento: t.tipoDocumento?.label ?? t.tipoDocumento ?? "—",
  diaInicio: t.diaInicio ?? "—",
  diaFin: t.diaFin ?? "—",
  importe: t.importe ? `$${t.importe}` : "—",
  fh_ultima_modificacion: formatDate(t.fh_ultima_modificacion),
  aplicativos: Array.isArray(t.aplicativos)
    ? t.aplicativos.map((a, i) =>
        typeof a === "string"
          ? { idAplicativo: i + 1, aplicativo: a, cuotaAplicativo: "—" }
          : a
      )
    : [],
});

const buscarEnLocal = (id) => {
  const registros = JSON.parse(localStorage.getItem("tarifas") ?? "[]");
  return registros.filter((r) => Number(r.idTarifa) === Number(id));
};

const buscar = async () => {
  if (!idBusqueda.value) return;

  try {
    const { data } = await api.post("/tarifas/consulta", {
      idTarifa: String(idBusqueda.value),
    });

    const resultado = data.response?.tarifas ?? [];

    if (resultado.length) {
      tarifas.value = resultado.map(mapTarifa);
      return;
    }

    const local = buscarEnLocal(idBusqueda.value);

    if (local.length) {
      tarifas.value = local.map(mapTarifaLocal);
      return;
    }

    tarifas.value = [];
    Swal.fire({
      icon: "info",
      title: "Sin resultados",
      text: `No se encontró información para el ID ${idBusqueda.value}.`,
      confirmButtonText: "Aceptar",
    });
  } catch {
    tarifas.value = [];
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al consultar. Intenta de nuevo.",
      confirmButtonText: "Aceptar",
    });
  }
};
</script>
