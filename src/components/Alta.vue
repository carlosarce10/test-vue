<template>
  <v-form @submit.prevent="onSubmit">
    <v-row>
      <!-- idTarifa -->
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="idTarifa"
          label="ID Tarifa"
          type="number"
          :error-messages="errors.idTarifa"
          variant="outlined"
          density="compact"
        />
      </v-col>

      <!-- tarifa -->
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="tarifa"
          label="Tarifa"
          :error-messages="errors.tarifa"
          variant="outlined"
          density="compact"
        />
      </v-col>

      <!-- concepto -->
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="concepto"
          label="Concepto"
          :error-messages="errors.concepto"
          variant="outlined"
          density="compact"
        />
      </v-col>

      <!-- importe -->
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="importe"
          label="Importe"
          type="number"
          :error-messages="errors.importe"
          variant="outlined"
          density="compact"
        />
      </v-col>

      <!-- estatus -->
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="estatus"
          :items="opcionesEstatus"
          item-title="label"
          item-value="value"
          label="Estatus"
          :error-messages="errors.estatus"
          variant="outlined"
          density="compact"
          return-object
        />
      </v-col>

      <!-- tipoProducto -->
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="tipoProducto"
          :items="opcionesTipoProducto"
          label="Tipo Producto"
          :error-messages="errors.tipoProducto"
          variant="outlined"
          density="compact"
        />
      </v-col>

      <!-- tipoDocumento -->
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="tipoDocumento"
          :items="opcionesTipoDocumento"
          item-title="label"
          item-value="value"
          label="Tipo Documento"
          :error-messages="errors.tipoDocumento"
          variant="outlined"
          density="compact"
          return-object
        />
      </v-col>

      <!-- aplicativos -->
      <v-col cols="12" sm="6" md="3">
        <v-combobox
          v-model="aplicativos"
          label="Aplicativos"
          :error-messages="errors.aplicativos"
          variant="outlined"
          density="compact"
          multiple
          chips
          closable-chips
        />
      </v-col>

      <!-- diaInicio -->
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="diaInicio"
          label="Día Inicio"
          type="date"
          :error-messages="errors.diaInicio"
          variant="outlined"
          density="compact"
        />
      </v-col>

      <!-- diaFin -->
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="diaFin"
          label="Día Fin"
          type="date"
          :error-messages="errors.diaFin"
          variant="outlined"
          density="compact"
        />
      </v-col>

      <!-- fh_ultima_modificacion -->
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="fh_ultima_modificacion"
          label="Última Modificación"
          type="date"
          :error-messages="errors.fh_ultima_modificacion"
          variant="outlined"
          density="compact"
        />
      </v-col>
    </v-row>

    <!-- Acciones -->
    <v-row justify="end" class="mt-2">
      <v-col cols="auto">
        <button type="button" class="btn btn--ghost" @click="onCancel">
          Cancelar
        </button>
      </v-col>
      <v-col cols="auto">
        <button type="submit" class="btn btn--primary">
          Guardar
        </button>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { useForm, useField } from "vee-validate";
import { Toast } from "@/plugins/sweetalert2";
import Swal from "@/plugins/sweetalert2";

const opcionesEstatus = [
  { label: "Activo", value: 1 },
  { label: "Inactivo", value: 0 },
];

const opcionesTipoProducto = ["Producto A", "Producto B", "Producto C"];

const opcionesTipoDocumento = [
  { label: "Factura", value: "FAC" },
  { label: "Recibo", value: "REC" },
  { label: "Nota de crédito", value: "NC" },
];

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: {
    idTarifa: "required",
    tarifa: "required",
    concepto: "required",
    importe: "required",
    estatus: "required",
    tipoProducto: "required",
    tipoDocumento: "required",
    aplicativos: "required",
    diaInicio: "required",
    diaFin: "required",
    fh_ultima_modificacion: "required",
  },
});

const { value: idTarifa } = useField("idTarifa", undefined, { label: "ID Tarifa" });
const { value: tarifa } = useField("tarifa", undefined, { label: "Tarifa" });
const { value: concepto } = useField("concepto", undefined, { label: "Concepto" });
const { value: importe } = useField("importe", undefined, { label: "Importe" });
const { value: estatus } = useField("estatus", undefined, { label: "Estatus" });
const { value: tipoProducto } = useField("tipoProducto", undefined, { label: "Tipo Producto" });
const { value: tipoDocumento } = useField("tipoDocumento", undefined, { label: "Tipo Documento" });
const { value: aplicativos } = useField("aplicativos", undefined, { label: "Aplicativos" });
const { value: diaInicio } = useField("diaInicio", undefined, { label: "Día Inicio" });
const { value: diaFin } = useField("diaFin", undefined, { label: "Día Fin" });
const { value: fh_ultima_modificacion } = useField("fh_ultima_modificacion", undefined, { label: "Última Modificación" });

const onSubmit = handleSubmit((values) => {
  const registros = JSON.parse(localStorage.getItem("tarifas") ?? "[]");

  const existe = registros.some((r) => Number(r.idTarifa) === Number(values.idTarifa));
  if (existe) {
    Swal.fire({
      icon: "warning",
      title: "ID duplicado",
      text: `Ya existe un registro con el ID ${values.idTarifa}.`,
      confirmButtonText: "Aceptar",
    });
    return;
  }

  registros.push(values);
  localStorage.setItem("tarifas", JSON.stringify(registros));

  Toast.fire({ icon: "success", title: "Registro guardado correctamente" });
  resetForm();
});

const onCancel = () => resetForm();
</script>
