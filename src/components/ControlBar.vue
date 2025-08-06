<script setup lang="ts">
import { ref } from "vue";
import { Button, Toast, useToast } from "primevue";
import { type FormSubmitEvent } from "@primevue/forms";
import useDnsApi from "@/composables/DnsApi";
import useRecordStore from "@/composables/useRecordStore";
import { AxiosError } from "axios";
import DnsRecordDialog from "@/components/DnsRecordDialog.vue";

const initialValues = ref({
  hostname: "",
  ipAddress: "",
  addPtr: true
});

const newRecordVisible = ref(false);
const editRecordVisible = ref(false);
const hostname = ref("");
const ipAddress = ref("");
const addPtr = ref(true);

const toast = useToast();

const { addRecord } = useDnsApi();

async function onAddSubmit(fse: FormSubmitEvent) {
  if (fse.valid) {
    toast.add({
      severity: "success",
      summary: "Validation successful",
      life: 2000
    });
    try {
      await addRecord(hostname.value, ipAddress.value, addPtr.value);
      toast.add({
        severity: "success",
        summary: "Record added",
        life: 2000
      });
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        generateErrorToast(`HTTP ${e.code}: ${e.message}`);
      } else if (e instanceof Error) {
        generateErrorToast(e.message);
      } else {
        generateErrorToast("Unknown error!");
      }
    }
    newRecordVisible.value = false;
  }
}

function onEditClick() {
  editRecordVisible.value = true;
  const { selectedRecord } = useRecordStore();
  hostname.value = selectedRecord.value?.hostname ?? "";
  ipAddress.value = selectedRecord.value?.ipAddress ?? "";
}

async function onEditSubmit(fse: FormSubmitEvent) {
  if (fse.valid) {
    toast.add({
      severity: "success",
      summary: "Validation successful",
      life: 2000
    });
    try {
      await addRecord(hostname.value, ipAddress.value, addPtr.value);
      toast.add({
        severity: "success",
        summary: "Record added",
        life: 2000
      });
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        generateErrorToast(`HTTP ${e.code}: ${e.message}`);
      } else if (e instanceof Error) {
        generateErrorToast(e.message);
      } else {
        generateErrorToast("Unknown error!");
      }
    }
  }
}

function onDeleteClick() {

}

function generateErrorToast(message: string) {
  toast.add({ severity: "error", summary: message });
}

</script>
<template>
  <Toast
    position="bottom-center"
    severity="error"
  />
  <Button
    label="Новая запись"
    @click="newRecordVisible = true">
    <slot name="icon">
      <img src="@/assets/add.svg" alt="plus">
      Новая запись
    </slot>
  </Button>
  <Button
    label="Изменить запись"
    @click="onEditClick">
    <slot name="icon">
      <img src="@/assets/edit.svg" alt="edit">
      Изменить запись
    </slot>
  </Button>
  <Button
    label="Удалить запись"
    @click="onDeleteClick">
    <slot name="icon">
      <img src="@/assets/delete.svg" alt="delete">
      Удалить запись
    </slot>
  </Button>
  <DnsRecordDialog
    header="Добавить A-запись в DNS"
    v-model:visible="newRecordVisible"
    v-model:hostname="hostname"
    v-model:ip-address="ipAddress"
    v-model:add-ptr="addPtr"
    :initial-values
    @submit="onAddSubmit"
  />
  <DnsRecordDialog
    header="Изменить A-запись в DNS"
    v-model:visible="editRecordVisible"
    v-model:hostname="hostname"
    v-model:ip-address="ipAddress"
    v-model:add-ptr="addPtr"
    :initial-values
    @submit="onEditSubmit"
  />
</template>
