import axios, { AxiosError } from "axios";

type RecordType = "A" | "AAAA" | "CNAME" | "MX" | "NS" | "PTR" | "SOA" | "SRV" | "TXT";

export interface DnsRecord {
  hostname: string,
  type: RecordType,
  ipAddress?: string
}
interface ReceivedRecord {
  HostName: string,
  RecordType: string,
  RecordData: string
}

export default function useDnsApi() {
  const API_ADDRESS: string = import.meta.env.VITE_API_SECURE_URL;

  const HTTP_UNPROCESSABLE_CONTENT = 422;

  const axiosInstance = axios.create({
    baseURL: API_ADDRESS
  });

  const getRecords = async function(...recordTypes: RecordType[]) {
    try {
      const response = await axiosInstance.get("/dns/list");
      const recordData: DnsRecord[] = (response.data as ReceivedRecord[]).map(
        (r: ReceivedRecord): DnsRecord => ({
          hostname: r.HostName,
          type: r.RecordType as RecordType,
          ipAddress: r.RecordData
        })
      );

      return recordData.filter(r => recordTypes.includes(r.type));
    } catch (e: unknown) {
      throw e;
    }
  };

  const addRecord = async function(hostname: string, ipAddress: string, addPtr: boolean = true) {
    try {
      axiosInstance.post("/dns/add-record", {
        Name: hostname,
        IpAddress: ipAddress,
        addPtr
      });
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        if (e.status === HTTP_UNPROCESSABLE_CONTENT) {
          throw new Error("Hostname already exists!");
        }
      }
      throw e;
    }
  };

  const deleteRecord = async function(hostname: string) {
    try {
      axiosInstance.post("/dns/delete-record", {
        Name: hostname
      });
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        throw new Error(e.message);
      }
      throw e;
    }
  };

  return {
    getRecords,
    addRecord,
    deleteRecord
  };
}
