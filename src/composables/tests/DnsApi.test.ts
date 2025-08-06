import { describe, expect, test, vi } from "vitest";
import useDnsApi from "../DnsApi";
import { type AxiosInstance } from "axios";

vi.mock("axios", async () => {
  const mockGet = vi.fn().mockResolvedValue({
    data: [
      {
        HostName: "@",
        RecordType: "A",
        RecordData: "10.127.200.101"
      },
      {
        HostName: "@",
        RecordType: "A",
        RecordData: "10.127.200.100"
      },
      {
        HostName: "dc01",
        RecordType: "A",
        RecordData: "10.127.200.100"
      },
      {
        HostName: "asr.bss",
        RecordType: "A",
        RecordData: "10.127.200.145"
      }
    ]
  });
  const mockCreate = vi.fn(() => ({ get: mockGet }) as unknown as AxiosInstance);

  return {
    default: {
      create: mockCreate
    }
  };
});

describe("Method /dns/list to PSU endpoint", () => {
  const dnsApi = useDnsApi();

  test("Gets DNS Records table", async () => {
    const response = await dnsApi.getRecords("A");
    expect(response.length).toBeGreaterThan(0);

    const record = response.find(r => r.hostname === "dc01");
    expect(record).toBeDefined();
    expect(record?.ipAddress).toStrictEqual("10.127.200.100");
  });
});

describe("Method /dns/add-record to PSU Endpoint", () => {
  test("Add A Record to DNS", async () => {
    // const response
  });
});
