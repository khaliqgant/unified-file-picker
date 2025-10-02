/**
 * OneDrive File Picker Integration
 * 
 * Handles the native Microsoft OneDrive File Picker v8
 */

// OneDrive File Picker types
export interface OneDrivePickerOptions {
  sdk: string;
  entry: {
    oneDrive?: {};
    sharePoint?: {
      siteId?: string;
      webUrl?: string;
    };
  };
  authentication: {};
  messaging: {
    origin: string;
    channelId: string;
  };
  selection: {
    mode: string;
  };
}

/**
 * Opens the OneDrive Picker
 */
export async function openOneDrivePicker(
  accessToken: string,
  options: any,
  onPick: (files: any[]) => void,
  onCancel: () => void
): Promise<void> {
  console.log('Opening native OneDrive File Picker v8 with options:', options);

  const tenant = process.env.REACT_APP_SHAREPOINT_TENANT || 'your-tenant';
  const clientId = process.env.REACT_APP_ONEDRIVE_CLIENT_ID || 'your-client-id';

  if (!clientId) {
    console.error("OneDrive Client ID (REACT_APP_ONEDRIVE_CLIENT_ID) is not set.");
    onCancel();
    return;
  }

  const channelId = crypto.randomUUID();

  const pickerOptions: OneDrivePickerOptions = {
    sdk: "8.0",
    entry: options.siteId ? {
      sharePoint: {
        siteId: options.siteId,
      }
    } : {
      oneDrive: {}
    },
    authentication: {},
    messaging: {
      origin: window.location.origin,
      channelId: channelId
    },
    selection: {
      mode: "single",
    },
  };

  const baseUrl = options.siteId
    ? `https://${tenant}.sharepoint.com/sites/${options.siteId}`
    : `https://${tenant}-my.sharepoint.com`;

  const queryString = new URLSearchParams({
    filePicker: JSON.stringify(pickerOptions),
    locale: 'en-us'
  });

  const url = `${baseUrl}/_layouts/15/FilePicker.aspx?${queryString}`;

  const win = window.open("", "OneDrivePicker", "width=1080,height=680");
  if (!win) {
    console.error("Failed to open OneDrive picker window.");
    onCancel();
    return;
  }

  const form = win.document.createElement("form");
  form.setAttribute("action", url);
  form.setAttribute("method", "POST");

  const tokenInput = win.document.createElement("input");
  tokenInput.setAttribute("type", "hidden");
  tokenInput.setAttribute("name", "access_token");
  tokenInput.setAttribute("value", accessToken);
  form.appendChild(tokenInput);

  win.document.body.append(form);
  form.submit();

  let messagePort: MessagePort;

  const messageListener = (event: MessageEvent) => {
    if (event.source === win && event.data.type === "initialize" && event.data.channelId === channelId) {
      messagePort = event.ports[0];
      messagePort.addEventListener("message", async (msgEvent: MessageEvent) => {
        const payload = msgEvent.data;
        switch (payload.type) {
          case "notification":
            console.log("OneDrive Picker Notification:", payload.data);
            break;
          case "command":
            messagePort.postMessage({ type: "acknowledge", id: payload.id });
            const command = payload.data;
            switch (command.command) {
              case "authenticate":
                messagePort.postMessage({
                  type: "result",
                  id: payload.id,
                  data: { result: "token", token: accessToken }
                });
                break;
              case "close":
                win.close();
                onCancel();
                break;
              case "pick":
                const pickedItems = command.data.items;
                const files = pickedItems.map((item: any) => ({
                  provider: "onedrive",
                  id: item.id,
                  name: item.name,
                  mimeType: item.file?.mimeType || null,
                  size: item.size || null,
                  downloadUrl: item["@microsoft.graph.downloadUrl"] || null,
                  webViewUrl: item.webUrl || null,
                  raw: item
                }));
                onPick(files);
                win.close();
                messagePort.postMessage({ type: "result", id: payload.id, data: { result: "success" } });
                break;
              default:
                messagePort.postMessage({
                  type: "result",
                  id: payload.id,
                  data: { result: "error", error: { code: "unsupportedCommand", message: command.command } }
                });
                break;
            }
            break;
        }
      });
      messagePort.start();
      messagePort.postMessage({ type: "activate" });
    }
  };

  window.addEventListener("message", messageListener);

  const checkWindowClosed = setInterval(() => {
    if (win.closed) {
      clearInterval(checkWindowClosed);
      window.removeEventListener("message", messageListener);
      onCancel();
    }
  }, 500);
}
