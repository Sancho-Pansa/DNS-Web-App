import { ref, type Ref } from "vue";
import type { DnsRecord } from "./useDnsApi";

const selectedRecord: Ref<DnsRecord | null> = ref(null);

export default function useRecordStore() {
  return {
    selectedRecord
  };
}
