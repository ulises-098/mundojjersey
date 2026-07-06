"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { googleDriveConfig, isGoogleDriveEnabled } from "@/lib/config";

interface GoogleDocsView {
  setIncludeFolders: (v: boolean) => GoogleDocsView;
  setSelectFolderEnabled: (v: boolean) => GoogleDocsView;
  setMimeTypes: (v: string) => GoogleDocsView;
}

interface GooglePickerBuilder {
  addView: (view: GoogleDocsView) => GooglePickerBuilder;
  setOAuthToken: (token: string) => GooglePickerBuilder;
  setDeveloperKey: (key: string) => GooglePickerBuilder;
  setAppId: (id: string) => GooglePickerBuilder;
  enableFeature: (feature: unknown) => GooglePickerBuilder;
  setCallback: (cb: (data: PickerResponse) => void) => GooglePickerBuilder;
  build: () => { setVisible: (v: boolean) => void };
}

declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
    };
    google: {
      picker: {
        DocsView: new (viewId: unknown) => GoogleDocsView;
        ViewId: { DOCS_IMAGES: unknown };
        PickerBuilder: new () => GooglePickerBuilder;
        Feature: { MULTISELECT_ENABLED: unknown };
        Action: { PICKED: string };
      };
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (resp: { access_token?: string }) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

interface PickerDoc {
  id: string;
  name?: string;
}

interface PickerResponse {
  action: string;
  docs: PickerDoc[];
}

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";

export function PhotoPicker({
  name = "images",
  required = false,
  label = "Fotos (podés elegir varias)",
}: {
  name?: string;
  required?: boolean;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const tokenClientRef = useRef<ReturnType<
    Window["google"]["accounts"]["oauth2"]["initTokenClient"]
  > | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [gapiReady, setGapiReady] = useState(false);
  const [gisReady, setGisReady] = useState(false);
  const [loadingDrive, setLoadingDrive] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);

  const DRIVE_DOWNLOAD_TIMEOUT_MS = 20000;

  useEffect(() => {
    if (!inputRef.current) return;
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    inputRef.current.files = dataTransfer.files;
  }, [files]);

  function handleLocalChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function openPicker(accessToken: string) {
    window.gapi.load("picker", () => {
      const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS_IMAGES)
        .setIncludeFolders(true)
        .setSelectFolderEnabled(false);

      const picker = new window.google.picker.PickerBuilder()
        .addView(view)
        .setOAuthToken(accessToken)
        .setDeveloperKey(googleDriveConfig.apiKey)
        .setAppId(googleDriveConfig.appId)
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .setCallback(async (data: PickerResponse) => {
          if (data.action !== window.google.picker.Action.PICKED) return;

          setLoadingDrive(true);
          setDriveError(null);
          let failedCount = 0;
          try {
            const downloaded: File[] = [];
            for (const doc of data.docs) {
              const controller = new AbortController();
              const timeout = setTimeout(() => controller.abort(), DRIVE_DOWNLOAD_TIMEOUT_MS);
              try {
                const res = await fetch(
                  `https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`,
                  { headers: { Authorization: `Bearer ${accessToken}` }, signal: controller.signal },
                );
                if (!res.ok) {
                  failedCount += 1;
                  continue;
                }
                const blob = await res.blob();
                downloaded.push(
                  new File([blob], doc.name || `drive-${doc.id}.jpg`, {
                    type: blob.type || "image/jpeg",
                  }),
                );
              } catch {
                failedCount += 1;
              } finally {
                clearTimeout(timeout);
              }
            }
            setFiles((prev) => [...prev, ...downloaded]);
            if (failedCount > 0) {
              setDriveError(
                `No se pudieron descargar ${failedCount} foto(s) de Drive. Si usás Brave, probá bajando el "Shield" para este sitio, o intentá con otro navegador.`,
              );
            }
          } finally {
            setLoadingDrive(false);
          }
        })
        .build();

      picker.setVisible(true);
    });
  }

  function handleDriveClick() {
    if (!gisReady) return;

    if (!tokenClientRef.current) {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: googleDriveConfig.clientId,
        scope: DRIVE_SCOPE,
        callback: (resp) => {
          if (resp.access_token) openPicker(resp.access_token);
        },
      });
    }

    tokenClientRef.current.requestAccessToken();
  }

  return (
    <div className="flex flex-col gap-2">
      {isGoogleDriveEnabled && (
        <>
          <Script src="https://apis.google.com/js/api.js" onReady={() => setGapiReady(true)} />
          <Script
            src="https://accounts.google.com/gsi/client"
            onReady={() => setGisReady(true)}
          />
        </>
      )}

      <label className="flex flex-col gap-1 text-sm text-neutral-300">
        {label}
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept="image/*"
          multiple
          required={required}
          onChange={handleLocalChange}
          className="text-sm text-neutral-400"
        />
      </label>

      {isGoogleDriveEnabled && (
        <button
          type="button"
          onClick={handleDriveClick}
          disabled={!gisReady || !gapiReady || loadingDrive}
          className="w-fit rounded-lg border border-[#c9a961]/50 px-3 py-1.5 text-xs font-semibold text-[#c9a961] transition-colors hover:bg-[#c9a961]/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingDrive ? "Cargando de Drive..." : "Elegir desde Google Drive"}
        </button>
      )}

      {driveError && <p className="text-xs text-red-400">{driveError}</p>}

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, i) => (
            <PhotoThumb key={`${file.name}-${i}`} file={file} onRemove={() => removeFile(i)} />
          ))}
        </div>
      )}
    </div>
  );
}

function PhotoThumb({ file, onRemove }: { file: File; onRemove: () => void }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return (
    <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-white/10 bg-neutral-800">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="h-full w-full object-cover" />
      <button
        type="button"
        aria-label="Quitar foto"
        onClick={onRemove}
        className="absolute right-0 top-0 bg-black/70 px-1 text-xs leading-tight text-white hover:bg-black"
      >
        ×
      </button>
    </div>
  );
}
