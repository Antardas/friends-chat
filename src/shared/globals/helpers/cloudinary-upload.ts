import cloudinary, { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

type CloudinaryUploadResponse = UploadApiResponse | UploadApiErrorResponse | undefined;

export function uploads(file: string, public_id?: string, overwrite?: boolean, invalidate?: boolean): Promise<CloudinaryUploadResponse> {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        public_id,
        overwrite,
        invalidate
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          resolve(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}
