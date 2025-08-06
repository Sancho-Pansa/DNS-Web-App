<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import useDnsApi, { type DnsRecord } from "@/composables/DnsApi";
import useRecordStore from "@/composables/useRecordStore";
import { onMounted, ref, watch, type Ref } from "vue";

const recordsList: Ref<DnsRecord[]> = ref([]);
const selectedRow: Ref<DnsRecord | null> = ref(null);
const isLoading = ref(true);
const DEFAULT_ZONE = ref(import.meta.env.VITE_DEFAULT_ZONE);

const { selectedRecord } = useRecordStore();

watch(selectedRow, () => {
  selectedRecord.value = selectedRow.value;
});

onMounted(async () => {
  recordsList.value = await refreshTable();
  isLoading.value = false;
});

async function refreshTable() {
  const { getRecords } = useDnsApi();
  return getRecords("A", "AAAA", "CNAME", "MX", "NS", "PTR", "SOA", "SRV", "TXT");
}
</script>

<template>
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
