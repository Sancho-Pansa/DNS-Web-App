import axios, { type AxiosResponse } from "axios"
import { hostname } from "os"

type RecordType = "A" | "AAAA" | "CNAME" | "MX" | "NS" | "PTR" | "SOA" | "SRV" | "TXT"

export interface DnsRecord {
  hostname: string
  type: RecordType
  ipAddress?: string
}
interface ReceivedRecord {
  HostName: string
  RecordType: string
  RecordData: string
}

export default function useDnsApi() {
  const API_ADDRESS: string = import.meta.env.VITE_API_BASE_URL

  const axiosInstance = axios.create({
    baseURL: API_ADDRESS
  })

  const getRecords = async function (...recordTypes: RecordType[]) {
    try {
      const response = await axiosInstance.get("/dns/list")
      const recordData: DnsRecord[] = (response.data as ReceivedRecord[]).map(
        (r: ReceivedRecord): DnsRecord => ({
          hostname: r.HostName,
          type: r.RecordType as RecordType,
          ipAddress: r.RecordData
        })
      )

      return recordData.filter((r) => recordTypes.includes(r.type))
    } catch (e) {
      throw e
    }
  }

  return {
    getRecords
  }
}
