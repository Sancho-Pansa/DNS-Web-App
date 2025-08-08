<script setup lang="ts">
import { ref } from "vue";
import { Button, Toast, useToast } from "primevue";
import { type FormSubmitEvent } from "@primevue/forms";
import useDnsApi from "@/composables/DnsApi";
import useRecordStore from "@/composables/useRecordStore";
import { AxiosError } from "axios";
import DnsRecordDialog from "@/components/DnsRecordDialog.vue";

const DEFAULT_VALUES = {
  hostname: "",
  ipAddress: "",
  addPtr: true
};

const newRecordVisible = ref(false);
const deleteRecordVisible = ref(false);
const hostname = ref("");
const ipAddress = ref("");
const addPtr = ref(true);

const toast = useToast();

const { addRecord, deleteRecord } = useDnsApi();

function onAddRecordClick() {
  hostname.value = DEFAULT_VALUES.hostname;
  ipAddress.value = DEFAULT_VALUES.ipAddress;
  addPtr.value = DEFAULT_VALUES.addPtr;
  newRecordVisible.value = true;
}

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
    } finally {
      refreshTable();
    }
    newRecordVisible.value = false;
  }
}

function onDeleteClick() {
  deleteRecordVisible.value = true;
  const { selectedRecord } = useRecordStore();
  hostname.value = selectedRecord.value?.hostname ?? "";
  ipAddress.value = selectedRecord.value?.ipAddress ?? "";
}

async function onDeleteSubmit(fse: FormSubmitEvent) {
  console.log(fse);
  toast.add({
    severity: "success",
    summary: "Validation successful",
    life: 2000
  });
  try {
    await deleteRecord(hostname.value);
    toast.add({
      severity: "success",
      summary: "Deletion successful",
      life: 2000
    });
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      generateErrorToast(`HTTP ${e.code}: ${e.message}`);
    } else if (e instanceof Error) {
      generateErrorToast(e.message);
    } else {
      generateErrorToast("Unknown error!");
      deleteRecordVisible.value = false;
    }
  } finally {
    refreshTable();
  }
  deleteRecordVisible.value = false;
}

function refreshTable() {
  return;
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
    @click="onAddRecordClick">
    <slot name="icon">
      <img src="@/assets/add.svg" alt="plus">
      Новая запись
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
    header="Добавить A-запись"
    v-model:visible="newRecordVisible"
    v-model:hostname="hostname"
    v-model:ip-address="ipAddress"
    v-model:add-ptr="addPtr"
    @submit="onAddSubmit"
  />
  <DnsRecordDialog
    header="Удалить A-запись"
    v-model:visible="deleteRecordVisible"
    v-model:hostname="hostname"
    v-model:ip-address="ipAddress"
    v-model:add-ptr="addPtr"
    @submit="onDeleteSubmit"
  />
</template>
