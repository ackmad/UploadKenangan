import { google } from 'googleapis';
import { Readable } from 'stream';

function getAuthClient() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

  if (!privateKey || !clientEmail) {
    throw new Error('Missing Google service account credentials in environment variables.');
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
}

/**
 * Returns the Google Drive folder ID for a given class name.
 */
export function getFolderIdForClass(className: string): string {
  const map: Record<string, string | undefined> = {
    RPL: process.env.GDRIVE_RPL_FOLDER_ID,
    TKJ: process.env.GDRIVE_TKJ_FOLDER_ID,
    DKV: process.env.GDRIVE_DKV_FOLDER_ID,
  };

  const folderId = map[className.toUpperCase()];
  if (!folderId) {
    throw new Error(`No folder configured for class: ${className}`);
  }
  return folderId;
}

/**
 * Upload a file buffer to Google Drive inside the specified folder.
 */
export async function uploadFileToDrive(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  folderId: string,
): Promise<{ id: string; webViewLink: string }> {
  const auth = getAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  const stream = Readable.from(buffer);

  const response = await drive.files.create({
    // Required for uploading to folders shared with service accounts
    supportsAllDrives: true,
    requestBody: {
      name: filename,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: stream,
    },
    fields: 'id, webViewLink',
  });

  const file = response.data;
  if (!file.id) throw new Error('Failed to get file ID from Drive response.');

  return {
    id: file.id,
    webViewLink: file.webViewLink ?? '',
  };
}

export interface DriveFile {
  id: string;
  name: string;
  className: string;
  thumbnailLink: string;
  webContentLink: string;
  createdTime: string;
}

/**
 * List image files from a Google Drive folder.
 */
export async function listFilesFromFolder(
  folderId: string,
  className: string,
): Promise<DriveFile[]> {
  const auth = getAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  const response = await drive.files.list({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
    fields: 'files(id, name, thumbnailLink, webContentLink, createdTime)',
    orderBy: 'createdTime desc',
    pageSize: 200,
    // Required for listing files in folders shared with service accounts
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  const files = response.data.files ?? [];

  return files.map((f) => ({
    id: f.id ?? '',
    name: f.name ?? '',
    className,
    thumbnailLink: f.thumbnailLink ?? '',
    webContentLink: f.webContentLink ?? '',
    createdTime: f.createdTime ?? '',
  }));
}
