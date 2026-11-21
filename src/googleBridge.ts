export type HostRequest =
  | { method: "getWorkbookData" }
  | { method: "loadModuleData"; moduleName: string }
  | { method: "saveModuleData"; moduleName: string; records: Record<string,string>[]; expectedRevision: number };

type HostResponse<T> = { channel: "nic-valsad-office"; requestId: string; ok: true; result: T }
  | { channel: "nic-valsad-office"; requestId: string; ok: false; error: string };

const pending = new Map<string, { resolve: (value: unknown) => void; reject: (reason: Error) => void }>();

if (typeof window !== "undefined") {
  window.addEventListener("message", event => {
    const data = event.data as HostResponse<unknown> | undefined;
    if (!data || data.channel !== "nic-valsad-office" || !data.requestId) return;
    const request = pending.get(data.requestId);
    if (!request) return;
    pending.delete(data.requestId);
    if (data.ok) request.resolve(data.result);
    else request.reject(new Error(data.error || "The secure Google connection failed."));
  });
}

export function requestHost<T = unknown>(request: HostRequest): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const requestId = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `req-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const timeout = window.setTimeout(() => {
      pending.delete(requestId);
      reject(new Error("Open this application from its authorised Google Apps Script web-app link. Direct GitHub Pages access does not provide database access."));
    }, 20000);
    pending.set(requestId, {
      resolve: value => { window.clearTimeout(timeout); resolve(value as T); },
      reject: error => { window.clearTimeout(timeout); reject(error); }
    });
    window.parent.postMessage({ ...request, channel: "nic-valsad-office", requestId }, "*");
  });
}
