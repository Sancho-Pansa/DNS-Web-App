<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import useDnsApi, { type DnsRecord } from "@/composables/useDnsApi";
import useRecordStore from "@/composables/useRecordStore";
import { onMounted, ref, watch, type Ref } from "vue";
import { AxiosError } from "axios";
import { useToast } from "primevue";

const recordsList: Ref<DnsRecord[]> = ref([]);
const selectedRow: Ref<DnsRecord | null> = ref(null);
const isLoading = ref(true);
const DEFAULT_ZONE = ref(import.meta.env.VITE_DEFAULT_ZONE);

const { selectedRecord } = useRecordStore();
const toast = useToast();

watch(selectedRow, () => {
  selectedRecord.value = selectedRow.value;
});

onMounted(async () => {
  recordsList.value = await refreshTable();
});

async function refreshTable() {
  try {
    const { getRecords } = useDnsApi();
    return getRecords("A", "AAAA", "CNAME", "MX", "NS", "PTR", "SOA", "SRV", "TXT");
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      toast.add({
        summary: `HTTP ${e.code}: ${e.message}`,
        severity: "error",
        life: 3000
      });
    } else {
      toast.add({
        summary: "Unknown Error",
        severity: "error",
        life: 3000
      });
    }
  } finally {
    isLoading.value = false;
  }
  return [];
}
</script>

<template>
  <Toast position="center" />
  <DataTable
    v-model:selection="selectedRow"
    selection-mode="single"
    :value="recordsList"
    size="small"
    :loading="isLoading">
    <Column header="Hostname" field="hostname">
      <template #body="slotProps">
        {{ `${slotProps.data.hostname}.${DEFAULT_ZONE}` }}
      </template>
    </Column>
    <Column header="Record Type" field="type" />
    <Column header="IP Address" field="ipAddress" />
  </DataTable>
</template>
